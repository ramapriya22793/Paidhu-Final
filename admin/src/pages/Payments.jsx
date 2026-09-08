import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiDollarSign, FiTrendingUp, FiActivity, FiRefreshCcw, 
  FiEye, FiDownload, FiSearch, FiCreditCard, FiCheckCircle, 
  FiAlertTriangle, FiKey, FiLock, FiX, FiCheck
} from 'react-icons/fi';
import authService from '../services/authService';

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app');
const API_URL = BASE_URL + '/api/payments';
const CHECKOUT_API = BASE_URL + '/api/checkout';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('PAID');
  
  // Real-time Razorpay Gateway State
  const [rzpStatus, setRzpStatus] = useState(null);
  const [testingRzp, setTestingRzp] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState({ keyId: '', keySecret: '', webhookSecret: '' });
  const [configLoading, setConfigLoading] = useState(false);
  const [configFeedback, setConfigFeedback] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchRazorpayStatus();
  }, []);

  const fetchRazorpayStatus = async () => {
    try {
      setTestingRzp(true);
      const res = await axios.get(`${CHECKOUT_API}/razorpay-status`);
      setRzpStatus(res.data);
    } catch (e) {
      setRzpStatus({
        configured: false,
        status: 'ERROR',
        message: 'Unable to reach backend gateway status endpoint'
      });
    } finally {
      setTestingRzp(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (!configForm.keyId || !configForm.keySecret) {
      setConfigFeedback({ type: 'error', text: 'Both Key ID and Key Secret are required.' });
      return;
    }
    setConfigLoading(true);
    setConfigFeedback(null);
    try {
      const res = await axios.post(`${CHECKOUT_API}/razorpay-config`, configForm);
      setConfigFeedback({ type: 'success', text: res.data.message });
      fetchRazorpayStatus();
      setTimeout(() => {
        setShowConfigModal(false);
        setConfigFeedback(null);
      }, 2000);
    } catch (err) {
      setConfigFeedback({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to verify and save keys'
      });
    } finally {
      setConfigLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      const [paymentsRes, analyticsRes] = await Promise.all([
        axios.get(API_URL, config),
        axios.get(`${API_URL}/analytics`, config)
      ]);
      setPayments(paymentsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Error fetching payments data", error);
      setError("Failed to load payment data. Please try refreshing.");
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

  const filteredPayments = payments.filter(p => {
    const searchMatch = 
      p.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.order?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.order?.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (!searchMatch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PAID') return p.status === 'SUCCESS' || p.status === 'PAID';
    if (statusFilter === 'PENDING') return p.status === 'PENDING';
    if (statusFilter === 'FAILED') return p.status === 'FAILED';
    if (statusFilter === 'REFUNDED') return p.status === 'REFUNDED';
    return true;
  });

  const calculatedAnalytics = (() => {
    if (!payments || payments.length === 0) return {
      totalRevenue: 0,
      monthRevenue: 0,
      successfulCount: 0,
      refundedAmount: 0
    };

    const totalRevenue = payments
      .filter(p => p.status === 'SUCCESS' || p.status === 'PAID')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthRevenue = payments
      .filter(p => {
        if (p.status !== 'SUCCESS' && p.status !== 'PAID') return false;
        const pDate = new Date(p.createdAt);
        return pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear;
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const successfulCount = payments.filter(p => p.status === 'SUCCESS' || p.status === 'PAID').length;

    const refundedAmount = payments
      .flatMap(p => p.refunds || [])
      .filter(r => r.status === 'PROCESSED' || r.status === 'APPROVED')
      .reduce((sum, r) => sum + (r.refundAmount || 0), 0);

    return {
      totalRevenue,
      monthRevenue,
      successfulCount,
      refundedAmount
    };
  })();

  if (loading) return <div className="p-8 text-brand-plum font-bold">Loading Payments Dashboard...</div>;

  if (error) return (
    <div className="p-8 flex flex-col items-center justify-center space-y-4">
      <p className="text-red-500 font-semibold text-lg">{error}</p>
      <button
        onClick={fetchData}
        className="flex items-center gap-2 bg-brand-plum text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-plum/90 transition"
      >
        <FiRefreshCcw /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair">Payments Dashboard</h1>
        <button className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
          <FiDownload /> <span>Export Report</span>
        </button>
      </div>

      {/* Analytics Cards */}
      {calculatedAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center text-brand-plum">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">₹{calculatedAnalytics.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <FiTrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">This Month</p>
              <p className="text-2xl font-bold text-gray-800">₹{calculatedAnalytics.monthRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <FiActivity size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Successful Payments</p>
              <p className="text-2xl font-bold text-gray-800">{calculatedAnalytics.successfulCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <FiRefreshCcw size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Refunded Amount</p>
              <p className="text-2xl font-bold text-gray-800">₹{calculatedAnalytics.refundedAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Real-Time Gateway Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 ${
              rzpStatus?.status === 'CONNECTED' 
                ? 'bg-emerald-600' 
                : rzpStatus?.status === 'AUTH_FAILED' 
                  ? 'bg-red-600' 
                  : 'bg-amber-500'
            }`}>
              <FiCreditCard size={24} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-gray-800">Razorpay Payment Gateway</h3>
                {rzpStatus?.status === 'CONNECTED' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    <FiCheckCircle className="mr-1" size={12} /> Live Connected ({rzpStatus.mode === 'live' ? 'Live Production' : 'Test Sandbox'})
                  </span>
                )}
                {rzpStatus?.status === 'AUTH_FAILED' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    <FiAlertTriangle className="mr-1" size={12} /> Authentication Failed
                  </span>
                )}
                {rzpStatus?.status === 'NOT_CONFIGURED' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    <FiLock className="mr-1" size={12} /> Unconfigured (Simulated Checkout)
                  </span>
                )}
                {rzpStatus?.status === 'ERROR' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    <FiAlertTriangle className="mr-1" size={12} /> Status Check Error
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {rzpStatus?.message || 'Checking real-time Razorpay connection status...'}
              </p>
              {rzpStatus?.keyIdMasked && (
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-600">
                  <FiKey size={13} className="text-gray-400" />
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    Key ID: {rzpStatus.keyIdMasked}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-center shrink-0">
            <button
              onClick={fetchRazorpayStatus}
              disabled={testingRzp}
              className="flex items-center space-x-1.5 px-3.5 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
            >
              <FiRefreshCcw size={14} className={testingRzp ? 'animate-spin' : ''} />
              <span>{testingRzp ? 'Testing...' : 'Test Connection'}</span>
            </button>
            <button
              onClick={() => {
                setShowConfigModal(true);
                setConfigFeedback(null);
              }}
              className="flex items-center space-x-1.5 px-4 py-2 bg-[#662654] hover:bg-[#521c43] text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <FiKey size={14} />
              <span>Configure API Keys</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3 bg-gray-50/50">
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

          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1.5 bg-gray-200/60 p-1 rounded-lg">
            <button
              onClick={() => setStatusFilter('PAID')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                statusFilter === 'PAID'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-300/50'
              }`}
            >
              Paid Only ({payments.filter(p => p.status === 'SUCCESS' || p.status === 'PAID').length})
            </button>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-[#662654] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-300/50'
              }`}
            >
              All ({payments.length})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                statusFilter === 'PENDING'
                  ? 'bg-yellow-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-300/50'
              }`}
            >
              Pending ({payments.filter(p => p.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setStatusFilter('FAILED')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                statusFilter === 'FAILED'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-300/50'
              }`}
            >
              Failed ({payments.filter(p => p.status === 'FAILED').length})
            </button>
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

      {/* Modal for Configuring Razorpay Credentials */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100">
            <button 
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <FiX size={20} />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#662654]/10 flex items-center justify-center text-[#662654]">
                <FiKey size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Razorpay API Credentials</h3>
                <p className="text-xs text-gray-500">Live test and update your backend gateway keys</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              Obtain your API Key ID and Key Secret from your <a href="https://dashboard.razorpay.com/#/app/keys" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">Razorpay Dashboard &gt; Settings &gt; API Keys</a>.
              Credentials will be tested against the live Razorpay API before saving.
            </p>

            {configFeedback && (
              <div className={`p-3 rounded-lg text-xs font-medium mb-4 flex items-center space-x-2 ${
                configFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {configFeedback.type === 'success' ? <FiCheck size={16} /> : <FiAlertTriangle size={16} />}
                <span>{configFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Razorpay Key ID *
                </label>
                <input
                  type="text"
                  placeholder="rzp_live_... or rzp_test_..."
                  value={configForm.keyId}
                  onChange={(e) => setConfigForm({ ...configForm, keyId: e.target.value.trim() })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#662654] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Razorpay Key Secret *
                </label>
                <input
                  type="password"
                  placeholder="Enter Razorpay Key Secret"
                  value={configForm.keySecret}
                  onChange={(e) => setConfigForm({ ...configForm, keySecret: e.target.value.trim() })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#662654] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Webhook Secret (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Optional Webhook Secret"
                  value={configForm.webhookSecret}
                  onChange={(e) => setConfigForm({ ...configForm, webhookSecret: e.target.value.trim() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#662654] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={configLoading}
                  className="px-5 py-2 text-sm font-semibold bg-[#662654] hover:bg-[#521c43] text-white rounded-lg transition disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
                >
                  {configLoading ? (
                    <>
                      <FiRefreshCcw className="animate-spin" size={14} />
                      <span>Validating with Razorpay...</span>
                    </>
                  ) : (
                    <span>Verify &amp; Save Keys</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
