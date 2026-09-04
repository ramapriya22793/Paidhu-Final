import React from 'react';
import { motion } from 'framer-motion';
import paidhuLogo from '../assets/paidhulogo.png';

const WhatsAppIcon = ({ className = "w-6 h-6" }) => (
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

const MaintenancePage = () => {
  const whatsappUrl = "https://wa.me/918754787774?text=" + encodeURIComponent("Hi Paidhu Team, I am visiting your website while it is under maintenance. I would like to place an order / get assistance.");

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fcfbfa] via-[#faf6f1] to-[#f4eee6] text-gray-800 font-sans flex flex-col justify-between relative overflow-x-hidden selection:bg-[#662654] selection:text-white">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#662654]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#d4af37]/8 blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full bg-[#662654] py-3.5 px-4 md:px-8 shadow-md relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={paidhuLogo} 
              alt="Paidhu" 
              className="h-8 md:h-10 w-auto object-contain"
            />
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/15">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Maintenance Mode
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 md:py-16 flex flex-col items-center justify-center text-center relative z-10">
        

        {/* Website Maintenance Message */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="space-y-3 md:space-y-4 max-w-2xl mb-10"
        >
          <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase bg-[#662654]/10 px-4 py-1.5 rounded-full inline-block">
            Website Under Maintenance
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#662654] font-serif tracking-tight leading-tight">
            We'll Be Back Soon!
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-xl mx-auto">
            Our website is currently undergoing scheduled maintenance and system upgrades. We are working hard to enhance your experience and will be back online shortly.
          </p>
        </motion.div>

        {/* ── WhatsApp Call-To-Action Box (Down Part) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-[0_15px_45px_rgba(37,211,102,0.12)] border-2 border-[#25D366]/30 relative overflow-hidden"
        >
          {/* Subtle top brand bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#25D366]" />

          <div className="flex flex-col items-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#25D366]/10 text-[#075E54] font-black text-xs uppercase tracking-wider px-3.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              Customer Support & Orders Live on WhatsApp
            </div>

            <h3 className="text-xl md:text-2xl font-black text-gray-900 font-serif">
              Need to Place an Order or Have Questions?
            </h3>

            <p className="text-xs md:text-sm text-gray-600 font-medium max-w-lg leading-relaxed">
              Our team is active right now! Click below to chat directly with us on WhatsApp. We will take your order and assist you immediately.
            </p>

            {/* Big WhatsApp Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-sm md:text-base uppercase tracking-wider px-8 py-4 rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.55)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer w-full sm:w-auto"
            >
              <WhatsAppIcon className="w-7 h-7" />
              <span>Connect on WhatsApp Now</span>
            </a>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 font-semibold pt-1">
              <span className="flex items-center gap-1.5">
                <span className="text-gray-400">📞 Call / WhatsApp:</span>
                <a href="tel:+918754787774" className="text-gray-900 font-bold hover:underline">
                  +91 87547 87774
                </a>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-gray-400">✉️ Email:</span>
                <a href="mailto:info@paidhu.com" className="text-gray-900 font-bold hover:underline">
                  info@paidhu.com
                </a>
              </span>
            </div>
          </div>
        </motion.div>

      </main>

      {/* Bottom Footer Bar */}
      <footer className="w-full bg-[#ede7d7] border-t border-[#662654]/10 py-4 px-4 text-center text-xs text-gray-600 font-semibold relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Paidhu Ethical Foods. All rights reserved.</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#075E54] hover:text-[#05463e] font-bold underline"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Chat with us on WhatsApp (+91 87547 87774)
          </a>
        </div>
      </footer>

    </div>
  );
};

export default MaintenancePage;
