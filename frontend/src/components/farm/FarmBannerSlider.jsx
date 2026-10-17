import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://paidhu-final-anm2.vercel.app');

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    image: '/banners/just_b_happy_banner_1.jpg',
    mobileImage: '/banners/just_b_happy_banner_1_mobile.jpg'
  },
  {
    id: 'default-2',
    image: '/banners/just_b_happy_banner_2.jpg',
    mobileImage: '/banners/just_b_happy_banner_2_mobile.jpg'
  },
  {
    id: 'default-3',
    image: '/banners/shopallbanner001.webp',
    mobileImage: '/banners/shopallbanner001.webp'
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
              link: b.link || null
            }));
            setSlides(backendSlides);
          }
        }
      })
      .catch(() => {
        // Default clean banner slides remain active
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
                  alt="Just B Happy Farm Banner" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    const fallback = '/banners/just_b_happy_banner_1.jpg';
                    if (!e.target.src.endsWith(fallback)) {
                      e.target.src = fallback;
                    }
                  }}
                />
              </picture>
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
