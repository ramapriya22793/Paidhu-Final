import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import customerService from '../services/customerService';
import { FiUsers, FiFilter, FiDownload, FiPhone, FiCheckCircle, FiUserCheck, FiUserX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'registered', 'guest'

  useEffect(() => {
    fetchCustomers(timeframe);
  }, [timeframe]);

  const fetchCustomers = async (selectedTimeframe) => {
    setLoading(true);
    try {
      const data = await customerService.getCustomers(selectedTimeframe);
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    if (typeFilter === 'registered') return c.isRegistered;
    if (typeFilter === 'guest') return !c.isRegistered;
    return true;
  });

  const exportCSV = () => {
    if (filteredCustomers.length === 0) return;
    const headers = ['Name', 'Email', 'Phone', 'Type', 'Total Orders', 'Cancelled Orders', 'Total Spent (INR)', 'Last Activity'];
    const rows = filteredCustomers.map(c => [
      `"${c.name || ''}"`,
      `"${c.email || ''}"`,
      `"${c.phone || ''}"`,
      c.isRegistered ? 'Registered Account' : 'Guest Checkout',
      c.totalOrders,
      c.cancelledOrders,
      c.totalSpent,
      `"${new Date(c.lastOrderDate).toLocaleString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Paidhu_Customer_Database_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
            <FiUsers className="mr-2 text-brand-plum" /> Customer Database
          </h1>
          <p className="text-sm text-gray-500 mt-1">Verified customers and ordering profiles derived from store activity.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Filter */}
          <div className="relative flex items-center bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
            <FiFilter className="text-gray-400 mr-2" />
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* Export Button */}
          <button 
            onClick={exportCSV}
            className="bg-brand-plum text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-plum/90 transition-all flex items-center shadow-sm cursor-pointer"
          >
            <FiDownload className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            typeFilter === 'all' ? 'bg-brand-plum text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Customers ({customers.length})
        </button>
        <button
          onClick={() => setTypeFilter('registered')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            typeFilter === 'registered' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FiUserCheck size={14} /> Registered Accounts ({customers.filter(c => c.isRegistered).length})
        </button>
        <button
          onClick={() => setTypeFilter('guest')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            typeFilter === 'guest' ? 'bg-amber-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FiUserX size={14} /> Guest Checkouts ({customers.filter(c => !c.isRegistered).length})
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-center">Total Orders</th>
                <th className="px-6 py-4 text-center">Cancelled</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4 text-right">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-brand-plum font-bold animate-pulse">
                    Loading customer database...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FiUsers size={32} className="text-gray-300" />
                      <p className="font-medium">No customers found for this filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, idx) => {
                  const cleanPhone = customer.phone ? customer.phone.replace(/\D/g, '') : '';
                  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                  return (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center font-bold text-sm shrink-0">
                            {(customer.name || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            {customer.isRegistered && customer.id ? (
                              <Link to={`/customers/${customer.id}`} className="font-bold text-brand-plum hover:underline">
                                {customer.name}
                              </Link>
                            ) : (
                              <div className="font-bold text-gray-800">{customer.name}</div>
                            )}
                            <div className="text-xs text-gray-500">{customer.email}</div>
                            
                            {customer.phone && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
                                  <FiPhone size={10} className="text-brand-plum" />
                                  {customer.phone}
                                </span>
                                {cleanPhone && (
                                  <a
                                    href={`https://wa.me/${waPhone}?text=Hi%20${encodeURIComponent(customer.name)},%20greeting%20from%20Paidhu%20Ethical%20Foods!`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors"
                                  >
                                    <FaWhatsapp size={10} /> Chat
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Account Status Badge */}
                      <td className="px-6 py-4">
                        {customer.isRegistered ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                            <FiCheckCircle size={12} /> Registered Account
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                            Guest Checkout
                          </span>
                        )}
                      </td>

                      {/* Total Orders */}
                      <td className="px-6 py-4 text-center">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-xs">
                          {customer.totalOrders}
                        </span>
                      </td>

                      {/* Cancelled Orders */}
                      <td className="px-6 py-4 text-center">
                        {customer.cancelledOrders > 0 ? (
                          <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-bold text-xs">
                            {customer.cancelledOrders}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* Total Spent */}
                      <td className="px-6 py-4 text-right font-bold text-brand-plum text-base">
                        ₹{customer.totalSpent.toLocaleString()}
                      </td>

                      {/* Last Activity */}
                      <td className="px-6 py-4 text-right text-gray-500 text-xs font-medium">
                        {new Date(customer.lastOrderDate).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
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

export default Customers;
