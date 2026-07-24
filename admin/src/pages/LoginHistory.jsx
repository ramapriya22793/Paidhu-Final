import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMonitor, FiUser, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const LoginHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app'}/api/admin/login-history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setHistory(res.data);
      } catch (error) {
        console.error('Failed to fetch login history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center space-x-2 text-brand-plum">
        <div className="w-5 h-5 border-2 border-brand-plum border-t-transparent rounded-full animate-spin"></div>
        <span>Loading Login History...</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-800">Login History</h1>
          <p className="text-gray-500 mt-1">Monitor recent logins from users.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Device / User Agent</th>
                <th className="px-6 py-4">Login Time</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center font-bold">
                        {item.user?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{item.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{item.user?.phone || item.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {item.ipAddress || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={item.userAgent}>
                    <div className="flex items-center space-x-2">
                      <FiMonitor className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{item.userAgent || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiClock className="text-gray-400" />
                      <span>{new Date(item.loginTime).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.status === 'SUCCESS' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="mr-1" /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiAlertCircle className="mr-1" /> Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No login history records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginHistory;
