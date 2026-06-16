import React from 'react';
import { motion } from 'framer-motion';
import paidhuCommunityImg from '../../assets/paidhu_community.png';

const RealMomsSection = () => {
  return (
    <section className="relative w-full bg-[#522742] pt-12 pb-0 overflow-hidden">
      {/* Wavy Top SVG Divider (matching the storytelling section above) */}
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#fbc225] font-serif mb-4 tracking-tight">
            Join the Paidhu Family
          </h2>
          <p className="text-lg md:text-xl font-bold text-[#fdfaf6] mb-6 max-w-md leading-snug">
            Connecting health enthusiasts, culinary lovers, and advocates of clean, floral living.
          </p>
          
          <div className="w-full h-px bg-[#fbc225]/30 mb-6"></div>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <span className="text-[#fbc225] mr-3 mt-1 text-xl leading-none">•</span>
              <span className="text-[#fdfaf6] font-medium text-base md:text-lg">Discover unique ways to incorporate edible flowers into your daily recipes</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#fbc225] mr-3 mt-1 text-xl leading-none">•</span>
              <span className="text-[#fdfaf6] font-medium text-base md:text-lg">Get exclusive floral-infused tips from culinary experts and nutritionists</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#fbc225] mr-3 mt-1 text-xl leading-none">•</span>
              <span className="text-[#fdfaf6] font-medium text-base md:text-lg">Receive members-only invitations to farm tours, tastings, and wellness meet-ups</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#fbc225] mr-3 mt-1 text-xl leading-none">•</span>
              <span className="text-[#fdfaf6] font-medium text-base md:text-lg">Connect with a passionate community advocating for clean, natural, and ethical foods</span>
            </li>
          </ul>

          <a 
            href="https://wa.me/918754787774" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-[#fbc225] text-[#522742] text-sm font-black py-2.5 px-6 rounded-full hover:bg-[#e0ad20] transition-colors flex items-center shadow-md w-fit"
          >
            Join Our WhatsApp Community 
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="w-full md:w-1/2 relative flex justify-end h-[400px] md:h-[600px] lg:h-[700px]"
        >
          {/* We use a clip-path for the organic wave on the left side of the image */}
          <div 
            className="w-full h-full bg-transparent"
            style={{
              clipPath: 'url(#paidhu-wave-clip)',
              WebkitClipPath: 'url(#paidhu-wave-clip)',
            }}
          >
            <img 
              src={paidhuCommunityImg} 
              alt="Paidhu Community" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* SVG Clip Path Definition for the right image organic wave */}
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
