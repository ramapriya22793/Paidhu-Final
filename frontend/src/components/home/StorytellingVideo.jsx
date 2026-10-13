import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import videoThumbnail from '../../assets/video_thumbnail.jpg';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'https://paidhu-final-anm2.vercel.app';
const FALLBACK_VIDEO_URL = `${API_BASE}/api/storage/videos/WhatsApp%20Video%202026-08-06%20at%2011.23.18%20AM.mp4`;

const StorytellingVideo = () => {
  const [videoData, setVideoData] = useState({
    videoUrl: FALLBACK_VIDEO_URL,
    videoTitle: "Paidhu Family Storytelling",
    videoSubtitle: "Experience the purity of our handcrafted natural treats",
    videoThumbnail: videoThumbnail
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch settings from the backend
  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setVideoData({
            videoUrl: data.videoUrl || FALLBACK_VIDEO_URL,
            videoTitle: data.videoTitle || "Paidhu Family Storytelling",
            videoSubtitle: data.videoSubtitle || "Experience the purity of our handcrafted natural treats",
            videoThumbnail: data.videoThumbnail || videoThumbnail
          });
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch storytelling video settings:", err);
      });
  }, []);

  return (
    <section className="relative w-full bg-white overflow-hidden py-8 md:py-14">
      <div className="max-w-[820px] mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-6 md:mb-8">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#662654] font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mb-2 px-3.5 py-1.5 bg-[#662654]/10 rounded-full inline-flex items-center gap-1.5 shadow-xs"
          >
            🌸 The Paidhu Story
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight"
          >
            {videoData.videoTitle}
          </motion.h2>
          {videoData.videoSubtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-xs sm:text-sm md:text-base mt-2 font-medium"
            >
              {videoData.videoSubtitle}
            </motion.p>
          )}
        </div>

        {/* Video Card - Medium sized, clean edge-to-edge container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          onClick={() => setIsModalOpen(true)}
          className="relative w-full aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_16px_40px_rgba(102,38,84,0.12)] border border-[#662554]/10 bg-black cursor-pointer group"
        >
          {/* Autoplay preview video */}
          <video 
            src={videoData.videoUrl} 
            poster={videoData.videoThumbnail}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            muted
            loop
            autoPlay
            playsInline
          />
          
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300"></div>
          
          {/* Play Button Overlay with glowing pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl relative"
              whileHover={{ scale: 1.12 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {/* Glowing Plum Ring */}
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping pointer-events-none"></div>
              <svg className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-[#662554] ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Modal content container */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="relative max-w-6xl md:max-w-7xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-14 right-0 md:-top-16 text-white hover:text-[#d4af37] transition-colors p-2.5 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center group"
              >
                <X size={22} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Heading info */}
              <div className="text-center mb-6 max-w-2xl px-4">
                <motion.h3
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-3xl font-serif text-[#d4af37] font-semibold tracking-wide mb-2"
                >
                  {videoData.videoTitle}
                </motion.h3>
                <motion.p
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs md:text-sm text-gray-300 font-light"
                >
                  {videoData.videoSubtitle}
                </motion.p>
              </div>

              {/* Video wrapper with glowing brand glow */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(102,38,84,0.4)] border border-white/10 bg-black">
                <video
                  src={videoData.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StorytellingVideo;

