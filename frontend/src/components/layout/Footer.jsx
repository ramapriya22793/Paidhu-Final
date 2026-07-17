import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


const InstagramIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const MessageCircleIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const Footer = () => {
  return (
    <footer className="w-full bg-[#522742] text-[#fdfaf6] pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-xl mb-4 font-serif text-[#ede7d7]">Quick Links</h4>
            <Link to="/shop/about-us" className="text-sm hover:text-[#ede7d7] transition-colors relative group w-fit">About Us</Link>
            <Link to="/shop/shop-all" className="text-sm hover:text-[#ede7d7] transition-colors relative group w-fit">Shop</Link>
            <Link to="/shop/bulk-orders" className="text-sm hover:text-[#ede7d7] transition-colors relative group w-fit">Contact</Link>
            <Link to="/shop/for-your-family" className="text-sm hover:text-[#ede7d7] transition-colors relative group w-fit">FAQs</Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-xl mb-4 font-serif text-[#ede7d7]">Legal</h4>
            <Link to="/legal/terms-conditions" className="text-sm hover:text-[#ede7d7] transition-colors relative group w-fit">Terms & Conditions</Link>
            <Link to="/legal/privacy-policy" className="text-sm hover:text-[#ede7d7] transition-colors relative group w-fit">Privacy Policy</Link>
            <Link to="/legal/shipping-policy" className="text-sm hover:text-[#ede7d7] transition-colors relative group w-fit">Shipping Policy</Link>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-xl mb-4 font-serif text-[#ede7d7]">Subscribe to our newsletter</h4>
            <p className="text-sm opacity-90 mb-2">Get updates, tips, and exclusive offers straight to your inbox.</p>
            <div className="relative flex flex-col space-y-3 mt-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-transparent border-b border-[#fdfaf6]/50 py-2 text-sm focus:outline-none focus:border-[#ede7d7] text-white placeholder-white/60 transition-colors"
              />
              <button className="bg-[#ede7d7] hover:bg-white text-[#522742] font-bold py-2 px-6 rounded-full w-max text-sm transition-transform hover:scale-105 active:scale-95">
                Subscribe
              </button>
            </div>
          </div>

          {/* Follow Us / Branding */}
          <div className="flex flex-col space-y-6 lg:items-end text-left lg:text-right">
            <div>
              <h4 className="font-bold text-xl mb-4 font-serif text-[#ede7d7]">Follow Us</h4>
              <div className="flex space-x-4 lg:justify-end">
                <motion.a 
                  whileHover={{ scale: 1.1, color: "#ede7d7" }} 
                  href="https://www.instagram.com/paidhu_edibleflower/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#fdfaf6] hover:text-[#ede7d7] transition-colors"
                >
                  <InstagramIcon size={24} />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1, color: "#ede7d7" }} 
                  href="https://www.youtube.com/@Paidhu" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#fdfaf6] hover:text-[#ede7d7] transition-colors"
                >
                  <YoutubeIcon size={24} />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1, color: "#ede7d7" }} 
                  href="https://wa.me/918754787774" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#fdfaf6] hover:text-[#ede7d7] transition-colors"
                >
                  <MessageCircleIcon size={24} />
                </motion.a>
              </div>
            </div>

            <div className="pt-4 flex flex-col lg:items-end">
              <div 
                className="w-32 h-[58px] mb-2 bg-[#ede7d7]"
                style={{
                  WebkitMaskImage: 'url(/Paidhulogo.png)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: 'url(/Paidhulogo.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center'
                }}
                title="Paidhu Logo"
              />
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 border-t border-[#fdfaf6]/20 pt-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white p-1 border border-[#ede7d7]/30 shadow-lg transition-transform hover:scale-110 duration-300">
            <img 
              src="/mascot.png" 
              alt="Paidhu Mascot" 
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-sm opacity-85 tracking-wide text-[#fdfaf6] font-medium">
            © Paidhu Ethical Foods - All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
