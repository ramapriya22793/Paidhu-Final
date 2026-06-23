import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight,
  ShoppingCart, Heart, ArrowUpDown, Plus, Check
} from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';
import paidhuLogo from '../assets/paidhulogo.png';
import { useCart } from '../context/CartContext';
import BulkOrdersSection from '../components/ui/BulkOrdersSection';
import AboutUsSection from '../components/ui/AboutUsSection';
import BlogsSection from '../components/ui/BlogsSection';
import FloralHabitatSection from '../components/ui/FloralHabitatSection';
import OurCommunitySection from '../components/ui/OurCommunitySection';
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

const shopCache = {};

// ---------- NAV SECTION META ----------
const NAV_META = {
  'shop-all':                   { label: 'Shop All',                   emoji: '🛍️',  desc: 'Browse our complete collection of premium floral foods.' },
  'deal-of-the-day':            { label: 'Deal of the Day',            emoji: '🔥',  desc: 'Exclusive daily deals on your favourite products.' },
  'shop-by-category':           { label: 'Shop by Category',           emoji: '🌿',  desc: 'Explore products organised by category.' },
  'for-your-family':            { label: 'For Your Family',            emoji: '👨‍👩‍👧‍👦', desc: 'Wholesome floral food products perfect for the whole family.' },
  'starting-floral-food-habitat':{ label: 'Starting Floral Food Habitat', emoji: '🌸', desc: 'Begin your floral food journey with curated starter packs.' },
  'byoc':                       { label: 'BYOC',                       emoji: '🎁',  desc: 'Build your own custom floral food box.' },
  'our-own-community':          { label: 'Our Own Community',          emoji: '🤝',  desc: 'Products loved and recommended by our community.' },
  'our-philosophy':             { label: 'Our Philosophy',             emoji: '💚',  desc: 'Products that embody our core values and philosophy.' },
  'bulk-orders':                { label: 'Bulk Orders',                emoji: '📦',  desc: 'Get the best prices when ordering in bulk.' },
  'blogs':                      { label: 'Blogs',                      emoji: '✍️',  desc: 'Discover stories, recipes, and insights from Paidhu.' },
};

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc',label: 'Price: High to Low' },
  { value: 'discount',  label: 'Best Discount' },
];

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 100 } }
};

const getCategoryIcon = (category) => {
  const map = {
    'Bloom Cookies': 'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937180748-WhatsAppImage20251128at14404PM600x402jpeg.jpeg',
    'Petal Jam': 'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780897222396-IMG20250917121311600x404png.png',
    'Saffron': 'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780939517153-saffronneign600x600jpg.jpg',
    'Medley Teas': 'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780938733725-WhatsAppImage20251113at23302330981866600x800jpg.jpg',
    'Brew Flora': 'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937914670-WhatsAppImage20251113at2330215f60b43f600x800jpg.jpg',
    'Bloom Powder': 'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937180748-WhatsAppImage20251128at14404PM600x402jpeg.jpeg'
  };
  return map[category] || '/mascot.png';
};

// ---------- DEAL COUNTDOWN TIMER ----------
const DealCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(24, 0, 0, 0); // Next midnight
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      let hours = Math.floor(diff / (1000 * 60 * 60));
      let minutes = Math.floor((diff / 1000 / 60) % 60);
      let seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNum = (num) => String(num).padStart(2, '0');

  return (
    <motion.div 
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-r from-[#662654] via-[#501b41] to-[#662654] py-3.5 text-white text-center shadow-lg relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl animate-pulse">⚡</span>
          <span className="text-sm font-black uppercase tracking-widest text-[#d4af37]">Flash Deal of the Day</span>
          <span className="text-[11px] text-white/70 font-semibold hidden md:inline">— Limited stocks, offers refresh at midnight</span>
        </div>
        
        <div className="flex items-center gap-1.5 font-mono text-sm font-black">
          <span className="text-xs uppercase tracking-wider text-white/60 font-sans mr-1 font-semibold">Ends in:</span>
          <div className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 min-w-[32px]">{formatNum(timeLeft.hours)}</div>
          <span>:</span>
          <div className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 min-w-[32px]">{formatNum(timeLeft.minutes)}</div>
          <span>:</span>
          <div className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 min-w-[32px]">{formatNum(timeLeft.seconds)}</div>
        </div>
      </div>
    </motion.div>
  );
};

// ---------- PRODUCT CARD ----------
const ProductCard = ({ product, index, navSection }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, wishlist, toggleWishlist } = useCart();

  const variants = typeof product.variants === 'string' 
    ? JSON.parse(product.variants) 
    : (product.variants || []);
  const hasVariants = Array.isArray(variants) && variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? variants[0] : null);

  const currentPrice = selectedVariant 
    ? (selectedVariant.offerPrice && selectedVariant.offerPrice !== '' ? Number(selectedVariant.offerPrice) : Number(selectedVariant.price))
    : (product.discountPrice || product.price);

  const originalPrice = selectedVariant 
    ? (selectedVariant.offerPrice && selectedVariant.offerPrice !== '' ? Number(selectedVariant.price) : null)
    : (product.discountPrice ? product.price : null);

  const discountPct = selectedVariant
    ? (selectedVariant.offerPrice && selectedVariant.offerPrice !== '' 
        ? Math.round(((Number(selectedVariant.price) - Number(selectedVariant.offerPrice)) / Number(selectedVariant.price)) * 100) 
        : null)
    : (product.discountPrice && product.price
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : null);

  const isInWishlist = wishlist && wishlist.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1, selectedVariant);
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.01, transition: { duration: 0.25, ease: 'easeOut' } }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      {/* Wishlist */}
      <motion.button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow transition-all duration-200"
      >
        <Heart
          size={15}
          className={isInWishlist ? 'fill-[#662654] text-[#662654]' : 'text-gray-400'}
          strokeWidth={2}
        />
      </motion.button>

      {/* Discount badge */}
      {discountPct && (
        <div className={`absolute top-3 left-3 z-20 ${navSection === 'deal-of-the-day' ? 'bg-gradient-to-r from-[#662654] to-[#d4af37] text-white shadow-lg' : 'bg-green-500 text-white'} text-[10px] font-black px-2.5 py-1 rounded-full shadow flex items-center gap-1`}>
          {navSection === 'deal-of-the-day' && <span className="animate-pulse">⚡</span>}
          {discountPct}% OFF
        </div>
      )}

      {/* Image — single static image, no swap on hover */}
      <Link to={`/product/${product.id}`} state={{ product }} className="block relative aspect-square overflow-hidden bg-[#f8f4ef]">
        {product.image ? (
          <>
            {/* Branded placeholder behind — visible only when image fails to load */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#f5efe8] to-[#ede0d4] gap-2">
              <img src="/paidhulogo.png" alt="Paidhu" className="w-14 h-14 object-contain opacity-30" />
              <span className="text-[10px] text-[#662654]/40 font-medium tracking-wide uppercase">Paidhu</span>
            </div>

            {/* Product image — hides on error, gentle scale on hover */}
            <img
              src={product.image.startsWith('http') ? product.image : `${API_BASE}${product.image}`}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              onError={e => { e.currentTarget.style.display = 'none'; }}
              loading={index < 4 ? "eager" : "lazy"}
              fetchPriority={index < 4 ? "high" : "low"}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f5efe8] to-[#ede0d4] gap-2">
            <img src="/paidhulogo.png" alt="Paidhu" className="w-14 h-14 object-contain opacity-30" />
            <span className="text-[10px] text-[#662654]/40 font-medium tracking-wide uppercase">Paidhu</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`} state={{ product }} className="block group/link mb-2 flex-1">
          <p className="text-[11px] text-[#662654] font-semibold uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="text-[13.5px] font-semibold text-gray-900 line-clamp-2 leading-snug group-hover/link:text-[#662654] transition-colors">{product.name}</h3>
        </Link>

        {product.shortDescription && (
          <p className="text-[11.5px] text-gray-400 line-clamp-1 mb-3">{product.shortDescription}</p>
        )}

        {/* Variants are now selected on the Product Detail Page */}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[16px] font-bold text-gray-900">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          {originalPrice && (
            <span className="text-[12px] text-gray-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {navSection === 'deal-of-the-day' && (
          <div className="mb-3.5">
            <div className="flex justify-between items-center text-[10px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-wider">
              <span>⚡ Deal claimed</span>
              <span className="text-[#662654] font-black">{((product.id * 17) % 35 + 55)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((product.id * 17) % 35 + 55)}%` }}
                transition={{ duration: 1.2, delay: 0.1 * index }}
                className="h-full bg-gradient-to-r from-[#662654] to-[#d4af37]"
              />
            </div>
          </div>
        )}

        {/* Add to Cart / Choose Options */}
        {hasVariants ? (
          <Link
            to={`/product/${product.id}`}
            state={{ product }}
            className="w-full bg-gradient-to-r from-[#662654] to-[#7f2d68] hover:from-[#7a2e64] hover:to-[#913b7e] text-white rounded-full py-2.5 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider shadow-[0_4px_12px_rgba(102,38,84,0.15)] hover:shadow-[0_6px_20px_rgba(102,38,84,0.3)] transition-all duration-300 group/btn cursor-pointer"
          >
            <span>Choose Options</span>
            <ChevronRight size={14} strokeWidth={2.5} className="transform group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <motion.button 
            onClick={handleAddToCart}
            disabled={isAdding}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#662654] to-[#7f2d68] hover:from-[#7a2e64] hover:to-[#913b7e] disabled:from-emerald-600 disabled:to-teal-500 text-white rounded-full py-2.5 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider shadow-[0_4px_12px_rgba(102,38,84,0.15)] hover:shadow-[0_6px_20px_rgba(102,38,84,0.3)] transition-all duration-300 group/btn cursor-pointer"
          >
            {isAdding ? (
              <>
                <Check size={14} strokeWidth={3} className="text-white animate-bounce" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart size={13} strokeWidth={2.5} className="transform group-hover/btn:scale-110 transition-transform" />
                <span>Add to Cart</span>
              </>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};


// ---------- SKELETON CARD ----------
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-100" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-100 rounded w-1/3" />
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
      <div className="h-10 bg-gray-100 rounded-full mt-4" />
    </div>
  </div>
);

// ---------- MAIN SHOP PAGE ----------
const ShopPage = () => {
  const { navSection = 'shop-all' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read category from URL (e.g. /shop/shop-by-category?category=Saffron)
  const activeCategory = searchParams.get('category') || '';

  // Build page meta — if a specific category is active, show its name
  const baseMeta = NAV_META[navSection] || NAV_META['shop-all'];

  const getInitialFallbackProducts = () => {
    let list = allFallbackProducts;
    if (activeCategory) {
      list = list.filter(p => p.category?.name === activeCategory || p.category === activeCategory);
    }
    if (navSection === 'deal-of-the-day') {
      list = list.filter(p => p.tags && p.tags.toLowerCase().includes("deal"));
    }
    const initialSearch = searchParams.get('q') || '';
    if (initialSearch) {
      list = list.filter(p => p.name.toLowerCase().includes(initialSearch.toLowerCase()));
    }
    return list.slice(0, 24);
  };

  const initialList = getInitialFallbackProducts();

  const [products, setProducts]     = useState(initialList);
  const [loading, setLoading]       = useState(initialList.length === 0);
  const [total, setTotal]           = useState(initialList.length);
  const [pages, setPages]           = useState(1);

  // Page synchronization with URL
  const urlPage = parseInt(searchParams.get('page')) || 1;
  const [page, setPage]             = useState(urlPage);
  useEffect(() => {
    setPage(urlPage);
  }, [urlPage]);

  const handlePageChange = (p) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', String(p));
      return newParams;
    });
    setPage(p);
  };

  const [search, setSearch]         = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sort, setSort]             = useState('newest');
  const [minPrice, setMinPrice]     = useState('');
  const [maxPrice, setMaxPrice]     = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [categories, setCategories] = useState([]);

  // Dynamic meta: show specific category name when one is selected
  const meta = activeCategory
    ? { ...baseMeta, label: activeCategory, desc: `Showing all products in ${activeCategory}` }
    : baseMeta;

  const LIMIT = 24;

  // Adjust page synchronously during render when dependencies change (prevents cascading duplicate fetches)
  const [prevNavSection, setPrevNavSection] = useState(navSection);
  if (navSection !== prevNavSection) {
    setPrevNavSection(navSection);
    setPage(1);
  }

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setPage(1);
  }

  const [prevSort, setPrevSort] = useState(sort);
  if (sort !== prevSort) {
    setPrevSort(sort);
    setPage(1);
  }

  const [prevCategory, setPrevCategory] = useState(activeCategory);
  if (activeCategory !== prevCategory) {
    setPrevCategory(activeCategory);
    setPage(1);
  }

  const [prevMinPrice, setPrevMinPrice] = useState(appliedMinPrice);
  if (appliedMinPrice !== prevMinPrice) {
    setPrevMinPrice(appliedMinPrice);
    setPage(1);
  }

  const [prevMaxPrice, setPrevMaxPrice] = useState(appliedMaxPrice);
  if (appliedMaxPrice !== prevMaxPrice) {
    setPrevMaxPrice(appliedMaxPrice);
    setPage(1);
  }

  // Sync search input state when URL changes (e.g. from navbar search)
  const urlSearch = searchParams.get('q') || '';
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 420);
    return () => clearTimeout(t);
  }, [search]);

  // Push debounced search query to URL params
  useEffect(() => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (debouncedSearch) {
        newParams.set('q', debouncedSearch);
      } else {
        newParams.delete('q');
      }
      return newParams;
    }, { replace: true });
  }, [debouncedSearch, setSearchParams]);

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE}/api/products?limit=200`)
      .then(r => r.json())
      .then(data => {
        const cats = [...new Set((data.products || []).map(p => p.category).filter(Boolean))];
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  // Fetch products with caching and fallback hydration
  useEffect(() => {
    let active = true;
    const cacheKey = `${navSection}-${page}-${sort}-${debouncedSearch}-${appliedMinPrice}-${appliedMaxPrice}-${activeCategory}`;
    
    // Instantly resolve cached result if available
    if (shopCache[cacheKey]) {
      setProducts(shopCache[cacheKey].products);
      setTotal(shopCache[cacheKey].total);
      setPages(shopCache[cacheKey].pages);
      setLoading(false);
    } else {
      // If no cache but we have matching fallback products, keep showing them and loading = false to prevent showing skeletons
      const matchingFallbacks = getInitialFallbackProducts();
      if (matchingFallbacks.length > 0) {
        setProducts(matchingFallbacks);
        setTotal(matchingFallbacks.length);
        setLoading(false);
      } else {
        setLoading(true);
      }
    }

    const loadProducts = async () => {
      try {
        const params = new URLSearchParams({
          navSection,
          page,
          limit: LIMIT,
          sort,
        });
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (appliedMinPrice) params.set('minPrice', appliedMinPrice);
        if (appliedMaxPrice) params.set('maxPrice', appliedMaxPrice);
        if (activeCategory) params.set('category', activeCategory);

        const res = await fetch(`${API_BASE}/api/products?${params}`);
        const data = await res.json();
        if (active) {
          const fetchedList = data.products || [];
          setProducts(fetchedList);
          setTotal(data.total || 0);
          setPages(data.pages || 1);
          
          shopCache[cacheKey] = {
            products: fetchedList,
            total: data.total || 0,
            pages: data.pages || 1
          };
        }
      } catch (e) {
        console.error('Fetch error:', e);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [navSection, page, sort, debouncedSearch, appliedMinPrice, appliedMaxPrice, activeCategory]);

  const applyPriceFilter = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setShowFilters(false);
  };

  const handleCategoryChange = (cat) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (cat) {
        newParams.set('category', cat);
      } else {
        newParams.delete('category');
      }
      newParams.set('page', '1');
      return newParams;
    });
    setPage(1);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('category');
      newParams.delete('q');
      newParams.set('page', '1');
      return newParams;
    });
    setSearch('');
    setSort('newest');
    setPage(1);
  };

  const sortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || 'Sort';

  if (navSection === 'bulk-orders') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="min-h-screen bg-[#faf9f7]"
      >
        <BulkOrdersSection />
      </motion.div>
    );
  }

  if (navSection === 'about-us') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="min-h-screen bg-[#faf9f7]"
      >
        <AboutUsSection />
      </motion.div>
    );
  }

  if (navSection === 'our-own-community') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="min-h-screen bg-[#faf9f7]"
      >
        <OurCommunitySection />
      </motion.div>
    );
  }

  if (navSection === 'blogs') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="min-h-screen bg-[#faf9f7]"
      >
        <BlogsSection />
      </motion.div>
    );
  }

  if (navSection === 'starting-floral-food-habitat') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="min-h-screen bg-[#faf9f7]"
      >
        <FloralHabitatSection />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="min-h-screen bg-[#faf9f7]"
    >
      {/* Ticking countdown for deals page */}
      {navSection === 'deal-of-the-day' && <DealCountdown />}

      {/* ══════════════════════════════════════════════════
          SHOP PAGE BANNER — same images as home page
          ══════════════════════════════════════════════════ */}
      <PageBanner pageSlug={navSection} />


      {/* ══════════════════════════════════════════════════
          STICKY TOOLBAR — filters, sort, category pills
          ══════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          {/* Result count */}
          <p className="text-[13px] text-gray-500 whitespace-nowrap">
            {loading ? 'Loading…' : `${total.toLocaleString()} product${total !== 1 ? 's' : ''}`}
          </p>

          <div className="flex items-center gap-2.5 ml-auto w-full max-w-md justify-end font-sans">
            {/* Minimal search bar inside toolbar */}
            <div className="relative w-full max-w-[180px] sm:max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-full pl-8 pr-8 py-1.5 text-[12px] focus:outline-none focus:border-[#662654] focus:bg-white transition-all font-semibold"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter button */}
            <button
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[13px] font-semibold text-gray-700 transition-all"
            >
              <SlidersHorizontal size={14} /> Filters
              {(appliedMinPrice || appliedMaxPrice) && <span className="w-1.5 h-1.5 rounded-full bg-[#662654] ml-0.5" />}
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(s => !s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[13px] font-semibold text-gray-700 transition-all"
              >
                <ArrowUpDown size={13} /> {sortLabel} <ChevronDown size={12} />
              </button>
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50"
                  >
                    {SORT_OPTIONS.map(o => (
                      <button
                        key={o.value}
                        onClick={() => { setSort(o.value); setShowSortMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${sort === o.value ? 'text-[#662654] font-bold bg-[#662654]/5' : 'text-gray-700 hover:bg-gray-50'}`}
                      >{o.label}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Filter drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-100 bg-white"
            >
              <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Min Price (₹)</label>
                  <input
                    type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0"
                    className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#662654]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Max Price (₹)</label>
                  <input
                    type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="10000"
                    className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#662654]"
                  />
                </div>
                <button
                  onClick={applyPriceFilter}
                  className="px-5 py-2 bg-[#662654] text-white rounded-lg text-[13px] font-bold hover:bg-[#7a2e64] transition-colors"
                >Apply</button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-[13px] font-semibold hover:bg-gray-200 transition-colors"
                >Clear All</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Category Quick Filter Strip ── */}
      {['shop-all', 'shop-by-category', 'deal-of-the-day'].includes(navSection) && categories.length > 0 && (
        <div className="w-full bg-[#faf9f7] border-b border-gray-100 py-3">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center gap-2.5 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => handleCategoryChange('')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-extrabold tracking-wide transition-all shadow-sm flex items-center gap-2 ${!activeCategory ? 'bg-[#662654] text-white shadow-[0_4px_14px_rgba(102,38,84,0.35)] scale-105' : 'bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
              <img 
                src="/mascot.png" 
                alt="All Categories" 
                className="w-6 h-6 rounded-full object-cover shadow-sm bg-white p-0.5"
              />
              <span>All Categories</span>
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-extrabold tracking-wide transition-all shadow-sm flex items-center gap-2 ${activeCategory === cat ? 'bg-[#662654] text-white shadow-[0_4px_14px_rgba(102,38,84,0.35)] scale-105' : 'bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
              >
                <img 
                  src={getCategoryIcon(cat)} 
                  alt={cat} 
                  className="w-6 h-6 rounded-full object-cover shadow-sm bg-white"
                  onError={e => { e.target.src = '/mascot.png'; }}
                />
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          PRODUCT GRID
          ══════════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="text-7xl mb-6">🌸</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No products found</h2>
            <p className="text-gray-400 text-[14px] mb-6">
              {search ? `No results for "${search}"` : "We couldn't find any products for this section yet."}
            </p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-[#662654] text-white rounded-full font-semibold text-[14px] hover:bg-[#7a2e64] transition-colors">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
          >
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} navSection={navSection} />
            ))}
          </motion.div>
        )}

        {/* ---- PAGINATION ---- */}
        {!loading && pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: pages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === pages || Math.abs(n - page) <= 1)
              .reduce((acc, n, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== n - 1) acc.push('...');
                acc.push(n);
                return acc;
              }, [])
              .map((item, idx) => item === '...' ? (
                <span key={`dots-${idx}`} className="text-gray-400 text-[13px] px-1">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageChange(item)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all ${page === item ? 'bg-[#662654] text-white shadow-md' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                >{item}</button>
              ))}

            <button
              onClick={() => handlePageChange(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ShopPage;
