import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center group"
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-[4px] border-white shadow-2xl bg-[var(--color-brand-gold)] overflow-visible">
        {/* Mascot Image */}
        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
          <img 
            src="/mascot.png" 
            alt="Chat with us" 
            className="w-[120%] h-[120%] object-cover scale-110"
          />
        </div>
        
        {/* Red Notification Badge */}
        <div className="absolute -top-2 -right-1 w-7 h-7 md:w-8 md:h-8 bg-[#ef4444] text-white text-sm font-bold flex items-center justify-center rounded-full shadow-md border-[3px] border-white z-10">
          1
        </div>

        {/* Green Online Dot */}
        <div className="absolute bottom-0 right-0 w-5 h-5 md:w-6 md:h-6 bg-[#22c55e] rounded-full border-[3px] border-white shadow-sm z-10"></div>
        
        {/* Pulse effect */}
        <div className="absolute -inset-2 bg-[var(--color-brand-gold)] rounded-full animate-ping opacity-20 group-hover:opacity-40 z-[-1] transition-opacity duration-300"></div>
      </div>
    </motion.a>
  );
};

export default WhatsAppButton;
