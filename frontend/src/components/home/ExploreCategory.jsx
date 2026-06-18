import { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Categories in the specified order with accent colors & fallback images
const CATEGORY_CONFIG = [
  {
    title: "Bloom Cookies",
    subtitle: "Floral Artisan Bakes",
    accent: "#c8843a",
    badge: "Bestseller",
    img: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937180748-WhatsAppImage20251128at14404PM600x402jpeg.jpeg",
    fallback: "https://images.unsplash.com/photo-1558961309-dbdf717a1e4e?auto=format&fit=crop&q=90&w=1200"
  },
  {
    title: "Petal Jam",
    subtitle: "Pure Floral Preserves",
    accent: "#c45c7c",
    badge: "New Arrival",
    img: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780897222396-IMG20250917121311600x404png.png",
    fallback: "https://images.unsplash.com/photo-1589535036124-747385202613?auto=format&fit=crop&q=90&w=1200"
  },
  {
    title: "Saffron",
    subtitle: "Premium Red Gold",
    accent: "#d4821a",
    badge: "Pure & Premium",
    img: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780939517153-saffronneign600x600jpg.jpg",
    fallback: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=90&w=1200"
  },
  {
    title: "Medley Teas",
    subtitle: "Botanical Blends",
    accent: "#4a7c59",
    badge: "Hand Blended",
    img: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780938733725-WhatsAppImage20251113at23302330981866600x800jpg.jpg",
    fallback: "https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?auto=format&fit=crop&q=90&w=1200"
  },
  {
    title: "Brew Flora",
    subtitle: "Floral Infused Drinks",
    accent: "#7b5ea7",
    badge: "Signature Brew",
    img: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937334667-WhatsAppImage20251113at233026a02aaf431600x800jpg.jpg",
    fallback: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=90&w=1200"
  }
];

const getMobileGridClasses = (index) => {
  switch(index) {
    case 0: return "col-span-2 row-span-1";
    case 1: return "col-span-1 row-span-1";
    case 2: return "col-span-1 row-span-2";
    case 3: return "col-span-1 row-span-1";
    case 4: return "col-span-2 row-span-1";
    default: return "col-span-1 row-span-1";
  }
};

// Resolve the full image URL from backend
const resolveImage = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
};

const countsCache = { current: null };

const DEFAULT_COUNTS = {
  "Bloom Cookies": 4,
  "Petal Jam": 4,
  "Saffron": 1,
  "Medley Teas": 3,
  "Brew Flora": 3
};

const ExploreCategory = () => {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const navigate = useNavigate();
  const [categories, setCategories] = useState(() => {
    if (countsCache.current) return countsCache.current;
    return CATEGORY_CONFIG.map(c => ({
      ...c,
      img: c.img || c.fallback,
      loading: false,
      productCount: DEFAULT_COUNTS[c.title] || 0
    }));
  });

  const handleCategoryClick = (cat) => {
    navigate(`/shop/shop-by-category?category=${encodeURIComponent(cat.title)}`);
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchCategoryCounts = async () => {
      try {
        const updated = await Promise.all(
          CATEGORY_CONFIG.map(async (cat) => {
            try {
              const res = await fetch(
                `${API_BASE}/api/products?category=${encodeURIComponent(cat.title)}&limit=1`
              );
              const data = await res.json();

              return {
                ...cat,
                img: cat.img || cat.fallback,
                loading: false,
                productCount: data.total || 0
              };
            } catch (e) {
              return {
                ...cat,
                img: cat.img || cat.fallback,
                loading: false,
                productCount: DEFAULT_COUNTS[cat.title] || 0
              };
            }
          })
        );
        
        countsCache.current = updated;
        if (isMounted) {
          setCategories(updated);
        }
      } catch (err) {
        console.error("Error fetching category counts:", err);
      }
    };

    fetchCategoryCounts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-[#fcfbfa] pt-4 pb-4 md:pt-6 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[#662654] font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mb-3 px-4 py-1.5 bg-[#662654]/10 rounded-full inline-flex items-center gap-1.5"
          >
            <Sparkles size={11} /> Our Categories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-[#111] tracking-tight mb-3"
          >
            Explore Our <span className="text-[#662654]">World</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 font-medium text-base md:text-lg max-w-2xl"
          >
            Discover our handcrafted collection of premium, natural, and guilt-free floral foods.
          </motion.p>
        </div>

        {/* =========================================
            MOBILE VIEW: Asymmetrical Bento Box Grid
            ========================================= */}
        <div className="grid md:hidden grid-cols-2 auto-rows-[130px] gap-3">
          {categories.map((cat, index) => (
            <motion.div
              key={`mobile-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.07, duration: 0.45, ease: "easeOut" }}
              onClick={() => handleCategoryClick(cat)}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 ${getMobileGridClasses(index)}`}
            >
              {/* Skeleton shimmer while loading */}
              {cat.loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
              )}

              {/* Background Image */}
              <img
                src={cat.img}
                alt={cat.title}
                width={600}
                height={320}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={e => { e.target.src = cat.fallback; }}
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 opacity-80 transition-opacity duration-500 group-hover:opacity-90"
                style={{ background: `linear-gradient(to top, ${cat.accent}ee 0%, ${cat.accent}55 50%, transparent 100%)` }}
              />

              {/* Badge */}
              <div className="absolute top-2 right-2 z-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-2 py-0.5">
                <span className="text-white text-[9px] font-bold tracking-wider uppercase">{cat.badge}</span>
              </div>

              <div className="absolute inset-0 p-3 flex flex-col justify-end z-10">
                <span className="text-white/80 text-[9px] font-bold tracking-widest uppercase mb-0.5 block">
                  {cat.subtitle}
                </span>
                <h3 className="font-black text-[15px] leading-tight text-white tracking-tight drop-shadow-sm">
                  {cat.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* =========================================
            DESKTOP VIEW: Expanding Flex Accordion
            ========================================= */}
        <div className="hidden md:flex w-full h-[260px] lg:h-[320px] gap-2.5 lg:gap-3">
          {categories.map((cat, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={`desktop-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => handleCategoryClick(cat)}
                style={{ flex: isHovered ? 4.5 : 1 }}
                className="relative h-full rounded-3xl overflow-hidden cursor-pointer group shadow-md transition-all duration-[650ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
              >
                {/* Skeleton shimmer while loading */}
                {cat.loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                )}

                {/* Background Image from backend */}
                <img
                  src={cat.img}
                  alt={cat.title}
                  width={600}
                  height={320}
                  loading="lazy"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                  onError={e => { e.target.src = cat.fallback; }}
                />

                {/* Dynamic gradient overlay using accent color */}
                <div
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    background: isHovered
                      ? `linear-gradient(to top, ${cat.accent}f0 0%, ${cat.accent}60 35%, transparent 70%)`
                      : 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)'
                  }}
                />

                {/* Shimmer glow line on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-500"
                  style={{
                    background: isHovered ? cat.accent : 'transparent',
                    boxShadow: isHovered ? `0 0 12px ${cat.accent}` : 'none'
                  }}
                />

                {/* Badge */}
                <div
                  className={`absolute top-3 right-3 z-20 backdrop-blur-sm border border-white/30 rounded-full px-2.5 py-0.5 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                  style={{ background: `${cat.accent}cc` }}
                >
                  <span className="text-white text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">
                    {cat.badge}
                  </span>
                </div>

                {/* Product count pill */}
                {cat.productCount > 0 && (
                  <div
                    className={`absolute top-3 left-3 z-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-2.5 py-0.5 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                  >
                    <span className="text-white text-[10px] font-semibold whitespace-nowrap">
                      {cat.productCount} Products
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end h-full pointer-events-none">

                  {/* Collapsed: Vertical Text */}
                  <div
                    className={`absolute bottom-5 left-1/2 -translate-x-1/2 transition-all duration-300 w-full flex justify-center ${isHovered ? 'opacity-0 scale-90' : 'opacity-100 delay-200'}`}
                  >
                    <h3
                      className="text-white font-bold tracking-[0.18em] uppercase text-[10px] lg:text-[11px] whitespace-nowrap drop-shadow"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {cat.title}
                    </h3>
                  </div>

                  {/* Expanded Content */}
                  <div
                    className={`transition-all duration-500 transform flex flex-col items-start ${isHovered ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-10 absolute bottom-5'}`}
                  >
                    <span className="text-white/75 text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase mb-1.5 block">
                      {cat.subtitle}
                    </span>
                    <h3 className="font-black text-xl lg:text-3xl text-white tracking-tight leading-tight mb-4 drop-shadow-md">
                      {cat.title}
                    </h3>
                    <div
                      onClick={(e) => { e.stopPropagation(); handleCategoryClick(cat); }}
                      className="flex items-center gap-2 text-white font-bold text-[11px] lg:text-sm w-fit px-4 py-2 rounded-full border border-white/40 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/80 hover:shadow-lg pointer-events-auto cursor-pointer"
                      style={{ background: `${cat.accent}99` }}
                    >
                      Shop Now <ArrowRight size={13} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 md:mt-12 flex justify-center w-full"
        >
          <button
            onClick={() => navigate('/shop/shop-all')}
            className="flex items-center gap-1.5 bg-[#ede7d7] shadow-sm rounded-full pl-6 pr-4 py-3 hover:bg-[#e4dcc8] transition-colors group w-full md:w-auto justify-center"
          >
            <span className="font-black text-[#662654] text-[15px]">View All Categories</span>
            <ChevronDown size={20} className="text-[#662654]" strokeWidth={3} />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default ExploreCategory;
