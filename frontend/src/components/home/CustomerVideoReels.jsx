import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? 'http://localhost:5000' 
    : 'https://paidhu-final-anm2.vercel.app');

const SUPABASE_STORAGE_URL = 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/reviews/videos';

// The exact customer review videos uploaded in the Admin panel
const FALLBACK_VIDEO_REELS = [
  {
    id: 'user-reel-1',
    video: `${SUPABASE_STORAGE_URL}/1789837755612-WhatsAppVideo20260919at93243PMmp4.mp4`,
    comment: "These Bloom Cookies are so fresh, crispy, and delicious. My kids love the natural floral taste!",
    rating: 5,
    reviewerName: "Pooja Hegde (Verified Mom)",
    product: {
      id: 8,
      name: "Bloom Cookies - White Lotus",
      price: 66,
      image: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807099194-whitelotuscookiepng.png"
    }
  },
  {
    id: 'user-reel-2',
    video: `${SUPABASE_STORAGE_URL}/1789837725773-WhatsAppVideo20260919at93603PMmp4.mp4`,
    comment: "Authentic Aavaram Poo cookies with traditional herbal goodness. Outstanding crunch & quality.",
    rating: 5,
    reviewerName: "Kavitha R. (Verified Buyer)",
    product: {
      id: 9,
      name: "Bloom Cookies - Aavaram Poo",
      price: 66,
      image: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807081906-AAVARAMPOOpng.png"
    }
  },
  {
    id: 'user-reel-3',
    video: `${SUPABASE_STORAGE_URL}/1789837671597-WhatsAppVideo20260919at93553PMmp4.mp4`,
    comment: "Pure Kashmiri Saffron Powder! Incredible aroma and gives rich golden color to milk and sweets.",
    rating: 5,
    reviewerName: "Ananya Deshmukh",
    product: {
      id: 21,
      name: "Pure Kashmiri Saffron Powder",
      price: 1600,
      image: "https://wp.paidhu.com/wp-content/uploads/2024/08/DSC07565-scaled.jpg"
    }
  },
  {
    id: 'user-reel-4',
    video: `${SUPABASE_STORAGE_URL}/1789837626809-WhatsAppVideo20260919at93601PMmp4.mp4`,
    comment: "Traditional sun-cured Gulkand and floral honey treats. Truly healthy with zero refined sugars.",
    rating: 5,
    reviewerName: "Dr. Meenakshi S.",
    product: {
      id: 11,
      name: "Bloom Cookies - Hibiscus",
      price: 66,
      image: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807065977-hibiscuscookiepng.png"
    }
  },
  {
    id: 'user-reel-5',
    video: `${SUPABASE_STORAGE_URL}/1789837245897-WhatsAppVideo20260919at93603PM1mp4.mp4`,
    comment: "The packaging and purity of Paidhu botanical superfoods exceeded my expectations!",
    rating: 5,
    reviewerName: "Divya Balaji",
    product: {
      id: 8,
      name: "Bloom Cookies - White Lotus",
      price: 66,
      image: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807099194-whitelotuscookiepng.png"
    }
  },
  {
    id: 'user-reel-6',
    video: `${SUPABASE_STORAGE_URL}/1789837100827-WhatsAppVideo20260919at93243PMmp4.mp4`,
    comment: "Wholesome natural ingredients. We replaced all our usual tea snacks with Paidhu floral cookies.",
    rating: 5,
    reviewerName: "Shalini Menon",
    product: {
      id: 9,
      name: "Bloom Cookies - Aavaram Poo",
      price: 66,
      image: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807081906-AAVARAMPOOpng.png"
    }
  }
];

// Single Reel Card with simultaneous continuous autoplay & clean unobstructed full-screen video
const ReelCard = ({ review, onClick, isGlobalMuted }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isGlobalMuted;
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Auto-play was prevented (e.g. browser policy), ensure muted and retry
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isGlobalMuted, review.video]);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className="relative shrink-0 w-[240px] sm:w-[270px] md:w-[290px] aspect-[9/16] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border-2 border-[#522742]/10 bg-black cursor-pointer group select-none"
    >
      {/* Background Autoplay Video Element */}
      <video
        ref={videoRef}
        src={review.video ? (review.video.includes('#') ? review.video : `${review.video}#t=0.001`) : ''}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loop
        autoPlay
        playsInline
        muted={isGlobalMuted}
        preload="auto"
      />

      {/* Subtle Bottom Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Hover Expand/Play Indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
        <motion.div 
          className="w-14 h-14 rounded-full bg-white/95 text-[#522742] flex items-center justify-center shadow-xl backdrop-blur-xs"
          whileHover={{ scale: 1.15 }}
        >
          <Play size={22} className="ml-1 fill-[#522742]" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const CustomerVideoReels = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeModalReview, setActiveModalReview] = useState(null);
  const [modalPlaying, setModalPlaying] = useState(true);
  const [modalMuted, setModalMuted] = useState(false);
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);

  const sliderRef = useRef(null);
  const modalVideoRef = useRef(null);

  // Fetch reviews from Database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/reviews?hasVideo=true&t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          const videoReviews = Array.isArray(data) ? data.filter(r => r.video && r.video.trim() !== '') : [];
          
          if (videoReviews.length > 0) {
            // Merge with fallback if less than 6 to keep the carousel rich & wide
            if (videoReviews.length < 6) {
              const combined = [...videoReviews, ...FALLBACK_VIDEO_REELS.slice(videoReviews.length)];
              setReviews(combined);
            } else {
              setReviews(videoReviews);
            }
          } else {
            setReviews(FALLBACK_VIDEO_REELS);
          }
        } else {
          setReviews(FALLBACK_VIDEO_REELS);
        }
      } catch (err) {
        console.warn("Failed to fetch customer review videos, using high-res reels:", err);
        setReviews(FALLBACK_VIDEO_REELS);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === 'left' ? -320 : 320;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleOpenModal = (review) => {
    setActiveModalReview(review);
    setModalPlaying(true);
    setModalMuted(false);
  };

  const handleCloseModal = () => {
    setActiveModalReview(null);
    setModalPlaying(false);
  };

  const handlePrevReel = (e) => {
    e.stopPropagation();
    if (!activeModalReview) return;
    const currentIndex = reviews.findIndex(r => r.id === activeModalReview.id);
    const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    setActiveModalReview(reviews[prevIndex]);
    setModalPlaying(true);
  };

  const handleNextReel = (e) => {
    e.stopPropagation();
    if (!activeModalReview) return;
    const currentIndex = reviews.findIndex(r => r.id === activeModalReview.id);
    const nextIndex = (currentIndex + 1) % reviews.length;
    setActiveModalReview(reviews[nextIndex]);
    setModalPlaying(true);
  };

  const toggleModalPlay = () => {
    if (!modalVideoRef.current) return;
    if (modalPlaying) {
      modalVideoRef.current.pause();
      setModalPlaying(false);
    } else {
      modalVideoRef.current.play();
      setModalPlaying(true);
    }
  };

  const toggleModalMute = () => {
    if (!modalVideoRef.current) return;
    modalVideoRef.current.muted = !modalMuted;
    setModalMuted(!modalMuted);
  };

  return (
    <section className="relative w-full bg-[#f6f2ec] overflow-hidden py-14 sm:py-20 md:py-24 border-t border-[#522742]/10">
      
      {/* Background Subtle Accent Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#522742_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#522742]/10 text-[#522742] text-[11px] font-black uppercase tracking-wider mb-3">
              <Sparkles size={13} className="text-[#d4af37]" />
              <span>Real Experiences • Verified Video Reviews</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#522742] font-serif tracking-tight leading-tight">
              Loved by Families Everywhere
            </h2>
            <p className="text-sm sm:text-base text-[#522742]/80 mt-2 font-medium">
              Watch real customer reels and unboxings featuring our pure botanical treats, saffron elixirs, and floral jams.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => setIsGlobalMuted(!isGlobalMuted)}
              className="px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-[#522742] text-xs font-bold shadow-sm border border-[#522742]/15 flex items-center gap-1.5 transition-all cursor-pointer"
              title={isGlobalMuted ? "Unmute Previews" : "Mute Previews"}
            >
              {isGlobalMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-[#38ef7d]" />}
              <span>{isGlobalMuted ? "Muted" : "Sound On"}</span>
            </button>

            <button
              onClick={() => scrollSlider('left')}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#522742] shadow-sm border border-[#522742]/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous Reels"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scrollSlider('right')}
              className="w-10 h-10 rounded-full bg-[#522742] hover:bg-[#6a2b53] text-white shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next Reels"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Video Reels Carousel */}
        <div
          ref={sliderRef}
          className="flex items-center gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, index) => (
            <div key={review.id || index} className="snap-start">
              <ReelCard
                review={review}
                onClick={() => handleOpenModal(review)}
                isGlobalMuted={isGlobalMuted}
              />
            </div>
          ))}
        </div>

      </div>

      {/* POPUP FULL-SCREEN REEL VIEWER MODAL */}
      <AnimatePresence>
        {activeModalReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[92vh] bg-[#1a1217] rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Left/Middle: Video Player */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[350px] md:min-h-[580px] overflow-hidden group">
                <video
                  ref={modalVideoRef}
                  src={activeModalReview.video}
                  autoPlay
                  loop
                  playsInline
                  muted={modalMuted}
                  onClick={toggleModalPlay}
                  className="w-full h-full max-h-[70vh] md:max-h-[85vh] object-contain cursor-pointer"
                />

                {/* Video Controls Bar Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-full text-white border border-white/10">
                  <div className="flex items-center gap-3">
                    <button onClick={toggleModalPlay} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                      {modalPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button onClick={toggleModalMute} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                      {modalMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevReel}
                      className="p-1 hover:text-[#d4af37] transition-colors cursor-pointer"
                      title="Previous Reel"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextReel}
                      className="p-1 hover:text-[#d4af37] transition-colors cursor-pointer"
                      title="Next Reel"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel: Product Info & Customer Review */}
              <div className="w-full md:w-[340px] bg-[#221620] p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 text-left">
                <div>
                  {/* Verified Review Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#522742] text-white flex items-center justify-center font-bold text-xs">
                        {(activeModalReview.reviewerName || 'V')[0]}
                      </div>
                      <div>
                        <h4 className="text-white text-xs font-bold">
                          {activeModalReview.reviewerName || 'Verified Customer'}
                        </h4>
                        <span className="text-gray-400 text-[10px]">Verified Buyer</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(activeModalReview.rating || 5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-[#fbc225] text-[#fbc225]" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
                    <p className="text-gray-200 text-xs sm:text-sm font-medium leading-relaxed">
                      "{activeModalReview.comment || 'Amazing natural floral product! Exceptional quality.'}"
                    </p>
                  </div>
                </div>

                {/* Attached Product Box */}
                {activeModalReview.product && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      {activeModalReview.product.image && (
                        <img
                          src={activeModalReview.product.image}
                          alt={activeModalReview.product.name}
                          className="w-14 h-14 rounded-2xl object-contain bg-white p-1 shrink-0 shadow-sm"
                        />
                      )}
                      <div>
                        <h5 className="text-white font-bold text-xs sm:text-sm line-clamp-2">
                          {activeModalReview.product.name}
                        </h5>
                        {activeModalReview.product.price && (
                          <span className="text-[#d4af37] font-extrabold text-sm sm:text-base">
                            ₹{activeModalReview.product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={activeModalReview.product.id ? `/product/${activeModalReview.product.id}` : '/shop'}
                      onClick={handleCloseModal}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#d4af37] to-[#e6ca65] hover:from-[#c5a028] hover:to-[#d4af37] text-[#522742] font-black text-xs sm:text-sm rounded-full shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <ShoppingBag size={16} />
                      <span>Shop This Product</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CustomerVideoReels;