import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronRight, ChevronLeft, Check, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import fallbacks from './fallbacks.json';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const productsCache = {};

const categories = [
  "Bestsellers",
  "Super Value Packs",
  "New Launches",
  "Deals of the Day",
  "Traditional Snacks",
  "Cookies & Cakes",
  "Crunchy Snacks"
];

const resolveImage = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
};

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
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 100 }
  }
};

// ---------- COLLECTION PRODUCT CARD ----------
const CollectionProductCard = ({ product, activeCategory, addingId, setAddingId, isInWishlist, handleToggleWishlist }) => {
  const { addToCart } = useCart();
  const raw = product.raw || {};
  const variants = typeof raw.variants === 'string' 
    ? JSON.parse(raw.variants) 
    : (raw.variants || []);
  const hasVariants = Array.isArray(variants) && variants.length > 0;
  
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? variants[0] : null);

  const currentPrice = selectedVariant 
    ? (selectedVariant.offerPrice && selectedVariant.offerPrice !== '' ? Number(selectedVariant.offerPrice) : Number(selectedVariant.price))
    : product.discountedPrice;

  const originalPrice = selectedVariant 
    ? (selectedVariant.offerPrice && selectedVariant.offerPrice !== '' ? Number(selectedVariant.price) : null)
    : (product.originalPrice > product.discountedPrice ? product.originalPrice : null);

  const discountPercent = selectedVariant
    ? (selectedVariant.offerPrice && selectedVariant.offerPrice !== '' 
        ? Math.round(((Number(selectedVariant.price) - Number(selectedVariant.offerPrice)) / Number(selectedVariant.price)) * 100) 
        : null)
    : product.discountPercent;

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingId(product.id);
    addToCart({
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

    setTimeout(() => {
      setAddingId(null);
    }, 800);
  };

  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="w-full h-full bg-white rounded-2xl border border-gray-100 hover:shadow-[0_12px_30px_rgba(102,38,84,0.08)] transition-all duration-300 overflow-hidden flex flex-col group shadow-sm"
    >
      {/* Image Area */}
      <Link to={`/product/${product.id}`} state={{ product: product.raw }} className="block relative aspect-square bg-[#faf8f6] overflow-hidden flex items-center justify-center p-4">
        {product.badge && (
          <div className={`absolute top-0 left-0 z-10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${product.badgeColor} rounded-br-lg shadow-sm`}>
            {product.badge}
          </div>
        )}
        {/* Wishlist Button */}
        <motion.button
          onClick={(e) => handleToggleWishlist(e, product)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md transition-all duration-200 hover:bg-white"
        >
          <Heart
            size={14}
            className={isInWishlist(product.id) ? 'fill-[#662654] text-[#662654]' : 'text-gray-400'}
            strokeWidth={2}
          />
        </motion.button>
        <img 
          src={product.image} 
          alt={product.title} 
          width={280}
          height={280}
          loading="lazy"
          className="max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </Link>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <Link to={`/product/${product.id}`} state={{ product: product.raw }} className="block text-[14px] md:text-[15px] font-bold text-gray-800 hover:text-[#662654] leading-[1.3] mb-1.5 transition-colors duration-200 line-clamp-1">
          {product.title}
        </Link>

        {/* Description */}
        <p className="text-[12px] md:text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-4 min-h-[36px] md:min-h-[40px]">
          {product.description}
        </p>

        {/* Size Selector */}
        {hasVariants && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {variants.map((v, i) => {
              const isSelected = selectedVariant && selectedVariant.size === v.size;
              return (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariant(v);
                  }}
                  className={`text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#662654] text-white border-[#662654] shadow-sm'
                      : 'bg-[#faf9f7] text-[#662654] border-gray-200 hover:border-[#662654]/50'
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        )}

        {/* Price Section */}
        <div className="mt-auto flex items-center mb-4 flex-wrap gap-y-1">
          {originalPrice > currentPrice && (
            <span className="text-[11px] md:text-[12px] text-gray-400 line-through mr-1.5">
              ₹{originalPrice}
            </span>
          )}
          <span className="text-[14px] md:text-[15px] font-extrabold text-black mr-2">
            ₹{currentPrice}
          </span>
          {discountPercent > 0 && (
            <span className="text-[9px] md:text-[10px] font-bold text-[#166534] bg-[#dcfce7] px-1.5 py-0.5 rounded whitespace-nowrap">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button 
          onClick={handleAddToCartClick}
          disabled={addingId === product.id}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-[#662654] to-[#7f2d68] hover:from-[#7a2e64] hover:to-[#913b7e] disabled:from-emerald-600 disabled:to-teal-500 text-white rounded-full py-2.5 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider shadow-[0_4px_12px_rgba(102,38,84,0.12)] hover:shadow-[0_6px_20px_rgba(102,38,84,0.22)] transition-all duration-300 group/btn cursor-pointer"
        >
          {addingId === product.id ? (
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
      </div>
    </motion.div>
  );
};

const ProductCollection = () => {
  const [activeCategory, setActiveCategory] = useState("Bestsellers");
  const [products, setProducts] = useState(() => {
    return productsCache[activeCategory] || fallbacks[activeCategory] || [];
  });
  const [loading, setLoading] = useState(() => {
    const initialList = productsCache[activeCategory] || fallbacks[activeCategory] || [];
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

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingId(product.id);
    // Convert product UI format to backend/cart format
    addToCart({
      id: product.id,
      name: product.title,
      price: product.originalPrice,
      discountPrice: product.discountedPrice !== product.originalPrice ? product.discountedPrice : null,
      image: product.image,
      category: activeCategory,
      shortDescription: product.description
    }, 1);

    setTimeout(() => {
      setAddingId(null);
    }, 800);
  };

  useEffect(() => {
    let isMounted = true;
    
    const instantList = productsCache[activeCategory] || fallbacks[activeCategory] || [];
    setProducts(instantList);
    setLoading(instantList.length === 0);

    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams({ limit: '10' });
        if (activeCategory === "Bestsellers") {
          queryParams.set("tag", "bestseller");
        } else if (activeCategory === "Super Value Packs") {
          queryParams.set("tag", "family_combos");
        } else if (activeCategory === "New Launches") {
          queryParams.set("sort", "newest");
        } else if (activeCategory === "Deals of the Day") {
          queryParams.set("navSection", "deal-of-the-day");
        } else if (activeCategory === "Cookies & Cakes") {
          queryParams.set("category", "Bloom Cookies");
        } else {
          queryParams.set("category", activeCategory);
        }

        const res = await fetch(`${API_BASE}/api/products?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        
        let fetchedProducts = data.products || [];

        // If we have fewer than 5 products, backfill with general products to fill the 5-column grid row
        if (fetchedProducts.length < 5) {
          const backfillRes = await fetch(`${API_BASE}/api/products?limit=15`);
          if (backfillRes.ok) {
            const backfillData = await backfillRes.json();
            const backfillList = backfillData.products || [];
            for (const p of backfillList) {
              if (fetchedProducts.length >= 5) break;
              if (!fetchedProducts.some(fp => fp.id === p.id)) {
                fetchedProducts.push(p);
              }
            }
          }
        }

        // Map products to UI format
        const mappedProducts = fetchedProducts.map(p => {
          const originalPrice = p.price;
          const discountedPrice = p.discountPrice || p.price;
          const discountPercent = originalPrice > discountedPrice 
            ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) 
            : 0;

          let badge = "";
          let badgeColor = "";
          if (p.tags && p.tags.toLowerCase().includes("bestseller")) {
            badge = "Bestseller";
            badgeColor = "bg-[#fde047] text-black";
          } else if (discountPercent > 0) {
            badge = "Sale";
            badgeColor = "bg-[#662654] text-white";
          }

          const image = p.image || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imageUrl : null);
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
        });

        productsCache[activeCategory] = mappedProducts;

        if (isMounted) {
          setProducts(mappedProducts);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
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
    <section className="w-full bg-white pt-4 pb-2 md:pt-8 md:pb-4">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* Category Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-8 mb-6 border-b border-gray-100 items-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative whitespace-nowrap px-8 py-3 rounded-full text-[15px] font-extrabold tracking-wide transition-all duration-300 ${
                activeCategory === category 
                  ? 'text-white bg-[#662654] shadow-[0_6px_20px_rgba(102,38,84,0.4)] scale-105' 
                  : 'text-[#555] bg-transparent hover:text-[#662654] hover:bg-[#662654]/5 hover:shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:-translate-y-0.5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div 
          variants={gridVariants}
          initial="hidden"
          animate="show"
          key={activeCategory}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 pb-4"
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div 
                key={`skeleton-${idx}`} 
                className="w-full bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-sm animate-pulse"
              >
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
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500">
              <p className="text-base font-semibold">No products found in this category.</p>
            </div>
          ) : (
            products.slice(0, 5).map((product) => (
              <CollectionProductCard
                key={product.id}
                product={product}
                activeCategory={activeCategory}
                addingId={addingId}
                setAddingId={setAddingId}
                isInWishlist={isInWishlist}
                handleToggleWishlist={handleToggleWishlist}
              />
            )))}
        </motion.div>

        {/* Bottom Actions */}
        <div className="mt-6 flex justify-center items-center w-full">
          {/* View All Button */}
          <button className="flex items-center bg-[#eef0f3] rounded-full pl-4 pr-1 md:pl-5 md:pr-1.5 py-1 md:py-1.5 group hover:bg-[#e2e4e8] transition-colors shadow-sm">
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
