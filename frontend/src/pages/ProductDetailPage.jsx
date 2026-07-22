import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ChevronDown, ChevronUp, Plus, Minus, ShoppingCart, 
  ShieldCheck, CheckCircle2, Heart, Info, HelpCircle, ArrowLeft, Check,
  ChevronLeft, ChevronRight
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import SEO from '../components/seo/SEO';
import ProductCarousel from '../components/home/ProductCarousel';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const API_BASE = 'https://paidhu-final-anm2.vercel.app';

const resolveImage = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
};

// Fix corrupted product names from DB (e.g. "???" -> " - ")
const resolveProductName = (name) => {
  if (!name) return '';
  return name.replace(/\s*\?+\s*/g, ' - ').trim();
};


const ProductDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stateProduct = location.state?.product;

  const [product, setProduct] = useState(() => stateProduct || null);
  const [loading, setLoading] = useState(() => !stateProduct);
  const [error, setError] = useState(null);
  
  const [mainImgLoading, setMainImgLoading] = useState(true);

  // Similar Products Carousel ref & helper
  const similarScrollRef = useRef(null);
  const scrollSimilar = (direction) => {
    if (similarScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      similarScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  
  // Order states
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(() => {
    if (stateProduct && stateProduct.variants) {
      const parsed = typeof stateProduct.variants === 'string' ? JSON.parse(stateProduct.variants) : stateProduct.variants;
      if (Array.isArray(parsed) && parsed.length > 0) {
        const isJam = stateProduct.name?.toLowerCase().includes('jam');
        const sorted = [...parsed].sort((a, b) => {
          const sizeA = parseInt(a.size) || 0;
          const sizeB = parseInt(b.size) || 0;
          return isJam ? sizeB - sizeA : sizeA - sizeB;
        });
        return sorted[0];
      }
    }
    return null;
  });
  
  // Tab states
  const [activeTab, setActiveTab] = useState('about'); // about, benefits, nutrition, faqs
  const [openFaq, setOpenFaq] = useState(null);
  
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const isInWishlist = product && wishlist && wishlist.some(item => item.id === product.id);
  const [isAdding, setIsAdding] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice || null,
        image: product.image,
        category: product.category,
        shortDescription: product.shortDescription
      }, quantity, selectedVariant);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!product) {
        setLoading(true);
      }
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Product not found");
          throw new Error("Failed to fetch product details");
        }
        const data = await res.json();
        setProduct(data);

        // Fetch similar products in same category or matching keywords
        try {
          const listRes = await fetch(`${API_BASE}/api/products?limit=50`);
          if (listRes.ok) {
            const listData = await listRes.json();
            const all = listData.products || [];
            
            // Filter products in the same category or matching type, excluding current product
            let filtered = all.filter(p => p.id !== data.id && p.slug !== data.slug);
            
            if (data.category) {
              const catMatches = filtered.filter(p => p.category?.toLowerCase() === data.category?.toLowerCase());
              if (catMatches.length > 0) {
                filtered = catMatches;
              }
            }
            setSimilarProducts(filtered);
          }
        } catch (e) {
          console.error("Failed to fetch similar products:", e);
        }

        // If they landed on a numeric ID URL, redirect them to the slug URL
        const isIdNumeric = !isNaN(Number(id)) && /^\d+$/.test(id);
        if (isIdNumeric && data.slug) {
          navigate(`/product/${data.slug}`, { replace: true });
        }
        
        // Set variant if not set
        if (data.variants) {
          const parsed = typeof data.variants === 'string' ? JSON.parse(data.variants) : data.variants;
          if (Array.isArray(parsed) && parsed.length > 0 && !selectedVariant) {
            const isJam = data.name?.toLowerCase().includes('jam');
            const sorted = [...parsed].sort((a, b) => {
              const sizeA = parseInt(a.size) || 0;
              const sizeB = parseInt(b.size) || 0;
              return isJam ? sizeB - sizeA : sizeA - sizeB;
            });
            setSelectedVariant(sorted[0]);
          }
        }
      } catch (err) {
        console.error("Fetch product detail error:", err);
        if (!product) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [id]);

  // Handler for variant change
  const handleVariantSelect = (v) => {
    setSelectedVariant(v);
  };

  // Safe JSON parse helper for properties that could be stored as JSON
  const parseJsonField = (field) => {
    if (!field) return [];
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    }
    return Array.isArray(field) ? field : [];
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col justify-center items-center py-20">
        <div className="max-w-[1400px] w-full px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          {/* Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl w-full" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
          {/* Info Skeleton */}
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-20 bg-gray-200 rounded w-full" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-12 bg-gray-200 rounded-full w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col justify-center items-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center border border-gray-100"
        >
          <div className="text-6xl mb-4">🌸</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "The product you are looking for does not exist or has been removed."}</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-[#662654] hover:bg-[#7a2e64] text-white px-6 py-3 rounded-full font-bold transition-all shadow-md"
          >
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  // Parse rich text / JSON lists safely
  const benefitsList = parseJsonField(product.benefits);
  const highlightsList = parseJsonField(product.highlights);
  const faqs = parseJsonField(product.faqData);
  const variantsRaw = parseJsonField(product.variants);
  const isJam = product.name?.toLowerCase().includes('jam');
  const variants = Array.isArray(variantsRaw) ? [...variantsRaw].sort((a, b) => {
    const sizeA = parseInt(a.size) || 0;
    const sizeB = parseInt(b.size) || 0;
    return isJam ? sizeB - sizeA : sizeA - sizeB;
  }) : [];
  
  // Calculate pricing based on selected variant or default values
  const price = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
  const offerPrice = selectedVariant ? (selectedVariant.offerPrice ? Number(selectedVariant.offerPrice) : null) : (product.discountPrice ? Number(product.discountPrice) : null);
  
  const discountPercent = offerPrice && price > offerPrice
    ? Math.round(((price - offerPrice) / price) * 100)
    : 0;

  // Single product image
  const productImage = resolveImage(product.image || '');

  const breadcrumbItems = [
    { name: 'Shop', url: '/shop' },
    { name: product.category || 'Category', url: `/shop/${(product.category || '').toLowerCase().replace(/\s+/g, '-')}` },
    { name: product.name || 'Product' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="w-full min-h-screen bg-[#fcfbfa] py-8 font-sans"
    >
      <SEO 
        title={product.seoTitle || product.name}
        description={product.seoDescription || product.shortDescription || (product.description ? product.description.substring(0, 160) : '')}
        keywords={product.seoKeywords}
        image={productImage}
        productData={{
          name: product.name,
          image: productImage,
          description: product.shortDescription || (product.description ? product.description.substring(0, 160) : ''),
          price: offerPrice || price,
          inStock: product.stock > 0
        }}
        breadcrumbData={breadcrumbItems}
      />
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs items={breadcrumbItems} />
        
        {/* Breadcrumb / Back Link */}
        <Link 
          to="/shop" 
          className="group inline-flex items-center gap-2 text-gray-500 hover:text-[#662654] font-bold text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Shop
        </Link>

        {/* ── Main Product Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(102,38,84,0.03)] border border-gray-100/80 relative overflow-hidden">
          
          {/* Decorative luxury radial background */}
          <div className="absolute top-[-10%] right-[-10%] w-[35%] aspect-square rounded-full bg-gradient-to-br from-[#662654]/5 to-transparent blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[35%] aspect-square rounded-full bg-gradient-to-tr from-[#d4af37]/5 to-transparent blur-[80px] pointer-events-none" />

          {/* 1. Left Column: Product Image with Zoom */}
          <div>
            <div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              className="relative aspect-square bg-[#faf9f7] rounded-[2rem] overflow-hidden border border-gray-100 flex items-center justify-center shadow-inner cursor-zoom-in"
            >
              <motion.img 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ 
                  opacity: 1,
                  scale: isZooming ? 1.75 : 1,
                  transformOrigin: isZooming ? `${zoomPos.x}% ${zoomPos.y}%` : 'center'
                }}
                transition={isZooming ? { type: 'tween', duration: 0.1 } : { type: 'spring', damping: 25, stiffness: 120 }}
                src={productImage} 
                alt={product.name} 
                title={product.name}
                width="600"
                height="600"
                loading="eager"
                srcSet={`${productImage}?w=300 300w, ${productImage}?w=600 600w`}
                sizes="(max-width: 600px) 300px, 600px"
                className="w-full h-full object-contain p-6 pointer-events-none"
                style={{ imageRendering: 'high-quality', WebkitBackfaceVisibility: 'hidden', WebkitTransform: 'translateZ(0)' }}
                onLoad={() => setMainImgLoading(false)}
              />
              {mainImgLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#faf9f7] via-[#f5f3ef] to-[#faf9f7] animate-pulse flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl animate-spin text-[#662654] opacity-35">🌸</span>
                    <span className="text-[10px] font-black tracking-widest text-[#662654]/40 uppercase">Loading image…</span>
                  </div>
                </div>
              )}
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#662654] to-[#d4af37] text-white px-4 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-full shadow-lg z-10 flex items-center gap-1 border border-white/20">
                  <span>✨</span> {discountPercent}% OFF
                </div>
              )}
            </div>
          </div>

          {/* 2. Right Column: Rich Info Panel */}
          <div className="space-y-6 lg:space-y-8">
            <div>
              <span className="text-xs font-black text-[#662654] uppercase tracking-widest bg-[#662654]/10 border border-[#662654]/10 px-3.5 py-1.5 rounded-full">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mt-4 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Ratings and Reviews Summary */}
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-5">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" className="stroke-current" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">4.8 / 5.0</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-semibold text-[#662654] hover:text-[#d4af37] transition-colors hover:underline cursor-pointer">
                12 Reviews
              </span>
            </div>

            {/* Price Section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                {offerPrice ? (
                  <>
                    <span className="text-3xl font-black text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      ₹{offerPrice.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-gray-900">
                    ₹{price.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Inclusive of all taxes</p>
            </div>

            {/* Variants Selector */}
            {variants.length > 0 && (
              <div className="space-y-3">
                <span className="block text-xs font-black text-gray-400 uppercase tracking-wider">Select Option / Size</span>
                {variants.some(v => v.size.length > 15) ? (
                  <div className="relative w-full max-w-md">
                    <select
                      value={selectedVariant?.size || ''}
                      onChange={(e) => {
                        const selected = variants.find(v => v.size === e.target.value);
                        if (selected) handleVariantSelect(selected);
                      }}
                      className="w-full text-sm font-bold px-4 py-3 rounded-xl border border-gray-200 text-[#662654] bg-white hover:border-[#662654]/50 focus:outline-none focus:ring-2 focus:ring-[#662654]/20 focus:border-[#662654] appearance-none cursor-pointer pr-10 shadow-sm"
                      aria-label="Select product variation option"
                    >
                      {variants.map((v, i) => (
                        <option key={i} value={v.size}>
                          {v.size}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#662654]">
                      <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {variants.map((v, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleVariantSelect(v)}
                        className={`text-sm font-bold px-5 py-2.5 rounded-xl border transition-all duration-300 ${
                          selectedVariant?.size === v.size
                            ? 'border-[#662654] bg-[#662654] text-white shadow-md shadow-[#662654]/20 scale-[1.02]'
                            : 'border-gray-200 text-gray-600 bg-white hover:border-[#662654]/50 hover:bg-gray-50'
                        }`}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stock status indicator */}
            <div className="flex items-center gap-2">
              <span className={`relative flex h-2 w-2`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${product.stock > 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </span>
              <span className="text-xs font-bold text-gray-600">
                {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Action Bar: Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 border-t border-b border-gray-100 py-6">
              
              {/* Qty Selector */}
              <div className="flex items-center justify-between border border-gray-200 rounded-full p-1 bg-[#faf9f6] w-full sm:w-32 shadow-inner">
                <motion.button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  whileTap={{ scale: 0.8 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#662654] shadow-sm disabled:shadow-none transition-all disabled:opacity-30 cursor-pointer"
                >
                  <Minus size={14} />
                </motion.button>
                <span className="text-sm font-black text-[#662654]">{quantity}</span>
                <motion.button 
                  onClick={() => setQuantity(q => q + 1)}
                  whileTap={{ scale: 0.8 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#662654] shadow-sm transition-all cursor-pointer"
                >
                  <Plus size={14} />
                </motion.button>
              </div>

              {/* Add To Cart Button */}
              <motion.button 
                onClick={handleAddToCart}
                disabled={isAdding}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-[#662654] via-[#7a2e64] to-[#662654] hover:brightness-110 disabled:bg-emerald-600 text-white rounded-full py-4 px-8 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#662654]/20 hover:shadow-2xl hover:shadow-[#662654]/35 cursor-pointer relative overflow-hidden group"
              >
                {/* Shining reflection animation overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                
                {isAdding ? (
                  <>
                    <Check size={18} strokeWidth={3} className="text-white animate-bounce" />
                    <span>{product.status === 'PREORDER' ? 'PRE-ORDERED!' : 'ADDED TO CART!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                    <span>{product.status === 'PREORDER' ? 'PRE-ORDER NOW' : 'ADD TO CART'} — ₹{((offerPrice || price) * quantity).toLocaleString()}</span>
                  </>
                )}
              </motion.button>

              {/* Wishlist Button */}
              <motion.button 
                onClick={() => toggleWishlist(product)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isInWishlist ? 'border-[#662654] bg-[#662654]/5 text-[#662654]' : 'border-gray-200 text-gray-400 hover:text-[#662654]'
                }`}
              >
                <Heart size={20} className={isInWishlist ? 'animate-pulse' : ''} fill={isInWishlist ? "currentColor" : "none"} />
              </motion.button>
            </div>

            {/* Value Props Strip */}
            <div className="grid grid-cols-3 gap-3 text-center text-gray-500 pt-2">
              <motion.div whileHover={{ y: -3 }} className="flex flex-col items-center p-3 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="w-10 h-10 rounded-full bg-[#662654]/5 flex items-center justify-center mb-1.5">
                  <ShieldCheck size={20} className="text-[#662654]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-700">100% Pure</span>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="flex flex-col items-center p-3 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="w-10 h-10 rounded-full bg-[#662654]/5 flex items-center justify-center mb-1.5">
                  <CheckCircle2 size={20} className="text-[#662654]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-700">Mom Approved</span>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="flex flex-col items-center p-3 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="w-10 h-10 rounded-full bg-[#662654]/5 flex items-center justify-center mb-1.5">
                  <Info size={20} className="text-[#662654]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-700">Zero Sugar</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Detailed Tabs Section (Below the fold) ── */}
        <div className="mt-12 md:mt-16 bg-white rounded-[2.5rem] shadow-[0_10px_35px_rgba(0,0,0,0.01)] border border-gray-100/60 overflow-hidden">
          
          {/* Tab buttons header */}
          <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100 bg-[#faf9f7] px-4 md:px-8">
            {[
              { id: 'about', label: 'About & Ingredients' },
              { id: 'benefits', label: 'Benefits & Highlights', show: benefitsList.length > 0 || highlightsList.length > 0 },
              { id: 'nutrition', label: 'Nutrition Facts', show: product.nutritionInfo },
              { id: 'faqs', label: 'Product FAQs', show: faqs.length > 0 }
            ].map(tab => {
              if (tab.show === false) return null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-5 px-6 font-extrabold text-[13px] tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id 
                      ? 'text-[#662654]' 
                      : 'text-gray-400 hover:text-[#662654]'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#662654] rounded-t-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content bodies */}
          <div className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {activeTab === 'about' && (
                <motion.div
                  key="about" 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                  {product.ingredients && (
                    <div>
                      <h3 className="text-lg font-black text-gray-900 mb-2">Ingredients</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {product.ingredients}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'benefits' && (
                <motion.div
                  key="benefits" 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {benefitsList.length > 0 && (
                    <div>
                      <h3 className="text-lg font-black text-gray-900 mb-4">Key Benefits</h3>
                      <ul className="space-y-3">
                        {benefitsList.map((b, idx) => (
                          <li key={idx} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
                            <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {highlightsList.length > 0 && (
                    <div>
                      <h3 className="text-lg font-black text-gray-900 mb-4">Product Highlights</h3>
                      <ul className="space-y-3">
                        {highlightsList.map((h, idx) => (
                          <li key={idx} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
                            <CheckCircle2 size={18} className="text-[#662654] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'nutrition' && product.nutritionInfo && (
                <motion.div
                  key="nutrition" 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="max-w-md"
                >
                  <h3 className="text-lg font-black text-gray-900 mb-4">Nutritional Facts</h3>
                  <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                    {Object.entries(product.nutritionInfo).map(([key, val]) => (
                      <div key={key} className="flex justify-between p-4 text-sm font-semibold">
                        <span className="text-gray-500 capitalize">{key}</span>
                        <span className="text-gray-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'faqs' && faqs.length > 0 && (
                <motion.div
                  key="faqs" 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="space-y-3 max-w-3xl"
                >
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-gray-800 hover:bg-gray-100/50 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-3">
                            <HelpCircle size={16} className="text-[#662654]" />
                            {faq.question}
                          </span>
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0 }} 
                              animate={{ height: 'auto' }} 
                              exit={{ height: 0 }}
                              className="overflow-hidden bg-white"
                            >
                              <p className="p-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* ── Category-Based Similar Products Section (Carousel Scroller) ── */}
        {similarProducts.length > 0 && (
          <div className="mt-12 mb-8 max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
              <div>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-[#662654] tracking-tight">
                  Similar Products
                </h2>
                <div className="w-10 h-0.5 bg-[#662654] rounded-full mt-1" />
              </div>

              {/* Scroll Arrow Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollSimilar('left')}
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 text-[#662654] flex items-center justify-center shadow-sm hover:bg-[#662654] hover:text-white transition-all active:scale-95 cursor-pointer"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollSimilar('right')}
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 text-[#662654] flex items-center justify-center shadow-sm hover:bg-[#662654] hover:text-white transition-all active:scale-95 cursor-pointer"
                  aria-label="Scroll Right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Horizontal Carousel Container */}
            <div 
              ref={similarScrollRef}
              className="flex overflow-x-auto gap-4 py-2 scroll-smooth snap-x snap-mandatory no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {similarProducts.map((simProd) => {
                const simImg = resolveImage(simProd.image);
                const simPrice = simProd.discountPrice || simProd.price;
                return (
                  <motion.div
                    key={simProd.id}
                    whileHover={{ y: -4 }}
                    className="w-[200px] sm:w-[220px] shrink-0 snap-start bg-white rounded-2xl p-3 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <Link to={`/product/${simProd.slug || simProd.id}`} className="block relative aspect-[4/3] rounded-xl overflow-hidden bg-[#faf9f6] mb-2.5">
                      <img 
                        src={simImg} 
                        alt={simProd.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div>
                      <Link to={`/product/${simProd.slug || simProd.id}`} className="block">
                        <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#662654] transition-colors line-clamp-1">
                          {simProd.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <div>
                        <span className="font-bold text-gray-900 text-sm sm:text-base">
                          ₹{simPrice}
                        </span>
                        {simProd.discountPrice && (
                          <span className="text-[10px] text-gray-400 line-through ml-1">
                            ₹{simProd.price}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/product/${simProd.slug || simProd.id}`}
                        className="bg-[#662654] hover:bg-[#7a2e64] text-white text-[11px] font-bold px-3 py-1.5 rounded-full transition-all shadow-sm flex items-center gap-1"
                      >
                        <ShoppingCart size={11} /> View
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}



      </div>

    </motion.div>
  );
};

export default ProductDetailPage;
