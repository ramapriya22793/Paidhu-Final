import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    id: '01',
    title: 'Healthy Kids Snacks',
    description: 'Nutritious and delicious snacks made with premium natural ingredients for growing kids.',
    images: [
      'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937180748-WhatsAppImage20251128at14404PM600x402jpeg.jpeg',
      'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780936984001-aavarampoo600x403jpeg.jpeg',
      'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780936736170-whitelotuscookie300x300jpeg.jpeg',
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: '02',
    title: 'Flower Based Infusions',
    description: 'Discover wellness blends crafted from edible flowers, herbs, and traditional ingredients.',
    images: [
      'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937722325-WhatsAppImage20251113at233024f74fae34600x800jpg.jpg',
      'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780938733725-WhatsAppImage20251113at23302330981866600x800jpg.jpg',
      'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937825758-WhatsAppImage20251113at233021b33d20d8600x600jpg.jpg',
      'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937914670-WhatsAppImage20251113at2330215f60b43f600x800jpg.jpg',
      'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937499230-WhatsAppImage20251113at233020322c5e7d600x800jpg.jpg'
    ]
  },
  {
    id: '03',
    title: 'Moms Community',
    description: 'Join the Paidhu moms community to share parenting experiences, healthy food ideas, and lifestyle tips.',
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1536640712247-c57f6ff9c26a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484981138541-3d074aa97716?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: '04',
    title: 'Travel Friendly Foods',
    description: 'Convenient healthy snacks and ready-to-carry products designed for modern families on the go.',
    images: [
      'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780897222396-IMG20250917121311600x404png.png',
      'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780939517153-saffronneign600x600jpg.jpg',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop',
      'https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780856723641-WhatsAppImage20260417at10558PM600x750jpeg.jpeg'
    ]
  }
];

const FeaturedBento = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Automatically cycle images for the active category
  useEffect(() => {
    setCurrentImageIndex(0); // Reset to first image when category changes

    const activeFeature = features[activeIndex];
    if (!activeFeature.images || activeFeature.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % activeFeature.images.length);
    }, 4000); // Cycle images every 4 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section className="w-full bg-[#fcfbfa] pt-12 pb-6 md:pt-20 md:pb-8">
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
                            <div className="mt-4 flex items-center gap-2 text-[#662654] text-xs font-bold uppercase tracking-wider">
                              Explore <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                            </div>
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
          <div className="lg:col-span-7 h-[400px] md:h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden relative shadow-2xl bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${activeIndex}-${currentImageIndex}`}
                src={features[activeIndex].images[currentImageIndex]}
                alt={features[activeIndex].title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Elegant overlay gradient to make it look premium */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Premium Slide indicators (Dots) */}
            {features[activeIndex].images && features[activeIndex].images.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
                {features[activeIndex].images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentImageIndex === idx 
                        ? 'bg-white w-6 shadow-md' 
                        : 'bg-white/40 hover:bg-white/80'
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
