import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { FiEye, FiCheck, FiTruck, FiX, FiPrinter, FiDownload } from 'react-icons/fi';

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

  const exportToExcel = () => {
    if (orders.length === 0) {
      alert("No orders to export!");
      return;
    }

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Date',
      'Total Price',
      'Subtotal',
      'Delivery Charge',
      'Discount',
      'Order Status',
      'Payment Status',
      'Payment Method',
      'Shipping Address',
      'Items Ordered'
    ];

    const rows = orders.map(order => {
      const dateStr = new Date(order.createdAt).toLocaleDateString();
      const itemsStr = order.items
        ? order.items.map(item => `${item.product?.name || 'Product'} (${item.quantity})`).join(', ')
        : '';

      return [
        order.orderNumber || `#${order.id.toString().padStart(5, '0')}`,
        order.customerName,
        order.customerEmail,
        dateStr,
        `₹${order.totalPrice}`,
        `₹${order.subtotal}`,
        `₹${order.deliveryCharge}`,
        `₹${order.discountAmount}`,
        order.orderStatus,
        order.paymentStatus,
        order.paymentMethod,
        order.shippingAddress,
        itemsStr
      ];
    });

    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...rows.map(e => e.map(escapeCSV).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `Paidhu_Orders_${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <button 
          onClick={exportToExcel}
          className="bg-brand-plum hover:bg-brand-plum/90 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow hover:shadow-md"
        >
          <FiDownload size={16} /> Export to Excel
        </button>
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
