import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiShoppingBag, FiUsers, FiClock, FiArrowUpRight, FiArrowDownRight, FiRefreshCw } from 'react-icons/fi';
import {
  AreaChart, Area, BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import authService from '../services/authService';

const StatCard = ({ title, value, icon, trend, onClick, color = 'brand-plum' }) => {
  const isPositive = trend.startsWith('+');
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-plum/10 text-brand-plum flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {isPositive ? <FiArrowUpRight size={12}/> : <FiArrowDownRight size={12}/>}
            {trend}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 font-playfair">{value}</h3>
        <p className="text-xs text-gray-400 mt-1">vs last week</p>
      </div>
    </div>
  );
};

// Custom Donut tooltip
const DonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-xl px-4 py-2 border border-gray-100">
        <p className="font-bold text-gray-800">{payload[0].name}</p>
        <p className="text-brand-plum font-semibold">{payload[0].value} orders</p>
      </div>
    );
  }
  return null;
};

// Custom Bar tooltip
const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-xl px-4 py-2 border border-gray-100">
        <p className="font-bold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-sm font-semibold">
            {p.name === 'revenue' ? `₹${Number(p.value).toLocaleString()}` : `${p.value} orders`}
          </p>
        ))}
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
    ordersChartData: [],
    orderStatusData: [],
    topProducts: [],
    customerGrowth: [],
    recentOrders: [],
    trends: null
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState('Loading Dashboard...');

  const fetchStats = useCallback(async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      const response = await axios.get(
        (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/admin/stats' + (isManual ? '?refresh=true' : ''),
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
  }, []);

  useEffect(() => {
    fetchStats();

    // Cold start warning
    const timer = setTimeout(() => {
      setLoadingMsg('Waking up server (this may take 30-60 seconds on free hosting)...');
    }, 3000);

    // Auto-refresh every 30 seconds for near real-time sync
    const interval = setInterval(() => fetchStats(), 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchStats]);

  const user = authService.getCurrentUser();
  const role = user?.role || 'SUPER_ADMIN';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair">Dashboard Overview</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-gray-500">Welcome back to Paidhu management.</p>
            {lastUpdated && (
              <span className="text-xs text-gray-400">
                · Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
          {/* Manual Refresh */}
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-sm font-semibold text-brand-plum bg-brand-plum/10 hover:bg-brand-plum/20 px-4 py-2 rounded-xl transition-all disabled:opacity-60"
          >
            <FiRefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Syncing...' : 'Refresh'}
          </button>
          {loading && !refreshing && (
            <div className="flex items-center text-brand-plum text-sm font-medium">
              <div className="w-4 h-4 border-2 border-brand-plum/20 border-t-brand-plum rounded-full animate-spin mr-2"></div>
              {loadingMsg}
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {role !== 'ECOMMERCE_ADMIN' && (
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<FiDollarSign />}
            trend={stats.trends?.revenueTrend || '+0.0%'}
            onClick={() => navigate('/payments')}
          />
        )}
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FiShoppingBag />}
          trend={stats.trends?.ordersTrend || '+0.0%'}
          onClick={() => navigate('/orders')}
        />
        {role !== 'ACCOUNTS_ADMIN' && (
          <StatCard
            title="Total Customers"
            value={stats.totalUsers}
            icon={<FiUsers />}
            trend={stats.trends?.usersTrend || '+0.0%'}
            onClick={() => navigate('/customers')}
          />
        )}
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrdersCount}
          icon={<FiClock />}
          trend={stats.trends?.pendingTrend || '+0.0%'}
          onClick={() => navigate('/orders')}
        />
      </div>

      {/* Charts Row 1: Revenue Area + Order Status Donut */}
      {role !== 'ECOMMERCE_ADMIN' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Revenue Area Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 font-playfair">Revenue Overview</h2>
                <p className="text-xs text-gray-400 mt-0.5">Monthly revenue this year</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-plum/10 text-brand-plum">
                {new Date().getFullYear()}
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#662654" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#662654" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dx={-8} tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '10px 14px' }}
                    formatter={v => [`₹${Number(v).toLocaleString()}`, 'Revenue']}
                    labelStyle={{ fontWeight: 700, color: '#1f2937', marginBottom: 4 }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#662654" strokeWidth={3} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 6, fill: '#662654', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Donut */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 font-playfair">Order Status</h2>
              <p className="text-xs text-gray-400 mt-0.5">Live breakdown</p>
            </div>
            {stats.orderStatusData && stats.orderStatusData.length > 0 ? (
              <>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.orderStatusData}
                        cx="50%" cy="50%"
                        innerRadius={50} outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {stats.orderStatusData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<DonutTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {stats.orderStatusData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-600 font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-44 flex items-center justify-center text-gray-400 text-sm">No order data yet</div>
            )}
          </div>
        </div>
      )}

      {/* Charts Row 2: Orders Bar Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Monthly Orders Bar Chart */}
        <div className={`${role === 'ECOMMERCE_ADMIN' ? 'lg:col-span-2' : 'lg:col-span-2'} bg-white p-6 rounded-2xl shadow-sm border border-gray-100`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 font-playfair">Orders This Year</h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly order volume</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ordersChartData || stats.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={22}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#662654" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#a05080" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dx={-8} allowDecimals={false} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: '#f9fafb', radius: 8 }} />
                <Bar dataKey="orders" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-playfair">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No recent orders found.</p>
            ) : (
              stats.recentOrders.map((order, i) => {
                const itemCount = order.items ? order.items.length : 0;
                const statusColors = {
                  PENDING: 'text-yellow-600 bg-yellow-50',
                  CONFIRMED: 'text-blue-600 bg-blue-50',
                  DELIVERED: 'text-green-600 bg-green-50',
                  SHIPPED: 'text-purple-600 bg-purple-50',
                  CANCELLED: 'text-red-500 bg-red-50',
                };
                return (
                  <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-brand-plum/10 rounded-lg flex items-center justify-center text-brand-plum font-bold text-[10px] shrink-0">
                        {(order.orderNumber || `#00${i+1}`).slice(-4)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 truncate max-w-[90px]">{order.customerName}</p>
                        <p className="text-xs text-gray-400">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {role !== 'ECOMMERCE_ADMIN' && (
                        <p className="text-sm font-bold text-gray-800">₹{order.totalPrice}</p>
                      )}
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full mt-0.5 inline-block ${statusColors[order.orderStatus] || 'text-gray-600 bg-gray-50'}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 3: Top Products + Customer Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Products by Revenue — Progress Bars */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-800 font-playfair">Top Products by Revenue</h2>
            <p className="text-xs text-gray-400 mt-0.5">Best performing products this year</p>
          </div>
          {stats.topProducts && stats.topProducts.length > 0 ? (
            <div className="space-y-4">
              {stats.topProducts.map((product, i) => {
                const maxRevenue = stats.topProducts[0]?.revenue || 1;
                const pct = Math.round((product.revenue / maxRevenue) * 100);
                const colors = ['#662654','#8b3a6b','#a05080','#c47aaa','#e8b8d4'];
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{product.name}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-gray-400">{product.orders} orders</span>
                        <span className="text-sm font-bold text-gray-800">₹{product.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: colors[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No product sales data yet</div>
          )}
        </div>

        {/* Customer Growth — Line Chart */}
        {role !== 'ACCOUNTS_ADMIN' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 font-playfair">Customer Growth</h2>
                <p className="text-xs text-gray-400 mt-0.5">New registrations monthly</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800 font-playfair">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Total customers</p>
              </div>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.customerGrowth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dx={-8} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '10px 14px' }}
                    formatter={v => [v, 'New Customers']}
                    labelStyle={{ fontWeight: 700, color: '#1f2937', marginBottom: 4 }}
                  />
                  <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, fill: '#10b981', strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
