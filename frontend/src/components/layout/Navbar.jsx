import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Grid3X3, Trash2, Minus, Plus, ArrowRight, Lock, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import paidhuLogo from '../../assets/paidhulogo.png';
import { useCart } from '../../context/CartContext';
import AuthModal from './AuthModal';

// Helper to match categories to relevant icons based on the product category type
const getCategoryIcon = (categoryName) => {
  const name = categoryName ? categoryName.toLowerCase() : '';
  if (name.includes('saffron')) return '🌸';
  if (name.includes('tea')) return '🍵';
  if (name.includes('brew') || name.includes('drink') || name.includes('infusion')) return '🍹';
  if (name.includes('cookie') || name.includes('bake') || name.includes('biscuit') || name.includes('snack')) return '🍪';
  if (name.includes('jam') || name.includes('preserve') || name.includes('gulkhand')) return '🍓';
  if (name.includes('powder') || name.includes('dust')) return '✨';
  if (name.includes('honey')) return '🍯';
  if (name.includes('gift') || name.includes('box')) return '🎁';
  if (name.includes('flower') || name.includes('petal')) return '🌺';
  return '🌼'; // Default brand flower fallback
};

const API_BASE = 'https://paidhu-final-anm2.vercel.app';

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

const CATEGORY_FALLBACK_IMAGES = {
  'saffron': 'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780939517153-saffronneign600x600jpg.jpg',
  'medley teas': 'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780938733725-WhatsAppImage20251113at23302330981866600x800jpg.jpg',
  'brew flora': 'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937914670-WhatsAppImage20251113at2330215f60b43f600x800jpg.jpg',
  'bloom cookies': '/bloom_cookies_banner.png',
  'petal jam': 'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780896914793-ChatGPTImageApr272026024630PM300x300png.png'
};

const searchPhrases = [
  "Search for flowers, saffron...",
  "Search for edible flowers...",
  "Search for pure saffron...",
  "Search for premium gift boxes..."
];

// Category emoji map — add more as needed
const CATEGORY_EMOJI = {
  'Saffron':        '🌸',
  'Honey':          '🍯',
  'Medley Teas':    '🍵',
  'Floral Jams':    '🍓',
  'Edible Flowers': '🌺',
  'Gift Boxes':     '🎁',
  'Herbal':         '🌿',
  'Spices':         '🌶️',
  'Teas':           '🍵',
  'Dry Fruits':     '🥜',
  'Superfoods':     '💚',
  'Snacks':         '🍪',
};
const defaultEmoji = '🌼';

// Maps navbar display name → route slug
const navSlugMap = {
  'Home':                        '/',
  'Shop All':                    'shop-all',
  'Deal of the Day':             'deal-of-the-day',
  'Shop by Category':            'shop-by-category',
  'For Your Family':             'for-your-family',
  'Starting Floral food habitat':'starting-floral-food-habitat',
  'BYOC':                        'byoc',
  'Our Own Community':           'our-own-community',
  'Bulk Orders':                 'bulk-orders',
  'Blogs':                       'blogs',
  'About Us':                    'about-us',
  'Careers':                     '__direct__/careers',
  'Saffron Guidance':            '__direct__/saffron-guidance',
};


const Navbar = () => {
  const [isScrolled, setIsScrolled]           = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentText, setCurrentText]         = useState('');
  const [isDeleting, setIsDeleting]           = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const defaultCategoriesList = [
    { name: 'Bloom Cookies', image: '/bloom_cookies_banner.png' },
    { name: 'Saffron', image: '/saffron_threads-B9qmeB7u.png' },
    { name: 'Petal Jam', image: '/banner_jam.jpeg' },
    { name: 'Medley Teas', image: '/banner_tea.jpeg' },
    { name: 'Brew Flora', image: '/hibiscus_tea-t1d8KRFf.png' }
  ];
  const [categories, setCategories]           = useState(defaultCategoriesList);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [mobileCatOpen, setMobileCatOpen]     = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser]                       = useState(null);
  const catRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const navigate = useNavigate();

  const filteredProducts = searchQuery.trim()
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Fetch user profile on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('paidhu_token');
    if (token) {
      fetch(`${API_BASE}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.id) setUser(data);
      })
      .catch(err => console.error('Failed to fetch user', err));
    }
  }, []);

  const { 
    cart, 
    cartCount, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartBadgeAnimate, 
    setCartBadgeAnimate,
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    removeFromWishlist,
    wishlistCount,
    addToCart
  } = useCart();

  // Trigger badge wiggle animation when cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartBadgeAnimate(true);
      const timer = setTimeout(() => setCartBadgeAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount, setCartBadgeAnimate]);

  // Typewriter effect
  useEffect(() => {
    const typeSpeed = isDeleting ? 40 : 80;
    const currentPhrase = searchPhrases[currentPhraseIndex];
    const timer = setTimeout(() => {
      if (!isDeleting && currentText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentPhraseIndex(prev => (prev + 1) % searchPhrases.length);
      } else {
        setCurrentText(
          currentPhrase.substring(0, currentText.length + (isDeleting ? -1 : 1))
        );
      }
    }, typeSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch products and map categories from backend with 4h caching
  useEffect(() => {
    let cachedCats = null;
    let cachedProducts = null;
    let cachedTime = null;
    try {
      cachedCats = localStorage.getItem('paidhu_categories');
      cachedProducts = localStorage.getItem('paidhu_products');
      cachedTime = localStorage.getItem('paidhu_products_time');
    } catch (e) {
      console.error("Failed to read cache from localStorage", e);
    }
    const cachingDuration = 4 * 60 * 60 * 1000; // Cache for 4 hours

    if (cachedCats && cachedProducts && cachedTime && (Date.now() - Number(cachedTime) < cachingDuration)) {
      try {
        setCategories(JSON.parse(cachedCats));
        setAllProducts(JSON.parse(cachedProducts));
        return;
      } catch (e) {}
    }

    fetch(`${API_BASE}/api/products?limit=200`)
      .then(r => r.json())
      .then(data => {
        const productsList = data.products || [];
        setAllProducts(productsList);
        const categoryMap = {};
        
        productsList.forEach(p => {
          if (p.category && !categoryMap[p.category]) {
            const img = p.image || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imageUrl : null);
            categoryMap[p.category] = img;
          }
        });
        
        const cats = Object.keys(categoryMap).map(name => ({
          name,
          image: categoryMap[name]
        }));
        
        setCategories(cats);
        try {
          localStorage.setItem('paidhu_categories', JSON.stringify(cats));
          localStorage.setItem('paidhu_products', JSON.stringify(productsList));
          localStorage.setItem('paidhu_products_time', String(Date.now()));
        } catch (e) {
          console.error("Failed to write to localStorage", e);
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setShowCatDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchSuggestions(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNavClick = (name) => {
    const slug = navSlugMap[name];
    if (slug) {
      if (slug === '/') {
        navigate('/');
      } else if (slug.startsWith('__direct__')) {
        navigate(slug.replace('__direct__', ''));
      } else {
        navigate(`/shop/${slug}`);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (cat) => {
    setShowCatDropdown(false);
    setMobileCatOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/shop/shop-by-category?category=${encodeURIComponent(cat)}`);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/shop/shop-all?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navColumns = [
    { top: { name: 'Home' } },
    { top: { name: 'Shop All' } },
    { top: { name: 'Deal of the Day' } },
    { top: { name: 'Shop by Category' } },
    { top: { name: 'For Your Family' }, bottom: { name: 'Bulk Orders' } },
    { top: { name: 'Starting Floral food habitat' }, bottom: { name: 'Blogs' } },
    { top: { name: 'BYOC' }, bottom: { name: 'Saffron Guidance' } },
    { top: { name: 'Our Own Community' } },
    { top: { name: 'About Us' }, bottom: { name: 'Careers' } },
  ];


  return (
    <motion.header
      className={`w-full z-50 bg-[#662654] transition-all duration-300 font-sans ${isScrolled ? 'shadow-md' : ''}`}
    >


      {/* Top Row */}
      <div className="w-full bg-[#662654] py-1 md:py-1.5 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center relative">

          {/* Left: Mobile Menu & Search */}
          <div className="flex w-1/4 lg:w-1/3 items-center">
            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#ede7d7]"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:flex w-full">
              <div className="relative w-full max-w-[320px] group" ref={searchRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onKeyDown={handleSearch}
                  placeholder={currentText + '|'}
                  className="w-full pl-5 pr-12 py-2 rounded-[8px] border-[1.5px] border-[#ede7d7]/20 bg-white/10 focus:outline-none focus:border-[#ede7d7] focus:ring-0 text-[14px] text-[#ede7d7] placeholder-[#ede7d7]/60 transition-all"
                />
                <Search
                  size={22}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#ede7d7] group-focus-within:text-white transition-colors cursor-pointer"
                  strokeWidth={1.5}
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/shop/shop-all?q=${encodeURIComponent(searchQuery.trim())}`);
                      setShowSearchSuggestions(false);
                    }
                  }}
                />
                {/* Search suggestions dropdown */}
                {showSearchSuggestions && filteredProducts.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-[#662654] border border-[#ede7d7]/20 rounded-lg shadow-xl overflow-hidden z-[9999] max-h-80 overflow-y-auto">
                    <div className="py-2">
                      {filteredProducts.map((p) => {
                        const pImage = resolveSingleImage(
                          p.image || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imageUrl : null)
                        );
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              navigate(`/product/${p.slug || p.id}`, { state: { product: p } });
                              setSearchQuery('');
                              setShowSearchSuggestions(false);
                            }}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-white/10 cursor-pointer transition-colors"
                          >
                            {pImage ? (
                              <img
                                src={pImage}
                                alt={p.name}
                                className="w-10 h-10 object-cover rounded-md border border-[#ede7d7]/10 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center text-[#ede7d7] flex-shrink-0">
                                🌸
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#ede7d7] truncate">{p.name}</p>
                              <p className="text-xs text-[#ede7d7]/60">₹{p.price}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex w-1/2 lg:w-1/3 justify-center z-10">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-center">
              <Link to="/" className="flex items-center justify-center">
                <img
                  src={paidhuLogo}
                  alt="Paidhu The Edible Flower Co."
                  width={142}
                  height={64}
                  className="h-10 md:h-12 lg:h-14 w-auto object-contain"
                  style={{ filter: 'brightness(0) saturate(100%) invert(92%) sepia(12%) saturate(308%) hue-rotate(34deg) brightness(96%) contrast(93%)' }}
                />
              </Link>
            </motion.div>
          </div>

          {/* Right: Icons */}
          <div className="flex w-1/4 lg:w-1/3 justify-end items-center space-x-5 text-[#ede7d7]">
            <motion.button
              onClick={() => setIsAuthModalOpen(true)}
              whileHover={{ scale: 1.1 }}
              className="hover:text-white transition-colors hidden lg:flex items-center cursor-pointer"
            >
              <User size={24} strokeWidth={1.5} />
            </motion.button>
            
            {/* Wishlist Icon */}
            <motion.button
              onClick={() => setIsWishlistOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hover:text-white transition-colors relative"
            >
              <Heart size={24} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-2 bg-[var(--color-brand-gold)] text-white text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold shadow-sm"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              onClick={() => setIsCartOpen(true)}
              animate={cartBadgeAnimate ? { scale: [1, 1.25, 0.95, 1.1, 1], rotate: [0, -10, 10, -5, 5, 0] } : {}}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hover:text-white transition-colors relative"
            >
              <ShoppingCart size={24} strokeWidth={1.5} />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-2 bg-[var(--color-brand-gold)] text-white text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Second Row — Desktop Navigation */}
      <div className="hidden lg:block w-full bg-[#ede7d7] border-b border-[#662654]/10 py-2">
        <nav className="max-w-[1400px] mx-auto px-4 xl:px-8">
          <div className="flex justify-center gap-x-6 xl:gap-x-8 w-full mt-0">
            {navColumns.map((col, i) => (
              <div key={i} className={`flex flex-col items-center ${col.bottom ? 'justify-start gap-y-0.5' : 'justify-center min-h-[44px]'}`}>



                {/* "Shop by Category" gets the dropdown */}
                {col.top.name === 'Shop by Category' ? (
                  <div className="relative" ref={catRef}>
                    <button
                      onMouseEnter={() => setShowCatDropdown(true)}
                      onClick={() => setShowCatDropdown(v => !v)}
                      className="relative flex items-center gap-1 text-[#662654] font-bold text-[13px] xl:text-[14px] hover:text-[#4a1c3d] transition-colors cursor-pointer whitespace-nowrap group"
                    >
                      {col.top.name}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${showCatDropdown ? 'rotate-180' : ''}`}
                      />
                      <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[#662654] group-hover:w-full transition-all duration-300 rounded-full" />
                    </button>

                    {/* ── Category Dropdown ── */}
                    <AnimatePresence>
                      {showCatDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.97 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          onMouseLeave={() => setShowCatDropdown(false)}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden"
                        >
                          {/* Dropdown Header */}
                          <div className="px-6 pt-5 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                              <Grid3X3 size={15} className="text-[#662654]" />
                              <p className="text-[12px] font-bold uppercase tracking-widest text-[#662654]">
                                Discover Our Range of Floral Foods
                              </p>
                            </div>
                          </div>

                          {/* Category Grid */}
                          <div className="p-4">
                            {categories.length === 0 ? (
                              <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
                                Loading categories…
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-1">
                                {categories.map(cat => {
                                  const catName = typeof cat === 'string' ? cat : (cat.name || '');
                                  const catImage = (cat && typeof cat === 'object' && cat.image)
                                    ? cat.image
                                    : (CATEGORY_FALLBACK_IMAGES[catName.toLowerCase()] || null);
                                  const iconFallback = getCategoryIcon(catName);
                                  
                                  return (
                                    <button
                                      key={catName}
                                      onClick={() => handleCategoryClick(catName)}
                                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#662654]/5 hover:text-[#662654] text-gray-700 transition-all duration-150 group/cat text-left w-full cursor-pointer"
                                    >
                                      <div className="w-6.5 h-6.5 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center">
                                        {catImage ? (
                                          <img 
                                            src={catImage.startsWith('http') ? catImage : `${API_BASE}${catImage.startsWith('/') ? '' : '/'}${catImage}`} 
                                            alt={catName} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover/cat:scale-110"
                                            onError={(e) => {
                                              e.target.style.display = 'none';
                                              e.target.nextSibling.style.display = 'block';
                                            }}
                                          />
                                        ) : null}
                                        <span 
                                          className="text-xs font-bold text-[#662654]" 
                                          style={{ display: catImage ? 'none' : 'block' }}
                                        >
                                          {iconFallback}
                                        </span>
                                      </div>
                                      <span className="text-[13.5px] font-semibold group-hover/cat:translate-x-0.5 transition-transform duration-150">
                                        {catName}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* View All Footer */}
                          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-[12px] text-gray-400">
                              {categories.length} categories available
                            </span>
                            <button
                              onClick={() => {
                                setShowCatDropdown(false);
                                navigate('/shop/shop-by-category');
                              }}
                              className="text-[13px] font-bold text-[#662654] hover:underline flex items-center gap-1"
                            >
                              View All →
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavItem name={col.top.name} onClick={() => handleNavClick(col.top.name)} />
                )}

                {col.bottom && (
                  <NavItem name={col.bottom.name} onClick={() => handleNavClick(col.bottom.name)} />
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#662654] border-b border-[#ede7d7]/10 overflow-hidden"
          >
            <div className="px-4 py-4">
              {/* Mobile search */}
              <div className="relative w-full mb-4 group" ref={mobileSearchRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onKeyDown={handleSearch}
                  placeholder="Search for flowers, saffron..."
                  className="w-full pl-5 pr-10 py-2.5 rounded-full border border-[#ede7d7]/20 bg-white/10 text-[#ede7d7] placeholder-[#ede7d7]/60 shadow-sm focus:outline-none focus:border-[#ede7d7] focus:ring-0 text-sm transition-all"
                />
                <Search
                  size={18}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#ede7d7] group-focus-within:text-white cursor-pointer"
                  strokeWidth={1.5}
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/shop/shop-all?q=${encodeURIComponent(searchQuery.trim())}`);
                      setShowSearchSuggestions(false);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                />
                {/* Mobile search suggestions */}
                {showSearchSuggestions && filteredProducts.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-[#662654] border border-[#ede7d7]/20 rounded-lg shadow-xl overflow-hidden z-[9999] max-h-60 overflow-y-auto">
                    <div className="py-2">
                      {filteredProducts.map((p) => {
                        const pImage = resolveSingleImage(
                          p.image || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imageUrl : null)
                        );
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              navigate(`/product/${p.slug || p.id}`, { state: { product: p } });
                              setSearchQuery('');
                              setShowSearchSuggestions(false);
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-white/10 cursor-pointer transition-colors"
                          >
                            {pImage ? (
                              <img
                                src={pImage}
                                alt={p.name}
                                className="w-10 h-10 object-cover rounded-md border border-[#ede7d7]/10 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center text-[#ede7d7] flex-shrink-0">
                                🌸
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#ede7d7] truncate">{p.name}</p>
                              <p className="text-xs text-[#ede7d7]/60">₹{p.price}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                {navColumns.reduce((acc, col) => {
                  acc.push(col.top);
                  if (col.bottom) acc.push(col.bottom);
                  return acc;
                }, []).map(link => (
                  link.name === 'Shop by Category' ? (
                    <div key={link.name}>
                      {/* Mobile: collapsible category section */}
                      <button
                        onClick={() => setMobileCatOpen(v => !v)}
                        className="w-full text-left text-[#ede7d7] font-medium text-sm border-b border-[#ede7d7]/10 py-3 hover:text-white transition-colors flex items-center justify-between"
                      >
                        {link.name}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${mobileCatOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileCatOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-2 pt-1 grid grid-cols-2 gap-1">
                              {categories.map(cat => {
                                const catName = typeof cat === 'string' ? cat : (cat.name || '');
                                const catImage = (cat && typeof cat === 'object' && cat.image)
                                  ? cat.image
                                  : (CATEGORY_FALLBACK_IMAGES[catName.toLowerCase()] || null);
                                const iconFallback = getCategoryIcon(catName);
                                
                                return (
                                  <button
                                    key={catName}
                                    onClick={() => handleCategoryClick(catName)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#662654]/10 hover:text-white text-[#ede7d7]/90 text-[13px] font-medium transition-all text-left cursor-pointer"
                                  >
                                    <div className="w-5.5 h-5.5 rounded-full overflow-hidden flex-shrink-0 border border-[#ede7d7]/10 bg-white/5 flex items-center justify-center">
                                      {catImage ? (
                                        <img 
                                          src={catImage.startsWith('http') ? catImage : `${API_BASE}${catImage.startsWith('/') ? '' : '/'}${catImage}`} 
                                          alt={catName} 
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                          }}
                                        />
                                      ) : null}
                                      <span 
                                        className="text-[10px] text-[#ede7d7]" 
                                        style={{ display: catImage ? 'none' : 'block' }}
                                      >
                                        {iconFallback}
                                      </span>
                                    </div>
                                    <span>{catName}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.name)}
                      className="text-left text-[#ede7d7] font-medium text-sm border-b border-[#ede7d7]/10 py-3 hover:text-white transition-colors"
                    >
                      {link.name}
                    </button>
                  )
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Shopping Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/55 backdrop-blur-[2px] z-[9998]"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col h-full"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="text-[#662654]" size={20} />
                  <h2 className="text-lg font-black text-gray-900">Your Cart</h2>
                  {cartCount > 0 && (
                    <span className="bg-[#662654]/10 text-[#662654] text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <span className="text-5xl mb-4">🛒</span>
                    <h3 className="text-base font-black text-gray-800 mb-1">Your cart is empty</h3>
                    <p className="text-xs text-gray-400 max-w-[240px] mb-6">
                      Add some of our delicious floral food products to get started!
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/shop');
                      }}
                      className="bg-[#662654] hover:bg-[#7a2e64] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">


                    {/* Cart Items */}
                    <div className="space-y-3">
                      <AnimatePresence initial={false}>
                        {cart.map((item) => {
                          const resolvedImg = resolveSingleImage(item.image) || 'https://images.unsplash.com/photo-1599598425947-330026217432?q=80&w=100&auto=format&fit=crop';
                            
                          const itemPrice = item.offerPrice || item.price;
                          
                          return (
                            <motion.div
                              key={`${item.id}-${item.selectedVariant?.size || 'default'}`}
                              layout
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow group/item"
                            >
                              {/* Product Thumbnail */}
                              <Link 
                                to={`/product/${item.slug || item.id}`}
                                onClick={() => setIsCartOpen(false)}
                                className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 block cursor-pointer"
                              >
                                <img src={resolvedImg} alt={item.name} className="w-full h-full object-cover" />
                              </Link>

                              {/* Item Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className="hidden sm:block text-[13px] font-bold text-gray-900 truncate group-hover/item:text-[#662654] transition-colors">
                                  {item.name}
                                </h4>
                                {item.selectedVariant && (
                                  <span className="hidden sm:inline-block text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md mt-0.5">
                                    Size: {item.selectedVariant.size}
                                  </span>
                                )}
                                <p className="text-[12px] font-black text-[#662654] mt-1">
                                  ₹{itemPrice.toLocaleString()}
                                </p>
                              </div>

                              {/* Qty Selector & Delete */}
                              <div className="flex flex-col items-end gap-2">
                                <button
                                  onClick={() => removeFromCart(item.id, item.selectedVariant?.size)}
                                  className="text-gray-300 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <div className="flex items-center gap-1.5 border border-gray-200 rounded-full p-0.5 bg-gray-50">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariant?.size)}
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-gray-500 hover:bg-white active:scale-90 transition-all cursor-pointer"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="text-[11px] font-black text-gray-800 w-4 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariant?.size)}
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-gray-500 hover:bg-white active:scale-90 transition-all cursor-pointer"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.02)]">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-800">Total</span>
                      <span className="text-lg font-black text-gray-900">
                        ₹{cartTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full bg-[#662654] hover:bg-[#7a2e64] text-white py-4 rounded-full flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-[#662654]/15 hover:shadow-[#662654]/30 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 group/btn cursor-pointer"
                  >
                    <Lock size={14} />
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span className="text-emerald-500">🔒</span> Secured SSL checkout
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="fixed inset-0 bg-black/55 backdrop-blur-[2px] z-[9998]"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col h-full"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <Heart className="text-[#662654] fill-[#662654]" size={20} />
                  <h2 className="text-lg font-black text-gray-900">Your Wishlist</h2>
                  {wishlistCount > 0 && (
                    <span className="bg-[#662654]/10 text-[#662654] text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                      {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <span className="text-5xl mb-4">❤️</span>
                    <h3 className="text-base font-black text-gray-800 mb-1">Your wishlist is empty</h3>
                    <p className="text-xs text-gray-400 max-w-[240px] mb-6">
                      Tap the heart icon on any product to save it to your wishlist!
                    </p>
                    <button
                      onClick={() => {
                        setIsWishlistOpen(false);
                        navigate('/shop');
                      }}
                      className="bg-[#662654] hover:bg-[#7a2e64] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {wishlist.map((item) => {
                        const resolvedImg = resolveSingleImage(item.image) || 'https://images.unsplash.com/photo-1599598425947-330026217432?q=80&w=100&auto=format&fit=crop';
                          
                        const itemPrice = item.offerPrice || item.price;
                        
                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow group/item"
                          >
                            {/* Product Thumbnail */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                              <img src={resolvedImg} alt={item.name} className="w-full h-full object-cover" />
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[13px] font-bold text-gray-900 truncate group-hover/item:text-[#662654] transition-colors">
                                {item.name}
                              </h4>
                              <p className="text-[12px] font-black text-[#662654] mt-1">
                                ₹{itemPrice.toLocaleString()}
                              </p>
                            </div>

                            {/* Actions: Add to Cart & Delete */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  addToCart(item, 1);
                                  removeFromWishlist(item.id);
                                }}
                                className="bg-[#662654] hover:bg-[#7a2e64] text-white p-2 rounded-full transition-colors cursor-pointer"
                                title="Move to Cart"
                              >
                                <ShoppingCart size={14} />
                              </button>
                              <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="text-gray-300 hover:text-rose-500 p-2 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Remove from Wishlist"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        user={user}
        onLoginSuccess={(loggedInUser) => {
          console.log('User logged in successfully:', loggedInUser);
          setUser(loggedInUser);
        }}
        onLogout={() => {
          localStorage.removeItem('paidhu_token');
          setUser(null);
          setIsAuthModalOpen(false);
        }}
      />
    </motion.header>
  );
};

// Single nav link with hover underline animation
const NavItem = ({ name, onClick }) => (
  <button
    onClick={onClick}
    className="relative text-[#662654] font-bold text-[13px] xl:text-[14px] hover:text-[#4a1c3d] transition-colors cursor-pointer whitespace-nowrap text-center group"
  >
    {name}
    <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[#662654] group-hover:w-full transition-all duration-300 rounded-full" />
  </button>
);

export default Navbar;
