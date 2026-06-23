import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Check, X, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import fallbacks from '../components/home/fallbacks.json';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const allFallbackProducts = (() => {
  const seen = new Set();
  const list = [];
  Object.values(fallbacks).forEach(categoryList => {
    categoryList.forEach(p => {
      if (!seen.has(p.id) && p.raw) {
        seen.add(p.id);
        list.push(p.raw);
      }
    });
  });
  return list;
})();

// Pricing logic perfectly mimicking the reference
const TIERS = [
  { items: 3, price: 799 },
  { items: 4, price: 1049 },
  { items: 5, price: 1399 }
];

const MAX_ITEMS = 5;

const BYOCPage = () => {
  const [products, setProducts] = useState(allFallbackProducts.slice(0, 30));
  const [bundle, setBundle] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  // Load products if backend is available
  useEffect(() => {
    fetch(`${API_BASE}/api/products?limit=50`)
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => console.log('Using fallback products for BYOC'));
  }, []);

  const handleAddToBundle = (product) => {
    if (bundle.length >= MAX_ITEMS) return;
    setBundle([...bundle, product]);
  };

  const handleRemoveFromBundle = (index) => {
    const newBundle = [...bundle];
    newBundle.splice(index, 1);
    setBundle(newBundle);
  };

  const currentTier = [...TIERS].reverse().find(t => bundle.length >= t.items) || { items: 0, price: 0 };
  const currentTotal = bundle.length < 3 
    ? bundle.reduce((sum, item) => sum + (item.discountPrice || item.price), 0)
    : currentTier.price + (bundle.length > currentTier.items ? bundle[bundle.length - 1].discountPrice || bundle[bundle.length - 1].price : 0);

  const nextTier = TIERS.find(t => t.items > bundle.length);

  const handleAddBundleToCart = async () => {
    if (bundle.length < 3) return; // Must have at least 3 items
    
    setIsAddingToCart(true);
    
    // Calculate the discount to apply to each item to make the total match the tier price
    const originalTotal = bundle.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
    const discountFactor = currentTotal / originalTotal;
    
    // Add each item to the cart sequentially
    for (const item of bundle) {
      const bundledPrice = Math.round((item.discountPrice || item.price) * discountFactor);
      
      const variant = item.variants && item.variants.length > 0 
        ? (typeof item.variants === 'string' ? JSON.parse(item.variants)[0] : item.variants[0]) 
        : null;
        
      const bundledVariant = variant ? { ...variant, offerPrice: bundledPrice } : null;
      
      const productToAdd = {
        ...item,
        price: item.price,
        discountPrice: bundledPrice // Override with discounted price
      };
      
      await addToCart(productToAdd, 1, bundledVariant);
    }
    
    setTimeout(() => {
      setIsAddingToCart(false);
      setBundle([]);
      setIsCartOpen(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      {/* Top Promotional Banner */}
      <div className="w-full bg-[#662654] text-white text-center py-2.5 font-extrabold tracking-wide text-xs md:text-sm uppercase shadow-sm sticky top-0 z-40">
        BUY 3 FOR ₹799 | 4 FOR ₹1049 | 5 FOR ₹1399 — BUY NOW!
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: Product Grid */}
        <div className="flex-1 w-full">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#662654] mb-3 font-serif">Build Your Box</h1>
            <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl">
              Mix and match your favorite Paidhu products. Choose at least 3 items to unlock special bundle pricing!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group relative">
                
                <div className="aspect-[4/5] overflow-hidden bg-[#f8f5f0] relative">
                  <img 
                    src={product.image.startsWith('http') ? product.image : `${API_BASE}${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={e => { e.currentTarget.src = '/mascot.png'; }}
                  />
                  {product.discountPrice && product.price && product.discountPrice < product.price && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-[13px] font-bold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-[#662654] transition-colors">{product.name}</h3>
                  
                  <div className="flex items-baseline gap-2 mb-4 mt-auto">
                    <span className="text-[15px] font-extrabold text-gray-900">₹{product.discountPrice || product.price}</span>
                    {product.discountPrice && <span className="text-[11px] text-gray-400 line-through">₹{product.price}</span>}
                  </div>

                  <button 
                    onClick={() => handleAddToBundle(product)}
                    disabled={bundle.length >= MAX_ITEMS}
                    className="w-full bg-[#662654] hover:bg-[#4d1c3f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-between px-4 transition-colors"
                  >
                    <span>Add to Bundle</span>
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Bundle Sidebar */}
        <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 lg:sticky lg:top-[120px] z-30">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden relative">
            
            {/* Sidebar Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#662654] uppercase tracking-wider font-serif">My Bundle</h2>
              <div className="bg-[#f0f4f8] w-12 h-12 rounded-full flex items-center justify-center relative shadow-inner">
                <span className="text-xl">🌸</span>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  {bundle.length}
                </div>
              </div>
            </div>

            {/* Pricing Tiers Indicator */}
            <div className="bg-[#faf9f7] p-5 border-b border-gray-100 flex justify-between relative">
              <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-8 h-0.5 bg-[#662654] -translate-y-1/2 z-0 transition-all duration-500" 
                style={{ width: `${bundle.length >= 5 ? 100 : bundle.length >= 4 ? 50 : bundle.length >= 3 ? 0 : 0}%` }}
              />
              
              {TIERS.map((tier, idx) => {
                const isReached = bundle.length >= tier.items;
                return (
                  <div key={idx} className="flex flex-col items-center relative z-10">
                    <div className={`w-4 h-4 rounded-full mb-1.5 border-2 transition-colors ${isReached ? 'bg-[#662654] border-[#662654]' : 'bg-white border-gray-300'}`} />
                    <span className={`text-[12px] font-extrabold ${isReached ? 'text-gray-900' : 'text-gray-400'}`}>₹{tier.price}</span>
                  </div>
                );
              })}
            </div>

            {/* Selected Items Slots */}
            <div className="p-5 space-y-3 bg-white min-h-[300px] max-h-[40vh] lg:max-h-[50vh] overflow-y-auto custom-scrollbar">
              {Array.from({ length: MAX_ITEMS }).map((_, idx) => {
                const item = bundle[idx];
                
                if (item) {
                  return (
                    <motion.div 
                      key={`slot-${idx}-${item.id}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 bg-[#fefdfc] shadow-sm relative pr-10"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={item.image.startsWith('http') ? item.image : `${API_BASE}${item.image}`} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={e => { e.currentTarget.src = '/mascot.png'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</p>
                        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">₹{item.discountPrice || item.price}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromBundle(idx)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-50 text-[#662654] flex items-center justify-center hover:bg-purple-100 transition-colors"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    </motion.div>
                  );
                }

                return (
                  <div key={`empty-${idx}`} className="flex items-center justify-center py-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 gap-2">
                    <Plus size={14} />
                    <span className="text-[11px] font-bold tracking-wider uppercase">Your Selected Product</span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Summary & Checkout */}
            <div className="p-5 bg-[#faf9f7] border-t border-gray-100 rounded-b-3xl">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Bundle Total</p>
                  {bundle.length < 3 ? (
                    <p className="text-[11px] font-bold text-[#662654]">{3 - bundle.length} more item{3 - bundle.length > 1 ? 's' : ''} to unlock ₹799 tier!</p>
                  ) : (
                    <p className="text-[11px] font-bold text-green-600 flex items-center gap-1">
                      <Check size={12} strokeWidth={3} /> Tier Unlocked!
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-gray-900 leading-none">₹{currentTotal}</p>
                </div>
              </div>

              <button
                onClick={handleAddBundleToCart}
                disabled={bundle.length < 3 || isAddingToCart}
                className="w-full bg-[#913b7e] disabled:bg-[#e2cbe0] disabled:text-[#662654]/60 hover:bg-[#7a2e64] text-white font-extrabold uppercase tracking-widest text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                style={{ backgroundColor: bundle.length >= 3 ? '#662654' : '#e2cbe0' }}
              >
                {isAddingToCart ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <ShoppingCart size={18} />
                  </motion.div>
                ) : (
                  <span>{bundle.length < 3 ? 'Add 3 items to start' : 'Add Bundle To Cart'}</span>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BYOCPage;
