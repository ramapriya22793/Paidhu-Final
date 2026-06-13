import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import customerService from '../services/customerService';
import { FiUsers, FiFilter, FiDownload } from 'react-icons/fi';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
            <FiUsers className="mr-2 text-brand-plum" /> Customer Database
          </h1>
          <p className="text-sm text-gray-500 mt-1">Automatically derived from all your store orders.</p>
        </div>
        
        <div className="flex items-center space-x-3">
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
          <button className="bg-brand-plum text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-plum/90 transition-colors flex items-center">
            <FiDownload className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-center">Total Orders</th>
                <th className="px-6 py-4 text-center">Cancelled</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4 text-right">Last Order Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-brand-plum">
                    Loading customer data...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FiUsers size={32} className="text-gray-300" />
                      <p>No customers found for this timeframe.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {customer.isRegistered && customer.id ? (
                          <Link to={`/customers/${customer.id}`} className="font-semibold text-brand-plum hover:underline">
                            {customer.name}
                          </Link>
                        ) : (
                          <div className="font-semibold text-gray-800">{customer.name}</div>
                        )}
                        {customer.isRegistered && (
                          <span className="bg-brand-plum/10 text-brand-plum text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Registered
                          </span>
                        )}
                        {!customer.isRegistered && (
                          <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Guest
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold text-xs">
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {customer.cancelledOrders > 0 ? (
                        <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-bold text-xs">
                          {customer.cancelledOrders}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-brand-plum">
                      ₹{customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {new Date(customer.lastOrderDate).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
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

export default Customers;
