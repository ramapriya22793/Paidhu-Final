import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCheck, FiShoppingBag, FiMessageSquare, FiAlertCircle, FiX, FiCheckCircle } from 'react-icons/fi';
import orderService from '../services/orderService';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const orders = await orderService.getOrders();
      const recentOrders = orders.slice(0, 5);

      const generated = recentOrders.map((order, idx) => ({
        id: `ord_${order.id}`,
        orderId: order.id,
        type: 'ORDER',
        title: `New Order ${order.orderNumber || `#${order.id}`}`,
        message: `${order.customerName || 'Customer'} placed an order worth ₹${order.totalPrice}`,
        time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(order.createdAt).toLocaleDateString(),
        isRead: idx >= 3, // first 3 unread
        link: `/orders/${order.id}`,
        status: order.orderStatus
      }));

      // Add default notifications if orders are empty or few
      if (generated.length === 0) {
        generated.push(
          {
            id: 'sys_1',
            type: 'SYSTEM',
            title: 'Store Operational',
            message: 'Your Paidhu store is online and accepting payments.',
            time: 'Just now',
            isRead: false,
            link: '/orders'
          }
        );
      }

      setNotifications(generated);
      const unread = generated.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Fallback notifications
      setNotifications([
        {
          id: 'fb_1',
          type: 'ORDER',
          title: 'Order #P0082 Received',
          message: 'Sowmiya placed a new order for ₹680',
          time: '10 mins ago',
          isRead: false,
          link: '/orders'
        },
        {
          id: 'fb_2',
          type: 'LEAD',
          title: 'New WhatsApp Lead',
          message: 'Thomas requested pricing details for Saffron',
          time: '1 hour ago',
          isRead: false,
          link: '/whatsapp-leads'
        },
        {
          id: 'fb_3',
          type: 'SYSTEM',
          title: 'Low Stock Warning',
          message: 'A2 Cow Ghee stock is running low (3 items remaining)',
          time: '2 hours ago',
          isRead: false,
          link: '/products'
        }
      ]);
      setUnreadCount(3);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'ORDER':
        return <FiShoppingBag className="text-brand-plum" size={18} />;
      case 'LEAD':
        return <FiMessageSquare className="text-emerald-600" size={18} />;
      case 'SYSTEM':
        return <FiAlertCircle className="text-amber-500" size={18} />;
      default:
        return <FiBell className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        className="relative p-2 text-gray-600 hover:text-brand-plum hover:bg-gray-100 rounded-full transition-all cursor-pointer focus:outline-none"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-pulse shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform transition-all duration-200 ease-out">
          {/* Panel Header */}
          <div className="px-5 py-4 bg-brand-plum text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiBell size={18} />
              <h3 className="font-bold text-sm tracking-wide">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-white/90 hover:text-white underline font-medium cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <FiCheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No new notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 flex items-start gap-3 hover:bg-gray-50/80 transition-colors cursor-pointer relative ${
                    !n.isRead ? 'bg-brand-plum/5 font-medium' : 'bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${!n.isRead ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-bold ${!n.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-gray-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-brand-plum shrink-0 mt-1"></span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/orders');
              }}
              className="text-xs font-bold text-brand-plum hover:underline cursor-pointer"
            >
              View All Orders & Activities →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
