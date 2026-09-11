import React, { useState } from 'react';
import { motion } from 'framer-motion';

const characters = [
  { src: '/illustrations PNG-01 (1).png', message: "100% Natural Ingredients" },
  { src: '/illustrations PNG-02 (1).png', message: "No Refined Sugar" },
  { src: '/illustrations PNG-05 (1).png', message: "Family Approved Recipes" },
  { src: '/illustrations PNG-06 (1).png', message: "Zero Preservatives" },
  { src: '/illustrations PNG-07 (1).png', message: "Joyful & Healthy Snacking" },
];

const BrandCharactersBanner = () => {
  const [activeChar, setActiveChar] = useState(null);

  return (
    <section className="relative w-full min-h-[220px] sm:min-h-[280px] md:min-h-[440px] md:h-[480px] bg-[#ede7d7] overflow-hidden flex flex-col justify-end pt-2 sm:pt-4">
      {/* Decorative Wave at the top connecting to the previous section */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[20px] sm:h-[30px] md:h-[50px]">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-[#662554] opacity-10"></path>
        </svg>
      </div>

      {/* Playful Animated Callout Above Characters */}
      <div className="relative z-10 w-full flex justify-center pt-1 sm:pt-3 pb-2 sm:pb-3 px-4">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            y: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveChar(prev => (prev === null ? 0 : (prev + 1) % characters.length));
          }}
          className="inline-flex items-center gap-1.5 sm:gap-2.5 px-3.5 sm:px-6 py-1 sm:py-2 rounded-full bg-white/95 hover:bg-white shadow-[0_4px_16px_rgba(102,37,84,0.12)] border border-[#662554]/20 cursor-pointer backdrop-blur-md transition-all group"
        >
          <motion.span 
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-sm sm:text-lg"
          >
            🌸
          </motion.span>
          <span className="font-serif font-extrabold text-[#662554] text-[11px] sm:text-sm md:text-base tracking-wide group-hover:text-[#8A3673] transition-colors">
            Curious About Me? Tap to Discover!
          </span>
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-amber-500 text-xs sm:text-base"
          >
            ✨
          </motion.span>
        </motion.div>
      </div>

      {/* Main Content / Characters */}
      <div className="relative w-full max-w-[1400px] mx-auto flex justify-center md:justify-around items-end z-10 px-2 sm:px-4 md:px-8 gap-2 sm:gap-6 md:gap-8 pb-0">
        {characters.map((char, idx) => (
          <motion.div 
            key={idx} 
            className="relative flex flex-col justify-end items-center cursor-pointer"
            onMouseEnter={() => setActiveChar(idx)}
            onMouseLeave={() => setActiveChar(null)}
            onClick={() => setActiveChar(activeChar === idx ? null : idx)}
            // Gentle continuous floating animation
            animate={{
              y: [0, -8, 0]
            }}
            transition={{
              duration: 3 + (idx * 0.4),
              repeat: Infinity,
              ease: "easeInOut"
            }}
            // Playful wiggle on hover
            whileHover={{ 
              scale: 1.15, 
              rotate: [0, -3, 3, -3, 0],
              transition: { duration: 0.4 }
            }}
            // Pop on tap/click
            whileTap={{ scale: 0.95 }}
          >
            {/* Interactive Speech Bubble */}
            <div className={`
              absolute bottom-[108%] mb-2 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-2xl shadow-xl
              transform transition-all duration-300 origin-bottom
              whitespace-nowrap z-30 border border-[#662554] md:border-2
              ${activeChar === idx ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
            `}>
              {/* Bubble Tail */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[6px] md:border-[8px] border-transparent border-t-[#662554]"></div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] md:-mt-[4px] border-[5px] md:border-[6px] border-transparent border-t-white"></div>
              
              <p className="text-[#662554] font-bold text-[9px] sm:text-xs md:text-sm font-sans tracking-wide">
                {char.message}
              </p>
            </div>

            {/* Character Image */}
            <img 
              src={char.src}
              alt={`Paidhu Character ${idx + 1}`}
              width={200}
              height={244}
              loading="lazy"
              className="w-[64px] xs:w-[72px] sm:w-[95px] md:w-[150px] lg:w-[190px] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
            />
          </motion.div>
        ))}
      </div>

      {/* The "Table" / Foreground */}
      <div className="relative w-full h-[68px] sm:h-[75px] md:h-[120px] bg-[#662554] z-20 shadow-[0_-15px_30px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center">
        
        {/* Table Top Highlight/Depth */}
        <div className="absolute top-0 left-0 w-full h-2 md:h-3.5 bg-[#8A3673]"></div>
        
        {/* Wavy cloth overlay hanging off table */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
           <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[10px] md:h-[20px]">
              <path d="M0,0V15c150,20,150-20,300,0s150-20,300,0,150-20,300,0,150-20,300,0V0Z" className="fill-[#8A3673]"></path>
           </svg>
        </div>

        <h3 className="text-[#ede7d7] font-serif text-[15px] sm:text-lg md:text-3xl lg:text-4xl font-bold tracking-wide mt-2 md:mt-4 drop-shadow-md">
          Discover the Magic of Paidhu
        </h3>
        <p className="text-[#ede7d7]/80 text-[9px] sm:text-xs mt-0.5 md:mt-1 font-sans tracking-widest uppercase">
          Tap or hover over our friends!
        </p>
      </div>
    </section>
  );
};

export default BrandCharactersBanner;
