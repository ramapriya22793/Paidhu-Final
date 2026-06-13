import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ShoppingBag, Mail } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderNumber } = useParams();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
      className="w-full min-h-[80vh] bg-[#fcfbfa] flex items-center justify-center py-12 px-4 font-sans"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100/50 text-center space-y-6"
      >
        {/* Animated Checkmark */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981]"
          >
            <CheckCircle size={48} strokeWidth={2} />
          </motion.div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Placed Successfully!</h1>
          <p className="text-gray-500 text-sm font-semibold">Thank you for shopping with Paidhu. Your order is confirmed.</p>
        </div>

        {/* Order Number Box */}
        <div className="bg-[#662654]/5 rounded-2xl p-4 border border-[#662654]/10 max-w-sm mx-auto">
          <span className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Number</span>
          <span className="block text-xl font-black text-[#662654] tracking-wide">{orderNumber}</span>
        </div>

        {/* Secondary Info */}
        <div className="flex flex-col items-center justify-center gap-4 text-xs font-semibold text-gray-400 max-w-md mx-auto leading-relaxed border-t border-b border-gray-100 py-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={16} className="text-[#662654]" />
            <span>We've sent a detailed invoice and confirmation email to your address.</span>
          </div>
          <span className="text-center">Our team is carefully preparing your premium floral goodies. We'll update you as soon as it ships!</span>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
          <Link
            to="/shop"
            className="w-full sm:w-auto bg-[#662654] hover:bg-[#7a2e64] text-white px-8 py-3.5 rounded-full flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <ShoppingBag size={16} />
            <span>Continue Shopping</span>
          </Link>
          <Link
            to="/shop/shop-all"
            className="w-full sm:w-auto border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 px-8 py-3.5 rounded-full flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderSuccessPage;
