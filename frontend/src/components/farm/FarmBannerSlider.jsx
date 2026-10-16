import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://paidhu-final-anm2.vercel.app');

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    image: '/banners/just_b_happy_banner_1.jpg',
    mobileImage: '/banners/just_b_happy_banner_1_mobile.jpg',
    tag: 'PAIDHU • JUST B HAPPY FARMS',
    headline: 'Official Botanical Contract Farming',
    sub: 'Join Paidhu Just B Happy Farms for ethical edible flower cultivation and assured buyback contracts.',
    badge: '🌸 Guaranteed Buyback'
  },
  {
    id: 'default-2',
    image: '/banners/just_b_happy_banner_2.jpg',
    mobileImage: '/banners/just_b_happy_banner_2_mobile.jpg',
    tag: 'COMMUNITY & LIVELIHOOD',
    headline: 'Empowering Generational Flower Farmers',
    sub: 'Handpicking radiant blossoms at dawn with technical support and guaranteed pricing.',
    badge: '🌿 100% Pesticide Free'
  },
  {
    id: 'default-3',
    image: '/banners/just_b_happy_banner_3.jpg',
    mobileImage: '/banners/just_b_happy_banner_3_mobile.jpg',
    tag: 'ETHICAL BOTANICALS',
    headline: 'Vibrant Natural Bloom Cultivation',
    sub: 'Sustainable agrarian practices supporting biodiversity, pollinators, and rural empowerment.',
    badge: '✨ Direct Farm Buyback'
  },
  {
    id: 'default-4',
    image: '/banners/just_b_happy_banner_4.jpg',
    mobileImage: '/banners/just_b_happy_banner_4_mobile.jpg',
    tag: 'JOIN OUR NETWORK',
    headline: 'Transform Your Acreage Into Botanical Wealth',
    sub: 'Full agronomist guidance from soil preparation to post-harvest collection.',
    badge: '🚜 Contract Farming'
  },
  {
    id: 'default-5',
    image: '/banners/just_b_happy_banner_5.jpg',
    mobileImage: '/banners/just_b_happy_banner_5_mobile.jpg',
    tag: 'AGRARIAN VERIFICATION',
    headline: 'Apply for Paidhu Farm Certification',
    sub: 'Submit your land details below to enroll in our upcoming cultivation cycle.',
    badge: '📋 Quick 3-Step Application'
  }
];

const FarmBannerSlider = ({ onScrollToForm }) => {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Fetch dynamic banners from backend if configured for just-b-happy
  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE}/api/banners/active/just-b-happy?t=${Date.now()}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter(b => (b.isActive === true || b.isActive === 'true' || b.isActive === 1) && (b.webImage || b.webImagePath));
          if (active.length > 0) {
            const resolveUrl = (img) => {
              if (!img) return null;
              if (img.startsWith('http://') || img.startsWith('https://')) return img;
              const path = img.startsWith('/') ? img : `/${img}`;
              return `${API_BASE}${path}`;
            };
            const backendSlides = active.map(b => ({
              id: `backend-${b.id}`,
              image: resolveUrl(b.webImage || b.webImagePath),
              mobileImage: resolveUrl(b.mobileImage || b.mobileImagePath),
              tag: b.category || 'PAIDHU • JUST B HAPPY FARMS',
              headline: b.title || 'Official Botanical Contract Farming',
              sub: b.description || 'Join Paidhu Just B Happy Farms for ethical edible flower cultivation and assured buyback contracts.',
              badge: '🌸 Guaranteed Buyback',
              link: b.link || null
            }));
            setSlides(backendSlides);
          }
        }
      })
      .catch(() => {
        // Default authentic farm slides remain active
      });
    return () => { isMounted = false; };
  }, []);

  // Continuous Auto-Carousel: advances every 4 seconds automatically
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 35;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const scrollToForm = () => {
    if (onScrollToForm) {
      onScrollToForm();
    } else {
      const el = document.getElementById('farm-application-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full px-0 pt-0 pb-0">
      {/* Full-Width Edge-to-Edge Banner Container with Auto-Carousel */}
      <div 
        className="relative w-full overflow-hidden bg-[#2C3308] select-none shadow-xl border-b-4 border-[#F9E086] group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Horizontal Scrolling Track */}
        <div 
          className="flex transition-transform duration-700 ease-in-out w-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={slide.id || index}
              onClick={scrollToForm}
              className="w-full flex-shrink-0 relative h-[220px] xs:h-[260px] sm:h-[320px] md:h-[400px] lg:h-[460px] flex items-center overflow-hidden cursor-pointer"
            >
              {/* Responsive Picture: dedicated mobileImage for mobile screens (<640px) */}
              <picture className="w-full h-full block">
                {slide.mobileImage && (
                  <source media="(max-width: 639px)" srcSet={slide.mobileImage} />
                )}
                <img 
                  src={slide.image} 
                  alt={slide.headline || "Just B Happy Farm Banner"} 
                  className="w-full h-full object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    const fallback = `/banners/just_b_happy_banner_${(index % 5) + 1}.jpg`;
                    if (!e.target.src.endsWith(fallback)) {
                      e.target.src = fallback;
                    }
                  }}
                />
              </picture>

              {/* Cinematic Bottom Gradient Overlay with Farm Story text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-8 md:p-10 pointer-events-none">
                <div className="max-w-3xl pointer-events-auto">
                  {slide.badge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4E580F]/90 text-[#F9E086] text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-[#F9E086]/30 mb-2 shadow-md">
                      <Sparkles className="w-3 h-3 text-[#F9E086]" />
                      <span>{slide.badge}</span>
                    </span>
                  )}
                  <h2 className="text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-serif font-black drop-shadow-md leading-tight">
                    {slide.headline || 'PAIDHU • Just B Happy Farms'}
                  </h2>
                  <p className="text-gray-200 text-xs sm:text-sm md:text-base mt-1 line-clamp-2 drop-shadow font-medium max-w-2xl hidden xs:block">
                    {slide.sub || 'Partner with us for guaranteed buyback and ethical flower cultivation.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Previous Button */}
        {slides.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-[#4E580F] text-white border border-white/30 backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg z-20"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Next Button */}
        {slides.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-[#4E580F] text-white border border-white/30 backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg z-20"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Pagination Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(dotIdx);
                }}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === dotIdx 
                    ? 'w-6 sm:w-9 h-1.5 sm:h-2.5 bg-[#F9E086] shadow-md' 
                    : 'w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmBannerSlider;
