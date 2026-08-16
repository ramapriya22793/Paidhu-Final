import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMonitor, FiUser, FiClock, FiAlertCircle, FiCheckCircle, FiShield, FiTrash2, FiRefreshCw } from 'react-icons/fi';

const LoginHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'SUCCESS', 'FAILED', 'ADMIN'
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('paidhu_token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app'}/api/admin/login-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch login history', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all login history logs? This action cannot be undone.")) {
      setClearing(true);
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('paidhu_token');
        await axios.delete(`${import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app'}/api/admin/login-history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory([]);
      } catch (error) {
        console.error('Failed to clear login history', error);
        alert('Failed to clear login history');
      } finally {
        setClearing(false);
      }
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'SUCCESS') return item.status === 'SUCCESS';
    if (filter === 'FAILED') return item.status === 'FAILED';
    if (filter === 'ADMIN') return item.user?.isAdmin;
    return true;
  });

  const parseDevice = (userAgent) => {
    if (!userAgent) return 'Unknown Device';
    if (userAgent.includes('axios')) return 'System API Client';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS Safari Mobile';
    if (userAgent.includes('Android')) return 'Android Mobile Web';
    if (userAgent.includes('Windows')) return 'Windows Desktop Browser';
    if (userAgent.includes('Macintosh')) return 'Mac OS Desktop Browser';
    return userAgent.slice(0, 30);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-800 flex items-center">
            <FiShield className="mr-3 text-brand-plum" /> Login History & Audit Logs
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Monitor real-time system logins, admin sessions, and security access logs.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchHistory}
            className="p-2.5 bg-white border border-gray-200 text-gray-700 hover:text-brand-plum rounded-xl transition-all shadow-sm cursor-pointer"
            title="Refresh Logs"
          >
            <FiRefreshCw size={16} />
          </button>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              disabled={clearing}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all cursor-pointer disabled:opacity-50"
            >
              <FiTrash2 size={16} className="mr-2" /> Clear History Logs
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'all' ? 'bg-brand-plum text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Activity ({history.length})
        </button>
        <button
          onClick={() => setFilter('SUCCESS')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'SUCCESS' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Successful Logins ({history.filter(i => i.status === 'SUCCESS').length})
        </button>
        <button
          onClick={() => setFilter('FAILED')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'FAILED' ? 'bg-red-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Failed Attempts ({history.filter(i => i.status === 'FAILED').length})
        </button>
        <button
          onClick={() => setFilter('ADMIN')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'ADMIN' ? 'bg-purple-700 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Admin Sessions ({history.filter(i => i.user?.isAdmin).length})
        </button>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Account Type</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Device / Client</th>
                <th className="px-6 py-4">Login Timestamp</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-brand-plum font-bold animate-pulse">
                    Loading login history logs...
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No login history records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const isGuest = item.user?.email && (item.user.email.endsWith('@paidhu.local') || item.user.name?.startsWith('Guest'));
                  const displayName = isGuest ? (item.user?.name || 'Guest User') : (item.user?.name || 'Customer');

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                            item.user?.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-brand-plum/10 text-brand-plum'
                          }`}>
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{displayName}</p>
                            <p className="text-xs text-gray-500">{item.user?.phone || item.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Account Type */}
                      <td className="px-6 py-4">
                        {item.user?.isAdmin ? (
                          <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full">
                            Admin Store Manager
                          </span>
                        ) : isGuest ? (
                          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                            Guest Session
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                            Customer Account
                          </span>
                        )}
                      </td>

                      {/* IP Address */}
                      <td className="px-6 py-4 text-xs font-semibold text-gray-700 font-mono">
                        {item.ipAddress || '127.0.0.1'}
                      </td>

                      {/* Device / Client */}
                      <td className="px-6 py-4 text-xs text-gray-600 max-w-xs truncate" title={item.userAgent}>
                        <div className="flex items-center space-x-2">
                          <FiMonitor className="text-gray-400 shrink-0" size={14} />
                          <span className="truncate font-medium">{parseDevice(item.userAgent)}</span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="px-6 py-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1.5 font-medium">
                          <FiClock className="text-gray-400" size={13} />
                          <span>{new Date(item.loginTime).toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 text-center">
                        {item.status === 'SUCCESS' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <FiCheckCircle className="mr-1" /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            <FiAlertCircle className="mr-1" /> Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginHistory;
