import React from 'react';
import { motion } from 'framer-motion';

const mediaLogos = [
  {
    id: 1,
    name: "Indian Express",
    imgSrc: "https://upload.wikimedia.org/wikipedia/commons/4/4e/The_Indian_Express_logo.svg",
    url: "https://indianexpress.com",
    bgColor: "bg-[#fff9ed]", // Pale yellow
    textColor: "text-[#ed1b24]",
    fontStyle: "font-serif font-bold tracking-tight text-xl"
  },
  {
    id: 2,
    name: "Studio LykKari",
    imgSrc: "https://logo.clearbit.com/studiolykkari.com",
    url: "https://studiolykkari.com",
    bgColor: "bg-[#fdf0f5]", // Pale pink
    textColor: "text-[#662654]",
    fontStyle: "font-sans font-black italic tracking-wider text-lg"
  },
  {
    id: 3,
    name: "Tofler",
    imgSrc: "https://logo.clearbit.com/tofler.in",
    url: "https://www.tofler.in",
    bgColor: "bg-[#f5f9ff]", // Pale blue
    textColor: "text-[#0052cc]",
    fontStyle: "font-sans font-bold tracking-widest text-2xl uppercase"
  },
  {
    id: 4,
    name: "Audience Reports",
    imgSrc: "https://logo.clearbit.com/audiencereports.com",
    url: "https://audiencereports.com",
    bgColor: "bg-[#f4fcf8]", // Pale green
    textColor: "text-[#128746]",
    fontStyle: "font-serif font-bold tracking-wide text-lg"
  },
  {
    id: 5,
    name: "Rocker Research",
    imgSrc: "https://logo.clearbit.com/rockerresearch.com",
    url: "https://rockerresearch.com",
    bgColor: "bg-[#fff5f5]", // Pale red
    textColor: "text-[#c53030]",
    fontStyle: "font-sans font-black uppercase text-xl"
  }
];

// Duplicate the array to ensure seamless infinite scroll
const marqueeItems = [...mediaLogos, ...mediaLogos];

const LogoDisplay = ({ logo }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <a 
      href={logo.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`block w-full h-24 md:h-28 flex items-center justify-center ${logo.bgColor} rounded-xl transition-all duration-500 filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:shadow-[0_15px_35px_rgba(102,38,84,0.15)] hover:scale-105 overflow-hidden p-4 group`}
    >
      {!imgError ? (
        <img 
          src={logo.imgSrc} 
          alt={logo.name} 
          loading="lazy"
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:drop-shadow-md transition-all duration-300"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={`${logo.fontStyle} ${logo.textColor} text-center leading-tight`}>
          {logo.name}
        </span>
      )}
    </a>
  );
};

const AsSeenOn = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-[#ede7d7] overflow-hidden relative border-y border-[#d4b08c]/30">
      
      {/* Dynamic CSS for Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl font-black text-[#662654] text-center mb-4 tracking-tight drop-shadow-sm"
        >
          As Seen On
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#2b2b2b] font-medium text-sm md:text-lg text-center opacity-80"
        >
          Recognized by leading media and research platforms across India.
        </motion.p>
      </div>

      <div className="relative w-full overflow-hidden flex items-center py-6">
        
        {/* Soft Fade Edges matching the bg color */}
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#ede7d7] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#ede7d7] to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="flex animate-marquee-infinite w-[200%] sm:w-[200%] md:w-[150%] lg:w-[100%] items-center hover:pause">
          {marqueeItems.map((logo, index) => (
            <div 
              key={`${logo.id}-${index}`} 
              className="flex-shrink-0 w-[240px] md:w-[280px] px-3 md:px-5 flex items-center justify-center cursor-pointer"
            >
              <LogoDisplay logo={logo} />
            </div>
          ))}
          {/* Third duplicate set to guarantee no gap on very wide screens */}
          {mediaLogos.map((logo, index) => (
            <div 
              key={`extra-${logo.id}-${index}`} 
              className="flex-shrink-0 w-[240px] md:w-[280px] px-3 md:px-5 flex items-center justify-center cursor-pointer"
            >
              <LogoDisplay logo={logo} />
            </div>
          ))}
          {/* Fourth duplicate set to guarantee smooth loop for the 50% translation */}
          {mediaLogos.map((logo, index) => (
            <div 
              key={`extra2-${logo.id}-${index}`} 
              className="flex-shrink-0 w-[240px] md:w-[280px] px-3 md:px-5 flex items-center justify-center cursor-pointer"
            >
              <LogoDisplay logo={logo} />
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
};

export default AsSeenOn;
