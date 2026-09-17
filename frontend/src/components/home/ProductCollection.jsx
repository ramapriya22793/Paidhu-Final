import { useState, useEffect, useRef } from 'react';
import { Plus, Minus, ChevronRight, ChevronLeft, Check, Heart, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import fallbacks from './fallbacks.json';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://paidhu-final-anm2.vercel.app');

const productsCache = {};
let allProductsMemory = null;
let lastFetchTime = 0;

// Thematic terms directly based on Paidhu's floral food products (mouth-watering product temptation, non-health/non-medicinal)
const COLLECTION_TERMS = {
  "Bestsellers": {
    filter: (p) => p.tags?.toLowerCase().includes("bestseller") || [20, 8, 3, 31, 22].includes(p.id),
    priorityIds: [20, 8, 3, 31, 22],
    shopUrl: "/shop/shop-all?tag=bestseller",
  },
  "Bloom Cookies": {
    filter: (p) => /cookie/i.test(p.name + ' ' + (p.category?.name || p.category || '')),
    priorityIds: [8, 10, 9],
    shopUrl: "/shop/shop-by-category?category=Bloom%20Cookies",
  },
  "Pure Saffron": {
    filter: (p) => {
      const name = (p.name || p.title || '').toLowerCase();
      const cat = (p.category?.name || (typeof p.category === 'string' ? p.category : '') || '').toLowerCase();
      if (name.includes('medley') || name.includes('tea') || name.includes('dips') || cat.includes('tea') || cat.includes('medley')) return false;
      return cat === 'saffron' || /saffron/i.test(name);
    },
    priorityIds: [20, 22, 21],
    shopUrl: "/shop/shop-all?q=saffron",
  },
  "Petal Jams": {
    filter: (p) => p.category?.toLowerCase().includes('jam') || /jam|gulkhand|syrup|preserve/i.test(p.name),
    priorityIds: [28, 4, 3, 29, 6],
    shopUrl: "/shop/shop-by-category?category=Petal%20Jam",
  },
  "Exotic Flower Brews": {
    filter: (p) => /brew\s*flora|whole\s*flower|chamomile|blue\s*pea|lavender|aavaram\s*poo/i.test(p.name),
    priorityIds: [12, 15, 14, 13, 11, 44],
    shopUrl: "/shop/shop-by-category?category=Brew%20Flora",
  },
  "Medley Teas": {
    filter: (p) => /medly|medley|tea\s*\(20\s*dips\)|dips/i.test(p.name),
    priorityIds: [45, 17, 18, 19, 31, 16],
    shopUrl: "/shop/shop-by-category?category=Medley%20Teas",
  },
  "Ruby Hibiscus Delights": {
    filter: (p) => /hibiscus/i.test(p.name + ' ' + (p.description || '')),
    priorityIds: [4, 10, 13, 16, 45],
    shopUrl: "/shop/shop-all?q=hibiscus",
  },
  "Gift Boxes & Combos": {
    filter: (p) => p.category?.toLowerCase().includes('gift') || /gift|combo|box/i.test(p.name + ' ' + (p.tags || '')) || [30, 20, 8, 3].includes(p.id),
    priorityIds: [30, 20, 8, 3, 28],
    shopUrl: "/shop/shop-all?tag=family_combos",
  }
};

const categories = Object.keys(COLLECTION_TERMS);

const resolveImage = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
};

// ---------- COLLECTION PRODUCT CARD ----------
const CollectionProductCard = ({ product, activeCategory, addingId, setAddingId, isInWishlist, handleToggleWishlist }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const raw = product.raw || {};
  const rawVariants = typeof raw.variants === 'string' 
    ? JSON.parse(raw.variants) 
    : (raw.variants || []);
  const isJam = raw.name?.toLowerCase().includes('jam');
  const variants = [...rawVariants].sort((a, b) => {
    const sizeA = parseInt(a.size) || 0;
    const sizeB = parseInt(b.size) || 0;
    return isJam ? sizeB - sizeA : sizeA - sizeB;
  });
  const hasVariants = Array.isArray(variants) && variants.length > 0;
  
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? variants[0] : null);
  const variantSize = selectedVariant?.size || 'default';
  const cartQty = getItemQuantity ? getItemQuantity(product.id, variantSize) : 0;

  const currentPrice = selectedVariant 
    ? (selectedVariant.offerPrice && selectedVariant.offerPrice !== '' ? Number(selectedVariant.offerPrice) : Number(selectedVariant.price || 0))
    : Number(product.discountedPrice ?? product.originalPrice ?? 0);

  const originalPrice = selectedVariant 
    ? (selectedVariant.offerPrice && selectedVariant.offerPrice !== '' ? Number(selectedVariant.price || 0) : null)
    : (product.originalPrice && Number(product.originalPrice) > Number(product.discountedPrice || 0) ? Number(product.originalPrice) : null);

  const discountPercent = selectedVariant
    ? (selectedVariant.offerPrice && selectedVariant.offerPrice !== '' 
        ? Math.round(((Number(selectedVariant.price || 0) - Number(selectedVariant.offerPrice)) / Number(selectedVariant.price || 1)) * 100) 
        : null)
    : (product.discountPercent ?? 0);

  const handleAddToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (addingId === product.id) return;
    
    setAddingId(product.id);
    try {
      await addToCart({
        id: product.id,
        name: product.title,
        price: selectedVariant ? Number(selectedVariant.price) : product.originalPrice,
        discountPrice: selectedVariant 
          ? (selectedVariant.offerPrice && selectedVariant.offerPrice !== '' ? Number(selectedVariant.offerPrice) : null)
          : (product.originalPrice > product.discountedPrice ? product.discountedPrice : null),
        image: product.image,
        category: activeCategory,
        shortDescription: product.description
      }, 1, selectedVariant);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div 
      className="w-full h-full bg-white rounded-2xl border border-gray-100 hover:shadow-[0_12px_30px_rgba(102,38,84,0.08)] transition-all duration-300 overflow-hidden flex flex-col group shadow-sm"
    >
      {/* Image Area */}
      <Link to={`/product/${product.raw?.slug || product.id}`} state={{ product: product.raw }} className="block relative aspect-[1.35/1] sm:aspect-square bg-[#f8f5f0] overflow-hidden">
        {product.badge && (
          <div className={`absolute top-0 left-0 z-10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${product.badgeColor} rounded-br-lg shadow-sm`}>
            {product.badge}
          </div>
        )}
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => handleToggleWishlist(e, product)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md transition-all duration-200 hover:bg-white cursor-pointer"
          aria-label="Toggle Wishlist"
        >
          <Heart
            size={14}
            className={isInWishlist(product.id) ? 'fill-[#662654] text-[#662654]' : 'text-gray-400'}
            strokeWidth={2}
          />
        </button>
        <img 
          src={product.image} 
          alt={product.title} 
          width={300}
          height={300}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ imageRendering: 'high-quality', WebkitBackfaceVisibility: 'hidden', WebkitTransform: 'translateZ(0)' }}
        />
      </Link>

      {/* Info Area - matching ShopPage.jsx */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <Link to={`/product/${product.raw?.slug || product.id}`} state={{ product: product.raw }} className="block group/link mb-1 sm:mb-2 flex-1">
          <h3 className="text-[12.5px] sm:text-[13.5px] font-semibold text-gray-900 line-clamp-2 leading-snug group-hover/link:text-[#662654] transition-colors">{product.title}</h3>
        </Link>

        {/* Option Selector Container - reserved min-height slot for uniform card height */}
        <div className="min-h-[36px] mb-2 flex items-center w-full">
          {hasVariants && (
            variants.some(v => v.size.length > 12) ? (
              <div className="relative w-full">
                <select
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const selected = variants.find(v => v.size === e.target.value);
                    if (selected) setSelectedVariant(selected);
                  }}
                  value={selectedVariant?.size || ''}
                  className="w-full text-[11px] md:text-[12px] font-bold px-3 py-2 rounded-lg border border-gray-200 text-[#662654] bg-[#faf9f7] hover:border-[#662654]/50 focus:outline-none focus:border-[#662654] appearance-none cursor-pointer pr-8 text-ellipsis overflow-hidden"
                  aria-label="Select product option size"
                >
                  {variants.map((v, i) => (
                    <option key={i} value={v.size}>
                      {v.size}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#662654]">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {variants.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(v);
                    }}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      selectedVariant?.size === v.size
                        ? 'border-[#662654] bg-[#662654] text-white shadow-md'
                        : 'border-[#eddfe9] text-[#662654] bg-[#f6f2f5] hover:border-[#662654]/50'
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            )
          )}
        </div>


        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
          <span className="text-[15px] sm:text-[16px] font-bold text-gray-900">
            ₹{(currentPrice || 0).toLocaleString('en-IN')}
          </span>
          {originalPrice && originalPrice > currentPrice && (
            <span className="text-[11px] sm:text-[12px] text-gray-400 line-through">
              ₹{(originalPrice || 0).toLocaleString('en-IN')}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[9px] sm:text-[10px] font-bold text-white bg-green-500 px-1.5 py-0.5 rounded shadow-sm ml-auto">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Add to Cart or Quantity Stepper */}
        {cartQty > 0 ? (
          <div 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="w-full mt-auto bg-[#662654] text-white rounded-full py-1.5 px-3 flex items-center justify-between shadow-[0_4px_12px_rgba(102,38,84,0.25)] transition-all duration-300"
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateQuantity(product.id, cartQty - 1, variantSize);
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-[#662654] transition-colors cursor-pointer active:scale-90"
              title="Decrease quantity"
            >
              <Minus size={13} strokeWidth={3} />
            </button>
            
            <span className="text-white font-black text-sm sm:text-base select-none px-2">
              {cartQty}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateQuantity(product.id, cartQty + 1, variantSize);
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-[#662654] transition-colors cursor-pointer active:scale-90"
              title="Increase quantity"
            >
              <Plus size={13} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button 
            type="button"
            onClick={handleAddToCartClick}
            disabled={addingId === product.id}
            className="w-full mt-auto bg-gradient-to-r from-[#662654] to-[#7f2d68] hover:from-[#7a2e64] hover:to-[#913b7e] disabled:from-emerald-600 disabled:to-teal-500 text-white rounded-full py-2 sm:py-2.5 flex items-center justify-center gap-2 font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-[0_4px_12px_rgba(102,38,84,0.15)] hover:shadow-[0_6px_20px_rgba(102,38,84,0.3)] transition-all duration-300 group/btn cursor-pointer"
          >
            {addingId === product.id ? (
              <>
                <Check size={14} strokeWidth={3} className="text-white animate-bounce" />
                <span>{product.status === 'PREORDER' ? 'Pre-ordered!' : 'Added!'}</span>
              </>
            ) : (
              <>
                <ShoppingCart size={13} strokeWidth={2.5} className="transform group-hover/btn:scale-110 transition-transform" />
                <span>{product.status === 'PREORDER' ? 'Pre-order' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const ProductCollection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Bestsellers");
  const tabsRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const t1 = setTimeout(checkScroll, 100);
    const t2 = setTimeout(checkScroll, 400);
    const t3 = setTimeout(checkScroll, 1000);
    const el = tabsRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  useEffect(() => {
    checkScroll();
  }, [activeCategory]);

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = Math.max(tabsRef.current.clientWidth * 0.75, 220);
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
      setTimeout(checkScroll, 700);
    }
  };

  const handleCategorySelect = (category, e) => {
    setActiveCategory(category);
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    setTimeout(checkScroll, 400);
    setTimeout(checkScroll, 750);
  };

  // Product scroller navigation (Mobile / Horizontal Scroll)
  const productsScrollRef = useRef(null);
  const [canScrollProdLeft, setCanScrollProdLeft] = useState(false);
  const [canScrollProdRight, setCanScrollProdRight] = useState(true);

  const checkProdScroll = () => {
    if (productsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = productsScrollRef.current;
      setCanScrollProdLeft(scrollLeft > 10);
      setCanScrollProdRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollProducts = (direction) => {
    if (productsScrollRef.current) {
      const scrollAmount = Math.max(productsScrollRef.current.clientWidth * 0.75, 240);
      productsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkProdScroll, 350);
      setTimeout(checkProdScroll, 700);
    }
  };

  useEffect(() => {
    const el = productsScrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkProdScroll, { passive: true });
      window.addEventListener('resize', checkProdScroll);
      return () => {
        el.removeEventListener('scroll', checkProdScroll);
        window.removeEventListener('resize', checkProdScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (productsScrollRef.current) {
      productsScrollRef.current.scrollLeft = 0;
    }
    checkProdScroll();
    const t1 = setTimeout(checkProdScroll, 150);
    const t2 = setTimeout(checkProdScroll, 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeCategory]);

  const handleViewAllClick = () => {
    const config = COLLECTION_TERMS[activeCategory];
    if (config?.shopUrl) {
      navigate(config.shopUrl);
    } else {
      navigate("/shop/shop-all");
    }
  };

  const getFallbackProducts = (cat) => {
    return productsCache[cat] ||
      fallbacks[cat] ||
      (cat === "Bloom Cookies" ? fallbacks["Crispy Bloom Cookies"] : null) ||
      (cat === "Pure Saffron" ? fallbacks["Pure Kashmiri Saffron"] : null) ||
      (cat === "Petal Jams" ? fallbacks["Artisanal Petal Preserves"] : null) ||
      (cat === "Medley Teas" ? fallbacks["Fragrant Medley Teas"] : null) ||
      [];
  };

  const [products, setProducts] = useState(() => {
    return getFallbackProducts(activeCategory);
  });
  const [loading, setLoading] = useState(() => {
    const initialList = getFallbackProducts(activeCategory);
    return initialList.length === 0;
  });
  const [addingId, setAddingId] = useState(null);
  const { addToCart, wishlist, toggleWishlist } = useCart();

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.title,
      price: product.originalPrice,
      discountPrice: product.discountedPrice !== product.originalPrice ? product.discountedPrice : null,
      image: product.image,
      category: activeCategory,
      shortDescription: product.description
    });
  };

  const isInWishlist = (productId) => {
    return wishlist && wishlist.some(item => item.id === productId);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (addingId === product.id) return;
    
    setAddingId(product.id);
    try {
      // Convert product UI format to backend/cart format
      await addToCart({
        id: product.id,
        name: product.title,
        price: product.originalPrice,
        discountPrice: product.discountedPrice !== product.originalPrice ? product.discountedPrice : null,
        image: product.image,
        category: activeCategory,
        shortDescription: product.description
      }, 1);
    } finally {
      setAddingId(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const instantList = getFallbackProducts(activeCategory);
    setProducts(instantList);
    setLoading(instantList.length === 0);

    const mapProductToUI = (p) => {
      const originalPrice = p.price;
      const discountedPrice = p.discountPrice || p.price;
      const discountPercent = originalPrice > discountedPrice 
        ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) 
        : 0;

      let badge = "";
      let badgeColor = "";
      if (p.status === 'PREORDER') {
        badge = "Pre-order";
        badgeColor = "bg-[#662654] text-white";
      } else if (p.tags && p.tags.toLowerCase().includes("bestseller")) {
        badge = "Bestseller";
        badgeColor = "bg-[#662654] text-white";
      } else if (discountPercent > 0) {
        badge = "Sale";
        badgeColor = "bg-[#662654] text-white";
      }

      const image = p.image || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imageUrl : null) || (p.images && p.images.length > 0 ? p.images[0] : null);
      const resolvedImages = p.images ? p.images.map(img => resolveImage(img)) : [resolveImage(image)].filter(Boolean);

      return {
        id: p.id,
        badge,
        badgeColor,
        image: resolveImage(image) || "https://images.unsplash.com/photo-1599598425947-330026217432?q=80&w=500&auto=format&fit=crop",
        images: resolvedImages.length > 0 ? resolvedImages : ["https://images.unsplash.com/photo-1599598425947-330026217432?q=80&w=500&auto=format&fit=crop"],
        title: p.name,
        description: p.shortDescription || p.description,
        originalPrice,
        discountedPrice,
        discountPercent,
        raw: p
      };
    };

    const fetchProducts = async () => {
      try {
        const isStale = (Date.now() - lastFetchTime) > 15000;
        let allProducts = allProductsMemory;
        if (!allProducts || allProducts.length === 0 || isStale) {
          const res = await fetch(`${API_BASE}/api/products?limit=100&_t=${Date.now()}`, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            allProducts = data.products || [];
            allProductsMemory = allProducts;
            lastFetchTime = Date.now();
          }
        }

        // Populate cache for all collection terms at once for instantaneous tab switching
        if (allProducts && allProducts.length > 0) {
          for (const [termName, termConfig] of Object.entries(COLLECTION_TERMS)) {
            let matched = allProducts.filter(termConfig.filter);
            if (termConfig.priorityIds) {
              matched.sort((a, b) => {
                const idxA = termConfig.priorityIds.indexOf(a.id);
                const idxB = termConfig.priorityIds.indexOf(b.id);
                if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                if (idxA !== -1) return -1;
                if (idxB !== -1) return 1;
                return a.id - b.id;
              });
            }

            // If fewer than 5 products, backfill with general products to fill the 5-column row
            if (matched.length < 5) {
              for (const p of allProducts) {
                if (matched.length >= 5) break;
                if (!matched.some(m => m.id === p.id)) {
                  matched.push(p);
                }
              }
            }

            // Deduplicate by title
            const seen = new Set();
            matched = matched.filter(p => {
              const key = (p.name || '').trim().toLowerCase();
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });

            productsCache[termName] = matched.map(mapProductToUI);
          }
        }

        const activeList = productsCache[activeCategory] || getFallbackProducts(activeCategory);
        if (isMounted) {
          setProducts(activeList);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching collection products:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  return (
    <section className="w-full bg-white pt-2 pb-2 md:pt-4 md:pb-3">

      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* Mobile Category Swipe Notification */}
        <div className="flex sm:hidden items-center justify-between px-1 mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#662654]">
            Categories
          </span>
          <button
            type="button"
            onClick={() => scrollTabs('right')}
            className="flex items-center gap-1 text-[11px] font-extrabold text-[#662654] bg-[#f6f2f5] hover:bg-[#eddfe9] px-2.5 py-1 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span>Swipe for more options</span>
            <ChevronRight size={13} strokeWidth={3} className="animate-pulse text-[#662654]" />
          </button>
        </div>

        {/* Category Tabs with Scroll Arrows */}
        <div className="relative mb-6 border-b border-gray-100 pb-4">
          {/* Left Arrow & Fade Gradient */}
          <div 
            className={`absolute left-0 top-0 bottom-4 z-20 flex items-center transition-opacity duration-300 pointer-events-none ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-10 sm:w-16 h-full bg-gradient-to-r from-white via-white/95 to-transparent" />
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              aria-label="Scroll options left"
              tabIndex={canScrollLeft ? 0 : -1}
              className={`absolute left-0 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#662654] shadow-[0_4px_16px_rgba(102,38,84,0.25)] border border-[#662654]/20 flex items-center justify-center hover:bg-[#662654] hover:text-white transition-all duration-200 active:scale-90 cursor-pointer ${
                canScrollLeft ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Scrollable Tabs */}
          <div 
            ref={tabsRef}
            className="flex overflow-x-auto hide-scrollbar space-x-2.5 sm:space-x-4 py-2 px-1 items-center scroll-smooth pr-14 sm:pr-16"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={(e) => handleCategorySelect(category, e)}
                className={`relative whitespace-nowrap px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-[15px] font-extrabold tracking-wide transition-all duration-300 cursor-pointer shrink-0 ${
                  activeCategory === category 
                    ? 'text-white bg-[#662654] shadow-[0_6px_20px_rgba(102,38,84,0.4)] scale-105' 
                    : 'text-[#662654] bg-[#f6f2f5] hover:text-[#662654] hover:bg-[#eddfe9] hover:shadow-[0_4px_10px_rgba(102,38,84,0.08)] hover:-translate-y-0.5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Right Arrow & Fade Gradient */}
          <div 
            className={`absolute right-0 top-0 bottom-4 z-20 flex items-center justify-end transition-opacity duration-300 pointer-events-none ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-12 sm:w-20 h-full bg-gradient-to-l from-white via-white/95 to-transparent" />
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              aria-label="Scroll options right"
              tabIndex={canScrollRight ? 0 : -1}
              className={`absolute right-0 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#662654] shadow-[0_4px_16px_rgba(102,38,84,0.25)] border border-[#662654]/20 flex items-center justify-center hover:bg-[#662654] hover:text-white transition-all duration-200 active:scale-90 cursor-pointer ${
                canScrollRight ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Mobile Product Swipe Notification */}
        <div className="flex sm:hidden items-center justify-between px-1 mb-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#662654]">
            {activeCategory} ({products.length})
          </span>
          <button
            type="button"
            onClick={() => scrollProducts('right')}
            className="flex items-center gap-1 text-[11px] font-extrabold text-white bg-[#662654] hover:bg-[#7e3168] px-3 py-1 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span>Swipe to view all products</span>
            <ChevronRight size={13} strokeWidth={3} className="animate-pulse text-white" />
          </button>
        </div>

        {/* Product Scroller & Grid Container with Navigation Arrows */}
        <div className="relative group/prodScroller">
          
          {/* Left Arrow Button & Edge Fade */}
          <div 
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 flex items-center transition-opacity duration-300 pointer-events-none ${
              canScrollProdLeft ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className="w-8 sm:w-12 h-64 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
            <button
              type="button"
              onClick={() => scrollProducts('left')}
              aria-label="Scroll products left"
              tabIndex={canScrollProdLeft ? 0 : -1}
              className={`absolute left-0 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#662654] shadow-[0_4px_18px_rgba(102,38,84,0.32)] border border-[#662654]/25 flex items-center justify-center hover:bg-[#662654] hover:text-white transition-all duration-200 active:scale-90 cursor-pointer ${
                canScrollProdLeft ? 'pointer-events-auto hover:scale-105' : 'pointer-events-none opacity-40'
              }`}
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* Product Grid / Horizontal Scroller */}
          <div 
            ref={productsScrollRef}
            key={activeCategory}
            className="flex overflow-x-auto gap-3.5 sm:gap-6 pb-4 snap-x snap-mandatory hide-scrollbar sm:grid sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 sm:overflow-visible sm:pb-0 scroll-smooth pr-10 sm:pr-0 pl-0.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <div 
                  key={`skeleton-${idx}`} 
                  className="w-[42vw] max-w-[170px] flex-shrink-0 snap-center sm:w-auto sm:max-w-none sm:snap-align-none"
                >
                  <div className="w-full bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-sm animate-pulse">
                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                      <div className="w-4/5 h-4/5 bg-gray-200 rounded-lg" />
                    </div>
                    <div className="p-4 flex flex-col flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-5/6" />
                      <div className="mt-auto h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-10 bg-gray-200 rounded-full w-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500">
                <p className="text-base font-semibold">No products found in this category.</p>
              </div>
            ) : (
              products.slice(0, 10).map((product) => (
                <div key={product.id} className="w-[42vw] max-w-[170px] flex-shrink-0 snap-center sm:w-auto sm:max-w-none sm:snap-align-none">
                  <CollectionProductCard
                    product={product}
                    activeCategory={activeCategory}
                    addingId={addingId}
                    setAddingId={setAddingId}
                    isInWishlist={isInWishlist}
                    handleToggleWishlist={handleToggleWishlist}
                  />
                </div>
              )))}
          </div>

          {/* Right Arrow Button & Edge Fade */}
          <div 
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-end transition-opacity duration-300 pointer-events-none ${
              canScrollProdRight ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className="w-10 sm:w-14 h-64 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
            <button
              type="button"
              onClick={() => scrollProducts('right')}
              aria-label="Scroll products right"
              tabIndex={canScrollProdRight ? 0 : -1}
              className={`absolute right-0 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#662654] shadow-[0_4px_18px_rgba(102,38,84,0.32)] border border-[#662654]/25 flex items-center justify-center hover:bg-[#662654] hover:text-white transition-all duration-200 active:scale-90 cursor-pointer ${
                canScrollProdRight ? 'pointer-events-auto hover:scale-105' : 'pointer-events-none opacity-40'
              }`}
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex justify-center items-center w-full">
          {/* View All Button */}
          <button 
            onClick={handleViewAllClick}
            className="flex items-center bg-[#eef0f3] rounded-full pl-4 pr-1 md:pl-5 md:pr-1.5 py-1 md:py-1.5 group hover:bg-[#e2e4e8] transition-colors shadow-sm cursor-pointer"
          >
            <span className="text-[12px] md:text-[15px] font-bold text-[#111] mr-2 md:mr-4 tracking-wide truncate max-w-[200px] md:max-w-none">
              View All {activeCategory}
            </span>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#cbd1d9] flex items-center justify-center group-hover:bg-[#aeb6c1] transition-colors flex-shrink-0">
              <ChevronRight size={16} className="text-white ml-0.5" strokeWidth={3.5} />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProductCollection;
