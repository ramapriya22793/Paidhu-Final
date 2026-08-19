import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiShoppingBag, FiUsers, FiClock, FiTrendingUp, FiTrendingDown, FiRefreshCw } from 'react-icons/fi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import axios from 'axios';
import authService from '../services/authService';

const PIE_COLORS = ['#662654', '#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4', '#fb5607', '#3a86ff'];

// Trend badge
const TrendBadge = ({ trend }) => {
  const isUp = trend.startsWith('+');
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
      {isUp ? <FiTrendingUp size={11} /> : <FiTrendingDown size={11} />}
      {trend} vs last week
    </span>
  );
};

// Stat card with gradient accent
const StatCard = ({ title, value, icon, trend, onClick, gradient, iconBg }) => (
  <div
    onClick={onClick}
    className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group"
  >
    {/* Gradient top bar */}
    <div className={`absolute top-0 left-0 right-0 h-1 ${gradient} rounded-t-2xl`} />
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 font-playfair mt-1">{value}</h3>
        <div className="mt-2">
          <TrendBadge trend={trend} />
        </div>
      </div>
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
  </div>
);

// Custom pie tooltip
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-3 border border-gray-100 text-sm">
        <p className="font-bold text-gray-800">{payload[0].name}</p>
        <p className="text-brand-plum font-semibold">₹{payload[0].value.toLocaleString()}</p>
        <p className="text-gray-500">{payload[0].payload.orders} orders</p>
      </div>
    );
  }
  return null;
};

// Custom area tooltip
const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-xl px-4 py-3 border border-gray-100 text-sm">
        <p className="font-bold text-gray-700 mb-1">{label}</p>
        <p className="text-brand-plum font-semibold">₹{Number(payload[0].value).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrdersCount: 0,
    chartData: [],
    recentOrders: [],
    productRevenueData: [],
    trends: null
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      const response = await axios.get(
        (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/admin/stats',
        config
      );
      setStats(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 60 seconds for real-time feel
    const interval = setInterval(() => fetchStats(true), 60000);
    return () => clearInterval(interval);
  }, []);

  const user = authService.getCurrentUser();
  const role = user?.role || 'SUPER_ADMIN';

  const statusConfig = {
    PENDING:          { bg: 'bg-amber-50',  text: 'text-amber-600',  dot: 'bg-amber-400' },
    CONFIRMED:        { bg: 'bg-blue-50',   text: 'text-blue-600',   dot: 'bg-blue-400' },
    PACKED:           { bg: 'bg-indigo-50', text: 'text-indigo-600', dot: 'bg-indigo-400' },
    SHIPPED:          { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-400' },
    OUT_FOR_DELIVERY: { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-400' },
    DELIVERED:        { bg: 'bg-green-50',  text: 'text-green-600',  dot: 'bg-green-400' },
    CANCELLED:        { bg: 'bg-red-50',    text: 'text-red-500',    dot: 'bg-red-400' },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 border-4 border-brand-plum/20 border-t-brand-plum rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading live dashboard data…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair">Dashboard Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {lastUpdated
              ? `Live data · Last updated ${lastUpdated.toLocaleTimeString()}`
              : 'Paidhu Ethical Foods — Admin Analytics'}
          </p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-60"
        >
          <FiRefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {role !== 'ECOMMERCE_ADMIN' && (
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<FiDollarSign className="text-emerald-600" />}
            trend={stats.trends?.revenueTrend || '+0.0%'}
            onClick={() => navigate('/payments')}
            gradient="bg-gradient-to-r from-emerald-400 to-teal-500"
            iconBg="bg-emerald-50"
          />
        )}
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={<FiShoppingBag className="text-blue-600" />}
          trend={stats.trends?.ordersTrend || '+0.0%'}
          onClick={() => navigate('/orders')}
          gradient="bg-gradient-to-r from-blue-400 to-indigo-500"
          iconBg="bg-blue-50"
        />
        {role !== 'ACCOUNTS_ADMIN' && (
          <StatCard
            title="Total Customers"
            value={stats.totalUsers.toLocaleString()}
            icon={<FiUsers className="text-violet-600" />}
            trend={stats.trends?.usersTrend || '+0.0%'}
            onClick={() => navigate('/customers')}
            gradient="bg-gradient-to-r from-violet-400 to-purple-500"
            iconBg="bg-violet-50"
          />
        )}
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrdersCount.toLocaleString()}
          icon={<FiClock className="text-amber-600" />}
          trend={stats.trends?.pendingTrend || '+0.0%'}
          onClick={() => navigate('/orders')}
          gradient="bg-gradient-to-r from-amber-400 to-orange-500"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Revenue Area Chart */}
        {role !== 'ECOMMERCE_ADMIN' && (
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-800">Monthly Revenue</h2>
                <p className="text-xs text-gray-400 mt-0.5">Revenue trend for {new Date().getFullYear()}</p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1 rounded-full">
                ₹{stats.totalRevenue.toLocaleString()} total
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#662654" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#662654" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="4 4" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dx={-5} tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area type="monotone" dataKey="sales" stroke="#662654" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#662654', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Product Revenue Pie Chart */}
        <div className={`${role === 'ECOMMERCE_ADMIN' ? 'xl:col-span-3' : 'xl:col-span-1'} bg-white rounded-2xl shadow-sm border border-gray-100 p-6`}>
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-800">Product Revenue</h2>
            <p className="text-xs text-gray-400 mt-0.5">Top products by revenue share</p>
          </div>
          {stats.productRevenueData && stats.productRevenueData.length > 0 ? (
            <>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.productRevenueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stats.productRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend list */}
              <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto">
                {stats.productRevenueData.map((item, i) => {
                  const total = stats.productRevenueData.reduce((s, d) => s + d.value, 0);
                  const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-gray-600 truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-gray-400">{pct}%</span>
                        <span className="font-semibold text-gray-700">₹{item.value.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
              No order data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-800">Recent Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest 5 orders placed</p>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="text-xs font-semibold text-brand-plum hover:underline"
          >
            View all →
          </button>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4">#Order</th>
                  <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4">Customer</th>
                  <th className="text-left text-xs font-semibold text-gray-400 pb-3 pr-4">Items</th>
                  {role !== 'ECOMMERCE_ADMIN' && (
                    <th className="text-right text-xs font-semibold text-gray-400 pb-3 pr-4">Amount</th>
                  )}
                  <th className="text-right text-xs font-semibold text-gray-400 pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, i) => {
                  const s = statusConfig[order.orderStatus] || statusConfig.PENDING;
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => navigate('/orders')}
                    >
                      <td className="py-3 pr-4">
                        <span className="text-xs font-bold text-brand-plum bg-brand-plum/5 px-2 py-1 rounded-lg">
                          {order.orderNumber ? order.orderNumber.slice(-6) : `#00${i + 1}`}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-gray-800 truncate max-w-[140px]">{order.customerName}</p>
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-xs">
                        {order.items ? order.items.length : 0} item{order.items?.length !== 1 ? 's' : ''}
                      </td>
                      {role !== 'ECOMMERCE_ADMIN' && (
                        <td className="py-3 pr-4 text-right font-bold text-gray-800 font-mono">
                          ₹{Number(order.totalPrice).toLocaleString()}
                        </td>
                      )}
                      <td className="py-3 text-right">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] uppercase font-bold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
