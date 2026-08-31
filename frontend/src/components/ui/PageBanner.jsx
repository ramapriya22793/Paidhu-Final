// PageBanner — Full-width shop section banner carousel.
// Same visual style as the Home Hero.jsx banner.
// Fetch order: specific pageSlug → 'home' banners → local fallback.
// Height is driven by the image's native aspect ratio (no white side-bars, no fixed height).
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = 'https://paidhu-final-anm2.vercel.app';

const resolveUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Convert backend banner record → slide object
const toSlide = (b) => ({
  id:          `banner-${b.id}`,
  image:       resolveUrl(b.webImage  || b.webImagePath)  || null,
  mobileImage: resolveUrl(b.mobileImage || b.mobileImagePath) || null,
  bgColor:     '#f8f4ef',
  isBackend:   true,
  category:    b.category || null,
});

// Local fallback per section (used only when DB + home fallback both return nothing)
const LOCAL_FALLBACK = '/shop_all_banner.jpg';

const PageBanner = ({ pageSlug }) => {
  const [slides, setSlides]             = useState([{ id: 'fallback-init', image: LOCAL_FALLBACK, bgColor: '#f8f4ef' }]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile]         = useState(false);
  const [aspectRatios, setAspectRatios] = useState({});
  const [ready, setReady]               = useState(true);

  // ── Responsive detection ─────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Fetch: slug → shop-all/shop → home → local fallback ──────────────────
  useEffect(() => {
    if (!pageSlug) return;
    setCurrentSlide(0);

    const resolvedSlug = pageSlug;

    const fetchSlug = (slug) =>
      fetch(`${API_BASE}/api/banners/active/${slug}?t=${Date.now()}`)
        .then(r => (r.ok ? r.json() : []))
        .catch(() => []);

    (async () => {
      // 1. Slug-specific banners
      let data = await fetchSlug(resolvedSlug);

      // 2. Fallback to main shop-all / shop banners if not found
      if (!data || data.length === 0) {
        if (resolvedSlug !== 'shop-all' && resolvedSlug !== 'shop') {
          data = await fetchSlug('shop-all');
          if (!data || data.length === 0) {
            data = await fetchSlug('shop');
          }
        } else if (resolvedSlug === 'shop-all') {
          data = await fetchSlug('shop');
        } else if (resolvedSlug === 'shop') {
          data = await fetchSlug('shop-all');
        }
      }

      // 3. Fallback to home banners (same carousel as the homepage)
      if (!data || data.length === 0) {
        data = await fetchSlug('home');
      }

      if (data && data.length > 0) {
        const activeData = data.filter(b => b.isActive === true || b.isActive === 'true');
        if (activeData.length > 0) {
          setSlides(activeData.map(toSlide).filter(s => s.image));
        } else {
          setSlides([{ id: 'local-1', image: LOCAL_FALLBACK, bgColor: '#f0ede6' }]);
        }
      } else {
        // 4. Last resort — local image
        setSlides([{ id: 'local-1', image: LOCAL_FALLBACK, bgColor: '#f0ede6' }]);
      }
      setReady(true);
    })();
  }, [pageSlug]);

  // ── Pre-load images & compute aspect ratios ──────────────────────────────
  useEffect(() => {
    slides.forEach(slide => {
      const url = (isMobile && slide.mobileImage) ? slide.mobileImage : slide.image;
      if (!url) return;
      const key = `${slide.id}-${isMobile ? 'm' : 'w'}`;
      if (aspectRatios[key]) return;

      const img = new Image();
      img.onload = () => {
        setAspectRatios(prev => ({ ...prev, [key]: img.naturalWidth / img.naturalHeight }));
      };
      img.src = url;
    });
  }, [slides, isMobile]);

  // ── Auto-advance every 6 s ────────────────────────────────────────────────
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setCurrentSlide(p => (p === slides.length - 1 ? 0 : p + 1));
    }, 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const next = () => setCurrentSlide(p => (p === slides.length - 1 ? 0 : p + 1));
  const prev = () => setCurrentSlide(p => (p === 0 ? slides.length - 1 : p - 1));

  // ── Skeleton ──────────────────────────────────────────────────────────────
  const isShopAll = ['shop-all', 'shop-by-category', 'deal-of-the-day', 'shop'].includes(pageSlug);

  if (!ready) {
    return (
      <div 
        className={
          isShopAll
            ? "w-full bg-[#faf9f7] pt-0 pb-2 md:pb-3 px-0"
            : "w-full bg-[#f8f4ef] py-3 md:py-4 px-3 sm:px-4 lg:px-6"
        }
      >
        <div
          className={
            isShopAll
              ? "w-full rounded-none overflow-hidden animate-pulse bg-gradient-to-r from-[#e8e0d5] via-[#f0e8db] to-[#e8e0d5]"
              : "w-full rounded-[28px] md:rounded-[36px] overflow-hidden animate-pulse bg-gradient-to-r from-[#e8e0d5] via-[#f0e8db] to-[#e8e0d5]"
          }
          style={{ aspectRatio: isShopAll ? (isMobile ? 2 : 1920 / 427) : 2 }}
        />
      </div>
    );
  }

  if (slides.length === 0) return null;

  const current  = slides[currentSlide];
  const cacheKey = `${current.id}-${(isMobile && current.mobileImage) ? 'm' : 'w'}`;
  const aspect = isShopAll
    ? (isMobile ? 2 : 1920 / 427)
    : (aspectRatios[cacheKey] || 2);
  const imgSrc   = (isMobile && current.mobileImage) ? current.mobileImage : current.image;

  const handleLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.target;
    if (w && h) {
      setAspectRatios(prev => {
        const r = w / h;
        if (prev[cacheKey] === r) return prev;
        return { ...prev, [cacheKey]: r };
      });
    }
  };

  return (
    <div 
      className={
        isShopAll
          ? "w-full bg-[#faf9f7] pt-0 pb-2 md:pb-3 px-0"
          : "w-full bg-[#f8f4ef] py-3 md:py-4 px-3 sm:px-4 lg:px-6"
      }
    >
      <div
        className={
          isShopAll
            ? "relative w-full overflow-hidden rounded-none transition-shadow duration-500 group"
            : [
                'relative w-full overflow-hidden',
                'rounded-[28px] md:rounded-[36px]',
                'shadow-[0_8px_40px_rgba(0,0,0,0.10)]',
                'hover:shadow-[0_14px_50px_rgba(212,175,55,0.18)]',
                'transition-shadow duration-500 group',
              ].join(' ')
        }
        style={{ aspectRatio: aspect }}
      >
        {/* ── Slides ──────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1,  scale: 1     }}
            exit={  { opacity: 0,  scale: 0.985  }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
            style={{ background: current.bgColor || '#f8f4ef' }}
          >
            {current.category ? (
              <Link to={`/shop/shop-by-category?category=${encodeURIComponent(current.category)}`} className="absolute inset-0 w-full h-full block cursor-pointer z-10">
                {current.mobileImage && (
                  <img
                    src={current.mobileImage}
                    alt="Paidhu Banner"
                    className="md:hidden absolute inset-0 w-full h-full object-cover object-center"
                    onLoad={handleLoad}
                  />
                )}
                <img
                  src={imgSrc}
                  alt="Paidhu Banner"
                  className={[
                    current.mobileImage ? 'hidden md:block' : 'block',
                    'absolute inset-0 w-full h-full object-cover object-center',
                    'transition-transform duration-700 group-hover:scale-[1.015]',
                  ].join(' ')}
                  onLoad={handleLoad}
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              </Link>
            ) : (
              <>
                {current.mobileImage && (
                  <img
                    src={current.mobileImage}
                    alt="Paidhu Banner"
                    className="md:hidden absolute inset-0 w-full h-full object-cover object-center"
                    onLoad={handleLoad}
                  />
                )}
                <img
                  src={imgSrc}
                  alt="Paidhu Banner"
                  className={[
                    current.mobileImage ? 'hidden md:block' : 'block',
                    'absolute inset-0 w-full h-full object-cover object-center',
                    'transition-transform duration-700 group-hover:scale-[1.015]',
                  ].join(' ')}
                  onLoad={handleLoad}
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              </>
            )}

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation arrows ───────────────────────────────────────── */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous banner"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-[#662654] hover:scale-110 shadow-lg z-20"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Next banner"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-[#662654] hover:scale-110 shadow-lg z-20"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* ── Dot indicators ──────────────────────────────────────────── */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 px-3.5 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === i
                    ? 'w-5 h-2 bg-[#d4af37]'
                    : 'w-2 h-2 bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageBanner;
