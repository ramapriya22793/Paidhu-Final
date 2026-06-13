import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiChevronLeft, FiPrinter, FiDownload, FiTruck, FiBox, FiCheckCircle, FiClock, FiCreditCard } from 'react-icons/fi';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/orders';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Edit states
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierPartner, setCourierPartner] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      const data = response.data;
      setOrder(data);
      setOrderStatus(data.orderStatus);
      setPaymentStatus(data.paymentStatus);
      setTrackingNumber(data.trackingNumber || '');
      setCourierPartner(data.courierPartner || '');
    } catch (error) {
      console.error("Error fetching order details", error);
      alert("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const payload = {
        orderStatus,
        paymentStatus,
        trackingNumber,
        courierPartner
      };
      await axios.put(`${API_URL}/${id}/details`, payload);
      alert("Order updated successfully!");
      fetchOrderDetails();
    } catch (error) {
      console.error("Error updating order", error);
      alert("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-brand-plum font-bold">Loading Order Details...</div>;
  if (!order) return <div className="p-8 text-red-500 font-bold">Order Not Found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <Link to="/orders" className="text-gray-500 hover:text-brand-plum flex items-center text-sm font-medium mb-2">
            <FiChevronLeft size={16} className="mr-1" /> Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair">
            Order {order.orderNumber || `#${order.id.toString().padStart(5, '0')}`}
          </h1>
          <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => window.print()} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center font-medium transition-colors">
            <FiPrinter size={16} className="mr-2" /> Print Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Details) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Product Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-l-lg">Product</th>
                    <th className="px-4 py-3 font-medium">SKU</th>
                    <th className="px-4 py-3 font-medium text-center">Qty</th>
                    <th className="px-4 py-3 font-medium text-right">Unit Price</th>
                    <th className="px-4 py-3 font-medium text-right rounded-r-lg">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items?.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 flex items-center gap-3">
                        {item.product?.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded object-cover border border-gray-100" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                            <FiBox size={20} />
                          </div>
                        )}
                        <span className="font-medium text-gray-800">{item.product?.name || 'Unknown Product'}</span>
                      </td>
                      <td className="px-4 py-4 text-gray-500">PRD-{item.productId}</td>
                      <td className="px-4 py-4 text-center text-gray-800 font-medium">{item.quantity}</td>
                      <td className="px-4 py-4 text-right text-gray-600">₹{item.price}</td>
                      <td className="px-4 py-4 text-right font-bold text-brand-plum">₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Billing Summary */}
            <div className="mt-6 border-t border-gray-100 pt-6 flex justify-end">
              <div className="w-72 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">₹{order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Charges</span>
                  <span className="font-medium text-gray-800">₹{order.deliveryCharge?.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount {order.coupon ? `(${order.coupon.code})` : ''}</span>
                    <span className="font-medium">-₹{order.discountAmount?.toFixed(2)}</span>
                  </div>
                )}
                {order.rewardPointsUsed > 0 && (
                  <div className="flex justify-between text-brand-plum">
                    <span>Reward Discount</span>
                    <span className="font-medium">-₹{order.rewardPointsUsed?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-100 text-lg">
                  <span className="font-bold text-gray-800">Grand Total</span>
                  <span className="font-bold text-brand-plum">₹{order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Order Timeline</h2>
            <div className="space-y-6">
              {/* Order Placed Event (Always exists implicitly) */}
              <div className="flex gap-4 relative">
                <div className="absolute top-8 left-4 bottom-[-24px] w-0.5 bg-brand-plum/20"></div>
                <div className="w-8 h-8 rounded-full bg-brand-plum text-white flex items-center justify-center shrink-0 relative z-10">
                  <FiCheckCircle size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Order Placed</h4>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              {/* Dynamic Timeline Events */}
              {order.timeline && Array.isArray(order.timeline) && order.timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== order.timeline.length - 1 && (
                    <div className="absolute top-8 left-4 bottom-[-24px] w-0.5 bg-brand-plum/20"></div>
                  )}
                  <div className="w-8 h-8 rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center shrink-0 relative z-10">
                    <FiClock size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{event.note || event.status}</h4>
                    <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Side Panels) */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Customer Name</p>
                <p className="font-medium text-gray-800">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="font-medium text-gray-800">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Customer ID</p>
                <p className="font-medium text-gray-800">{order.user ? `USR-${order.user.id}` : 'Guest'}</p>
              </div>
              {order.user && (
                <div>
                  <p className="text-xs text-gray-500">Account Created</p>
                  <p className="font-medium text-gray-800">{new Date(order.user.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Shipping Address</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
              {order.shippingAddress}
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Payment Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Payment Method</p>
                <div className="flex items-center gap-2 mt-1">
                  <FiCreditCard className="text-brand-plum" />
                  <p className="font-medium text-gray-800">{order.paymentMethod === 'COD' ? 'Cash On Delivery' : order.paymentMethod}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Status</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-bold uppercase ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentMethod !== 'COD' && (
                <>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Gateway</p>
                    <p className="font-medium text-gray-800">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transaction / Payment ID</p>
                    <p className="font-medium text-gray-800 text-xs mt-1">
                      {order.payments && order.payments.length > 0 && order.payments[0].razorpayPaymentId ? order.payments[0].razorpayPaymentId : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Gateway Order ID</p>
                    <p className="font-medium text-gray-800 text-xs mt-1">
                      {order.payments && order.payments.length > 0 && order.payments[0].razorpayOrderId ? order.payments[0].razorpayOrderId : 'N/A'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Admin Actions (Update Form) */}
          <div className="bg-brand-plum/5 rounded-xl shadow-sm border border-brand-plum/20 p-6 print:hidden">
            <h2 className="text-sm font-bold text-brand-plum uppercase tracking-wider mb-4 flex items-center gap-2">
               Admin Actions
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Order Status</label>
                <select 
                  value={orderStatus} 
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-plum text-sm"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PACKED">Packed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Status</label>
                <select 
                  value={paymentStatus} 
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-plum text-sm"
                >
                  <option value="PENDING">Pending (COD Collection)</option>
                  <option value="PAID">Paid / Collected</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Courier Partner</label>
                <input 
                  type="text" 
                  value={courierPartner} 
                  onChange={(e) => setCourierPartner(e.target.value)}
                  placeholder="e.g., Delhivery, BlueDart"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-plum text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tracking Number</label>
                <input 
                  type="text" 
                  value={trackingNumber} 
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="AWB / Tracking ID"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-plum text-sm"
                />
              </div>
              
              <button 
                onClick={handleUpdate}
                disabled={updating}
                className="w-full mt-2 py-3 bg-brand-plum text-white font-bold rounded-lg hover:bg-brand-plum/90 transition-colors disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
