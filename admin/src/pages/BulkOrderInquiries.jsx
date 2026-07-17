import { useState, useEffect } from 'react';
import { FiTrash2, FiClock, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import authService from '../services/authService';

const BulkOrderInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/bulk-orders', config);
      setInquiries(res.data);
    } catch (error) {
      console.error('Failed to fetch inquiries', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bulk-orders/${id}/status`, { status: newStatus }, config);
      fetchInquiries(); // Refresh
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bulk-orders/${id}`, config);
      fetchInquiries(); // Refresh
    } catch (error) {
      console.error('Failed to delete inquiry', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Inquiries...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Bulk Order Inquiries</h1>
          <p className="text-gray-500 mt-1">View and manage requests submitted via the Bulk Orders page form.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            No bulk order inquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">Date</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">Contact Details</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">Location</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">Purpose</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 align-top whitespace-nowrap text-sm text-gray-600">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                      <div className="text-xs text-gray-400 mt-1">{new Date(inquiry.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-gray-900">{inquiry.fullName}</div>
                      <div className="text-sm text-gray-600 mt-1">{inquiry.email}</div>
                      <div className="text-sm text-brand-plum font-semibold mt-1">{inquiry.mobile}</div>
                    </td>
                    <td className="px-6 py-4 align-top text-sm">
                      <div className="text-gray-900 font-medium">{inquiry.region}</div>
                      <div className="text-gray-500 mt-1">{inquiry.country}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm text-gray-700 max-w-xs">{inquiry.purpose}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <select 
                        value={inquiry.status}
                        onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                        className={`text-sm font-semibold rounded-full px-3 py-1 border outline-none cursor-pointer ${
                          inquiry.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                          inquiry.status === 'Contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                          'bg-green-50 text-green-700 border-green-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <button 
                        onClick={() => deleteInquiry(inquiry.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                        title="Delete Inquiry"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkOrderInquiries;
