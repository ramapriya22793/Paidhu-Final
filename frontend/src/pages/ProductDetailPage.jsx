import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ChevronDown, ChevronUp, Plus, Minus, ShoppingCart, 
  ShieldCheck, CheckCircle2, Heart, Info, HelpCircle, ArrowLeft, Check,
  ChevronLeft, ChevronRight, MessageSquare, Sparkles, ArrowRight, X, ZoomIn
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import SEO from '../components/seo/SEO';
import ProductCarousel from '../components/home/ProductCarousel';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import fallbacks from '../components/home/fallbacks.json';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://paidhu-final-anm2.vercel.app');

const resolveImage = (img) => {
  if (!img) return null;
  if (typeof img === 'object' && img.imageUrl) return resolveImage(img.imageUrl);
  if (typeof img !== 'string') return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/') && (img.includes('.png') || img.includes('.jpg') || img.includes('.webp') || img.includes('.svg') || img.includes('saffron_'))) {
    return img;
  }
  return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
};

// Fix corrupted product names from DB (e.g. "???" -> " - ")
const resolveProductName = (name) => {
  if (!name) return '';
  return name.replace(/\s*\?+\s*/g, ' - ').trim();
};

// Detect if a product is saffron-related (Saffron 1G, Saffron Gift Box, Kashmiri Mongra, etc.)
const isSaffronProduct = (p, selectedVariant) => {
  if (!p) return false;
  const str = [
    p.name,
    p.slug,
    typeof p.category === 'object' ? p.category?.name : p.category,
    typeof p.tags === 'string' ? p.tags : Array.isArray(p.tags) ? p.tags.join(' ') : '',
    p.description,
    p.shortDescription,
    selectedVariant?.size,
    selectedVariant?.name,
    ...(Array.isArray(p.variants) ? p.variants.map(v => v.size || v.name) : [])
  ].filter(Boolean).join(' ').toLowerCase();

  return (
    str.includes('saffron') ||
    str.includes('mongra') ||
    str.includes('neign') ||
    str.includes('gift-box') ||
    str.includes('gift box') ||
    str.includes('kesar')
  );
};


const ProductDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stateProduct = location.state?.product;

  // Always fetch fresh from API so faqData, nutritionInfo etc. are always up to date.
  // stateProduct is only used for a quick initial preview (image/name) while we load.
  const [product, setProduct] = useState(() => stateProduct || null);
  const [loading, setLoading] = useState(true);
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
  
  const { addToCart, updateQuantity, getItemQuantity, wishlist, toggleWishlist } = useCart();
  const isInWishlist = product && wishlist && wishlist.some(item => item.id === product.id);
  const [isAdding, setIsAdding] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const isSaffron = isSaffronProduct(product, selectedVariant);

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
      setLoading(true);
      setError(null);
      try {
        const decoded = decodeURIComponent(id || '').trim();
        const fetchParam = decoded.replace(/\s+/g, '-');
        const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(fetchParam)}?_t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
          if (res.status === 404) throw new Error("Product not found");
          throw new Error("Failed to fetch product details");
        }
        const data = await res.json();
        setProduct(data);

        // Fire Meta Pixel ViewContent event for catalogue matching
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'ViewContent', {
            content_ids: [String(data.id)],
            content_type: 'product',
            content_name: data.name,
            value: Number(data.discountPrice || data.price || 0),
            currency: 'INR'
          });
        }

        // Fetch similar products in same category and also include other products
        try {
          const listRes = await fetch(`${API_BASE}/api/products?limit=60&_t=${Date.now()}`, { cache: 'no-store' });
          let all = [];
          if (listRes.ok) {
            const listData = await listRes.json();
            all = listData.products || [];
          }

          // Merge with fallbacks to guarantee plenty of products across all categories
          Object.values(fallbacks).forEach(catList => {
            catList.forEach(p => {
              const item = p.raw || p;
              if (item && item.id && !all.some(existing => String(existing.id) === String(item.id))) {
                all.push(item);
              }
            });
          });

          // 1. Same category items first (excluding current product)
          const currentIdStr = String(data.id || '');
          const currentSlug = data.slug || '';
          const currentCat = (data.category || '').toLowerCase();

          const catMatches = all.filter(p => 
            String(p.id) !== currentIdStr && 
            p.slug !== currentSlug && 
            (currentCat && p.category?.toLowerCase() === currentCat)
          );

          // 2. All other products from other categories (Cookies, Saffron, Jams, Brew Flora, Teas, Combos)
          const otherProducts = all.filter(p => 
            String(p.id) !== currentIdStr && 
            p.slug !== currentSlug && 
            !catMatches.some(m => String(m.id) === String(p.id))
          );

          // Combined: Category similar items first, then all other products!
          setSimilarProducts([...catMatches, ...otherProducts]);
        } catch (e) {
          console.error("Failed to fetch similar products:", e);
        }

        // Redirect URL to official clean slug if needed (e.g. from numeric ID or space URL)
        if (data.slug && id !== data.slug) {
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
    setActiveImageIndex(0);
  }, [id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    if (lightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);


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
  const faqs = (product.productSeo?.faqs && Array.isArray(product.productSeo.faqs) && product.productSeo.faqs.length > 0)
    ? product.productSeo.faqs
    : parseJsonField(product.faqData);

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

  // 🌸 Saffron 5-item Signature Gallery (Matches user mockup)
  const saffronGallery = [
    {
      full: resolveImage(product?.image) || '/saffron_highres_1.png',
      thumb: '/saffron_thumb_1.png',
      circle: '/saffron_circle_1.png',
      title: 'Kashmiri Mongra Saffron Box & Bottle'
    },
    {
      full: (product?.images && product.images[0] ? resolveImage(product.images[0]) : null) || '/saffron_highres_2.png',
      thumb: '/saffron_thumb_2.png',
      circle: '/saffron_circle_2.png',
      title: 'Glass Vial Bottle with Cork Lid'
    },
    {
      full: (product?.images && product.images[1] ? resolveImage(product.images[1]) : null) || '/saffron_highres_3.png',
      thumb: '/saffron_thumb_3.png',
      circle: '/saffron_circle_3.png',
      title: 'Luxury Saffron Packaging Box'
    },
    {
      full: (product?.images && product.images[2] ? resolveImage(product.images[2]) : null) || '/saffron_highres_4.png',
      thumb: '/saffron_thumb_4.png',
      circle: '/saffron_circle_4.png',
      title: 'Quality & Lab Purity Certificate'
    },
    {
      full: (product?.images && product.images[3] ? resolveImage(product.images[3]) : null) || '/saffron_highres_5.png',
      thumb: '/saffron_thumb_5.png',
      circle: '/saffron_circle_5.png',
      title: 'Nutrition Facts & Analysis'
    }
  ];

  // Standard gallery for other products
  const standardGallery = [];
  if (product && product.image) {
    standardGallery.push({
      full: resolveImage(product.image),
      thumb: resolveImage(product.image),
      title: product.name
    });
  }
  if (product && Array.isArray(product.images)) {
    product.images.forEach((img, idx) => {
      const url = resolveImage(typeof img === 'string' ? img : img.imageUrl);
      if (url && !standardGallery.some(g => g.full === url)) {
        standardGallery.push({
          full: url,
          thumb: url,
          title: `${product.name} - View ${idx + 1}`
        });
      }
    });
  }
  if (product && Array.isArray(product.productImages)) {
    product.productImages.forEach((img, idx) => {
      const url = resolveImage(img.imageUrl);
      if (url && !standardGallery.some(g => g.full === url)) {
        standardGallery.push({
          full: url,
          thumb: url,
          title: `${product.name} - View ${idx + 1}`
        });
      }
    });
  }
  if (standardGallery.length === 0) {
    standardGallery.push({
      full: '/white_lotus_cookies_new.png',
      thumb: '/white_lotus_cookies_new.png',
      title: product?.name || 'Product'
    });
  }

  const galleryItems = isSaffron ? saffronGallery : standardGallery;
  const currentItem = galleryItems[activeImageIndex] || galleryItems[0];
  const currentImage = currentItem?.full || '/white_lotus_cookies_new.png';
  const productImage = currentImage;

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
        title={product.productSeo?.seoTitle || product.productSeo?.seoFriendlyPageTitle || product.seoTitle || product.name}
        description={product.productSeo?.metaDescription || product.seoDescription || product.shortDescription || (product.description ? product.description.substring(0, 160) : '')}
        keywords={product.productSeo?.secondaryKeywords ? (Array.isArray(product.productSeo.secondaryKeywords) ? product.productSeo.secondaryKeywords.join(', ') : product.productSeo.secondaryKeywords) : product.seoKeywords}
        image={productImage}
        canonicalUrl={product.productSeo?.canonicalUrl}
        robotsIndex={product.productSeo?.robotsIndex || 'index'}
        robotsFollow={product.productSeo?.robotsFollow || 'follow'}
        customSchema={product.productSeo?.productSchema}
        faqData={faqs}
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
        
        {/* 🌸 Saffron Signature Breadcrumbs or Standard Breadcrumbs */}
        {isSaffron ? (
          <div className="w-full text-center py-3 mb-4">
            <nav className="inline-flex items-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#334155] uppercase font-sans">
              <Link to="/" className="hover:text-[#b91c1c] transition-colors">HOME</Link>
              <span className="text-gray-300 font-light">-</span>
              <Link to="/shop" className="hover:text-[#b91c1c] transition-colors">PRODUCTS</Link>
              <span className="text-gray-300 font-light">-</span>
              <span className="text-[#b91c1c] font-bold">KASHMIRI MONGRA</span>
            </nav>
          </div>
        ) : (
          <>
            {/* Breadcrumbs Navigation */}
            <Breadcrumbs items={breadcrumbItems} />
            
            {/* Breadcrumb / Back Link */}
            <Link 
              to="/shop" 
              className="group inline-flex items-center gap-2 text-gray-500 hover:text-[#662654] font-bold text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Shop
            </Link>
          </>
        )}

        {/* ── Main Product Section ── */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start p-6 md:p-10 rounded-[2.5rem] border border-gray-100/80 relative overflow-hidden ${
          isSaffron ? 'bg-[#f8f9fd] shadow-[0_20px_50px_rgba(70,80,120,0.05)]' : 'bg-white shadow-[0_20px_50px_rgba(102,38,84,0.03)]'
        }`}>
          
          {/* Decorative luxury radial background */}
          <div className="absolute top-[-10%] right-[-10%] w-[35%] aspect-square rounded-full bg-gradient-to-br from-[#662654]/5 to-transparent blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[35%] aspect-square rounded-full bg-gradient-to-tr from-[#d4af37]/5 to-transparent blur-[80px] pointer-events-none" />

          {/* 1. Left Column: Product Image Gallery */}
          {isSaffron ? (
            <div className="relative w-full rounded-[2.5rem] overflow-hidden p-4 sm:p-8 md:p-10 border border-[#dce1f0] shadow-xs bg-[#eef1f8] bg-[radial-gradient(#d5daf0_1.5px,transparent_1.5px)] [background-size:20px_20px]">
              {/* Subtle Saffron Pattern Watermark */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none bg-repeat bg-center"
                style={{ backgroundImage: "url('/saffron_bg_pattern.png')", backgroundSize: "220px 220px" }}
              />

              {/* Ambient radial glows */}
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-gradient-to-br from-red-500/10 to-transparent blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-gradient-to-tr from-amber-500/10 to-transparent blur-3xl pointer-events-none" />

              {/* Flex Container: Curved Arc Thumbnails + Central Circle */}
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-8 w-full z-10">
                
                {/* 🌸 Curved Circular Thumbnails Arc along the left side */}
                <div className="flex flex-row md:flex-col items-center justify-center gap-3 sm:gap-4 md:gap-3.5 z-20 order-2 md:order-1 shrink-0 overflow-x-auto max-w-full py-2 px-2">
                  {saffronGallery.map((item, idx) => {
                    // Arc curve offsets for desktop (md:):
                    // Matches user reference (media_1789132865636.png) wrapping the left curve of the central circle
                    const arcOffsets = [82, 30, 0, 30, 82];
                    const xOffset = arcOffsets[idx] || 0;
                    const isSelected = activeImageIndex === idx;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActiveImageIndex(idx);
                          setMainImgLoading(true);
                        }}
                        style={{
                          '--arc-x': `${xOffset}px`
                        }}
                        className={`group relative w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full bg-white p-1 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:scale-110 md:[transform:translateX(var(--arc-x))] ${
                          isSelected
                            ? 'border-2 border-[#b91c1c] ring-2 ring-[#b91c1c]/25 scale-105 shadow-xl z-10'
                            : 'border border-gray-200/90 hover:border-[#b91c1c]/50 opacity-90 hover:opacity-100'
                        }`}
                        title={item.title}
                        aria-label={item.title}
                      >
                        <img
                          src={item.thumb || item.circle || item.full}
                          alt={item.title}
                          className="w-full h-full object-contain rounded-full select-none pointer-events-none"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>

                {/* 🌸 Central Large White Showcase Circle */}
                <div className="relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[460px] aspect-square rounded-full bg-white shadow-[0_20px_50px_rgba(30,41,59,0.08)] border border-white flex items-center justify-center p-6 sm:p-8 lg:p-10 order-1 md:order-2 group">
                  
                  {/* Discount badge if present */}
                  {discountPercent > 0 && (
                    <div className="absolute top-4 left-8 md:top-6 md:left-10 bg-gradient-to-r from-[#b91c1c] to-[#d4af37] text-white px-3.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-full shadow-lg z-10 flex items-center gap-1 border border-white/20">
                      <span>✨</span> {discountPercent}% OFF
                    </div>
                  )}

                  {/* Active Image with smooth transition */}
                  <div 
                    className="w-full h-full flex items-center justify-center relative cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                    title="Click to zoom image"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImageIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        src={currentImage}
                        alt={saffronGallery[activeImageIndex]?.title || product.name}
                        title={saffronGallery[activeImageIndex]?.title || product.name}
                        className="w-full h-full object-contain select-none p-2"
                        style={{ imageRendering: 'high-quality' }}
                        onLoad={() => setMainImgLoading(false)}
                      />
                    </AnimatePresence>

                    {mainImgLoading && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-xs rounded-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-3xl animate-spin text-[#b91c1c]">🌸</span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Loading...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 🌸 Red Zoom Button at Bottom-Right */}
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-[#b91c1c] text-[#b91c1c] flex items-center justify-center shadow-lg hover:bg-[#b91c1c] hover:text-white transition-all duration-300 cursor-pointer z-10 hover:scale-110"
                    title="Zoom Full View"
                    aria-label="Zoom Full View"
                  >
                    <ZoomIn size={22} className="stroke-[2.5]" />
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <div>
              <div
                className="relative aspect-square bg-[#faf9f7] rounded-[2rem] overflow-hidden border border-gray-100 flex items-center justify-center shadow-inner group cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ 
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    src={currentImage} 
                    alt={product.name} 
                    title={product.name}
                    width="600"
                    height="600"
                    loading="eager"
                    className="w-full h-full object-contain p-6 select-none"
                    style={{ imageRendering: 'high-quality', WebkitBackfaceVisibility: 'hidden', WebkitTransform: 'translateZ(0)' }}
                    onLoad={() => setMainImgLoading(false)}
                    onError={(e) => {
                      setMainImgLoading(false);
                      if (e.currentTarget.src !== 'https://paidhuethicalfoods.com/white_lotus_cookies_new.png') {
                        e.currentTarget.src = 'https://paidhuethicalfoods.com/white_lotus_cookies_new.png';
                      }
                    }}
                  />
                </AnimatePresence>

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
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  title="Zoom image"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Multiple Thumbnails Gallery for Standard Products */}
              {galleryItems.length > 1 && (
                <div className="flex items-center gap-3 mt-4 overflow-x-auto py-2">
                  {galleryItems.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setMainImgLoading(true);
                      }}
                      className={`w-16 h-16 rounded-2xl overflow-hidden border-2 p-1 bg-white transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx ? 'border-[#662654] shadow-md scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={item.thumb || item.full} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Right Column: Rich Info Panel */}
          <div className="space-y-6 lg:space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-[#662654] uppercase tracking-widest bg-[#662654]/10 border border-[#662654]/10 px-3.5 py-1.5 rounded-full">
                  {product.category}
                </span>
                {isSaffron && (
                  <Link
                    to="/saffron-guidance"
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#d4af37]/20 to-[#f5d061]/20 hover:from-[#d4af37]/30 hover:to-[#f5d061]/30 text-[#7a4f15] border border-[#d4af37]/40 text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all shadow-xs"
                  >
                    <Sparkles size={11} className="text-[#85581a]" />
                    <span>Free Saffron Guidance Included</span>
                  </Link>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mt-3 leading-tight">
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
            {(() => {
              const currentVariantSize = selectedVariant?.size || 'default';
              const inCartQty = product ? (getItemQuantity(product.id, currentVariantSize) || (currentVariantSize === 'default' ? getItemQuantity(product.id) : 0)) : 0;
              return (
                <div className="flex flex-col sm:flex-row gap-4 border-t border-b border-gray-100 py-6">
                  {/* Qty Selector */}
                  {inCartQty > 0 ? (
                    <div className="flex items-center justify-between border border-[#662654]/30 rounded-full p-1 bg-[#662654]/5 w-full sm:w-36 shadow-xs">
                      <motion.button 
                        onClick={() => updateQuantity(product.id, inCartQty - 1, currentVariantSize)}
                        whileTap={{ scale: 0.8 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#662654] hover:bg-[#662654] hover:text-white transition-all cursor-pointer"
                        title="Decrease quantity in cart"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </motion.button>
                      <div className="flex flex-col items-center leading-none">
                        <span className="text-sm font-black text-[#662654]">{inCartQty}</span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">in cart</span>
                      </div>
                      <motion.button 
                        onClick={() => updateQuantity(product.id, inCartQty + 1, currentVariantSize)}
                        whileTap={{ scale: 0.8 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#662654] hover:bg-[#662654] hover:text-white transition-all cursor-pointer"
                        title="Increase quantity in cart"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </motion.button>
                    </div>
                  ) : (
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
                  )}

                  {/* Add To Cart Button */}
                  <motion.button 
                    onClick={inCartQty > 0 ? () => updateQuantity(product.id, inCartQty + 1, currentVariantSize) : handleAddToCart}
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
                    ) : inCartQty > 0 ? (
                      <>
                        <ShoppingCart size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                        <span>IN CART ({inCartQty}) — ADD ANOTHER (+1)</span>
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
                    <Heart size={18} className={isInWishlist ? 'fill-[#662654]' : ''} />
                  </motion.button>
                </div>
              );
            })()}

            {/* 🌸 Saffron Guidance Box (Visible while viewing Saffron products) */}
            {isSaffron && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 md:p-5 bg-gradient-to-br from-[#fefbf6] via-[#fff8ef] to-[#fbf1f5] border border-[#d4af37]/50 shadow-[0_4px_20px_rgba(212,175,55,0.12)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
                
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#662654] to-[#9b3b82] p-1 flex-shrink-0 shadow-md flex items-center justify-center">
                    <img 
                      src="/saffron_icon.png" 
                      alt="Saffron Guidance" 
                      className="w-full h-full object-contain drop-shadow-sm" 
                      onError={(e) => { e.target.src = '/mascot.png'; }} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-[#d4af37]/20 text-[#85581a] px-2.5 py-0.5 rounded-full border border-[#d4af37]/40 flex items-center gap-1">
                        <Sparkles size={10} className="text-[#85581a]" />
                        Free Saffron Guidance
                      </span>
                    </div>
                    <h3 className="text-sm md:text-[15px] font-black text-[#662654] mt-1.5 font-serif leading-snug">
                      Need Guidance on Saffron for Pregnancy or Daily Wellness?
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Doctor-aligned advice on Kashmiri Mongra Saffron dosage, right trimester timing, warm milk preparation, and family wellness benefits.
                    </p>

                    {/* Quick highlight pills */}
                    <div className="flex flex-wrap gap-2 mt-2.5 text-[11px] font-bold text-[#662654]/90">
                      <span className="bg-white/80 border border-[#d4af37]/30 rounded-md px-2 py-0.5 shadow-xs flex items-center gap-1">
                        🌸 Trimester-wise Dosage
                      </span>
                      <span className="bg-white/80 border border-[#d4af37]/30 rounded-md px-2 py-0.5 shadow-xs flex items-center gap-1">
                        🥛 Warm Milk Protocol
                      </span>
                      <span className="bg-white/80 border border-[#d4af37]/30 rounded-md px-2 py-0.5 shadow-xs flex items-center gap-1">
                        🏥 Doctor-Approved
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 mt-3.5">
                      <Link
                        to="/saffron-guidance"
                        className="inline-flex items-center gap-1.5 bg-[#662654] hover:bg-[#4a1c3d] text-white text-xs font-black px-4 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <span>Consult Saffron Guidance</span>
                        <ArrowRight size={13} />
                      </Link>
                      <a
                        href="https://wa.me/918754787774?text=Hi%20Paidhu%2C%20I%20am%20viewing%20the%20Saffron%20Gift%20Box%20%2F%20Kashmiri%20Mongra%20Saffron%20and%20would%20like%20expert%20saffron%20guidance%20for%20pregnancy%2Fwellness."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <MessageSquare size={13} />
                        <span>WhatsApp Expert</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

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
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-700">Family Approved</span>
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

        {/* ── Internal Links Section (SEO) ── */}
        {product.productSeo?.internalLinks && product.productSeo.internalLinks.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Explore Related Categories & Pages</h4>
            <div className="flex flex-wrap gap-2">
              {product.productSeo.internalLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.url || '/shop'}
                  className="px-3.5 py-1.5 bg-[#faf9f7] hover:bg-[#662654] hover:text-white border border-gray-200/80 rounded-xl text-xs font-bold text-[#662654] transition-all flex items-center gap-1"
                >
                  <span>{link.anchorText}</span>
                  <span>→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

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

                      {(() => {
                        const simQty = getItemQuantity(simProd.id, 'default') || getItemQuantity(simProd.id);
                        if (simQty > 0) {
                          return (
                            <div 
                              className="flex items-center gap-1 bg-[#662654] text-white rounded-full px-2 py-0.5 shadow-sm"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            >
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  updateQuantity(simProd.id, simQty - 1);
                                }}
                                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                                title="Decrease quantity"
                              >
                                <Minus size={11} strokeWidth={2.5} />
                              </button>
                              <span className="text-xs font-bold px-1 min-w-[14px] text-center">{simQty}</span>
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  updateQuantity(simProd.id, simQty + 1);
                                }}
                                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                                title="Increase quantity"
                              >
                                <Plus size={11} strokeWidth={2.5} />
                              </button>
                            </div>
                          );
                        }
                        return (
                          <motion.button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(simProd, 1);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-7 h-7 rounded-full bg-[#662654] hover:bg-[#7a2e64] text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                            title="Add to Cart"
                          >
                            <Plus size={16} strokeWidth={2.5} />
                          </motion.button>
                        );
                      })()}

                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}



        {/* 🌸 Fullscreen Lightbox Zoom Modal */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
              onClick={() => setLightboxOpen(false)}
            >
              {/* Top Bar: Title & Close Button */}
              <div className="w-full flex items-center justify-between z-30 max-w-5xl" onClick={(e) => e.stopPropagation()}>
                <div className="text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                    {isSaffron ? 'Kashmiri Mongra Saffron Showcase' : 'Product Gallery'}
                  </span>
                  <h3 className="text-sm sm:text-base font-medium text-white/90 truncate max-w-xs sm:max-w-md">
                    {galleryItems[activeImageIndex]?.title || product.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:scale-105"
                  aria-label="Close Lightbox"
                  title="Close (Esc)"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Central Area: Prev, Main Image, Next */}
              <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
                {galleryItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1))}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-white/20 hover:scale-110 shadow-xl"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                <div className="w-full h-full max-h-[70vh] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImageIndex}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.22 }}
                      src={currentImage}
                      alt={galleryItems[activeImageIndex]?.title || product.name}
                      className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl bg-white/5 p-2 select-none"
                    />
                  </AnimatePresence>
                </div>

                {galleryItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-white/20 hover:scale-110 shadow-xl"
                    aria-label="Next Image"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>

              {/* Bottom Bar: Thumbnail Strip & Counter */}
              <div className="flex flex-col items-center gap-2 z-30 max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
                <span className="text-white/60 text-xs font-semibold tracking-wider">
                  {activeImageIndex + 1} / {galleryItems.length}
                </span>

                {galleryItems.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto max-w-full py-1.5 px-2">
                    {galleryItems.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 transition-all shrink-0 cursor-pointer p-0.5 bg-white ${
                          activeImageIndex === idx
                            ? 'border-[#b91c1c] ring-2 ring-red-500/40 scale-110 shadow-xl'
                            : 'border-white/30 opacity-60 hover:opacity-100'
                        }`}
                        title={item.title}
                      >
                        <img
                          src={item.thumb || item.circle || item.full}
                          alt=""
                          className="w-full h-full object-contain rounded-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
