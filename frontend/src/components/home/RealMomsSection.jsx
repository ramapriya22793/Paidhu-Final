import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const RealMomsSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % communitySlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full bg-[#faf7f3] overflow-hidden">
      {/* Wavy Top SVG Divider */}
      <div className="w-full overflow-hidden leading-[0] transform rotate-180">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[25px] sm:h-[35px] md:h-[45px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#e9e3d5"></path>
        </svg>
      </div>

      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-8 sm:pb-10 md:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full lg:col-span-6 text-left"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#522742] font-serif mb-2 sm:mb-3 tracking-tight">
              Paidhu Community
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-bold text-[#522742]/85 mb-3 sm:mb-4 max-w-lg leading-snug">
              A supportive space to share tips on clean eating, wholesome family nutrition, and pure culinary delights.
            </p>

            <div className="w-full h-px bg-[#522742]/20 mb-3 sm:mb-4"></div>

            <ul className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-6">
              <li className="flex items-start">
                <span className="text-[#fbc225] mr-2.5 mt-0.5 text-lg leading-none">•</span>
                <span className="text-[#4b3c43] font-medium text-xs sm:text-sm md:text-base">Connect with health-conscious families in your city</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#fbc225] mr-2.5 mt-0.5 text-lg leading-none">•</span>
                <span className="text-[#4b3c43] font-medium text-xs sm:text-sm md:text-base">Get expert advice on wholesome nutrition, healthy growth, and natural wellness</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#fbc225] mr-2.5 mt-0.5 text-lg leading-none">•</span>
                <span className="text-[#4b3c43] font-medium text-xs sm:text-sm md:text-base">Share unique, family-friendly recipes using floral petal jams and natural ingredients</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#fbc225] mr-2.5 mt-0.5 text-lg leading-none">•</span>
                <span className="text-[#4b3c43] font-medium text-xs sm:text-sm md:text-base">Receive invitations to exclusive local meetups, workshops, and product tastings</span>
              </li>
            </ul>

            {/* Slide dots */}
            <div className="flex gap-2 mb-4 sm:mb-6">
              {communitySlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeSlide === i ? 'w-7 bg-[#522742]' : 'w-2 bg-[#522742]/30 hover:bg-[#522742]/60'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <a
              href="https://chat.whatsapp.com/EDlauzE5x1B6U23RamfCej?s=sh&p=a&ilr=0"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#522742] text-white text-xs sm:text-sm font-black py-2.5 px-6 rounded-full hover:bg-[#662654] transition-colors inline-flex items-center shadow-md w-fit"
            >
              Join Our Community
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

          {/* Right — Real Community Slideshow Showcase (Restored Model with Rounded Card & Badges) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="w-full lg:col-span-6 relative flex justify-center items-center py-2"
          >
            <div className="relative w-full h-[260px] sm:h-[340px] md:h-[440px] lg:h-[500px] rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-xl md:shadow-2xl border-2 sm:border-4 border-white bg-white/60">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeSlide}
                  src={communitySlides[activeSlide]}
                  alt={`Paidhu Community ${activeSlide + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7 }}
                />
              </AnimatePresence>

              {/* Gentle bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

              {/* Badges on the image */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between z-10 pointer-events-none">
                <span className="text-[10px] sm:text-xs font-bold text-white bg-[#522742]/85 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
                  Paidhu Family Gatherings
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-white/90 bg-black/40 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                  {activeSlide + 1} / {communitySlides.length}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RealMomsSection;
