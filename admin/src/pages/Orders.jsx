import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { FiEye, FiCheck, FiTruck, FiX, FiPrinter } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(true);
    try {
      await orderService.updateOrderStatus(id, { orderStatus: newStatus });
      fetchOrders(); // refresh list
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PROCESSING':
        return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Processing</span>;
      case 'SHIPPED':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Shipped</span>;
      case 'DELIVERED':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Delivered</span>;
      case 'CANCELLED':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  if (loading) return <div className="p-8 text-brand-plum">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair">Orders Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-plum cursor-pointer hover:underline" onClick={() => navigate(`/orders/${order.id}`)}>
                      {order.orderNumber || `#${order.id.toString().padStart(5, '0')}`}
                    </td>
                    <td className="px-6 py-4 cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                      <div className="font-medium text-gray-800 hover:text-brand-plum">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-plum">
                      ₹{order.totalPrice}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'SHIPPED'); }}
                        disabled={updating || order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED'}
                        title="Mark as Shipped"
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors disabled:opacity-30"
                      >
                        <FiTruck size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'DELIVERED'); }}
                        disabled={updating || order.orderStatus === 'DELIVERED'}
                        title="Mark as Delivered"
                        className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors disabled:opacity-30"
                      >
                        <FiCheck size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'CANCELLED'); }}
                        disabled={updating || order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED'}
                        title="Cancel Order"
                        className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-30"
                      >
                        <FiX size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}
                        title="View Details"
                        className="text-gray-600 hover:bg-gray-100 p-2 rounded transition-colors"
                      >
                        <FiEye size={18} />
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

export default Orders;
