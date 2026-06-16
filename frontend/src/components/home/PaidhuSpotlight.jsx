import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fallbacks from './fallbacks.json';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const spotlightCache = { current: null };

const PaidhuSpotlight = () => {
  const resolveImage = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  const [products, setProducts] = useState(() => {
    if (spotlightCache.current) return spotlightCache.current;
    const initialList = fallbacks["Bestsellers"] || [];
    return initialList.map(p => ({
      id: p.id,
      name: p.title,
      slug: p.raw ? p.raw.slug : `product-${p.id}`,
      image: p.image
    }));
  });
  const [loading, setLoading] = useState(() => {
    if (spotlightCache.current) return false;
    const initialList = fallbacks["Bestsellers"] || [];
    return initialList.length === 0;
  });

  useEffect(() => {
    let isMounted = true;
    
    // Fetch products dynamically from the database
    fetch(`${API_BASE}/api/products?limit=25`)
      .then(res => res.ok ? res.json() : { products: [] })
      .then(data => {
        const mapped = (data.products || []).map(p => {
          const image = p.image || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imageUrl : null);
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            image: resolveImage(image) || "https://images.unsplash.com/photo-1599598425947-330026217432?q=80&w=500&auto=format&fit=crop"
          };
        });
        spotlightCache.current = mapped;
        if (isMounted) {
          setProducts(mapped);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Error fetching spotlight products:", err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Duplicate items for seamless infinite scrolling loop
  const marqueeItems = [...products, ...products];

  return (
    <section className="w-full pt-10 pb-10 md:pt-16 md:pb-16 bg-[#faf9f8] overflow-hidden font-sans">
      
      {/* CSS for infinite smooth scrolling marquee */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-wrapper {
          display: flex;
          width: max-content;
          animation: marqueeScroll 50s linear infinite;
        }
        .marquee-wrapper:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-4 text-center mb-8 md:mb-12 relative z-10">
        <span className="text-[#662654] font-bold tracking-[0.2em] text-xs uppercase mb-2 block">
          World on Your Plate
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-[#5a2141] tracking-tight leading-[1.1] uppercase">
          SPOTLIGHT
        </h2>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full overflow-hidden py-4 flex items-center">
        {/* Left & Right fading glass overlays for a luxury feel */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#faf9f8] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#faf9f8] to-transparent z-10 pointer-events-none" />

        {loading ? (
          // Skeleton loader row
          <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-hidden w-full px-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div 
                key={`spotlight-skeleton-${idx}`} 
                className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] md:w-[210px] md:h-[210px] lg:w-[240px] lg:h-[240px] flex-shrink-0 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="w-full text-center py-6 text-gray-500 font-semibold">
            No products found to showcase.
          </div>
        ) : (
          <div className="marquee-wrapper gap-4 sm:gap-6 md:gap-8">
            {marqueeItems.map((item, idx) => (
              <Link 
                to={`/product/${item.id}`} 
                key={`spotlight-${idx}-${item.id}`}
                className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] md:w-[210px] md:h-[210px] lg:w-[240px] lg:h-[240px] flex-shrink-0 relative overflow-hidden rounded-2xl border border-gray-100/50 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 group cursor-pointer block"
              >
                {/* Product Image */}
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                  loading="lazy"
                />
                
                {/* Premium Dark Backdrop Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity duration-300 opacity-85 group-hover:opacity-95" />

                {/* Text Content Overlay */}
                <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 text-center z-10 px-3">
                  <span className="text-white text-xs sm:text-sm md:text-base font-black uppercase tracking-wider block mb-1.5 drop-shadow-sm group-hover:text-[#d4af37] transition-colors duration-300 line-clamp-1">
                    {item.name}
                  </span>
                  
                  {/* Expanding Gold Underline on Hover */}
                  <div className="w-4 h-0.5 bg-[#d4af37] mx-auto transition-all duration-300 group-hover:w-16" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PaidhuSpotlight;
