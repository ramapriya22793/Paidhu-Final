import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';

const SUPABASE_STORAGE_URL = 'https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/community';

const communitySlides = [
  '/paidhu_mom_community_event_2.jpg',
  '/paidhu_mom_community_event_1.jpg',
  '/paidhu_mom_community_event_3.jpg',
  '/paidhu_mom_community_event_4.jpg',
  `${SUPABASE_STORAGE_URL}/wp_community_4.jpg`,
  `${SUPABASE_STORAGE_URL}/wp_community_5.jpg`,
  `${SUPABASE_STORAGE_URL}/wp_community_6.jpg`,
  `${SUPABASE_STORAGE_URL}/wp_community_7.jpg`,
  `${SUPABASE_STORAGE_URL}/wp_community_8.jpg`,
  `${SUPABASE_STORAGE_URL}/wp_community_1.jpg`,
  `${SUPABASE_STORAGE_URL}/wp_community_2.jpg`,
  `${SUPABASE_STORAGE_URL}/wp_community_3.jpg`,
];

const bulletPoints = [
  "Connect with health-conscious families in your city",
  "Get expert advice on wholesome nutrition, healthy growth, and natural wellness",
  "Share unique, family-friendly recipes using floral petal jams and natural ingredients",
  "Receive invitations to exclusive local meetups, workshops, and product tastings"
];

const RealMomsSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % communitySlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveSlide(prev => (prev - 1 + communitySlides.length) % communitySlides.length);
  };

  const handleNext = () => {
    setActiveSlide(prev => (prev + 1) % communitySlides.length);
  };

  return (
    <section className="relative w-full bg-[#faf7f3] overflow-hidden">
      {/* Wavy Top SVG Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180 pointer-events-none z-10">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[35px] md:h-[60px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#e9e3d5"></path>
        </svg>
      </div>

      <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-16 md:pb-20 px-5 sm:px-8 md:px-10 lg:px-16 gap-8 md:gap-12 lg:gap-16">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full md:w-[48%] lg:w-[46%] text-left"
        >
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#522742]/10 text-[#522742] text-[11px] font-black uppercase tracking-wider mb-3">
            <Sparkles size={12} className="text-[#d4af37]" />
            <span>Real Moms • Real Stories</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-[#522742] font-serif mb-3 tracking-tight leading-[1.15]">
            Paidhu Community
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-medium text-[#522742]/85 mb-5 max-w-lg leading-relaxed">
            A supportive space to share tips on clean eating, wholesome family nutrition, and pure culinary delights.
          </p>

          <div className="w-full h-px bg-[#522742]/15 mb-6"></div>

          {/* Feature Bullets with Precision Alignment */}
          <ul className="space-y-3 sm:space-y-3.5 mb-6">
            {bulletPoints.map((text, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#fbc225]/20 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <div className="w-2 h-2 rounded-full bg-[#fbc225]" />
                </div>
                <span className="text-[#4b3c43] font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          {/* Slide dots with active pill */}
          <div className="flex items-center gap-1.5 mb-7 flex-wrap">
            {communitySlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === i ? 'w-7 bg-[#522742] shadow-xs' : 'w-2 bg-[#522742]/25 hover:bg-[#522742]/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://chat.whatsapp.com/EDlauzE5x1B6U23RamfCej?s=sh&p=a&ilr=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#522742] to-[#6d2f57] hover:from-[#662654] hover:to-[#7f3767] text-white text-xs sm:text-sm font-black py-3 px-7 rounded-full shadow-[0_4px_16px_rgba(82,39,66,0.25)] hover:shadow-[0_6px_22px_rgba(82,39,66,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
            >
              <span>Join Our Community</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </a>

            {/* Slider Nav Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#522742] border border-[#522742]/15 shadow-sm flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Previous community photo"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#522742] border border-[#522742]/15 shadow-sm flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Next community photo"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right — Real community slideshow with mobile card and desktop wave clip */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="w-full md:w-[52%] lg:w-[54%] relative flex justify-center md:justify-end"
        >
          {/* Card Container: Rounded & clean on mobile so faces are never cut off; artistic wave on desktop */}
          <div
            className="w-full h-[280px] sm:h-[350px] md:h-[460px] lg:h-[520px] rounded-3xl md:rounded-none shadow-xl md:shadow-none border-4 md:border-0 border-white overflow-hidden relative"
            style={{
              clipPath: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'url(#paidhu-wave-clip)' : 'none',
              WebkitClipPath: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'url(#paidhu-wave-clip)' : 'none',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeSlide}
                src={communitySlides[activeSlide]}
                alt={`Paidhu Community ${activeSlide + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7 }}
              />
            </AnimatePresence>

            {/* Floating Event Badge */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-white/60 flex items-center gap-2">
              <Heart size={14} className="fill-[#e84a5f] text-[#e84a5f]" />
              <span className="text-[11px] sm:text-xs font-black text-[#522742] tracking-wide">
                Paidhu Family Gathering #{activeSlide + 1}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SVG Clip Path for Desktop */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="paidhu-wave-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.06 0 C 0.14 0.12, -0.02 0.32, 0.03 0.5 C 0.10 0.68, -0.02 0.88, 0.07 1 L 1 1 L 1 0 Z" />
          </clipPath>
        </defs>
      </svg>
    </section>
  );
};

export default RealMomsSection;
