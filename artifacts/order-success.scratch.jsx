import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Download, Package, Truck, Home, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-brand-plum border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
        <Package size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold font-playfair text-gray-800">Order Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">We couldn't find the order details you're looking for.</p>
        <Link to="/shop" className="bg-brand-plum text-white px-8 py-3 rounded-xl font-bold">Return to Shop</Link>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/invoices/invoice-${order.orderNumber}.pdf`, '_blank');
  };

  const deliveryDate = order.estimatedDeliveryDate 
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 font-poppins">
      <div className="container mx-auto px-4 max-w-[800px]">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center space-x-2 md:space-x-4 text-xs md:text-sm font-semibold mb-10 overflow-x-auto py-2">
          <span className="text-brand-plum flex items-center whitespace-nowrap">🛒 Cart</span>
          <span className="text-brand-plum">→</span>
          <span className="text-brand-plum flex items-center whitespace-nowrap">📍 Address</span>
          <span className="text-brand-plum">→</span>
          <span className="text-brand-plum flex items-center whitespace-nowrap">💳 Payment</span>
          <span className="text-brand-plum">→</span>
          <span className="text-brand-plum flex items-center whitespace-nowrap">📦 Review</span>
          <span className="text-brand-plum">→</span>
          <span className="text-brand-plum flex items-center whitespace-nowrap">✅ Success</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="bg-[#111111] py-12 px-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 0.2 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20 relative z-10"
            >
              <CheckCircle2 size={48} className="text-white" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-3 relative z-10">Thank You For Your Order!</h1>
            <p className="text-gray-300 relative z-10 max-w-md mx-auto">
              Your order has been placed successfully and is now being processed. We'll send you an email with the tracking details soon.
            </p>
          </div>

          <div className="p-8 md:p-12">
            
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Order Info */}
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
                  <p className="text-xl font-bold text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-gray-900">{order.paymentMethod}</p>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                      ${order.paymentMethod === 'COD' && order.orderStatus !== 'DELIVERED' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {order.paymentMethod === 'COD' && order.orderStatus !== 'DELIVERED' ? 'PENDING' : 'SUCCESSFUL'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-brand-plum font-playfair">₹{order.totalPrice?.toFixed(2)}</p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-cream/50 rounded-full flex items-center justify-center">
                    <Truck className="text-brand-plum" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Delivery</p>
                    <p className="font-bold text-gray-900">{deliveryDate}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="mt-1">
                    <MapPin className="text-gray-400" size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">{order.customerName}</p>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{order.shippingAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 mb-10" />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/profile/orders" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-bold text-center hover:border-gray-900 transition-colors flex justify-center items-center gap-2"
              >
                <Package size={18} /> Track Order
              </Link>
              
              <button 
                onClick={handleDownloadInvoice} 
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-bold flex justify-center items-center gap-2 hover:border-gray-900 transition-colors"
              >
                <Download size={18} /> Download Invoice
              </button>
              
              <Link 
                to="/shop" 
                className="w-full sm:w-auto px-8 py-4 bg-brand-plum text-white rounded-xl font-bold text-center hover:bg-[#521b42] transition-colors shadow-lg shadow-brand-plum/20 flex justify-center items-center gap-2"
              >
                Continue Shopping <ChevronRight size={18} />
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
