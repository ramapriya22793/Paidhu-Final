import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  ShoppingBag, 
  Mail, 
  Download, 
  CreditCard, 
  PackageCheck, 
  ShieldCheck, 
  FileText,
  Sparkles,
  Check
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    if (!order && orderNumber) {
      setLoading(true);
      fetch(`${API_BASE}/api/checkout/order/${orderNumber}`)
        .then(res => {
          if (!res.ok) throw new Error('Order not found');
          return res.json();
        })
        .then(data => {
          if (data.success && data.order) {
            setOrder(data.order);
          } else {
            setError('Could not retrieve order details.');
          }
        })
        .catch(err => {
          console.error('Fetch order details error:', err);
          setError('Failed to fetch order details.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderNumber, order]);

  const latestPayment = order?.payments && order.payments.length > 0 
    ? order.payments[order.payments.length - 1] 
    : null;

  const isOnlinePayment = order?.paymentMethod !== 'COD';
  const paymentStatusText = isOnlinePayment 
    ? (latestPayment?.status || 'SUCCESS') 
    : 'CONFIRMED (COD)';

  const invoiceUrl = `${API_BASE}/uploads/invoices/invoice-${orderNumber}.pdf`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
      className="w-full min-h-[85vh] bg-[#fcfbfa] flex flex-col items-center justify-start py-10 px-4 sm:px-6 font-sans relative"
    >
      {/* Toast Notification Banner */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-3xl mb-6 bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-sm font-medium border border-emerald-500"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-base">Payment Successful!</p>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Your payment for order <span className="font-mono font-bold text-white">#{orderNumber}</span> was received & verified.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowNotification(false)}
            className="text-emerald-200 hover:text-white text-xs font-bold px-2 py-1 rounded hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-gray-100/80 space-y-8"
      >
        {/* Header Hero Badge */}
        <div className="text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner relative z-10"
            >
              <CheckCircle size={56} strokeWidth={2.2} />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute inset-0 rounded-full bg-emerald-400/20"
            />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-xs tracking-wide uppercase">
              <Sparkles size={14} className="text-emerald-600" />
              Payment Successful & Order Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Thank You For Your Purchase!
            </h1>
            <p className="text-gray-500 text-sm sm:text-base font-semibold max-w-lg mx-auto">
              Your payment has been successfully processed. We're carefully preparing your order.
            </p>
          </div>
        </div>

        {/* Payment Confirmation Banner Box */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-2xl p-5 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-md shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                Payment Received & Confirmed
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 font-medium leading-snug mt-0.5">
                A confirmation message & tax invoice have been dispatched to{' '}
                <span className="font-bold text-emerald-950 underline decoration-emerald-400">{order?.customerEmail || 'your email'}</span>.
              </p>
            </div>
          </div>
          
          <a
            href={invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Download size={16} />
            <span>Download Invoice PDF</span>
          </a>
        </div>

        {/* Order & Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Order Details */}
          <div className="bg-[#fcfbfa] rounded-2xl p-5 border border-gray-100 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <FileText size={14} className="text-[#662654]" /> Order Info
              </span>
              <span className="text-xs font-black text-[#662654] bg-[#662654]/10 px-2.5 py-1 rounded-full">
                #{orderNumber}
              </span>
            </div>
            <div className="space-y-2 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Order Date:</span>
                <span className="font-bold text-gray-800">
                  {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Customer Name:</span>
                <span className="font-bold text-gray-800">{order?.customerName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping To:</span>
                <span className="font-bold text-gray-800 truncate max-w-[180px]">{order?.shippingAddress || 'Address on file'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Payment Details */}
          <div className="bg-[#fcfbfa] rounded-2xl p-5 border border-gray-100 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <CreditCard size={14} className="text-emerald-600" /> Payment Details
              </span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase">
                {paymentStatusText}
              </span>
            </div>
            <div className="space-y-2 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method:</span>
                <span className="font-bold text-gray-800">{order?.paymentMethod || 'Online Payment'}</span>
              </div>
              {latestPayment?.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment ID:</span>
                  <span className="font-mono font-bold text-gray-800 text-[11px]">{latestPayment.razorpayPaymentId}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-gray-200/40">
                <span className="font-bold text-gray-800 text-sm">Total Paid:</span>
                <span className="font-black text-lg text-[#662654]">
                  ₹{order?.totalPrice ? order.totalPrice.toLocaleString('en-IN') : '0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Breakdown */}
        {order?.items && order.items.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <PackageCheck size={16} className="text-[#662654]" /> Items Summary ({order.items.length})
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.product?.image ? (
                      <img 
                        src={item.product.image.startsWith('http') ? item.product.image : `${API_BASE}${item.product.image}`} 
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-xl border border-gray-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.product?.name || `Product #${item.productId}`}</h4>
                      <p className="text-xs text-gray-400 font-semibold">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">
                    ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown subtotal */}
            <div className="bg-[#fcfbfa] p-4 rounded-xl space-y-1.5 text-xs font-semibold border border-gray-100">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Charge</span>
                <span>₹{order.deliveryCharge}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              )}
              {order.rewardPointsUsed > 0 && (
                <div className="flex justify-between text-purple-600">
                  <span>Reward Points</span>
                  <span>-₹{order.rewardPointsUsed}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
                <span>Total</span>
                <span className="text-[#662654]">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Customer Notification Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-semibold text-gray-500 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-center">
          <Mail size={16} className="text-[#662654] shrink-0" />
          <span>If you have any questions regarding your payment, email us at <a href="mailto:support@paidhustore.com" className="text-[#662654] underline font-bold">support@paidhustore.com</a></span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
          <Link
            to="/shop"
            className="w-full sm:w-auto bg-[#662654] hover:bg-[#7a2e64] text-white px-8 py-3.5 rounded-full flex items-center justify-center gap-2 font-bold text-sm shadow-lg transition-all cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
          >
            <ShoppingBag size={18} />
            <span>Continue Shopping</span>
          </Link>
          <Link
            to="/shop/shop-all"
            className="w-full sm:w-auto border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-8 py-3.5 rounded-full flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer shadow-sm"
          >
            <span>Explore All Products</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderSuccessPage;
