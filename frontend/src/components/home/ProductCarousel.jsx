import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ShoppingCart, Check, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

const API_BASE = 'https://paidhu-final-anm2.vercel.app';

const CAROUSEL_SLUGS = [
  "rose-gulkhand-jam",
  "pure-kashmiri-saffron-mix",
  "hibiscus-floral-cookies",
  "organic-peanut-butter",
  "traditional-health-mix",
  "premium-raw-honey"
];

const initialProducts = [
  {
    id: 5,
    name: "Rose Gulkhand Jam",
    weight: "250g",
    price: "₹399",
    image: "https://images.unsplash.com/photo-1589535036124-747385202613?q=80&w=800&auto=format&fit=crop",
    image2: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780897222396-IMG20250917121311600x404png.png",
    rawProduct: { id: 5, price: 399, discountPrice: null, category: "Petal Jam" }
  },
  {
    id: 23,
    name: "Pure Kashmiri Saffron Mix",
    weight: "50g",
    price: "₹899",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=800&auto=format&fit=crop",
    image2: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780939517153-saffronneign600x600jpg.jpg",
    rawProduct: { id: 23, price: 899, discountPrice: null, category: "Saffron" }
  },
  {
    id: 24,
    name: "Hibiscus Floral Cookies",
    weight: "200g",
    price: "₹249",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop",
    image2: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937180748-WhatsAppImage20251128at14404PM600x402jpeg.jpeg",
    rawProduct: { id: 24, price: 249, discountPrice: null, category: "Bloom Cookies" }
  },
  {
    id: 25,
    name: "Organic Peanut Butter",
    weight: "350g",
    price: "₹299",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop",
    rawProduct: { id: 25, price: 299, discountPrice: null, category: "Bloom Cookies" }
  },
  {
    id: 26,
    name: "Traditional Health Mix",
    weight: "500g",
    price: "₹450",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1517881917431-135549973927?q=80&w=800&auto=format&fit=crop",
    rawProduct: { id: 26, price: 450, discountPrice: null, category: "Bloom Cookies" }
  },
  {
    id: 27,
    name: "Premium Raw Honey",
    weight: "400g",
    price: "₹599",
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89134292?q=80&w=800&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=800&auto=format&fit=crop",
    rawProduct: { id: 27, price: 599, discountPrice: null, category: "Petal Jam" }
  }
];

const ProductCarousel = ({ 
  title = "Indulge in the Authentic Taste of PAIDHU", 
  bgClass = "bg-[#ede7d7]",
  pyClass = "py-24"
}) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [products, setProducts] = React.useState(initialProducts);
  const [addingId, setAddingId] = React.useState(null);

  React.useEffect(() => {
    const fetchCarouselProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products?limit=50`);
        if (!res.ok) throw new Error("Failed to fetch carousel products");
        const data = await res.json();
        
        const fetchedList = data.products || [];
        const mapped = CAROUSEL_SLUGS.map(slug => {
          const prod = fetchedList.find(p => p.slug === slug);
          if (!prod) return null;
          return {
            id: prod.id,
            name: prod.name,
            weight: prod.shortDescription || "Pack",
            price: `₹${prod.price}`,
            image: prod.image,
            image2: (prod.images && prod.images.length > 1) ? prod.images[1] : prod.image,
            rawProduct: prod
          };
        }).filter(Boolean);
        
        if (mapped.length > 0) {
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Error loading carousel products:", err);
      }
    };
    fetchCarouselProducts();
  }, []);

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.rawProduct.price,
      discountPrice: product.rawProduct.discountPrice,
      image: product.image,
      category: product.rawProduct.category || "Snacks",
      shortDescription: product.weight
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
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.rawProduct.price,
        discountPrice: product.rawProduct.discountPrice,
        image: product.image,
        category: product.rawProduct.category || "Snacks",
        shortDescription: product.weight
      }, 1);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className={`w-full ${pyClass} ${bgClass} overflow-hidden relative`}>
      
      {/* Header Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center justify-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl md:text-5xl font-bold text-[#662654] text-center tracking-tight mb-4"
          >
            {title}
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#662654] rounded-full"
          />
        </div>

      {/* Carousel Container (Full Frame) */}
      <div className="relative group w-full px-2 md:px-8 xl:px-12 z-10">
          
          <style>{`
            .product-carousel-swiper .swiper-wrapper {
              transition-timing-function: linear !important;
            }
          `}</style>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            speed={4000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              960: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-12 pt-4 product-carousel-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="h-auto">
                <motion.div 
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(102,38,84,0.12)] border border-white/40 backdrop-blur-sm h-full flex flex-col transition-shadow duration-300 group/card cursor-pointer"
                >
                  
                  {/* Image Container (Vertical Reel style) */}
                  <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-5 bg-[#f8f5f0]">
                    {/* Badge */}
                    {product.rawProduct?.status === 'PREORDER' && (
                      <div className="absolute top-3 left-3 z-30 bg-[#662654] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                        PRE-ORDER
                      </div>
                    )}
                    {/* Wishlist Button */}
                    <motion.button
                      onClick={(e) => handleToggleWishlist(e, product)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/85 backdrop-blur flex items-center justify-center shadow transition-all duration-200"
                    >
                      <Heart
                        size={15}
                        className={isInWishlist(product.id) ? 'fill-[#662654] text-[#662654]' : 'text-gray-400'}
                        strokeWidth={2}
                      />
                    </motion.button>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover/card:opacity-0 group-hover/card:scale-110"
                      style={{ imageRendering: 'high-quality', WebkitBackfaceVisibility: 'hidden', WebkitTransform: 'translateZ(0)' }}
                    />
                    {product.image2 && (
                      <img 
                        src={product.image2} 
                        alt={product.name} 
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out opacity-0 scale-95 group-hover/card:opacity-100 group-hover/card:scale-110"
                        style={{ imageRendering: 'high-quality', WebkitBackfaceVisibility: 'hidden', WebkitTransform: 'translateZ(0)' }}
                      />
                    )}
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow px-2 pb-2">
                    <h3 className="font-serif text-lg md:text-xl font-bold text-[#2b2b2b] mb-1 line-clamp-1 group-hover/card:text-[#662654] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 font-medium">
                      {product.weight}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xl font-bold text-[#2b2b2b]">
                        {product.price}
                      </span>
                      
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={addingId === product.id}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#662654]/10 disabled:bg-emerald-100 text-[#662654] disabled:text-emerald-700 hover:bg-[#662654] hover:text-white transition-colors duration-300 group/btn cursor-pointer"
                      >
                        {addingId === product.id ? (
                          <Check size={16} strokeWidth={3} className="text-emerald-700 animate-bounce" />
                        ) : (
                          <ShoppingCart size={18} className="transform transition-transform group-hover/btn:scale-110" />
                        )}
                      </button>
                    </div>

                    {/* Add to Cart Full Button (Visible on Hover for desktop) */}
                    <motion.button 
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={addingId === product.id}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 bg-gradient-to-r from-[#662654] to-[#7f2d68] hover:from-[#7a2e64] hover:to-[#913b7e] disabled:from-emerald-600 disabled:to-teal-500 text-white rounded-full py-2.5 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider shadow-[0_4px_12px_rgba(102,38,84,0.15)] hover:shadow-[0_6px_20px_rgba(102,38,84,0.3)] transition-all duration-300 group/btn cursor-pointer"
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
                    </motion.button>
                  </div>

                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#662654] shadow-lg hover:bg-[#662654] hover:text-white transition-all duration-300 opacity-0 md:opacity-100 md:-ml-6 group-hover:ml-0 xl:-ml-12 xl:group-hover:-ml-6 disabled:opacity-50">
            <ChevronLeft size={24} />
          </button>
          
          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#662654] shadow-lg hover:bg-[#662654] hover:text-white transition-all duration-300 opacity-0 md:opacity-100 md:-mr-6 group-hover:mr-0 xl:-mr-12 xl:group-hover:-mr-6 disabled:opacity-50">
            <ChevronRight size={24} />
          </button>

        </div>

    </section>
  );
};

export default ProductCarousel;
