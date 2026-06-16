import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CreditCard, Truck, ShieldCheck, 
  Percent, ChevronRight, Check, AlertCircle, ShoppingBag, 
  MapPin, User, Mail, Phone, Lock, Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const resolveSingleImage = (img) => {
  if (!img) return null;
  let rawImg = img;
  if (Array.isArray(img)) {
    rawImg = img[0];
  } else if (typeof img === 'string') {
    const trimmed = img.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          rawImg = parsed[0];
        }
      } catch (e) {}
    } else if (trimmed.includes(',')) {
      rawImg = trimmed.split(',')[0].trim();
    } else {
      rawImg = trimmed;
    }
  }
  
  if (typeof rawImg !== 'string') return null;
  return rawImg.startsWith('http') ? rawImg : `${API_BASE}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
};

// Helper to decode user ID from JWT token
const getUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload).id;
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};

// Dynamically load Razorpay SDK script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart, isCartLoaded } = useCart();
  
  // Safe localStorage read
  let token = '';
  try {
    token = localStorage.getItem('paidhu_token') || '';
  } catch (e) {
    console.error("Failed to read token from localStorage", e);
  }
  
  const userId = getUserIdFromToken(token);
  const navigate = useNavigate();

  // Redirect if cart is empty, but only after context has loaded
  useEffect(() => {
    if (isCartLoaded && cart.length === 0) {
      navigate('/shop');
    }
  }, [cart, isCartLoaded, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [activeInput, setActiveInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online'); // 'Online' or 'COD'
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Cost Summary State (Calculated by backend)
  const [summary, setSummary] = useState({
    subtotal: cartTotal || 0,
    deliveryCharge: 0,
    discountAmount: 0,
    rewardPointsUsed: 0,
    totalPrice: cartTotal || 0,
    couponId: null
  });

  // Update summary when cartTotal changes
  useEffect(() => {
    const isPincodeEntered = formData.pincode && formData.pincode.trim().length === 6;
    setSummary(prev => {
      const charge = isPincodeEntered ? prev.deliveryCharge : 0;
      return {
        ...prev,
        subtotal: cartTotal || 0,
        totalPrice: (cartTotal || 0) + charge - prev.discountAmount - prev.rewardPointsUsed
      };
    });
  }, [cartTotal, formData.pincode]);

  // Fetch summary when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      fetchSummary();
    }
  }, [cart]);

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Trigger backend calculation when coupon or address changes
  const fetchSummary = async (couponToApply = appliedCoupon) => {
    if (cart.length === 0) return;

    const isPincodeEntered = formData.pincode && formData.pincode.trim().length === 6;

    if (!isPincodeEntered) {
      setSummary(prev => ({
        ...prev,
        subtotal: cartTotal || 0,
        deliveryCharge: 0,
        totalPrice: (cartTotal || 0) - prev.discountAmount - prev.rewardPointsUsed
      }));
      return;
    }

    setLoadingSummary(true);
    try {
      const checkoutItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const res = await fetch(`${API_BASE}/api/checkout/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          items: checkoutItems,
          deliveryType: 'Standard',
          couponCode: couponToApply || undefined,
          addressDetails: {
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSummary({
          subtotal: data.subtotal,
          deliveryCharge: data.deliveryCharge,
          discountAmount: data.discountAmount,
          rewardPointsUsed: data.rewardPointsUsed,
          totalPrice: data.totalPrice,
          couponId: data.couponId
        });
      }
    } catch (err) {
      console.error("Summary calculation failed:", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch summary when address values that affect shipping charge (state, city, pincode) change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (formData.state || formData.city || formData.pincode) {
        fetchSummary();
      }
    }, 600);
    return () => clearTimeout(delayDebounce);
  }, [formData.state, formData.city, formData.pincode]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    try {
      const checkoutItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const res = await fetch(`${API_BASE}/api/checkout/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          items: checkoutItems,
          deliveryType: 'Standard',
          couponCode: couponCode.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.discountAmount > 0) {
          setAppliedCoupon(couponCode.trim());
          setCouponSuccess(`Saved ₹${data.discountAmount} with "${couponCode.trim()}"!`);
          setSummary(prev => ({
            ...prev,
            discountAmount: data.discountAmount,
            totalPrice: data.totalPrice,
            couponId: data.couponId
          }));
        } else {
          setCouponError("Coupon code is not applicable for this cart total.");
        }
      } else {
        setCouponError("Invalid coupon code.");
      }
    } catch (err) {
      setCouponError("Failed to apply coupon.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponCode('');
    setCouponSuccess('');
    fetchSummary('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return "Enter a valid email address";
    if (!formData.phone.trim() || formData.phone.length < 10) return "Enter a valid 10-digit phone number";
    if (!formData.addressLine1.trim()) return "Shipping address is required";
    if (!formData.city.trim()) return "City is required";
    if (!formData.state.trim()) return "State is required";
    if (!formData.pincode.trim() || formData.pincode.length < 6) return "Enter a valid 6-digit Pincode";
    return null;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      const checkoutItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const shippingAddressStr = `${formData.addressLine1}, ${formData.addressLine2 ? formData.addressLine2 + ', ' : ''}${formData.city}, ${formData.state} - ${formData.pincode}`;

      const checkoutPayload = {
        userId,
        customerName: formData.fullName,
        customerEmail: formData.email,
        shippingAddress: shippingAddressStr,
        items: checkoutItems,
        paymentMethod,
        summary
      };

      const response = await fetch(`${API_BASE}/api/checkout/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(checkoutPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to initiate order");
      }

      if (paymentMethod === 'COD') {
        await clearCart();
        navigate(`/order-success/${result.order.orderNumber}`);
        return;
      }

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      const options = {
        key: (import.meta.env && import.meta.env.VITE_RAZORPAY_KEY_ID) || 'rzp_live_RnbwErlMvkWnMv',
        amount: result.amount,
        currency: result.currency,
        name: "Paidhu Edible Flower Co.",
        description: "Order Checkout Payment",
        order_id: result.razorpayOrderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#662654"
        },
        method: {
          card: false,
          wallet: false,
          emi: false,
          paylater: false,
          upi: true,
          netbanking: true
        },
        config: {
          display: {
            hide: [
              { method: 'card' },
              { method: 'wallet' },
              { method: 'emi' },
              { method: 'paylater' }
            ],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        handler: async function (res) {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/checkout/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: result.order.id,
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature
              })
            });

            const verifyResult = await verifyRes.json();
            if (verifyRes.ok && verifyResult.success) {
              await clearCart();
              navigate(`/order-success/${verifyResult.order.orderNumber}`);
            } else {
              setErrorMsg("Payment verification failed. Please contact support.");
              setSubmitting(false);
            }
          } catch (verifyErr) {
            setErrorMsg("Error verifying payment.");
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: function() {
            setSubmitting(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Checkout submission failed:", err);
      setErrorMsg(err.message || "Something went wrong during checkout.");
      setSubmitting(false);
    }
  };

  if (!isCartLoaded) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#fcfbfa] via-[#faf7f3] to-[#f4f0ea] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#662654] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-semibold tracking-wide uppercase text-[#662654]">Loading Checkout...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="w-full min-h-screen bg-gradient-to-b from-[#fcfbfa] via-[#faf7f3] to-[#f4f0ea] py-12 px-4 md:px-6 relative overflow-x-hidden font-sans"
    >
      
      {/* Background Decorative Rings */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square rounded-full bg-[#662654]/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square rounded-full bg-[#d4af37]/3 blur-[120px] pointer-events-none" />

      {/* Processing Loader Overlay */}
      <AnimatePresence>
        {submitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-[#220919]/60 backdrop-blur-md flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/95 rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl border border-white/20 flex flex-col items-center"
            >
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-[#662654]/10" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-4 border-t-[#662654] border-r-[#d4af37] border-b-transparent border-l-transparent"
                />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-1">Securing Your Order</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">Processing payment and writing order to database. Please do not close this window.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1300px] mx-auto relative z-10">
        
        {/* Navigation Back */}
        <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#662654] font-black text-xs uppercase tracking-widest mb-8 transition-colors group">
          <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Catalog</span>
        </Link>

        {/* Stepper Progress Bar */}
        <div className="max-w-xl mx-auto mb-12 flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-4.5 h-0.5 bg-gray-200 z-0 rounded-full" />
          <div className="absolute left-0 w-1/2 top-4.5 h-0.5 bg-gradient-to-r from-[#662654] to-[#d4af37] z-0 rounded-full" />
          
          <div className="flex flex-col items-center z-10 relative">
            <div className="w-9 h-9 rounded-full bg-[#662654] text-white flex items-center justify-center font-bold text-sm shadow-md border-4 border-white">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#662654] mt-2">Cart</span>
          </div>

          <div className="flex flex-col items-center z-10 relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#662654] to-[#d4af37] text-white flex items-center justify-center font-bold text-sm shadow-md border-4 border-white">
              2
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#662654] mt-2">Checkout</span>
          </div>

          <div className="flex flex-col items-center z-10 relative">
            <div className="w-9 h-9 rounded-full bg-white text-gray-400 flex items-center justify-center font-bold text-sm shadow border-4 border-white">
              3
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mt-2">Confirmation</span>
          </div>
        </div>

        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          
          {/* Left Forms column */}
          <div className="lg:col-span-7 space-y-6">
            
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50/90 backdrop-blur border border-rose-100 rounded-2xl p-4 flex items-start gap-3 text-rose-700 text-sm font-semibold shadow-sm"
              >
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Panel 1: Customer Details */}
            <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-white/60">
              <h2 className="text-md font-black text-gray-900 mb-6 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#662654]/10 text-[#662654] flex items-center justify-center text-xs font-bold">1</div>
                Contact Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <User size={10} className="text-[#662654]" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onFocus={() => setActiveInput('fullName')}
                    onBlur={() => setActiveInput('')}
                    placeholder="Enter your name" 
                    className={`w-full px-4 py-3 rounded-xl border bg-[#faf9f6]/40 focus:bg-white text-sm text-gray-800 placeholder-gray-400 font-semibold transition-all duration-300 ${
                      activeInput === 'fullName' 
                        ? 'border-[#662654] ring-2 ring-[#662654]/10 shadow-[0_0_15px_rgba(102,38,84,0.08)] bg-white' 
                        : 'border-gray-200'
                    }`}
                  />
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Mail size={10} className="text-[#662654]" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setActiveInput('email')}
                    onBlur={() => setActiveInput('')}
                    placeholder="you@example.com" 
                    className={`w-full px-4 py-3 rounded-xl border bg-[#faf9f6]/40 focus:bg-white text-sm text-gray-800 placeholder-gray-400 font-semibold transition-all duration-300 ${
                      activeInput === 'email' 
                        ? 'border-[#662654] ring-2 ring-[#662654]/10 shadow-[0_0_15px_rgba(102,38,84,0.08)] bg-white' 
                        : 'border-gray-200'
                    }`}
                  />
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Phone size={10} className="text-[#662654]" /> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onFocus={() => setActiveInput('phone')}
                    onBlur={() => setActiveInput('')}
                    placeholder="10-digit number" 
                    className={`w-full px-4 py-3 rounded-xl border bg-[#faf9f6]/40 focus:bg-white text-sm text-gray-800 placeholder-gray-400 font-semibold transition-all duration-300 ${
                      activeInput === 'phone' 
                        ? 'border-[#662654] ring-2 ring-[#662654]/10 shadow-[0_0_15px_rgba(102,38,84,0.08)] bg-white' 
                        : 'border-gray-200'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Panel 2: Shipping Details */}
            <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-white/60">
              <h2 className="text-md font-black text-gray-900 mb-6 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#662654]/10 text-[#662654] flex items-center justify-center text-xs font-bold">2</div>
                Shipping Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-3 relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <MapPin size={10} className="text-[#662654]" /> Address Line 1
                  </label>
                  <input 
                    type="text" 
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    onFocus={() => setActiveInput('addressLine1')}
                    onBlur={() => setActiveInput('')}
                    placeholder="Flat, House no., Building, Street" 
                    className={`w-full px-4 py-3 rounded-xl border bg-[#faf9f6]/40 focus:bg-white text-sm text-gray-800 placeholder-gray-400 font-semibold transition-all duration-300 ${
                      activeInput === 'addressLine1' 
                        ? 'border-[#662654] ring-2 ring-[#662654]/10 shadow-[0_0_15px_rgba(102,38,84,0.08)] bg-white' 
                        : 'border-gray-200'
                    }`}
                  />
                </div>

                <div className="md:col-span-3 relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Address Line 2 (Optional)</label>
                  <input 
                    type="text" 
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    onFocus={() => setActiveInput('addressLine2')}
                    onBlur={() => setActiveInput('')}
                    placeholder="Colony, Landmark, Area" 
                    className={`w-full px-4 py-3 rounded-xl border bg-[#faf9f6]/40 focus:bg-white text-sm text-gray-800 placeholder-gray-400 font-semibold transition-all duration-300 ${
                      activeInput === 'addressLine2' 
                        ? 'border-[#662654] ring-2 ring-[#662654]/10 shadow-[0_0_15px_rgba(102,38,84,0.08)] bg-white' 
                        : 'border-gray-200'
                    }`}
                  />
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onFocus={() => setActiveInput('city')}
                    onBlur={() => setActiveInput('')}
                    placeholder="City" 
                    className={`w-full px-4 py-3 rounded-xl border bg-[#faf9f6]/40 focus:bg-white text-sm text-gray-800 placeholder-gray-400 font-semibold transition-all duration-300 ${
                      activeInput === 'city' 
                        ? 'border-[#662654] ring-2 ring-[#662654]/10 shadow-[0_0_15px_rgba(102,38,84,0.08)] bg-white' 
                        : 'border-gray-200'
                    }`}
                  />
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">State</label>
                  <input 
                    type="text" 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    onFocus={() => setActiveInput('state')}
                    onBlur={() => setActiveInput('')}
                    placeholder="State" 
                    className={`w-full px-4 py-3 rounded-xl border bg-[#faf9f6]/40 focus:bg-white text-sm text-gray-800 placeholder-gray-400 font-semibold transition-all duration-300 ${
                      activeInput === 'state' 
                        ? 'border-[#662654] ring-2 ring-[#662654]/10 shadow-[0_0_15px_rgba(102,38,84,0.08)] bg-white' 
                        : 'border-gray-200'
                    }`}
                  />
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Pincode</label>
                  <input 
                    type="text" 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    onFocus={() => setActiveInput('pincode')}
                    onBlur={() => setActiveInput('')}
                    placeholder="6-digits" 
                    maxLength={6}
                    className={`w-full px-4 py-3 rounded-xl border bg-[#faf9f6]/40 focus:bg-white text-sm text-gray-800 placeholder-gray-400 font-semibold transition-all duration-300 ${
                      activeInput === 'pincode' 
                        ? 'border-[#662654] ring-2 ring-[#662654]/10 shadow-[0_0_15px_rgba(102,38,84,0.08)] bg-white' 
                        : 'border-gray-200'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Panel 3: Payment Options */}
            <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-white/60">
              <h2 className="text-md font-black text-gray-900 mb-6 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#662654]/10 text-[#662654] flex items-center justify-center text-xs font-bold">3</div>
                Payment Method
              </h2>

              <div className="grid grid-cols-1 gap-4">
                
                {/* Razorpay Online */}
                <div
                  className="relative flex items-start gap-4 p-5 rounded-2xl border-2 border-[#662654] bg-[#662654]/[0.02] shadow-[0_10px_25px_rgba(102,38,84,0.05)] text-left"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-[#662654] flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#662654]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-[#662654]/10 flex items-center justify-center">
                        <CreditCard size={12} className="text-[#662654]" />
                      </div>
                      Pay Online Securely (Card/UPI)
                    </span>
                    <span className="block text-[11px] font-semibold text-gray-400 leading-normal">
                      UPI, Credit/Debit cards, NetBanking, and secure wallets processed via Razorpay.
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 text-[9px] font-black text-[#cca43b] bg-[#cca43b]/10 px-2 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wide">
                    <Sparkles size={8} /> Fast Pay
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel: Sticky Cart details (lg:col-span-5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
            
            <div className="bg-[#220919] text-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden border border-[#d4af37]/20">
              {/* Premium dark glow background overlay */}
              <div className="absolute top-0 right-0 w-[50%] aspect-square rounded-full bg-[#662654]/20 blur-[80px] pointer-events-none" />
              
              <h2 className="text-md font-black pb-4 border-b border-white/10 flex items-center gap-2 relative z-10">
                <ShoppingBag size={16} className="text-[#d4af37]" />
                Order Review
              </h2>

              {/* Items List */}
              <div className="max-h-56 overflow-y-auto divide-y divide-white/5 pr-1 mt-4 relative z-10 scrollbar-thin scrollbar-thumb-white/10">
                {cart.map((item) => {
                  const resolvedImg = resolveSingleImage(item.image) || 'https://images.unsplash.com/photo-1599598425947-330026217432?q=80&w=100&auto=format&fit=crop';
                  return (
                    <div key={`${item.id}-${item.selectedVariant?.size || 'default'}`} className="flex items-center gap-4 py-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                        <img src={resolvedImg} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[12.5px] font-bold truncate text-white">{item.name}</h4>
                        <p className="text-[10px] text-white/55 mt-0.5 font-medium">
                          Qty: {item.quantity} {item.selectedVariant ? `| Size: ${item.selectedVariant.size}` : ''}
                        </p>
                      </div>
                      <span className="text-[12.5px] font-black text-[#d4af37]">
                        ₹{(((item.offerPrice || item.price || 0)) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Promo Coupon Form */}
              <div className="pt-5 border-t border-white/10 mt-5 relative z-10">
                <label className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Apply Promo Code</label>
                {appliedCoupon ? (
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="bg-[#d4af37]/10 rounded-xl p-3 border border-[#d4af37]/20 flex items-center justify-between text-xs text-[#d4af37] font-bold"
                  >
                    <span className="flex items-center gap-1.5">
                      <Percent size={13} /> Active: <span className="uppercase tracking-wider font-extrabold">{appliedCoupon}</span>
                    </span>
                    <button 
                      type="button" 
                      onClick={handleRemoveCoupon}
                      className="text-white/60 hover:text-white font-extrabold text-[11px]"
                    >
                      Remove
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER COUPON CODE" 
                      className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:outline-none focus:border-[#d4af37] text-xs font-bold uppercase tracking-wider text-white placeholder-white/30"
                    />
                    <button 
                      type="submit"
                      disabled={loadingSummary}
                      className="bg-[#d4af37] hover:bg-[#c39e2e] text-[#220919] font-black text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-rose-400 text-[10px] font-extrabold mt-1.5 flex items-center gap-1"><AlertCircle size={9} />{couponError}</p>}
                {couponSuccess && <p className="text-emerald-400 text-[10px] font-extrabold mt-1.5 flex items-center gap-1"><Check size={9} />{couponSuccess}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-white/10 pt-5 mt-5 space-y-3 relative z-10">
                <div className="flex justify-between items-center text-xs text-white/70 font-bold">
                  <span>Cart Subtotal</span>
                  <span className="text-white">₹{(summary?.subtotal ?? 0).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs text-white/70 font-bold">
                  <span>Shipping & Handling</span>
                  <span>
                    {(!formData.pincode || formData.pincode.trim().length < 6) ? (
                      <span className="text-white/40 text-[10px] font-bold italic">Enter Pincode to calculate</span>
                    ) : (
                      (summary?.deliveryCharge ?? 0) === 0 ? <span className="text-emerald-400 font-extrabold">FREE</span> : `₹${summary?.deliveryCharge ?? 0}`
                    )}
                  </span>
                </div>

                {(summary?.discountAmount ?? 0) > 0 && (
                  <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
                    <span>Promo Discount</span>
                    <span className="font-extrabold">- ₹{(summary?.discountAmount ?? 0).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-1">
                  <span className="text-sm font-black text-white">Grand Total</span>
                  <span className="text-2xl font-black text-[#d4af37]">
                    ₹{(summary?.totalPrice ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="pt-6 relative z-10">
                <motion.button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#662654] to-[#7f3069] text-white py-4 rounded-full flex items-center justify-center gap-2 font-bold text-sm shadow-[0_8px_30px_rgba(102,38,84,0.3)] hover:shadow-[0_8px_35px_rgba(102,38,84,0.5)] transition-all duration-300 group/btn cursor-pointer"
                >
                  <span>{submitting ? 'PROCESSING...' : 'CONFIRM ORDER & PAY'}</span>
                  <ChevronRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Trust Badge */}
              <div className="border-t border-white/5 pt-5 mt-6 flex flex-col items-center gap-1.5 text-center text-white/40 text-[9px] font-black uppercase tracking-wider relative z-10">
                <div className="flex items-center gap-1 text-emerald-400 font-extrabold">
                  <Lock size={12} /> SSL SECURE TRANSACTION
                </div>
                <span>Premium Quality Guaranteed by Paidhu</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default CheckoutPage;
