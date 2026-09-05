import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SUPABASE_STORAGE_URL = 'https://ljrwcciuacjbwocsxiqc.supabase.co/storage/v1/object/public/products/community';

const communitySlides = [
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
    <section className="relative w-full bg-[#faf7f3] pt-12 pb-0 overflow-hidden">
      {/* Wavy Top SVG Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[60px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#e9e3d5"></path>
        </svg>
      </div>

      <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between pt-16 md:pt-24 pb-12 md:pb-0 pl-6 md:pl-16 lg:pl-24">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full md:w-1/2 text-left mb-12 md:mb-0 pr-6 md:pr-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#522742] font-serif mb-4 tracking-tight">
            Paidhu Moms Community
          </h2>
          <p className="text-lg md:text-xl font-bold text-[#522742]/85 mb-6 max-w-md leading-snug">
            A supportive space for moms to share tips on clean eating, child nutrition, and natural family wellness.
          </p>

          <div className="w-full h-px bg-[#522742]/20 mb-6"></div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <span className="text-[#fbc225] mr-3 mt-1 text-xl leading-none">•</span>
              <span className="text-[#4b3c43] font-medium text-base md:text-lg">Connect with health-conscious moms in your city</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#fbc225] mr-3 mt-1 text-xl leading-none">•</span>
              <span className="text-[#4b3c43] font-medium text-base md:text-lg">Get expert advice on child nutrition, healthy growth, and natural remedies</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#fbc225] mr-3 mt-1 text-xl leading-none">•</span>
              <span className="text-[#4b3c43] font-medium text-base md:text-lg">Share unique, kids-friendly recipes using floral petal jams and natural ingredients</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#fbc225] mr-3 mt-1 text-xl leading-none">•</span>
              <span className="text-[#4b3c43] font-medium text-base md:text-lg">Receive invitations to exclusive local meetups, wellness workshops, and product tastings</span>
            </li>
          </ul>

          {/* Slide dots */}
          <div className="flex gap-2 mb-6">
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
            className="bg-[#522742] text-white text-sm font-black py-2.5 px-6 rounded-full hover:bg-[#662654] transition-colors flex items-center shadow-md w-fit"
          >
            Join Our Moms Community
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        {/* Right — Real community slideshow with wave clip */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="w-full md:w-1/2 relative flex justify-end h-[400px] md:h-[600px] lg:h-[700px]"
        >
          <div
            className="w-full h-full bg-transparent overflow-hidden"
            style={{
              clipPath: 'url(#paidhu-wave-clip)',
              WebkitClipPath: 'url(#paidhu-wave-clip)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeSlide}
                src={communitySlides[activeSlide]}
                alt={`Paidhu Moms Community ${activeSlide + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* SVG Clip Path */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="paidhu-wave-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.15 0 C 0.3 0.1, -0.05 0.3, 0.05 0.5 C 0.15 0.7, -0.1 0.9, 0.2 1 L 1 1 L 1 0 Z" />
          </clipPath>
        </defs>
      </svg>
    </section>
  );
};

export default RealMomsSection;


