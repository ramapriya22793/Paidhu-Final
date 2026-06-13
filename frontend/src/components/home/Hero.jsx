import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    headline: "FLAT 10% OFF",
    subheading: "Exotic Finds",
    description: "Use Coupon: PAIDHU10",
    cta: "Shop Now",
    image: "/hero_banner_full.png",
    bgColor: "bg-white",
  },
  {
    id: 'f2',
    headline: "Pure Kashmiri Saffron",
    subheading: "The world's most luxurious spice, ethically sourced.",
    description: "Experience the rich aroma and vibrant color of our premium organic saffron threads, hand-harvested for purity.",
    cta: "Shop Saffron",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=1200&auto=format&fit=crop",
    bgColor: "bg-[#5a1e48]",
  },
  {
    id: 'f3',
    headline: "Artisanal Floral Jams",
    subheading: "Sweetness infused with organic petals.",
    description: "Elevate your morning toast or evening desserts with our signature rose and lavender infused fruit preserves.",
    cta: "Discover Jams",
    image: "https://images.unsplash.com/photo-1589535036124-747385202613?q=80&w=1200&auto=format&fit=crop",
    bgColor: "bg-[#7a2e64]",
  }
];

const resolveUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [isMobile, setIsMobile] = useState(false);
  const [aspectRatios, setAspectRatios] = useState({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch ALL active banners for the 'home' page slug
  useEffect(() => {
    fetch(`${API_BASE}/api/banners/active/home`)
      .then(r => r.ok ? r.json() : [])
      .then(homeBanners => {
        if (homeBanners && homeBanners.length > 0) {
          // Map backend banners to slide format
          const backendSlides = homeBanners.map(b => ({
            id: `banner-${b.id}`,
            image: resolveUrl(b.webImage || b.webImagePath),
            mobileImage: resolveUrl(b.mobileImage || b.mobileImagePath),
            bgColor: 'bg-[#faf5eb]',
            isBackendBanner: true,
          }));
          setSlides(backendSlides);
        } else {
          setSlides(FALLBACK_SLIDES);
        }
      })
      .catch(() => {
        setSlides(FALLBACK_SLIDES);
      });
  }, []);

  // Pre-load slide images and compute aspect ratios
  useEffect(() => {
    slides.forEach(slide => {
      const imgUrl = (isMobile && slide.mobileImage) ? slide.mobileImage : slide.image;
      if (imgUrl) {
        const cacheKey = `${slide.id}-${isMobile ? 'mobile' : 'web'}`;
        if (!aspectRatios[cacheKey]) {
          const img = new Image();
          img.onload = () => {
            setAspectRatios(prev => ({
              ...prev,
              [cacheKey]: img.naturalWidth / img.naturalHeight
            }));
          };
          img.src = imgUrl;
        }
      }
    });
  }, [slides, isMobile]);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));

  const current = slides[currentSlide];
  const currentKey = `${current.id}-${(isMobile && current.mobileImage) ? 'mobile' : 'web'}`;
  const currentAspect = aspectRatios[currentKey] || 2;

  // Function to handle image load to update aspect ratio immediately
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      const cacheKey = `${current.id}-${(isMobile && current.mobileImage) ? 'mobile' : 'web'}`;
      if (aspectRatios[cacheKey] !== naturalWidth / naturalHeight) {
        setAspectRatios(prev => ({
          ...prev,
          [cacheKey]: naturalWidth / naturalHeight
        }));
      }
    }
  };

  return (
    <div className="w-full bg-[#f8f4ef] py-3 md:py-4 px-3 sm:px-4 lg:px-6">
      {/* Banner container — aspect ratio auto-fits to image dimensions */}
      <div 
        className="relative w-full overflow-hidden rounded-[28px] md:rounded-[36px] shadow-[0_8px_40px_rgba(0,0,0,0.10)] hover:shadow-[0_14px_50px_rgba(212,175,55,0.20)] transition-all duration-500 group"
        style={{ 
          aspectRatio: currentAspect,
          background: current.bgColor?.replace('bg-', '') || '#f8f4ef'
        }}
      >

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`absolute inset-0 w-full h-full flex items-center justify-center ${current.bgColor || 'bg-white'}`}
          >
            {/* Image Wrapper - Full-bleed object-cover */}
            <div className="absolute inset-0 w-full h-full">
              {/* Mobile image (if backend banner has separate mobile img) */}
              {current.mobileImage && (
                <img
                  src={current.mobileImage}
                  alt={current.headline || 'Paidhu Banner'}
                  className="md:hidden w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.015]"
                  onLoad={handleImageLoad}
                />
              )}

              {/* Web / main image */}
              <img
                src={current.image}
                alt={current.headline || 'Paidhu Banner'}
                className={`${current.mobileImage ? 'hidden md:block' : 'block'} w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.015]`}
                onLoad={handleImageLoad}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

              {/* Glassmorphic floating text overlay for fallback/text banners */}
              {!current.isBackendBanner && current.headline && (
                <div className="absolute inset-0 bg-black/20 z-10 flex items-center px-6 sm:px-12 md:px-20 lg:px-32">
                  <div className="max-w-xl text-white">
                    <motion.span 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="inline-block px-3 py-1 bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-[#ffd700] mb-4 shadow-sm"
                    >
                      {current.subheading || 'Exclusive Deal'}
                    </motion.span>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.7 }}
                      className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-4 uppercase drop-shadow-md"
                    >
                      {current.headline}
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.7 }}
                      className="text-xs sm:text-sm md:text-base text-white/90 font-medium leading-relaxed mb-6 drop-shadow"
                    >
                      {current.description}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.7 }}
                    >
                      <Link 
                        to="/shop"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-[#d4af37] to-[#fde047] hover:from-[#ffd700] hover:to-[#fff] text-[#662654] font-black uppercase text-xs sm:text-sm tracking-wider px-8 py-3.5 rounded-full shadow-[0_8px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        <span>{current.cta || 'Shop Now'}</span>
                        <motion.span 
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                          ➔
                        </motion.span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Glassmorphic Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-[#662654] hover:scale-110 shadow-lg z-20"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-[#662654] hover:scale-110 shadow-lg z-20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Glassmorphic Slide Indicators wrapper */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20 px-4 py-2.5 bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                currentSlide === index
                  ? 'w-6 h-2 bg-[#d4af37]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Hero;
