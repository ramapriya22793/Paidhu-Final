import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://paidhu-final-anm2.vercel.app');

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
    image: '/white_lotus_cookies_new.png',
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
  if (!slide) return '/shop';
  // 1. Direct custom redirect link configured in admin
  if (slide.link && typeof slide.link === 'string' && slide.link.trim()) {
    return slide.link.trim();
  }
  // 2. Category mapping configured in admin
  if (slide.category && typeof slide.category === 'string' && slide.category.trim()) {
    return `/shop/shop-by-category?category=${encodeURIComponent(slide.category.trim())}`;
  }
  // 3. Fallback product routes based on image names
  if (!slide.image) return '/shop';
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
  // Start with FALLBACK_SLIDES immediately — no loading spinner, instant LCP
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

  // Silently upgrade to backend banners in background — fallbacks shown instantly above
  useEffect(() => {
    fetch(`${API_BASE}/api/banners/active/home?t=${Date.now()}`)
      .then(r => r.ok ? r.json() : [])
      .then(homeBanners => {
        if (!homeBanners || homeBanners.length === 0) return;
        const activeBanners = homeBanners.filter(b => (b.isActive === true || b.isActive === 'true') && (b.webImage || b.webImagePath));
        if (activeBanners.length === 0) return;
        const backendSlides = activeBanners.map(b => ({
          id: `banner-${b.id}`,
          image: resolveUrl(b.webImage || b.webImagePath),
          mobileImage: resolveUrl(b.mobileImage || b.mobileImagePath),
          bgColor: 'bg-[#faf5eb]',
          isBackendBanner: true,
          category: b.category || null,
          link: b.link || null,
        })).filter(s => s.image);
        if (backendSlides.length > 0) {
          setSlides(backendSlides);
          setCurrentSlide(0);
        }
      })
      .catch(() => {
        // Keep fallback slides — already showing
      });
  }, []);

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
      {/* SEO H1 Heading (Visually Hidden for Crawlers) */}
      <h1 className="sr-only">Premium Ethical Foods & Natural Products from Paidhu</h1>

      
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

        {/* CSS fade transition — replaces framer-motion to reduce TBT */}
        {slides.map((slide, index) => {
          const targetUrl = getBannerLink(slide);
          const isExternal = targetUrl.startsWith('http://') || targetUrl.startsWith('https://');

          return (
            <div
              key={slide.id}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              style={{
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                pointerEvents: index === currentSlide ? 'auto' : 'none',
                backgroundColor: slide.bgColor?.replace('bg-', '') || '#f8f4ef',
              }}
            >
              {/* Image Wrapper - Clickable full-bleed object-cover */}
              {isExternal ? (
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 w-full h-full block cursor-pointer z-10"
                  tabIndex={index === currentSlide ? 0 : -1}
                  aria-label={slide.headline || 'Paidhu Hero Banner'}
                >
                  {slide.mobileImage && (
                    <img
                      src={slide.mobileImage}
                      alt={slide.headline || 'Paidhu Banner'}
                      width={600}
                      height={300}
                      className="md:hidden w-full h-full object-cover object-center"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                    />
                  )}

                  <img
                    src={slide.image}
                    alt={slide.headline || 'Paidhu Banner'}
                    width={1440}
                    height={600}
                    className={`${slide.mobileImage ? 'hidden md:block' : 'block'} w-full h-full object-cover object-center`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </a>
              ) : (
                <Link 
                  to={targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`}
                  className="absolute inset-0 w-full h-full block cursor-pointer z-10"
                  tabIndex={index === currentSlide ? 0 : -1}
                  aria-label={slide.headline || 'Paidhu Hero Banner'}
                >
                  {slide.mobileImage && (
                    <img
                      src={slide.mobileImage}
                      alt={slide.headline || 'Paidhu Banner'}
                      width={600}
                      height={300}
                      className="md:hidden w-full h-full object-cover object-center"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                    />
                  )}

                  <img
                    src={slide.image}
                    alt={slide.headline || 'Paidhu Banner'}
                    width={1440}
                    height={600}
                    className={`${slide.mobileImage ? 'hidden md:block' : 'block'} w-full h-full object-cover object-center`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </Link>
              )}

            {/* Text overlay for fallback/text banners (no motion — pure CSS) */}
            {!slide.isBackendBanner && !slide.hideTextOverlay && slide.headline && (
              <div className="absolute inset-0 bg-black/20 z-20 flex items-center px-6 sm:px-12 md:px-20 lg:px-32 pointer-events-none">
                <div className="max-w-xl text-white pointer-events-auto">
                  <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-[#ffd700] mb-4 shadow-sm">
                    {slide.subheading || 'Exclusive Deal'}
                  </span>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-4 uppercase drop-shadow-md">
                    {slide.headline}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium leading-relaxed mb-6 drop-shadow">
                    {slide.description}
                  </p>
                  <Link 
                    to="/shop"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-[#d4af37] to-[#fde047] hover:from-[#ffd700] hover:to-[#fff] text-[#662654] font-black uppercase text-xs sm:text-sm tracking-wider px-8 py-3.5 rounded-full shadow-[0_8px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <span>{slide.cta || 'Shop Now'}</span>
                    <span>➔</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          );
        })}

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
