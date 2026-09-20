import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    id: '01',
    title: 'Healthy Kids Snacks',
    description: 'Nutritious and crunchy bloom cookies crafted with pure millets, butter, and edible flower extracts—100% free of refined sugar and preservatives.',
    link: '/shop/shop-by-category?category=Bloom%20Cookies',
    images: [
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807099194-whitelotuscookiepng.png',
        title: 'Bloom Cookies - White Lotus',
        isProduct: true
      },
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807081906-AAVARAMPOOpng.png',
        title: 'Bloom Cookies - Aavaram Poo',
        isProduct: true
      },
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807060350-hibiscuscookiespng.png',
        title: 'Bloom Cookies - Hibiscus',
        isProduct: true
      }
    ]
  },
  {
    id: '02',
    title: 'Flower Based Infusions',
    description: 'Discover pure whole-flower wellness teas and dip infusions crafted from sun-dried edible blossoms and ancient botanical traditions.',
    link: '/shop/shop-by-category?category=Brew%20Flora',
    images: [
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806532876-Aavarempng.png',
        title: 'Brew Flora - Aavaram Poo (30g)',
        isProduct: true
      },
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806858400-CHAMOMILEBREWFLORApng.png',
        title: 'Brew Flora - Chamomile (30g)',
        isProduct: true
      },
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806997507-6png.png',
        title: 'Brew Flora - Blue Pea (30g)',
        isProduct: true
      },
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789803500245-MEDLEYTEAS1png.png',
        title: 'Medly Teas - Hibiscus (20 Dips)',
        isProduct: true
      },
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806823754-4png.png',
        title: 'Medly Teas - Lavender (20 Dips)',
        isProduct: true
      },
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806919503-7png.png',
        title: 'Brew Flora - Hibiscus Tea (30g)',
        isProduct: true
      }
    ]
  },
  {
    id: '03',
    title: 'Paidhu Community',
    description: 'Join thousands of mindful mothers and families sharing natural wellness recipes, parenting stories, and holistic lifestyle journeys.',
    link: '/blogs',
    images: [
      {
        src: '/paidhu_mom_community_event_2.jpg',
        title: 'Paidhu Moms & Families Gathering',
        isProduct: false
      },
      {
        src: '/paidhu_mom_community_event_1.jpg',
        title: 'Community Wellness & Tasting Session',
        isProduct: false
      },
      {
        src: '/paidhu_mom_community_event_3.jpg',
        title: 'Wholesome Gathering & Recipe Sharing',
        isProduct: false
      },
      {
        src: '/paidhu_mom_community_event_4.jpg',
        title: 'Family Health & Natural Nutrition',
        isProduct: false
      },
      {
        src: '/moms_garden_gathering.png',
        title: 'Paidhu Garden Community',
        isProduct: false
      }
    ]
  },
  {
    id: '04',
    title: 'Travel Friendly Foods',
    description: 'Convenient dip teas, royal Kashmiri saffron, and artisanal petal preserves designed for effortless nourishment wherever you travel.',
    link: '/shop',
    images: [
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789803563135-Screenshot202608061246502png.png',
        title: 'Cassia Fistula Medley Tea (20 Dips)',
        isProduct: true
      },
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806804404-2png.png',
        title: 'Medly Teas - Saffron (20 Dips)',
        isProduct: true
      },
      {
        src: 'https://wp.paidhu.com/wp-content/uploads/2024/08/saffron-neign.jpg',
        title: 'Super Negin Kashmiri Saffron',
        isProduct: true
      },
      {
        src: 'https://wp.paidhu.com/wp-content/uploads/2025/07/Gulkand-final.jpg',
        title: 'Artisanal Rose Gulkhand Jam',
        isProduct: true
      },
      {
        src: 'https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807238758-ChatGPTImageApr242026105405AM180x180png.png',
        title: "Tanner's Flower Petal Jam",
        isProduct: true
      }
    ]
  }
];

const FeaturedBento = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Automatically cycle images for the active category
  useEffect(() => {
    setCurrentImageIndex(0); // Reset to first image when category changes

    const activeFeature = features[activeIndex];
    if (!activeFeature.images || activeFeature.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % activeFeature.images.length);
    }, 3800); // Cycle images every 3.8 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  const activeFeature = features[activeIndex];
  const currentImgData = activeFeature.images[currentImageIndex] || activeFeature.images[0];

  const handleExplore = (link) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <section className="w-full bg-[#fcfbfa] pt-2 pb-6 md:pt-4 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-6 md:mb-8">
          <span className="text-[#662654] font-bold tracking-[0.2em] text-xs uppercase mb-2 block">
            Discover
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#5a2141] tracking-tight leading-[1.1]">
            The Paidhu Experience
          </h2>
        </div>

        {/* Interactive Menu & Image Reveal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Interactive Text Menu */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {features.map((feature, index) => {
              const isActive = activeIndex === index;
              
              return (
                <div 
                  key={feature.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`group relative py-5 md:py-6 border-b border-[#662654]/10 cursor-pointer transition-all duration-300 ${isActive ? 'pl-6' : 'hover:pl-4'}`}
                >
                  {/* Active Indicator Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[#662654] rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`} />
                  
                  <div className="flex items-start gap-4 md:gap-6">
                    <span className={`text-sm md:text-base font-semibold transition-colors duration-300 mt-1 ${isActive ? 'text-[#662654]' : 'text-gray-400'}`}>
                      {feature.id}
                    </span>
                    <div className="flex-1">
                      <h3 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-[#662654]' : 'text-gray-400 group-hover:text-gray-500'}`}>
                        {feature.title}
                      </h3>
                      
                      {/* Expandable Description */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed max-w-sm">
                              {feature.description}
                            </p>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExplore(feature.link);
                              }}
                              className="mt-4 inline-flex items-center gap-2 text-[#662654] text-xs font-bold uppercase tracking-wider hover:text-[#8b235c] transition-colors"
                            >
                              Explore <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Image Reveal Window */}
          <div 
            onClick={() => handleExplore(activeFeature.link)}
            className="lg:col-span-7 h-[400px] md:h-[500px] lg:h-[560px] rounded-[2rem] overflow-hidden relative shadow-xl bg-gradient-to-br from-white via-[#fdfbf9] to-[#f5eeea] border border-[#662654]/10 cursor-pointer group"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-${currentImageIndex}`}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full flex items-center justify-center p-4 md:p-8"
              >
                <img
                  src={currentImgData.src}
                  alt={currentImgData.title || activeFeature.title}
                  loading="lazy"
                  className={`w-full h-full ${
                    currentImgData.isProduct 
                      ? 'object-contain max-h-[85%] drop-shadow-xl group-hover:scale-105 transition-transform duration-500' 
                      : 'object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500'
                  }`}
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Top Right "Shop Now" Action Pill */}
            <div className="absolute top-5 right-5 z-20 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#662654] text-white text-xs font-semibold rounded-full shadow-lg">
                <ShoppingBag size={13} />
                <span>Shop Collection</span>
              </div>
            </div>

            {/* Bottom Floating Caption Card */}
            {currentImgData.title && (
              <div className="absolute bottom-6 left-6 right-20 z-20">
                <div className="inline-block bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-[#662654]/10 max-w-full">
                  <p className="text-[#662654] text-xs md:text-sm font-bold truncate">
                    {currentImgData.title}
                  </p>
                </div>
              </div>
            )}

            {/* Premium Slide indicators (Dots) */}
            {activeFeature.images && activeFeature.images.length > 1 && (
              <div className="absolute bottom-6 right-6 flex items-center gap-1.5 z-20 bg-black/20 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
                {activeFeature.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === idx 
                        ? 'bg-white w-5 shadow-sm' 
                        : 'bg-white/50 hover:bg-white/90 w-2'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedBento;
