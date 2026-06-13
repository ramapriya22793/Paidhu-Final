import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiDollarSign, FiTrendingUp, FiActivity, FiRefreshCcw, FiEye, FiDownload, FiSearch } from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api/payments';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, analyticsRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(`${API_URL}/analytics`)
      ]);
      setPayments(paymentsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Error fetching payments data", error);
      alert("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Paid</span>;
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>;
      case 'FAILED':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Failed</span>;
      case 'REFUNDED':
        return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Refunded</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const filteredPayments = payments.filter(p => 
    p.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.order?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.order?.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-brand-plum font-bold">Loading Payments Dashboard...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair">Payments Dashboard</h1>
        <button className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
          <FiDownload /> <span>Export Report</span>
        </button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center text-brand-plum">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">₹{analytics.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <FiTrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">This Month</p>
              <p className="text-2xl font-bold text-gray-800">₹{analytics.monthRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <FiActivity size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Successful Payments</p>
              <p className="text-2xl font-bold text-gray-800">{analytics.successfulCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <FiRefreshCcw size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Refunded Amount</p>
              <p className="text-2xl font-bold text-gray-800">₹{analytics.refundedAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search TXN ID, Customer, Order..."
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-plum/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-gray-100 text-gray-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Gateway</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-plum">
                      {payment.razorpayPaymentId || `TXN-COD-${payment.id}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{payment.order?.customerName || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{payment.order?.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                        {payment.gateway || 'Unknown'} ({payment.method})
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/payments/${payment.id}`)}
                        className="text-gray-600 hover:text-brand-plum bg-gray-50 hover:bg-brand-cream px-3 py-1.5 rounded transition flex items-center justify-center space-x-1 ml-auto"
                      >
                        <FiEye size={14} /> <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
