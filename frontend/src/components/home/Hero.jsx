import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = 'https://paidhu-final-anm2.vercel.app';

const FALLBACK_SLIDES = [
  {
    id: 'fallback-1',
    image: '/banner_tea.jpeg',
    bgColor: '#faf5eb',
    isBackendBanner: false
  },
  {
    id: 'fallback-2',
    image: '/banner_jam.jpeg',
    bgColor: '#faf5eb',
    isBackendBanner: false
  },
  {
    id: 'fallback-3',
    image: '/bloom_cookies_banner.png',
    bgColor: '#faf5eb',
    isBackendBanner: false
  }
];

const resolveUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

const getBannerLink = (slide) => {
  if (!slide || !slide.image) return '/shop';
  const imgUrl = slide.image.toLowerCase();
  
  if (imgUrl.includes('banner1') || imgUrl.includes('cookie')) {
    return '/product/bloom-cookies-hibiscus';
  }
  if (imgUrl.includes('banner2') || imgUrl.includes('tea')) {
    return '/product/medly-teas-hibiscus-20-dips';
  }
  if (imgUrl.includes('banner3') || imgUrl.includes('jam')) {
    return '/product/hibiscus-petal-jam';
  }
  return '/shop';
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch ALL active banners for the 'home' page slug with 4h caching
  useEffect(() => {
    let cachedBanners = null;
    let cachedTime = null;
    try {
      cachedBanners = localStorage.getItem('paidhu_home_banners');
      cachedTime = localStorage.getItem('paidhu_home_banners_time');
    } catch (e) {
      console.error("Failed to read banners from localStorage", e);
    }
    const cachingDuration = 4 * 60 * 60 * 1000; // Cache for 4 hours

    if (cachedBanners && cachedTime && (Date.now() - Number(cachedTime) < cachingDuration)) {
      try {
        setSlides(JSON.parse(cachedBanners));
        return;
      } catch (e) {}
    }

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
          try {
            localStorage.setItem('paidhu_home_banners', JSON.stringify(backendSlides));
            localStorage.setItem('paidhu_home_banners_time', String(Date.now()));
          } catch (e) {}
        } else {
          setSlides(FALLBACK_SLIDES);
        }
      })
      .catch(() => {
        setSlides(FALLBACK_SLIDES);
      });
  }, []);

  // Preload first slide image as soon as slides are determined
  useEffect(() => {
    if (slides && slides.length > 0) {
      const firstSlide = slides[0];
      const isMobileDevice = window.innerWidth < 768;
      const imageUrl = (isMobileDevice && firstSlide.mobileImage) ? firstSlide.mobileImage : firstSlide.image;
      
      if (imageUrl) {
        // Remove existing slide preload link if any
        const existingLink = document.getElementById('hero-banner-preload');
        if (existingLink) {
          existingLink.remove();
        }
        
        const link = document.createElement('link');
        link.id = 'hero-banner-preload';
        link.rel = 'preload';
        link.as = 'image';
        link.href = imageUrl;
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      }
    }
  }, [slides]);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));

  const current = slides[currentSlide];
  if (!current) return null;

  return (
    <div className="w-full bg-[#f8f4ef] py-3 md:py-4 px-3 sm:px-4 lg:px-6">
      {/* SEO H1 Heading (Visually Hidden) */}
      <h1 className="sr-only">Paidhu - The Edible Flower Co. | Natural & Organic Products</h1>
      
      {/* Banner container — aspect ratio auto-fits to image dimensions */}
      <div 
        className="relative w-full overflow-hidden rounded-[28px] md:rounded-[36px] shadow-[0_8px_40px_rgba(0,0,0,0.10)] hover:shadow-[0_14px_50px_rgba(212,175,55,0.20)] transition-all duration-500 group"
        style={{ 
          aspectRatio: isMobile ? '2 / 1' : '2.4 / 1',
          background: current.bgColor?.replace('bg-', '') || '#f8f4ef'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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
            {/* Image Wrapper - Clickable full-bleed object-cover */}
            <Link 
              to={getBannerLink(current)} 
              className="absolute inset-0 w-full h-full block cursor-pointer z-10"
            >
              {/* Mobile image (if backend banner has separate mobile img) */}
              {current.mobileImage && (
                <img
                  src={current.mobileImage}
                  alt={current.headline || 'Paidhu Banner'}
                  width={600}
                  height={300}
                  className="md:hidden w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.015]"
                  loading="eager"
                  fetchPriority="high"
                />
              )}

              {/* Web / main image */}
              <img
                src={current.image}
                alt={current.headline || 'Paidhu Banner'}
                width={1440}
                height={600}
                className={`${current.mobileImage ? 'hidden md:block' : 'block'} w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.015]`}
                loading="eager"
                fetchPriority="high"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
            </Link>

            {/* Glassmorphic floating text overlay for fallback/text banners */}
            {!current.isBackendBanner && !current.hideTextOverlay && current.headline && (
              <div className="absolute inset-0 bg-black/20 z-20 flex items-center px-6 sm:px-12 md:px-20 lg:px-32 pointer-events-none">
                <div className="max-w-xl text-white pointer-events-auto">
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
          </motion.div>
        </AnimatePresence>

        {/* Glassmorphic Navigation Arrows (always visible on mobile/tablet, hover-only on desktop) */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-all duration-300 hover:bg-white hover:text-[#662654] hover:scale-110 shadow-lg z-20"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-all duration-300 hover:bg-white hover:text-[#662654] hover:scale-110 shadow-lg z-20"
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
