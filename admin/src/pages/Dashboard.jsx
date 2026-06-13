import { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingBag, FiUsers, FiClock } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import authService from '../services/authService';

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 font-playfair">{value}</h3>
      <p className={`text-xs mt-2 font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
        {trend} from last week
      </p>
    </div>
    <div className="w-12 h-12 bg-brand-cream text-brand-plum rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrdersCount: 0,
    chartData: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      const response = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/stats', config);
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-brand-plum font-bold">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 font-playfair">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back to Paidhu management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<FiDollarSign />} trend="+12.5%" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<FiShoppingBag />} trend="+8.2%" />
        <StatCard title="Total Customers" value={stats.totalUsers} icon={<FiUsers />} trend="+4.1%" />
        <StatCard title="Pending Orders" value={stats.pendingOrdersCount} icon={<FiClock />} trend="-2.4%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 font-playfair">Revenue Overview</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#662654" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#662654" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#662654" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 font-playfair">Recent Orders</h2>
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent orders found.</p>
            ) : (
              stats.recentOrders.map((order, i) => {
                const itemCount = order.items ? order.items.length : 0;
                return (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-brand-cream rounded flex items-center justify-center text-brand-plum font-bold text-xs">
                        {order.orderNumber || `#00${i+1}`}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 truncate w-32">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{itemCount} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">₹{order.totalPrice}</p>
                      <p className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mt-1 ${
                        order.orderStatus === 'PENDING' ? 'text-yellow-600 bg-yellow-50' : 
                        order.orderStatus === 'CONFIRMED' ? 'text-blue-600 bg-blue-50' :
                        order.orderStatus === 'DELIVERED' ? 'text-green-600 bg-green-50' :
                        'text-gray-600 bg-gray-50'
                      }`}>
                        {order.orderStatus}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
