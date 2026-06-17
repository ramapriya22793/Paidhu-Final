import { useState, useEffect } from 'react';
import { X, Check, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TiffinModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Show modal after 2.5 seconds on home page load if not seen in current session
    const hasSeen = localStorage.getItem('hasSeenTiffinPopup');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenTiffinPopup', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple 10 digit validation
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/tiffin-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${cleanPhone}`, consent })
      });

      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error('Registration server is currently offline or unreachable. Please try again later.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setSuccess(true);
      localStorage.setItem('hasSeenTiffinPopup', 'true');
      
      // Auto close after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"
        />

        {/* Modal content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative bg-white w-full max-w-[850px] h-auto md:h-[450px] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 border border-white/20"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors shadow"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          {/* Left Side: Visual Banner */}
          <div className="w-full md:w-1/2 relative h-[200px] md:h-full overflow-hidden bg-[#eec85a]">
            <img
              src="/tiffin_popup_banner.png"
              alt="Kids Healthy Tiffin Ideas"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.95]"
            />
            {/* Split overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#662654]/90 via-[#662654]/40 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[#fbc225] text-[10px] font-black uppercase tracking-[0.2em] mb-1 px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full w-fit font-sans">
                Paidhu Moms Club
              </span>
              <h3 className="font-serif italic text-2xl md:text-3xl font-bold leading-tight mb-2 text-[#fff]">
                Running out of school tiffin ideas?
              </h3>
              <p className="text-white/95 text-xs md:text-sm max-w-xs leading-relaxed font-sans">
                Get a free PDF with 30+ healthy, quick, and floral-goodness tiffin recipes for kids.
              </p>
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white relative font-sans">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-6"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-200">
                  <Check size={32} strokeWidth={3} />
                </div>
                <h4 className="text-xl font-black text-gray-800 mb-1">Thank You!</h4>
                <p className="text-sm text-gray-500 font-medium max-w-xs">
                  We've registered your number! Get ready for fresh tiffin ideas on WhatsApp.
                </p>
              </motion.div>
            ) : (
              <div className="w-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-[#662654]/10 rounded-lg text-[#662654]">
                    <MessageSquare size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-bold text-[#662654] uppercase tracking-wider">Join WhatsApp updates</span>
                </div>
                
                <h4 className="font-serif text-xl md:text-2xl font-black text-gray-800 leading-tight mb-1.5">
                  Register for school tiffin ideas for kids
                </h4>
                <p className="text-gray-500 text-xs md:text-sm font-medium mb-6">
                  Get daily recipe guides and clean eating tips sent straight to your phone.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Phone input group */}
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center px-3 py-3 border-[1.5px] border-gray-200 bg-gray-50 text-gray-500 rounded-xl text-sm font-bold min-w-[54px] select-none">
                      +91
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter Mobile Number"
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-xl border-[1.5px] border-gray-200 focus:outline-none focus:border-[#662654] focus:ring-0 text-sm transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Error display */}
                  {error && (
                    <p className="text-rose-500 text-xs font-semibold pl-1">
                      {error}
                    </p>
                  )}

                  {/* Consent Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer py-1 select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      disabled={loading}
                      className="mt-0.5 rounded text-[#662654] focus:ring-[#662654]"
                    />
                    <span className="text-[11px] md:text-xs text-gray-500 leading-snug font-medium">
                      Notify me of daily tiffin recipes and exclusive updates.
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#662654] hover:bg-[#7d2f67] text-[#fdfaf6] font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? 'Registering...' : 'Get Them on WhatsApp'}
                  </button>
                </form>

                {/* Footer disclaimer */}
                <p className="text-[10px] text-gray-400 text-center mt-5 font-medium leading-relaxed">
                  By registering, you agree to our privacy policy. We never spam.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TiffinModal;
