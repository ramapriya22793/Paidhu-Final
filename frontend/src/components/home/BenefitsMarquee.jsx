import React from 'react';
import { motion } from 'framer-motion';

// Custom Icons for the Marquee
const WheatOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22l20-20" />
    <path d="M12 16v.01" />
    <path d="M8 12v.01" />
    <path d="M12 8v.01" />
    <path d="M16 12v.01" />
    <path d="M8 16v.01" />
    <path d="M4 20v.01" />
  </svg>
);

const MilletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <circle cx="18" cy="8" r="2" fill="currentColor" />
    <circle cx="6" cy="16" r="2" fill="currentColor" />
    <circle cx="16" cy="18" r="2" fill="currentColor" />
    <circle cx="8" cy="6" r="2" fill="currentColor" />
  </svg>
);

const FlaskOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22l20-20" />
    <path d="M10 5h4" />
    <path d="M10 5v4l-4.5 7.5A2 2 0 0 0 7.2 20h9.6a2 2 0 0 0 1.7-3.5L14 9" />
  </svg>
);

const benefits = [
  { text: "No Maida", icon: <WheatOffIcon /> },
  { text: "Made with Millets", icon: <MilletIcon /> },
  { text: "No Preservatives", icon: <FlaskOffIcon /> },
  { text: "100% Natural", icon: <WheatOffIcon /> }, 
];

const BenefitsMarquee = () => {
  const repeatedItems = [...benefits, ...benefits, ...benefits, ...benefits, ...benefits];

  return (
    <div className="w-full bg-[#662654] py-3.5 md:py-5 overflow-hidden flex">
      <motion.div 
        className="flex w-max whitespace-nowrap items-center cursor-default"
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ 
          ease: "linear", 
          duration: 25, 
          repeat: Infinity 
        }}
      >
        {/* Block 1 */}
        <div className="flex-none flex gap-12 md:gap-24 px-6 md:px-12 items-center">
          {repeatedItems.map((item, index) => (
            <div key={`block1-${index}`} className="flex items-center gap-3 md:gap-4 flex-none">
              <span className="text-white drop-shadow-sm">{item.icon}</span>
              <span className="text-white font-black uppercase text-[15px] md:text-[22px] tracking-wide drop-shadow-sm mt-1">
                {item.text}
              </span>
            </div>
          ))}
        </div>
        
        {/* Block 2 (Exact Duplicate for seamless loop) */}
        <div className="flex-none flex gap-12 md:gap-24 px-6 md:px-12 items-center">
          {repeatedItems.map((item, index) => (
            <div key={`block2-${index}`} className="flex items-center gap-3 md:gap-4 flex-none">
              <span className="text-white drop-shadow-sm">{item.icon}</span>
              <span className="text-white font-black uppercase text-[15px] md:text-[22px] tracking-wide drop-shadow-sm mt-1">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BenefitsMarquee;
