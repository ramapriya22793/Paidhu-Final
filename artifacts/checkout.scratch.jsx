import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MapPin, Truck, CreditCard, Check, ShieldCheck, Lock, Award, Package, RefreshCw, Plus, Edit2, Trash2 } from 'lucide-react';
import OrderSummarySidebar from '../components/checkout/OrderSummarySidebar';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState('Standard');
  const [selectedPayment, setSelectedPayment] = useState('UPI');
  const [summary, setSummary] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.info("Your cart is empty");
      navigate('/cart');
    }
    
    if (user) {
      axios.get('/api/addresses')
        .then(res => {
          setAddresses(res.data);
          const defaultAddr = res.data.find(a => a.isDefault);
          if (defaultAddr) setSelectedAddress(defaultAddr.id);
          else if (res.data.length > 0) setSelectedAddress(res.data[0].id);
        })
        .catch(err => console.error("Failed to load addresses", err));
    }
  }, [user, cartItems, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    if (selectedPayment === 'COD' && summary.totalPrice > 5000) {
      toast.error("Cash on Delivery is only available for orders below ₹5000");
      return;
    }

    setIsProcessing(true);
    try {
      const addressObj = addresses.find(a => a.id === selectedAddress);
      const addressString = `${addressObj.fullName}, ${addressObj.addressLine1}, ${addressObj.city}, ${addressObj.state} - ${addressObj.pincode}, Phone: ${addressObj.phone}`;
      
      const payload = {
        userId: user?.id,
        customerName: addressObj.fullName,
        customerEmail: user?.email || 'guest@paidhustore.com',
        shippingAddress: addressString,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.offerPrice || item.product?.price || 0
        })),
        paymentMethod: selectedPayment,
        summary: summary,
        notes: orderNotes,
        giftWrap: giftWrap
      };

      const res = await axios.post('/api/checkout/initiate', payload);
      
      if (selectedPayment === 'COD') {
        clearCart();
        navigate(`/order-success/${res.data.order.id}`);
      } else {
        const resScript = await loadRazorpayScript();
        if (!resScript) {
          toast.error('Razorpay SDK failed to load. Are you online?');
          setIsProcessing(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key', 
          amount: res.data.amount,
          currency: res.data.currency,
          name: 'Paidhu Store',
          description: 'Premium Floral Foods',
          order_id: res.data.razorpayOrderId,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post('/api/checkout/verify', {
                orderId: res.data.order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              
              if (verifyRes.data.success) {
                clearCart();
                navigate(`/order-success/${verifyRes.data.order.id}`);
              }
            } catch (err) {
              console.error(err);
              toast.error('Payment verification failed.');
            }
          },
          prefill: {
            name: addressObj.fullName,
            email: user?.email,
            contact: addressObj.phone
          },
          theme: {
            color: '#662654'
          }
        };
        
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        
        paymentObject.on('payment.failed', function (response){
          toast.error(`Payment failed: ${response.error.description}`);
          setIsProcessing(false);
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'UPI', label: 'UPI / QR', icon: '📱' },
    { id: 'Credit Card', label: 'Credit Card', icon: '💳' },
    { id: 'Debit Card', label: 'Debit Card', icon: '💳' },
    { id: 'Net Banking', label: 'Net Banking', icon: '🏦' },
    { id: 'Wallet', label: 'Wallets', icon: '👛' },
    { id: 'COD', label: 'Cash on Delivery', icon: '💵' }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 font-poppins">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1200px]">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center space-x-2 md:space-x-4 text-xs md:text-sm font-semibold mb-10 overflow-x-auto py-2">
          <span className="text-brand-plum flex items-center whitespace-nowrap">🛒 Cart</span>
          <span className="text-gray-300">→</span>
          <span className="text-brand-plum flex items-center whitespace-nowrap">📍 Address</span>
          <span className="text-gray-300">→</span>
          <span className="text-brand-plum flex items-center whitespace-nowrap">💳 Payment</span>
          <span className="text-gray-300">→</span>
          <span className="text-brand-plum flex items-center whitespace-nowrap">📦 Review</span>
          <span className="text-gray-300">→</span>
          <span className="text-gray-400 flex items-center whitespace-nowrap">✅ Success</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Form Sections */}
          <div className="flex-1 space-y-8">
            
            {/* 1. Delivery Address */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-plum"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 font-playfair">
                <MapPin className="text-brand-plum" size={24} /> Delivery Address
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <label 
                    key={addr.id} 
                    className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-brand-plum bg-brand-cream/10 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="address" 
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="w-4 h-4 text-brand-plum border-gray-300 focus:ring-brand-plum"
                        />
                        <h3 className="font-bold text-gray-900">{addr.fullName}</h3>
                      </div>
                      <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {addr.addressType}
                      </span>
                    </div>
                    <div className="pl-6 text-sm text-gray-600 leading-relaxed space-y-1">
                      <p>{addr.addressLine1}, {addr.addressLine2}</p>
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="font-medium text-gray-800 mt-2">Mobile: {addr.phone}</p>
                    </div>
                    {selectedAddress === addr.id && (
                      <div className="pl-6 mt-4 flex gap-3 text-sm font-semibold">
                        <button onClick={() => navigate('/profile/addresses')} className="text-brand-plum hover:underline">Edit Address</button>
                      </div>
                    )}
                  </label>
                ))}
                
                <div 
                  onClick={() => navigate('/profile/addresses')}
                  className="p-5 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-plum hover:bg-brand-cream/10 transition-all text-gray-500 hover:text-brand-plum min-h-[160px] group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-brand-plum/10 flex items-center justify-center mb-3 transition-colors">
                    <Plus size={20} className="text-gray-400 group-hover:text-brand-plum" />
                  </div>
                  <span className="font-bold">Add New Address</span>
                </div>
              </div>
            </div>

            {/* 2. Delivery Method */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 font-playfair">
                <Truck className="text-brand-gold" size={24} /> Delivery Method
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <label className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${selectedDelivery === 'Standard' ? 'border-brand-gold bg-amber-50/30 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="delivery" 
                    checked={selectedDelivery === 'Standard'} 
                    onChange={() => setSelectedDelivery('Standard')} 
                    className="w-5 h-5 mt-0.5 text-brand-gold border-gray-300 focus:ring-brand-gold" 
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-gray-900">Standard Delivery</h4>
                      <span className="font-bold text-gray-900">₹50</span>
                    </div>
                    <p className="text-sm text-gray-500">3-5 Business Days</p>
                    <p className="text-xs text-green-600 font-medium mt-2">FREE on orders above ₹999</p>
                  </div>
                </label>
                
                <label className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${selectedDelivery === 'Express' ? 'border-brand-gold bg-amber-50/30 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="delivery" 
                    checked={selectedDelivery === 'Express'} 
                    onChange={() => setSelectedDelivery('Express')} 
                    className="w-5 h-5 mt-0.5 text-brand-gold border-gray-300 focus:ring-brand-gold" 
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-gray-900">Express Delivery</h4>
                      <span className="font-bold text-gray-900">₹120</span>
                    </div>
                    <p className="text-sm text-gray-500">1-2 Business Days</p>
                    <p className="text-xs text-gray-500 mt-2">Fastest delivery option</p>
                  </div>
                </label>
              </div>

              {/* Delivery Estimate */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3 text-sm">
                <Package className="text-gray-400" size={20} />
                <p className="text-gray-700">
                  Estimated Delivery Date: <span className="font-bold text-gray-900 ml-1">Order today, delivered by {new Date(Date.now() + (selectedDelivery === 'Express' ? 2 : 5) * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </p>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-playfair">
                  <CreditCard className="text-blue-600" size={24} /> Payment Method
                </h2>
                <div className="flex gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/UPI-Logo.png" alt="UPI" className="h-4 opacity-70 grayscale hover:grayscale-0 transition-all" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-70 grayscale hover:grayscale-0 transition-all" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-70 grayscale hover:grayscale-0 transition-all" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {paymentMethods.map((method) => {
                  const isCodDisabled = method.id === 'COD' && summary.totalPrice > 5000;
                  return (
                    <label 
                      key={method.id}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 
                        ${isCodDisabled ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50' : 
                          selectedPayment === method.id ? 'border-blue-600 bg-blue-50/30 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={selectedPayment === method.id} 
                        onChange={() => !isCodDisabled && setSelectedPayment(method.id)} 
                        disabled={isCodDisabled}
                        className="sr-only" 
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-semibold text-gray-800 text-sm">{method.label}</span>
                      {selectedPayment === method.id && <Check className="absolute top-2 right-2 text-blue-600" size={16} />}
                      {isCodDisabled && <span className="absolute bottom-1 left-0 w-full text-[9px] text-red-500 font-medium">Above ₹5k</span>}
                    </label>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">256-bit SSL Encryption</h4>
                  <p className="text-xs text-gray-600">Your payment information is processed securely by Razorpay. We do not store your credit card details.</p>
                </div>
              </div>
            </div>

            {/* 4. Additional Options */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200/60">
              <h2 className="text-lg font-bold text-gray-900 mb-4 font-playfair">Additional Options</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="w-5 h-5 text-brand-plum rounded border-gray-300 focus:ring-brand-plum" />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 text-sm block">Add Luxury Gift Wrap (Free)</span>
                    <span className="text-xs text-gray-500">Includes a premium ribbon and personalized note card.</span>
                  </div>
                </label>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Order Notes (Optional)</label>
                  <textarea 
                    rows="2" 
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="E.g., Leave package at the front door..." 
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Sticky Summary */}
          <div className="lg:w-[400px]">
            <OrderSummarySidebar 
              summary={summary}
              cartItems={cartItems}
              userId={user?.id}
              selectedDelivery={selectedDelivery}
              onSummaryChange={setSummary}
              selectedAddressObj={addresses.find(a => a.id === selectedAddress)}
            />

            {/* Desktop Place Order Button (Mobile has sticky bottom bar) */}
            <div className="hidden lg:block mt-6">
              <button 
                onClick={handlePlaceOrder} 
                disabled={isProcessing || !selectedAddress}
                className={`w-full bg-[#111111] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all 
                  ${(isProcessing || !selectedAddress) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black hover:shadow-2xl hover:-translate-y-1'}`}
              >
                {isProcessing ? 'Processing...' : (
                  <>
                    <Lock size={18} /> 
                    Pay ₹{summary?.totalPrice?.toFixed(2) || '0.00'}
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-gray-100">
                <ShieldCheck className="text-gray-400 mb-2" size={24} />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Secure Payments</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-gray-100">
                <Truck className="text-gray-400 mb-2" size={24} />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-gray-100">
                <Award className="text-gray-400 mb-2" size={24} />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quality Assured</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-gray-100">
                <RefreshCw className="text-gray-400 mb-2" size={24} />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Easy Returns</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Amount</p>
          <p className="text-xl font-bold text-gray-900">₹{summary?.totalPrice?.toFixed(2) || '0.00'}</p>
        </div>
        <button 
          onClick={handlePlaceOrder} 
          disabled={isProcessing || !selectedAddress}
          className={`bg-[#111111] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg
            ${(isProcessing || !selectedAddress) ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
        >
          {isProcessing ? 'Processing...' : (
            <>
              <Lock size={16} /> Pay Now
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default CheckoutPage;
