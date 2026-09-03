import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Mail, Phone, Heart } from 'lucide-react';
import paidhuLogo from '../assets/paidhulogo.png';
import SEO from '../components/seo/SEO';

const WhatsAppIcon = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path
      fill="#FFFFFF"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M35.1 12.9C32.2 9.9 28.2 8.3 24 8.3C15.3 8.3 8.3 15.3 8.3 24C8.3 26.8 9 29.5 10.4 31.9L8 40L16.4 37.8C18.7 39.1 21.3 39.7 24 39.7C32.7 39.7 39.7 32.7 39.7 24C39.7 19.8 38 15.8 35.1 12.9ZM24 37.1C21.6 37.1 19.3 36.5 17.3 35.3L16.8 35L11.8 36.3L13.1 31.5L12.8 31C11.4 28.9 10.7 26.5 10.7 24C10.7 16.7 16.7 10.7 24 10.7C27.5 10.7 30.9 12.1 33.4 14.6C35.9 17.1 37.3 20.4 37.3 24C37.3 31.3 31.3 37.1 24 37.1ZM31.3 27.2C30.9 27 29 26.1 28.6 26C28.2 25.8 28 25.7 27.7 26.1C27.4 26.5 26.7 27.4 26.5 27.7C26.3 27.9 26.1 28 25.7 27.8C25.3 27.6 23.9 27.1 22.3 25.7C21 24.6 20.2 23.2 20 22.8C19.8 22.4 20 22.2 20.2 22C20.4 21.8 20.6 21.5 20.8 21.3C21 21.1 21 20.9 21.1 20.7C21.2 20.5 21.2 20.3 21.1 20.1C21 19.9 20.3 18.2 20 17.5C19.7 16.8 19.4 16.9 19.2 16.9C19 16.9 18.7 16.9 18.5 16.9C18.2 16.9 17.8 17 17.5 17.4C17.1 17.8 16.1 18.7 16.1 20.6C16.1 22.5 17.5 24.3 17.7 24.5C17.9 24.7 20.4 28.6 24.3 30.3C25.2 30.7 25.9 30.9 26.5 31.1C27.5 31.4 28.4 31.4 29.1 31.3C29.9 31.2 31.5 30.3 31.9 29.3C32.2 28.3 32.2 27.4 32.1 27.2C32 27.1 31.7 27.4 31.3 27.2Z"
    />
  </svg>
);

const WHATSAPP_LINK = 'https://wa.me/918754787774?text=Hi%20Paidhu%20Team%2C%20I%20am%20visiting%20your%20website%20and%20noticed%20it%20is%20under%20maintenance.%20I%20would%20like%20assistance%20with...';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fcfbfa] via-[#faf7f3] to-[#f4f0ea] text-gray-800 flex flex-col justify-between font-sans relative overflow-x-hidden">
      <SEO
        title="We'll Be Right Back | Paidhu Edible Flower Co."
        description="Paidhu is currently undergoing scheduled maintenance. Reach out directly on WhatsApp at +91 87547 87774 for inquiries and orders."
      />

      {/* Background Floral Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#662654]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#d4af37]/8 blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-[#662654]/10 bg-white/70 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <img src={paidhuLogo} alt="Paidhu Logo" className="h-9 md:h-11 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#662654] bg-[#662654]/10 px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Scheduled Maintenance</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#662654] text-[#ede7d7] text-xs md:text-sm font-extrabold uppercase tracking-widest shadow-md mb-6"
        >
          <Sparkles size={14} className="text-[#fbc225] fill-[#fbc225]" />
          <span>Blossoming Behind the Scenes</span>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#662654] font-serif tracking-tight leading-[1.15] mb-4"
        >
          We're Polishing Up <br className="hidden sm:inline" />
          <span className="text-gray-900">Our Floral Store</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg font-medium text-gray-600 max-w-2xl leading-relaxed mb-8"
        >
          Our website is temporarily undergoing scheduled maintenance and performance upgrades to deliver an even sweeter, fresher, and smoother shopping experience for your family.
        </motion.p>

        {/* Status Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl mb-8"
        >
          <div className="bg-white/85 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-2xl mb-1.5">🌸</span>
            <h4 className="text-xs md:text-sm font-black text-gray-900">Catalog Refresh</h4>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5 leading-snug">New botanical bakes & preserves</p>
          </div>

          <div className="bg-white/85 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-2xl mb-1.5">⚡</span>
            <h4 className="text-xs md:text-sm font-black text-gray-900">Faster Speeds</h4>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5 leading-snug">Smooth browsing & fast checkout</p>
          </div>

          <div className="bg-white/85 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-2xl mb-1.5">🛡️</span>
            <h4 className="text-xs md:text-sm font-black text-gray-900">System Upgrades</h4>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5 leading-snug">Secure payments & order tracking</p>
          </div>
        </motion.div>

        {/* ── DOWN: PROMINENT WHATSAPP NAVIGATION ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-2xl bg-gradient-to-br from-[#662654] via-[#521e42] to-[#3a132e] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-[#d4af37]/30"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#25D366]/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-3">
            <span className="inline-flex items-center gap-1 text-[#fbc225] text-xs font-black uppercase tracking-widest">
              <Heart size={13} className="fill-[#fbc225]" />
              Direct Customer Support Active
            </span>

            <h3 className="text-xl sm:text-2xl font-black font-serif text-white">
              Need to Place an Order or Have Questions?
            </h3>

            <p className="text-xs sm:text-sm font-medium text-white/85 max-w-lg leading-relaxed">
              While the web store is polishing up, our support team is fully active on WhatsApp! Tap below to chat with us, order your favourite items, or check delivery status.
            </p>

            {/* Direct WhatsApp Action Button */}
            <div className="pt-3 w-full sm:w-auto">
              <motion.a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm md:text-base px-8 py-4 rounded-full shadow-lg transition-all cursor-pointer group"
              >
                <WhatsAppIcon className="w-6 h-6 shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                <span>Chat on WhatsApp (+91 87547 87774)</span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Refresh Page Helper */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-[#662654] hover:text-[#4a1c3d] px-4 py-2 rounded-full bg-white/70 hover:bg-white border border-gray-200 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw size={14} />
            <span>Check If We're Back Online</span>
          </button>
        </div>

      </main>

      {/* ── DOWN: FOOTER & WHATSAPP BOTTOM BAR ── */}
      <footer className="w-full bg-[#ede7d7] border-t border-[#662654]/15 py-4 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          
          <div className="flex items-center gap-2 text-[#662654] font-bold text-xs md:text-sm">
            <WhatsAppIcon className="w-4 h-4 shrink-0" />
            <span>WhatsApp Helpline: <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#25D366] transition-colors">+91 87547 87774</a></span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <a href="mailto:contact@paidhuethicalfoods.com" className="flex items-center gap-1 hover:text-[#662654] transition-colors">
              <Mail size={13} />
              <span>contact@paidhuethicalfoods.com</span>
            </a>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default MaintenancePage;
