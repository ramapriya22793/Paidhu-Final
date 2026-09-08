import { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://paidhu-final-anm2.vercel.app');

// Categories in the specified order with accent colors, verified fallback images & product lists
const CATEGORY_CONFIG = [
  {
    title: "Bloom Cookies",
    subtitle: "Crunchy Melt-in-Mouth Bakes",
    accent: "#c8843a",
    textAccent: "#9a5d1a",
    badge: "Crispy & Sweet",
    characterImg: "/illustrations PNG-06 (1).png",
    characterAlt: "Lotus mascot enjoying crunchy cookie",
    characterTag: "Crunching & Munching!",
    characterAnim: {
      y: [0, 5, 5, -8, -6, 3, -4, 0],
      rotate: [0, -6, -6, 5, 2, -3, 3, 0],
      scale: [1, 0.95, 0.95, 1.08, 1.02, 1.06, 1.01, 1]
    },
    characterAnimDuration: 2.2,
    actionIcon: "🍪",
    actionIconAnim: { y: [2, -18], x: [0, 6], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.7] },
    actionIconDuration: 1.6,
    temptationQuote: "Irresistibly crunchy, crumbly floral cookies baked with wholesome country jaggery and zero refined sugar.",
    bgClass: "from-[#fffdfa] via-[#fcf6ee] to-[#f8ede0]",
    borderClass: "border-[#eaddcb]",
    img: "/white_lotus_cookies_new.png",
    fallback: "/white_lotus_cookies_new.png",
    productCount: 3,
    products: [
      {
        id: 8,
        name: "Bloom Cookies - White Lotus",
        image: "/white_lotus_cookies_new.png"
      },
      {
        id: 10,
        name: "Bloom Cookies - Hibiscus",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787744799967-paidhuhibiscus001png.png"
      },
      {
        id: 9,
        name: "Bloom Cookies - Aavaram Poo",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787745086149-paidhuaavaram001png.png"
      }
    ],
    images: [
      "/white_lotus_cookies_new.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787744799967-paidhuhibiscus001png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787745086149-paidhuaavaram001png.png"
    ]
  },
  {
    title: "Petal Jam",
    subtitle: "Luscious Velvety Spreads",
    accent: "#c45c7c",
    textAccent: "#a63f61",
    badge: "Sweet Temptation",
    characterImg: "/illustrations PNG-05 (1).png",
    characterAlt: "Lotus chef stirring sweet petal jam",
    characterTag: "Stirring Sweet Jam!",
    characterAnim: {
      x: [0, 6, 0, -6, 0],
      y: [0, -4, 4, -2, 0],
      rotate: [-6, 6, -5, 5, -6],
      scale: [1, 1.03, 0.98, 1.03, 1]
    },
    characterAnimDuration: 2.2,
    actionIcon: "🥄",
    actionIconAnim: { y: [0, -16], x: [-2, 6], opacity: [0, 1, 0], rotate: [-10, 20], scale: [0.6, 1.1, 0.8] },
    actionIconDuration: 1.8,
    temptationQuote: "Velvety floral preserves slow-simmered from freshly hand-plucked petals for decadent toasts and desserts.",
    bgClass: "from-[#fffcfd] via-[#fef2f6] to-[#fae5ed]",
    borderClass: "border-[#f2d4e0]",
    img: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746427907-WhatsAppImage20260806at1138202jpeg.jpeg",
    fallback: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746427907-WhatsAppImage20260806at1138202jpeg.jpeg",
    productCount: 5,
    products: [
      {
        id: 29,
        name: "Tanner's Jam",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746427907-WhatsAppImage20260806at1138202jpeg.jpeg"
      },
      {
        id: 28,
        name: "Rose Gulkhand Jam",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746603306-rosegulkhand001png.png"
      },
      {
        id: 6,
        name: "Sinensis Syrup – Petal Jam",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787747332571-synensissyrup001png.png"
      },
      {
        id: 4,
        name: "Hibiscus Petal Jam",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787747607795-hibiscuspetaljam001png.png"
      },
      {
        id: 3,
        name: "Neem Petal Jam",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787748641468-neemjam001png.png"
      }
    ],
    images: [
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746427907-WhatsAppImage20260806at1138202jpeg.jpeg",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746603306-rosegulkhand001png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787747332571-synensissyrup001png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787747607795-hibiscuspetaljam001png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787748641468-neemjam001png.png"
    ]
  },
  {
    title: "Saffron",
    subtitle: "Crimson Royal Luxury",
    accent: "#d4821a",
    textAccent: "#b5690b",
    badge: "Gourmet Grade A+",
    characterImg: "/saffron_character.png",
    characterAlt: "Saffron flower with authentic vibrant crimson threads",
    characterTag: "Blooming Royal Threads!",
    characterAnim: {
      y: [0, -12, 0],
      rotate: [-3, 3, -3],
      scale: [1, 1.1, 0.98, 1]
    },
    characterAnimDuration: 2.8,
    actionIcon: "✨",
    actionIconAnim: { y: [2, -22], opacity: [0, 1, 0], scale: [0.4, 1.3, 0.8] },
    actionIconDuration: 2.0,
    temptationQuote: "Hand-harvested pristine crimson threads offering intense floral aroma and luxurious golden hues.",
    bgClass: "from-[#fffdfa] via-[#fef7eb] to-[#faeedb]",
    borderClass: "border-[#f0dbc0]",
    img: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746786285-saffronsuperneigin001png.png",
    fallback: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746786285-saffronsuperneigin001png.png",
    productCount: 3,
    products: [
      {
        id: 22,
        name: "Super Negin Saffron",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746786285-saffronsuperneigin001png.png"
      },
      {
        id: 21,
        name: "Saffron Powder",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787747041682-saffronpowder002png.png"
      },
      {
        id: 20,
        name: "Kashmiri Mongra",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787745899482-paidhukashmirimongrapng.png"
      }
    ],
    images: [
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746786285-saffronsuperneigin001png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787747041682-saffronpowder002png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787745899482-paidhukashmirimongrapng.png"
    ]
  },
  {
    title: "Medley Teas",
    subtitle: "Soul-Soothing Aromatic Brews",
    accent: "#4a7c59",
    textAccent: "#386847",
    badge: "Fragrant Bliss",
    characterImg: "/medley_tea_character.png",
    characterAlt: "Hibiscus mascot dipping tea pouch into a cup",
    characterTag: "Dipping Pouch in Cup!",
    characterAnim: {
      y: [0, 8, 9, -8, -7, 8, 9, 0],
      rotate: [0, 4, 3, -3, -2, 4, 3, 0],
      scale: [1, 0.97, 0.97, 1.04, 1.04, 0.97, 0.97, 1]
    },
    characterAnimDuration: 2.4,
    actionIcon: "♨️",
    actionIconAnim: { y: [4, -20], x: [2, -4], opacity: [0, 1, 0], scale: [0.6, 1.2, 0.8] },
    actionIconDuration: 1.8,
    temptationQuote: "Handcrafted whole flower dips that infuse every cup with gentle floral fragrance and peaceful warmth.",
    bgClass: "from-[#fafffc] via-[#f3f9f5] to-[#e6f2e9]",
    borderClass: "border-[#d2e7d7]",
    img: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751567516-medleyteahibiscus005png.png",
    fallback: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751567516-medleyteahibiscus005png.png",
    productCount: 5,
    products: [
      {
        id: 45,
        name: "Medley Teas - Hibiscus",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751567516-medleyteahibiscus005png.png"
      },
      {
        id: 31,
        name: "Cassia Fistula Medley Tea",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787752669123-cassiafistulamedleyteaspng.png"
      },
      {
        id: 19,
        name: "Medley Teas - Blue Pea",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787750755658-medleyteasbluepea001png.png"
      },
      {
        id: 18,
        name: "Medley Teas - Saffron",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751146063-medleyteassaffron003png.png"
      },
      {
        id: 17,
        name: "Medley Teas - Lavender",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787752213835-medleyteaslavender007png.png"
      }
    ],
    images: [
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751567516-medleyteahibiscus005png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787752669123-cassiafistulamedleyteaspng.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787750755658-medleyteasbluepea001png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751146063-medleyteassaffron003png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787752213835-medleyteaslavender007png.png"
    ]
  },
  {
    title: "Brew Flora",
    subtitle: "Exotic Whole Blossom Teas",
    accent: "#7b5ea7",
    textAccent: "#684b93",
    badge: "Whole Bloom Magic",
    characterImg: "/brew_flora_character.png",
    characterTag: "Swinging Dried Blooms!",
    characterAnim: {
      x: [-5, 5, -5],
      y: [0, -10, 0, -9, 0],
      rotate: [-7, 7, -6, 6, -7],
      scale: [1, 1.04, 0.98, 1.04, 1]
    },
    characterAnimDuration: 2.0,
    actionIcon: "🌸",
    actionIconAnim: { y: [0, -18], x: [-4, 8], opacity: [0, 1, 0], rotate: [0, 45], scale: [0.5, 1.1, 0.7] },
    actionIconDuration: 1.7,
    temptationQuote: "Spectacular intact sun-dried whole flower blossoms that bloom and dance as they steep in steaming hot water.",
    bgClass: "from-[#fcfaff] via-[#f7f1fc] to-[#eee2f7]",
    borderClass: "border-[#e0d2f2]",
    img: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787156882780-brewfloraavarampoojpg.jpg",
    fallback: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787156882780-brewfloraavarampoojpg.jpg",
    productCount: 5,
    products: [
      {
        id: 44,
        name: "Brew Flora - Aavaram Poo",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787156882780-brewfloraavarampoojpg.jpg"
      },
      {
        id: 15,
        name: "Brew Flora - Chamomile",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787141815115-WhatsAppImage20251113at2330215f60b43f180x180jpg.jpg"
      },
      {
        id: 14,
        name: "Brew Flora - Lavender",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787138689761-WhatsAppImage20251113at233021b33d20d8180x1801jpg.jpg"
      },
      {
        id: 13,
        name: "Brew Flora - Hibiscus Tea",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787137806392-WhatsAppImage20251113at233024f74fae34180x180jpg.jpg"
      },
      {
        id: 12,
        name: "Brew Flora - Blue Pea",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787158088419-bluepeabrewflorajpg.jpg"
      }
    ],
    images: [
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787156882780-brewfloraavarampoojpg.jpg",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787141815115-WhatsAppImage20251113at2330215f60b43f180x180jpg.jpg",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787138689761-WhatsAppImage20251113at233021b33d20d8180x1801jpg.jpg",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787137806392-WhatsAppImage20251113at233024f74fae34180x180jpg.jpg",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787158088419-bluepeabrewflorajpg.jpg"
    ]
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

// =======================================================
// DESKTOP CATEGORY CARD (Expanding Flex Accordion Item)
// =======================================================
const DesktopCategoryCard = ({
  cat,
  index,
  isHovered,
  onHover,
  onClick
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const products = cat.products || [];
  const images = (cat.images && cat.images.length > 0) ? cat.images : (cat.img ? [cat.img] : [cat.fallback]);
  
  const safeIdx = images.length > 0 ? (activeImageIdx % images.length) : 0;
  const currentImg = images[safeIdx] || cat.fallback;
  const currentProduct = products[safeIdx] || null;

  // Auto-cycle products whenever the box is active / hovered
  useEffect(() => {
    if (!isHovered || images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered, images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      onMouseEnter={onHover}
      onClick={onClick}
      style={{ flex: isHovered ? 5 : 1 }}
      className="relative h-full rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-[650ms] ease-[cubic-bezier(0.25,1,0.5,1)] bg-white"
    >
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-500 z-30"
        style={{
          background: isHovered ? cat.accent : `${cat.accent}55`,
          boxShadow: isHovered ? `0 0 16px ${cat.accent}55` : 'none'
        }}
      />

      {/* ========================================================
          EXPANDED STATE (isHovered): Clean Two-Column Showcase
          Left: Category Details / Badges / CTA
          Right: Full Product Jar/Box on Pure White Background
          ======================================================== */}
      {isHovered ? (
        <div className="relative w-full h-full flex flex-row items-center justify-between p-6 lg:p-8 gap-6 z-10 bg-white">
          
          {/* Left Column: Category details & Shop Now */}
          <div className="flex-1 flex flex-col justify-between h-full max-w-[44%] py-1">
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                <span
                  className="rounded-full px-3 py-1 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs"
                  style={{ background: cat.accent }}
                >
                  {cat.badge}
                </span>
                <span className="bg-gray-100 border border-gray-200 text-gray-700 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-xs">
                  {products.length || cat.productCount} Products
                </span>
              </div>

              {/* Subtitle */}
              <span
                className="text-[11px] font-black tracking-[0.2em] uppercase mb-1.5 block"
                style={{ color: cat.textAccent || cat.accent }}
              >
                {cat.subtitle}
              </span>

              {/* Category Title */}
              <h3 className="font-black text-2xl lg:text-4xl text-gray-900 tracking-tight leading-tight mb-2">
                {cat.title}
              </h3>

              {/* Temptation Quote */}
              {cat.temptationQuote && (
                <p className="text-gray-600 text-xs lg:text-[13px] font-semibold leading-relaxed mb-3 italic">
                  "{cat.temptationQuote}"
                </p>
              )}

              {/* Live Active Product Name Tag */}
              {currentProduct && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gray-50 border border-gray-200 shadow-xs text-gray-800 max-w-full">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
                    style={{ background: cat.accent }}
                  />
                  <span className="truncate">{currentProduct.name}</span>
                </div>
              )}
            </div>

            {/* Shop Now Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="inline-flex items-center gap-2 text-white font-bold text-xs lg:text-sm px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                style={{ background: cat.accent }}
              >
                Shop Now <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Right Column: Full Product Box Showcase on White */}
          <div className="flex-1 flex flex-col items-center justify-between h-full max-w-[56%] relative py-1">
            {/* Product Stage with Chevrons */}
            <div className="relative w-full flex-1 flex items-center justify-center min-h-[200px] max-h-[250px] bg-white">
              {/* Previous Arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
                  }}
                  className="absolute left-0 z-30 w-8 h-8 rounded-full bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 flex items-center justify-center transition-all hover:scale-110 shadow-md border border-gray-200 cursor-pointer"
                  aria-label="Previous product"
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
              )}

              {/* THE FULL PRODUCT VIEW - OBJECT-CONTAIN - 100% UNTOUCHED, UNZOOMED, COMPLETE JAR/BOX */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${cat.title}-${safeIdx}-${currentImg}`}
                  src={resolveImage(currentImg)}
                  alt={currentProduct?.name || cat.title}
                  initial={{ opacity: 0.3, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.1, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="max-h-[200px] lg:max-h-[235px] max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] pointer-events-none z-10"
                  onError={(e) => { e.target.src = cat.fallback; }}
                />
              </AnimatePresence>

              {/* Special Character mascot interacting with the product */}
              {cat.characterImg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="absolute bottom-1 right-2 lg:right-3 z-20 flex flex-col items-center pointer-events-none drop-shadow-md"
                >
                  <span
                    className="mb-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border shadow-sm"
                    style={{ borderColor: `${cat.accent}55`, color: cat.textAccent || cat.accent }}
                  >
                    {cat.characterTag || "Tempting!"}
                  </span>
                  <div className="relative flex items-center justify-center">
                    <motion.img
                      animate={cat.characterAnim || { y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: cat.characterAnimDuration || 2.2, ease: "easeInOut" }}
                      src={cat.characterImg}
                      alt={cat.characterAlt || "Paidhu character"}
                      className="w-16 h-16 lg:w-19 lg:h-19 object-contain"
                    />
                    {cat.actionIcon && (
                      <motion.span
                        animate={cat.actionIconAnim || { y: [-2, -16], opacity: [0, 1, 0], scale: [0.6, 1.1, 0.7] }}
                        transition={{ repeat: Infinity, duration: cat.actionIconDuration || 1.8, ease: "easeOut" }}
                        className="absolute -top-1 -right-1 text-xs select-none pointer-events-none"
                      >
                        {cat.actionIcon}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Next Arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((prev) => (prev + 1) % images.length);
                  }}
                  className="absolute right-0 z-30 w-8 h-8 rounded-full bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 flex items-center justify-center transition-all hover:scale-110 shadow-md border border-gray-200 cursor-pointer"
                  aria-label="Next product"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Thumbnails Showcase Strip */}
            {products.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1.5 px-3 max-w-full pointer-events-auto scrollbar-none bg-gray-50/90 rounded-2xl border border-gray-200 shadow-xs mt-1">
                {products.map((p, pIdx) => {
                  const isThumbActive = safeIdx === pIdx;
                  return (
                    <button
                      key={p.id || pIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx(pIdx);
                      }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx(pIdx);
                      }}
                      title={p.name}
                      className={`relative w-9 h-9 lg:w-10 lg:h-10 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-white cursor-pointer ${
                        isThumbActive
                          ? 'scale-110 shadow-md ring-2'
                          : 'border-gray-200 opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{
                        borderColor: isThumbActive ? cat.accent : undefined,
                        '--tw-ring-color': isThumbActive ? `${cat.accent}55` : undefined
                      }}
                    >
                      <img
                        src={resolveImage(p.image) || cat.fallback}
                        alt={p.name}
                        className="w-full h-full object-contain p-0.5"
                        onError={(e) => { e.target.src = cat.fallback; }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================
            COLLAPSED STATE (!isHovered): Clean White Narrow Strip
            Showcases ONLY the Animated Character Mascot (No Packaging Image)
            ======================================================== */
        <div className="relative w-full h-full flex flex-col justify-between items-center py-5 px-1.5 bg-white overflow-hidden group">
          {/* Top category mini indicator dot */}
          <div className="w-full flex justify-center pt-0.5">
            <span
              className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-150 shadow-xs"
              style={{ background: cat.accent }}
            />
          </div>

          {/* Animated Mascot Stage - ONLY character mascot shown */}
          <div className="flex-1 flex flex-col items-center justify-center w-full relative my-1 px-1">
            <div className="relative w-full flex items-center justify-center min-h-[130px] lg:min-h-[150px]">
              {cat.characterImg && (
                <motion.div
                  animate={cat.characterAnim || { y: [0, -6, 0], rotate: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: cat.characterAnimDuration || 2.2, ease: "easeInOut" }}
                  whileHover={{ scale: 1.18 }}
                  className="relative flex items-center justify-center cursor-pointer drop-shadow-md"
                >
                  <img
                    src={cat.characterImg}
                    alt={cat.characterAlt || cat.title}
                    className="max-h-[115px] lg:max-h-[135px] max-w-full object-contain transition-transform duration-300 pointer-events-none"
                  />

                  {/* Action Micro-Effect (eating crumbs, jam swirl, tea steam, etc.) */}
                  {cat.actionIcon && (
                    <motion.span
                      animate={cat.actionIconAnim || { y: [-2, -18], opacity: [0, 1, 0], scale: [0.6, 1.1, 0.7] }}
                      transition={{ repeat: Infinity, duration: cat.actionIconDuration || 1.8, ease: "easeOut" }}
                      className="absolute top-0 right-0 text-xs select-none pointer-events-none filter drop-shadow-xs"
                    >
                      {cat.actionIcon}
                    </motion.span>
                  )}
                </motion.div>
              )}
            </div>

            {/* Action Tag Badge */}
            <span
              className="mt-2 text-[8px] lg:text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-xs transition-transform duration-200 group-hover:scale-105 text-center whitespace-nowrap inline-flex items-center gap-1"
              style={{
                color: cat.textAccent || cat.accent,
                borderColor: `${cat.accent}40`,
                background: `${cat.accent}14`
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-ping inline-block" style={{ background: cat.accent }} />
              {cat.characterTag}
            </span>
          </div>

          {/* Vertical Title */}
          <h3
            className="font-black tracking-[0.22em] uppercase text-[11px] lg:text-xs whitespace-nowrap text-gray-800 pb-1.5 transition-colors duration-300 group-hover:text-[#662654]"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {cat.title}
          </h3>
        </div>
      )}
    </motion.div>
  );
};

// =======================================================
// MOBILE CATEGORY CARD (Asymmetrical Bento Box Grid)
// =======================================================
const MobileCategoryCard = ({
  cat,
  index,
  onClick
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const products = cat.products || [];
  const images = (cat.images && cat.images.length > 0) ? cat.images : (cat.img ? [cat.img] : [cat.fallback]);
  
  const safeIdx = images.length > 0 ? (activeImageIdx % images.length) : 0;
  const currentImg = images[safeIdx] || cat.fallback;
  const currentProduct = products[safeIdx] || null;

  // Staggered auto-cycle for mobile cards
  useEffect(() => {
    if (images.length <= 1) return;
    const delay = 3200 + index * 450;
    const timer = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % images.length);
    }, delay);
    return () => clearInterval(timer);
  }, [images.length, index]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: "easeOut" }}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md border border-gray-100 transition-all duration-500 bg-white ${getMobileGridClasses(index)}`}
    >
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-20"
        style={{ background: cat.accent }}
      />

      {/* Main product image - object-contain - inside the white box! */}
      <div className="absolute inset-0 flex items-center justify-center p-3 pb-12 bg-white">
        <AnimatePresence mode="wait">
          <motion.img
            key={`${cat.title}-${safeIdx}`}
            src={resolveImage(currentImg)}
            alt={currentProduct?.name || cat.title}
            width={300}
            height={300}
            loading="lazy"
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.35 }}
            className="max-h-full max-w-full object-contain filter drop-shadow-sm"
            onError={(e) => { e.target.src = cat.fallback; }}
          />
        </AnimatePresence>

        {/* Special Character mascot for mobile with action animation */}
        {cat.characterImg && (
          <motion.div
            animate={cat.characterAnim || { y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: cat.characterAnimDuration || 2.2, ease: "easeInOut" }}
            className="absolute -bottom-1 -right-1 z-20 pointer-events-none drop-shadow-md flex items-center justify-center"
          >
            <img
              src={cat.characterImg}
              alt=""
              className="w-11 h-11 object-contain"
            />
            {cat.actionIcon && (
              <motion.span
                animate={cat.actionIconAnim || { y: [-2, -14], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: cat.actionIconDuration || 1.8, ease: "easeOut" }}
                className="absolute -top-1 -right-1 text-[10px] select-none pointer-events-none"
              >
                {cat.actionIcon}
              </motion.span>
            )}
          </motion.div>
        )}
      </div>

      {/* Gradient overlay for bottom text */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 45%, transparent 80%)` }}
      />

      {/* Top Header: Badge & Slide Dots */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
        <div
          className="rounded-full px-2 py-0.5 shadow-xs"
          style={{ background: cat.accent }}
        >
          <span className="text-white text-[9px] font-bold tracking-wider uppercase">{cat.badge}</span>
        </div>
        {images.length > 1 && (
          <div className="flex items-center gap-1 bg-black/10 backdrop-blur-xs px-1.5 py-0.5 rounded-full">
            {images.map((_, dIdx) => (
              <span
                key={dIdx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  safeIdx === dIdx ? 'w-2.5 bg-gray-800' : 'w-1 bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Information */}
      <div className="absolute inset-0 p-3 flex flex-col justify-end z-10 pointer-events-none">
        <span
          className="text-[9px] font-black tracking-widest uppercase mb-0.5 block"
          style={{ color: cat.textAccent || cat.accent }}
        >
          {cat.subtitle}
        </span>
        <h3 className="font-black text-[15px] leading-tight text-gray-900 tracking-tight">
          {cat.title}
        </h3>
        {currentProduct && (
          <span className="text-gray-700 text-[10px] font-bold truncate mt-0.5">
            ✦ {currentProduct.name}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// =======================================================
// MAIN EXPLORE CATEGORY COMPONENT
// =======================================================
const ExploreCategory = () => {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const navigate = useNavigate();
  const [categories, setCategories] = useState(() => {
    if (countsCache.current) return countsCache.current;
    return CATEGORY_CONFIG.map((c) => ({
      ...c,
      img: c.img || c.fallback,
      loading: false
    }));
  });

  const handleCategoryClick = (cat) => {
    navigate(`/shop/shop-by-category?category=${encodeURIComponent(cat.title)}`);
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchCategoryProducts = async () => {
      try {
        const updated = await Promise.all(
          CATEGORY_CONFIG.map(async (cat) => {
            try {
              // Fetch up to 20 products per category to get all product images
              const res = await fetch(
                `${API_BASE}/api/products?category=${encodeURIComponent(cat.title)}&limit=20`
              );
              const data = await res.json();

              const fetchedProducts = (data.products && data.products.length > 0)
                ? data.products.map((p) => ({
                    id: p.id,
                    name: p.name,
                    image: p.image,
                    price: p.price
                  }))
                : cat.products || [];

              const productImages = fetchedProducts.map((p) => p.image).filter(Boolean);
              const allImages = (cat.title === 'Bloom Cookies')
                ? ['/white_lotus_cookies_new.png', ...productImages.filter(img => img !== '/white_lotus_cookies_new.png')]
                : (productImages.length > 0 ? productImages : (cat.images || [cat.img || cat.fallback]));

              return {
                ...cat,
                products: fetchedProducts,
                images: allImages,
                img: allImages[0] || cat.fallback,
                loading: false,
                productCount: data.total || fetchedProducts.length || cat.productCount || 0
              };
            } catch (e) {
              return {
                ...cat,
                loading: false
              };
            }
          })
        );
        
        countsCache.current = updated;
        if (isMounted) {
          setCategories(updated);
        }
      } catch (err) {
        console.error("Error fetching category products:", err);
      }
    };

    fetchCategoryProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-[#fcfbfa] pt-4 pb-4 md:pt-6 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-6 md:mb-8">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[#662654] font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mb-3 px-4 py-1.5 bg-[#662654]/10 rounded-full inline-flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles size={11} /> Pure Floral Indulgence
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-[#111] tracking-tight mb-3"
          >
            Explore Our <span className="text-[#662654]">Tempting Creations</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 font-medium text-base md:text-lg max-w-2xl leading-relaxed"
          >
            Mouth-watering crunchy cookies, velvety petal spreads, royal golden saffron, and soul-soothing aromatic brews — crafted to tempt every craving!
          </motion.p>
        </div>

        {/* =========================================
            MOBILE VIEW: Asymmetrical Bento Box Grid
            ========================================= */}
        <div className="grid md:hidden grid-cols-2 auto-rows-[150px] gap-3">
          {categories.map((cat, index) => (
            <MobileCategoryCard
              key={`mobile-${cat.title}-${index}`}
              cat={cat}
              index={index}
              onClick={() => handleCategoryClick(cat)}
            />
          ))}
        </div>

        {/* =========================================
            DESKTOP VIEW: Expanding Flex Accordion
            ========================================= */}
        <div className="hidden md:flex w-full h-[340px] lg:h-[380px] gap-2.5 lg:gap-3">
          {categories.map((cat, index) => (
            <DesktopCategoryCard
              key={`desktop-${cat.title}-${index}`}
              cat={cat}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onClick={() => handleCategoryClick(cat)}
            />
          ))}
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
            className="flex items-center gap-1.5 bg-[#ede7d7] shadow-sm rounded-full pl-6 pr-4 py-3 hover:bg-[#e4dcc8] transition-colors group w-full md:w-auto justify-center cursor-pointer"
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
