import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const promos = [
  "FREE Shipping above ₹499",
  "10% OFF on your first order. Use code: WELCOME10",
  "Premium Organic Products Directly From Farms"
];

const PromoBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % promos.length);
    }, 4000); // Auto-slide every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const nextPromo = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % promos.length);
  const prevPromo = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + promos.length) % promos.length);

  return (
    <div className="w-full bg-[#006a3a] text-white py-1.5 px-4 relative z-50 flex items-center justify-center">
      <div className="max-w-[1400px] w-full flex items-center justify-center md:justify-between">
        
        {/* Empty div for balancing flex layout on desktop */}
        <div className="hidden md:block w-20"></div>

        <div className="flex items-center gap-4">
          <button onClick={prevPromo} className="text-white/80 hover:text-white transition-colors">
            <ChevronLeft size={16} />
          </button>
          
          <div className="w-[250px] md:w-[350px] text-center overflow-hidden relative h-[20px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute w-full text-[11px] md:text-xs font-semibold tracking-wide"
              >
                {promos[currentIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          <button onClick={nextPromo} className="text-white/80 hover:text-white transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right side links (like login/track order on Veeba) */}
        <div className="hidden md:flex items-center gap-4 text-[10px] font-medium tracking-wider text-white/90 w-20 justify-end">
          <a href="#" className="hover:underline">Track Order</a>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
