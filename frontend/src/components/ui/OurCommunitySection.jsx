import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Calendar, Award, Sparkles } from 'lucide-react';

const InstagramIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FlowerIcon = () => (
  <svg 
    width="120" 
    height="120" 
    viewBox="0 0 100 100" 
    fill="currentColor"
    className="text-[#662654]/5 absolute right-4 bottom-4 pointer-events-none"
  >
    <path d="M50 35c-3.3-9-13.5-9-16.8 0-3.3-9-13.5-9-16.8 0C6.6 40.4 12 55 24.8 55c2.3 0 4.4-.5 6.2-1.4 1.8.9 3.9 1.4 6.2 1.4 12.8 0 18.2-14.6 8.4-20zM50 35c3.3-9 13.5-9 16.8 0 3.3-9 13.5-9 16.8 0 9.8 5.4 4.4 20-8.4 20-2.3 0-4.4-.5-6.2-1.4-1.8.9-3.9 1.4-6.2 1.4-12.8 0-18.2-14.6-9.2-20z" />
    <circle cx="50" cy="50" r="10" />
  </svg>
);

const sliderImages = [
  "/wp_community_1.jpg",
  "/wp_community_2.jpg",
  "/wp_community_3.jpg"
];

const OurCommunitySection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-sans text-gray-800 bg-[#faf9f7] py-6 sm:py-12 overflow-hidden">
      <div className="max-w-[1250px] mx-auto px-4 md:px-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Slideshow, Heading, Subtitle, and Primary CTAs */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* ── Slideshow Banner ── */}
            <div className="relative w-full h-[220px] sm:h-[350px] rounded-[24px] md:rounded-[36px] overflow-hidden shadow-xl bg-gray-100 border border-white/40">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeSlide}
                  src={sliderImages[activeSlide]}
                  alt={`Paidhu Community Slide ${activeSlide + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent z-0" />
              
              {/* Indicators */}
              <div className="absolute bottom-4 left-6 flex gap-2.5 z-10">
                {sliderImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      activeSlide === i ? 'bg-[#fbc225] w-7' : 'bg-white/60 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Title & Subtitle Info */}
            <div className="space-y-4 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#662654]/5 text-[#662654] rounded-full text-xs font-black uppercase tracking-[0.15em] shadow-sm">
                <Sparkles size={12} className="fill-[#662654] text-[#662654]" />
                Join the Tribe
              </span>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#662654] leading-tight font-serif">
                Family Tales by Paidhu
              </h1>
              
              <p className="text-base sm:text-[18px] font-bold text-gray-500 leading-relaxed max-w-2xl">
                A supportive community for parents to connect, share &amp; learn how to nourish their kids better.
              </p>
            </div>

            {/* CTAs Row */}
            <div className="flex flex-wrap gap-3.5 pt-2">
              <a
                href="https://chat.whatsapp.com/H1ECUmlOhe1IVuf2X9F9lE"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#662654] hover:bg-[#521e42] text-white font-extrabold text-[13px] uppercase tracking-wider px-7 py-3.5 rounded-full shadow-[0_6px_20px_rgba(102,38,84,0.22)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
              >
                <MessageSquare size={15} />
                Join On WhatsApp
              </a>
              <a
                href="https://www.instagram.com/paidhu_edibleflowerco/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border-2 border-[#662654] text-[#662654] hover:bg-[#662654] hover:text-white font-extrabold text-[13px] uppercase tracking-wider px-7 py-3.5 rounded-full hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
              >
                <InstagramIcon size={15} />
                Join On Instagram
              </a>
            </div>

          </div>

          {/* Right Column: "Dear Mommies / Flower Recipes" Card and Events info */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* ── Dear Mommies Card ── */}
            <div className="relative bg-gradient-to-br from-white via-[#fdfcfb] to-[#fcfaf7] rounded-[28px] border border-[#662654]/10 shadow-[0_15px_40px_rgba(102,38,84,0.03)] p-6 sm:p-8 overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-b before:from-[#662654] before:to-[#d4af37]">
              <FlowerIcon />
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    Active
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#662654]/5 text-[#662654] rounded-full text-[9px] font-black uppercase tracking-wider">
                    Flower Recipes
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-serif leading-snug">
                  Dear Mommies
                </h2>
                
                <div className="space-y-4 text-gray-600 text-xs sm:text-sm leading-relaxed font-sans">
                  <p className="font-extrabold text-[#662654] text-[15px] sm:text-[16px] leading-snug">
                    Looking to make your kids’ everyday meals colourful, fun, naturally healthy and tasty with edible flowers?
                  </p>
                  <p className="font-semibold text-gray-500">
                    Join our Flower Recipes group by Family Tales community where we share kid-friendly floral recipes, playful food ideas, and simple ways to add natural colour, flavour, and nutrition to your child’s plate.
                  </p>
                  <p className="font-bold text-gray-750">
                    Tap below and bring fresh floral magic into your kids’ meals! 🌸🍽
                  </p>
                </div>

                <div className="pt-4">
                  <a
                    href="https://chat.whatsapp.com/DTuA8M5Z9GZ2QdupKw9zmy?mode=hqrc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[13px] uppercase tracking-wider px-8 py-3.5 rounded-full shadow-[0_6px_20px_rgba(16,185,129,0.25)] hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
                  >
                    <MessageSquare size={16} strokeWidth={2.5} />
                    Click to Join Group
                  </a>
                </div>
              </div>
            </div>

            {/* ── Upcoming Events Card ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#662654]">
                <Calendar size={18} className="stroke-[2.5]" />
                <h3 className="text-lg sm:text-xl font-black font-serif uppercase tracking-tight">
                  Upcoming Events
                </h3>
              </div>
              
              <div className="bg-white rounded-[20px] border border-gray-100 p-5 text-center text-gray-450 text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-2">
                <span>🌸</span>
                <p>No upcoming events scheduled. Stay tuned!</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default OurCommunitySection;
