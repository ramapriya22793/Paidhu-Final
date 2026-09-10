import { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://paidhu-final-anm2.vercel.app');

// Categories in the specified order with accent colors, verified fallback images & product lists
const CATEGORY_CONFIG = [
  {
    title: "Bloom Cookies",
    subtitle: "Wholesome Edible Flower Bakes",
    accent: "#c8843a",
    textAccent: "#9a5d1a",
    badge: "100% Real Flowers & Jaggery",
    characterImg: "/illustrations PNG-06 (1).png",
    characterAlt: "Lotus mascot enjoying crunchy cookie",
    characterAnim: {
      y: [0, 5, 5, -8, -6, 3, -4, 0],
      rotate: [0, -6, -6, 5, 2, -3, 3, 0],
      scale: [1, 0.95, 0.95, 1.08, 1.02, 1.06, 1.01, 1]
    },
    characterAnimDuration: 2.2,
    actionIcon: "🍪",
    actionIconAnim: { y: [2, -18], x: [0, 6], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.7] },
    actionIconDuration: 1.6,
    temptationQuote: "Delightful, crunchy floral cookies baked with real petals (Lotus, Hibiscus, Aavaram), pearl millet, and pure country jaggery with zero refined sugar or maida.",
    bgClass: "from-[#fffdfa] via-[#fcf6ee] to-[#f8ede0]",
    borderClass: "border-[#eaddcb]",
    img: "/white_lotus_cookies_new.png",
    fallback: "/white_lotus_cookies_new.png",
    productCount: 3,
    products: [
      {
        id: 8,
        name: "Bloom Cookies - White Lotus",
        image: "/white_lotus_cookies_new.png",
        shortDescription: "Bloom Cookies White Lotus are a delicate and soothing snack crafted for those who appreciate subtle floral flavors combined with a soft, melt-in-the-mouth texture.",
        description: "Bloom Cookies White Lotus are a delicate and soothing snack crafted for those who appreciate subtle floral flavors combined with a soft and melt-in-the-mouth texture. Infused with natural white lotus petals, pearl millet, and country jaggery."
      },
      {
        id: 10,
        name: "Bloom Cookies - Hibiscus",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787744799967-paidhuhibiscus001png.png",
        shortDescription: "Bloom Cookies Hibiscus are a delightful and refreshing snack crafted for those who appreciate unique flavors combined with a perfect crunchy texture.",
        description: "Bloom Cookies Hibiscus are the perfect combination of taste, quality, and uniqueness. With their natural hibiscus flavor, crispy texture, and balanced sweetness."
      },
      {
        id: 9,
        name: "Bloom Cookies - Aavaram Poo",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787745086149-paidhuaavaram001png.png",
        shortDescription: "Aavaram Poo Bloom Cookies are a delightful and traditional snack crafted for those who appreciate authentic flavors combined with a perfect crunchy texture.",
        description: "Aavaram Poo Bloom Cookies are the perfect combination of tradition, taste, and quality. Infused with natural Aavaram Poo (Senna auriculata) for a unique herbal taste."
      }
    ],
    images: [
      "/white_lotus_cookies_new.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787744799967-paidhuhibiscus001png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787745086149-paidhuaavaram001png.png"
    ]
  },
  {
    title: "Saffron",
    subtitle: "Certified Grade-A1 Saffron Strands",
    accent: "#d4821a",
    textAccent: "#b5690b",
    badge: "100% Pure Kashmiri Mongra",
    characterImg: "/saffron_character.png",
    characterAlt: "Saffron flower with authentic vibrant crimson threads",
    characterAnim: {
      y: [0, -12, 0],
      rotate: [-3, 3, -3],
      scale: [1, 1.1, 0.98, 1]
    },
    characterAnimDuration: 2.8,
    actionIcon: "✨",
    actionIconAnim: { y: [2, -22], opacity: [0, 1, 0], scale: [0.4, 1.3, 0.8] },
    actionIconDuration: 2.0,
    temptationQuote: "Prized Kashmiri Mongra and Super Negin saffron hand-harvested for deep crimson threads, exceptional potency, and rich aroma.",
    bgClass: "from-[#fffdfa] via-[#fef7eb] to-[#faeedb]",
    borderClass: "border-[#f0dbc0]",
    img: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787745899482-paidhukashmirimongrapng.png",
    fallback: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787745899482-paidhukashmirimongrapng.png",
    productCount: 3,
    products: [
      {
        id: 20,
        name: "Kashmiri Mongra",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787745899482-paidhukashmirimongrapng.png",
        shortDescription: "Experience the essence of Kashmir with our prized Kashmiri Mongra saffron, renowned for its deep red threads, distinct flavor, and unparalleled fragrance."
      },
      {
        id: 22,
        name: "Super Negin Saffron",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746786285-saffronsuperneigin001png.png",
        shortDescription: "Indulge in the ultimate luxury with our Super Neigin saffron, known for its exquisite golden strands, exceptional potency, and rich aromatic profile."
      },
      {
        id: 21,
        name: "Saffron Powder",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787747041682-saffronpowder002png.png",
        shortDescription: "Premium saffron powder from Paidhu is carefully sourced to ensure purity and superior quality. Known for its rich aroma and vibrant color."
      }
    ],
    images: [
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787745899482-paidhukashmirimongrapng.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746786285-saffronsuperneigin001png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787747041682-saffronpowder002png.png"
    ]
  },
  {
    title: "Petal Jam",
    subtitle: "Handcrafted Floral Gulkhand & Jams",
    accent: "#c45c7c",
    textAccent: "#a63f61",
    badge: "Pure Petal Preserves",
    characterImg: "/illustrations PNG-05 (1).png",
    characterAlt: "Lotus chef stirring sweet petal jam",
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
    temptationQuote: "Artisanal flower petal jams and traditional gulkhand slow-simmered from fresh Damask rose, aavaram, and hibiscus petals to retain delicate floral essence and natural wellness.",
    bgClass: "from-[#fffcfd] via-[#fef2f6] to-[#fae5ed]",
    borderClass: "border-[#f2d4e0]",
    img: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746427907-WhatsAppImage20260806at1138202jpeg.jpeg",
    fallback: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746427907-WhatsAppImage20260806at1138202jpeg.jpeg",
    productCount: 5,
    products: [
      {
        id: 29,
        name: "Tanner's Jam",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746427907-WhatsAppImage20260806at1138202jpeg.jpeg",
        shortDescription: "Made from the vibrant blossoms of the Avaram Poo (Cassia Auriculata) flower, this jam captures the delicate floral essence and natural goodness of this traditionally cherished medicinal flower."
      },
      {
        id: 28,
        name: "Rose Gulkhand Jam",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787746603306-rosegulkhand001png.png",
        shortDescription: "Discover the sweet floral taste of Rose Gulkhand Jam, made from handpicked Damask rose petals. A natural, digestive-friendly spread with traditional Ayurvedic benefits."
      },
      {
        id: 6,
        name: "Sinensis Syrup – Petal Jam",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787747332571-synensissyrup001png.png",
        shortDescription: "Sinensis Petal Jam is a premium artisanal floral preserve made from hand-picked fresh edible petals, carefully crafted to deliver both rich taste and natural wellness benefits."
      },
      {
        id: 4,
        name: "Hibiscus Petal Jam",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787747607795-hibiscuspetaljam001png.png",
        shortDescription: "Hibiscus Petal Jam is a natural antioxidant-rich herbal jam made from fresh hibiscus flowers. It helps support heart health, digestion, and overall wellness with every spoon."
      },
      {
        id: 3,
        name: "Neem Petal Jam",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787748641468-neemjam001png.png",
        shortDescription: "Buy Neem Petal Jam made from natural neem flowers. Supports digestion, detox, and overall wellness. 100% natural, chemical-free herbal jam from Paidhu."
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
    title: "Brew Flora",
    subtitle: "Sun-Dried Whole Blossom Teas",
    accent: "#7b5ea7",
    textAccent: "#684b93",
    badge: "100% Whole Dried Flowers",
    characterImg: "/brew_flora_character.png",
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
    temptationQuote: "Intact sun-dried whole edible flowers (Aavaram, Chamomile, Lavender, Blue Pea, Hibiscus) crafted to bring calmness, relaxation, and gentle wellness.",
    bgClass: "from-[#fcfaff] via-[#f7f1fc] to-[#eee2f7]",
    borderClass: "border-[#e0d2f2]",
    img: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787156882780-brewfloraavarampoojpg.jpg",
    fallback: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787156882780-brewfloraavarampoojpg.jpg",
    productCount: 5,
    products: [
      {
        id: 44,
        name: "Brew Flora - Aavaram Poo",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787156882780-brewfloraavarampoojpg.jpg",
        shortDescription: "Brew Flora Aavaram Poo (30g) is a premium-quality herbal product made from carefully selected and naturally dried Aavaram flowers for overall wellness and skin glow."
      },
      {
        id: 15,
        name: "Brew Flora - Chamomile",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787141815115-WhatsAppImage20251113at2330215f60b43f180x180jpg.jpg",
        shortDescription: "Sip serenity with Chamomile Tea, crafted from pure dried chamomile flowers. Naturally caffeine-free, it helps promote deep sleep, reduce stress, and calm the digestive system."
      },
      {
        id: 14,
        name: "Brew Flora - Lavender",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787138689761-WhatsAppImage20251113at233021b33d20d8180x1801jpg.jpg",
        shortDescription: "Crafted with calmness. Inspired by nature. Premium floral herbal blend carefully crafted to bring relaxation and elegance into your routine."
      },
      {
        id: 13,
        name: "Brew Flora - Hibiscus Tea",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787137806392-WhatsAppImage20251113at233024f74fae34180x180jpg.jpg",
        shortDescription: "Brew the vibrant taste of Indian Hibiscus Tea — a tart, refreshing floral infusion known for its deep red hue and high vitamin C content."
      },
      {
        id: 12,
        name: "Brew Flora - Blue Pea",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787158088419-bluepeabrewflorajpg.jpg",
        shortDescription: "Dive into calm with Bluepea Tea, also known as Shankhpushpi or Aparajita tea. Rich in anthocyanins that improve focus and relieve stress."
      }
    ],
    images: [
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787156882780-brewfloraavarampoojpg.jpg",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787141815115-WhatsAppImage20251113at2330215f60b43f180x180jpg.jpg",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787138689761-WhatsAppImage20251113at233021b33d20d8180x1801jpg.jpg",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787137806392-WhatsAppImage20251113at233024f74fae34180x180jpg.jpg",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787158088419-bluepeabrewflorajpg.jpg"
    ]
  },
  {
    title: "Medley Teas",
    subtitle: "Whole Flower Infusion Dip Teas",
    accent: "#4a7c59",
    textAccent: "#386847",
    badge: "Herbal Floral Dip Bags",
    characterImg: "/medley_tea_character.png",
    characterAlt: "Hibiscus mascot dipping tea pouch into a cup",
    characterAnim: {
      y: [0, 8, 9, -8, -7, 8, 9, 0],
      rotate: [0, 4, 3, -3, -2, 4, 3, 0],
      scale: [1, 0.97, 0.97, 1.04, 1.04, 0.97, 0.97, 1]
    },
    characterAnimDuration: 2.4,
    actionIcon: "♨️",
    actionIconAnim: { y: [4, -20], x: [2, -4], opacity: [0, 1, 0], scale: [0.6, 1.2, 0.8] },
    actionIconDuration: 1.8,
    temptationQuote: "Whole flower herbal tea infusions blending butterfly pea, hibiscus, pure saffron, and lavender for calming, antioxidant-rich hydration.",
    bgClass: "from-[#fafffc] via-[#f3f9f5] to-[#e6f2e9]",
    borderClass: "border-[#d2e7d7]",
    img: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751567516-medleyteahibiscus005png.png",
    fallback: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751567516-medleyteahibiscus005png.png",
    productCount: 5,
    products: [
      {
        id: 45,
        name: "Medley Teas - Hibiscus",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751567516-medleyteahibiscus005png.png",
        shortDescription: "Medly Teas – Hibiscus is a premium herbal tea made from carefully selected and naturally dried hibiscus flowers."
      },
      {
        id: 31,
        name: "Cassia Fistula Medley Tea",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787752669123-cassiafistulamedleyteaspng.png",
        shortDescription: "A premium herbal tea blend made with Cassia Fistula and carefully selected natural herbs. Rich in antioxidants and crafted to support everyday wellness."
      },
      {
        id: 19,
        name: "Medley Teas - Blue Pea",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787750755658-medleyteasbluepea001png.png",
        shortDescription: "Enjoy Bluetea Infusion — a pure butterfly pea flower drink that transforms your hydration routine with calming wellness."
      },
      {
        id: 18,
        name: "Medley Teas - Saffron",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751146063-medleyteassaffron003png.png",
        shortDescription: "Medly Saffron Tea is a premium herbal infusion crafted from high-quality tea leaves and pure saffron strands for daily relaxation."
      },
      {
        id: 17,
        name: "Medley Teas - Lavender",
        image: "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787752213835-medleyteaslavender007png.png",
        shortDescription: "Soothe your senses with Lavender Infusion — a fragrant herbal beverage that restores calm and balance with delicate floral notes."
      }
    ],
    images: [
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751567516-medleyteahibiscus005png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787752669123-cassiafistulamedleyteaspng.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787750755658-medleyteasbluepea001png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787751146063-medleyteassaffron003png.png",
      "https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/products/1787752213835-medleyteaslavender007png.png"
    ]
  }
];



// Resolve the full image URL from backend
const resolveImage = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
};

const countsCache = { current: null };

// Derive a clean, punchy excerpt directly from the admin-entered product description
export const deriveProductExcerpt = (product, fallback = '') => {
  if (!product) return fallback;
  const raw = product.shortDescription || product.description || '';
  if (!raw || !raw.trim()) return fallback;

  // Strip HTML tags & decode common HTML entities
  let text = raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—');

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const normName = (product.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  let meaningful = lines.find((l) => {
    const normLine = l.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normLine === normName) return false;
    if (l.includes('| Paidhu')) return false;
    if (l.match(/^(5 Benefits|Ingredients|Taste of|Why Choose|Conclusion)/i)) return false;
    if (l.includes('–') && normLine.startsWith(normName) && l.length < 75) return false;
    if (l.length < 25) return false;
    return true;
  });

  if (!meaningful && lines.length > 0) {
    meaningful = lines.find((l) => !l.includes('| Paidhu') && l.length > 20) || lines[0];
  }

  if (!meaningful) return fallback;

  meaningful = meaningful.replace(/\s+/g, ' ').trim();

  // Try extracting the first complete sentence (or two short sentences)
  const sentences = meaningful.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length > 0) {
    let result = '';
    for (const s of sentences) {
      const trimmed = s.trim();
      if (!result) {
        if (trimmed.length <= 190) {
          result = trimmed;
        } else {
          const cut = trimmed.substring(0, 160);
          const lastSpace = cut.lastIndexOf(' ');
          result = (lastSpace > 90 ? cut.substring(0, lastSpace) : cut).trim() + '...';
        }
      } else if ((result + ' ' + trimmed).length <= 180) {
        result = (result + ' ' + trimmed).trim();
      } else {
        break;
      }
    }
    if (result && result.length >= 25) {
      return result;
    }
  }

  // Fallback to word-boundary truncation
  if (meaningful.length > 165) {
    const cut = meaningful.substring(0, 160);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 90 ? cut.substring(0, lastSpace) : cut).trim() + '...';
  }

  return meaningful;
};

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
  const activeProductDescription = deriveProductExcerpt(currentProduct, cat.temptationQuote);

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
          <div className="flex-1 flex flex-col justify-between h-full max-w-[44%] py-2">
            <div>
              {/* Category Title */}
              <h3 className="font-black text-2xl lg:text-4xl text-gray-900 tracking-tight leading-tight mb-3">
                {cat.title}
              </h3>

              {/* Product description derived dynamically from admin */}
              {activeProductDescription && (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentProduct?.id || `${cat.title}-${safeIdx}`}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="text-gray-600 text-xs lg:text-[13px] font-medium leading-relaxed mb-3 line-clamp-3 italic min-h-[46px]"
                  >
                    "{activeProductDescription}"
                  </motion.p>
                </AnimatePresence>
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
// MOBILE CATEGORY CARD (Balanced Clean Grid Card)
// =======================================================
const MobileCategoryCard = ({
  cat,
  index,
  onClick
}) => {
  const isFeatured = index === 0;
  const heroImage = cat.img || cat.fallback;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      whileTap={{ scale: 0.98 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-xs hover:shadow-md border border-gray-100 transition-all duration-300 bg-white ${
        isFeatured ? 'col-span-2' : 'col-span-1'
      }`}
    >
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-20"
        style={{ background: cat.accent }}
      />

      {isFeatured ? (
        /* Top Featured Card (Bloom Cookies) — Balanced Horizontal Layout */
        <div className="relative w-full min-h-[160px] flex flex-row items-center justify-between p-4 bg-white">
          {/* Left Details */}
          <div className="flex-1 flex flex-col justify-between h-full max-w-[58%] z-10 py-0.5">
            <div>
              <span
                className="text-[9.5px] font-extrabold uppercase tracking-wider block mb-1"
                style={{ color: cat.textAccent || cat.accent }}
              >
                {cat.subtitle}
              </span>
              <h3 className="font-black text-xl text-gray-900 tracking-tight leading-tight mb-1.5">
                {cat.title}
              </h3>
              <p className="text-gray-500 text-[11px] font-medium line-clamp-2 leading-relaxed">
                {cat.temptationQuote}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[12px] font-black text-[#662654] pt-2">
              <span>Shop Collection</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </div>
          </div>

          {/* Right Hero Image Stage & Mascot */}
          <div className="flex-1 flex items-center justify-center h-full relative pl-2">
            <img
              src={resolveImage(heroImage)}
              alt={cat.title}
              width={220}
              height={140}
              loading="lazy"
              className="max-h-[120px] max-w-full object-contain filter drop-shadow-md z-10"
              onError={(e) => { e.target.src = cat.fallback; }}
            />

            {/* Mascot */}
            {cat.characterImg && (
              <motion.div
                animate={cat.characterAnim || { y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: cat.characterAnimDuration || 2.2, ease: "easeInOut" }}
                className="absolute -bottom-1 -right-1 z-20 pointer-events-none drop-shadow-sm flex items-center justify-center"
              >
                <img
                  src={cat.characterImg}
                  alt=""
                  className="w-11 h-11 object-contain"
                />
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        /* Regular Cards (Saffron, Petal Jam, Brew Flora, Medley Teas) — Vertical Symmetrical Card */
        <div className="relative w-full h-[215px] flex flex-col justify-between p-3.5 bg-white">
          {/* Top Category Label */}
          <div className="flex items-center justify-between z-10">
            <span
              className="text-[9px] font-extrabold uppercase tracking-wider truncate"
              style={{ color: cat.textAccent || cat.accent }}
            >
              {cat.subtitle}
            </span>
          </div>

          {/* Clean Central Hero Image Stage */}
          <div className="relative w-full flex-1 flex items-center justify-center min-h-[115px] max-h-[130px] my-1">
            <img
              src={resolveImage(heroImage)}
              alt={cat.title}
              width={160}
              height={130}
              loading="lazy"
              className="max-h-[115px] max-w-full object-contain filter drop-shadow-md z-10 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.target.src = cat.fallback; }}
            />

            {/* Mascot in bottom-right corner of image stage */}
            {cat.characterImg && (
              <motion.div
                animate={cat.characterAnim || { y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: cat.characterAnimDuration || 2.2, ease: "easeInOut" }}
                className="absolute -bottom-1 -right-1 z-20 pointer-events-none drop-shadow-sm flex items-center justify-center"
              >
                <img
                  src={cat.characterImg}
                  alt=""
                  className="w-9 h-9 object-contain"
                />
              </motion.div>
            )}
          </div>

          {/* Bottom Title & Action */}
          <div className="pt-2 border-t border-gray-100/80 flex items-center justify-between z-10">
            <h3 className="font-black text-[14px] text-gray-900 tracking-tight leading-tight truncate">
              {cat.title}
            </h3>
            <div className="flex items-center gap-0.5 text-[#662654] font-bold text-[11px] flex-shrink-0 ml-1">
              <span>View</span>
              <ArrowRight size={12} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      )}
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
                `${API_BASE}/api/products?category=${encodeURIComponent(cat.title)}&limit=20&_t=${Date.now()}`,
                { cache: 'no-store' }
              );
              const data = await res.json();

              const fetchedProducts = (data.products && data.products.length > 0)
                ? data.products.map((p) => ({
                    id: p.id,
                    name: p.name,
                    image: p.image,
                    price: p.price,
                    shortDescription: p.shortDescription || '',
                    description: p.description || ''
                  }))
                : cat.products || [];

              // Keep products and images in exact matching order
              let orderedProducts = fetchedProducts;
              if (cat.title === 'Bloom Cookies') {
                const whiteLotus = fetchedProducts.find(p => p.name.toLowerCase().includes('white lotus') || p.id === 8);
                if (whiteLotus) {
                  orderedProducts = [
                    { ...whiteLotus, image: whiteLotus.image || '/white_lotus_cookies_new.png' },
                    ...fetchedProducts.filter(p => p !== whiteLotus)
                  ];
                }
              } else if (cat.title === 'Saffron') {
                const getSaffronRank = (p) => {
                  const title = (p.name || p.title || '').toLowerCase();
                  if (p.id === 20 || /mongra|kashmiri/i.test(title)) return 1;
                  if (p.id === 22 || /negin|neigin/i.test(title)) return 2;
                  if (p.id === 21 || /powder/i.test(title)) return 3;
                  return 99;
                };
                orderedProducts = [...fetchedProducts].sort((a, b) => {
                  const rankA = getSaffronRank(a);
                  const rankB = getSaffronRank(b);
                  if (rankA !== 99 || rankB !== 99) {
                    if (rankA !== rankB) return rankA - rankB;
                  }
                  return (b.id || 0) - (a.id || 0);
                });
              }

              const productImages = orderedProducts.map((p) => p.image).filter(Boolean);
              const allImages = productImages.length > 0 ? productImages : (cat.images || [cat.img || cat.fallback]);

              return {
                ...cat,
                products: orderedProducts,
                images: allImages,
                img: cat.img || allImages[0] || cat.fallback,
                loading: false,
                productCount: data.total || orderedProducts.length || cat.productCount || 0
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
            Wholesome flower cookies, traditional petal jams, certified Kashmiri saffron, herbal dip teas, and sun-dried whole blossoms — curated for clean, natural wellness.
          </motion.p>
        </div>

        {/* =========================================
            MOBILE VIEW: Balanced Clean Grid
            ========================================= */}
        <div className="grid md:hidden grid-cols-2 gap-3 sm:gap-4">
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
