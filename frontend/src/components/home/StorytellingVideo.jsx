import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import videoThumbnail from '../../assets/video_thumbnail.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const FALLBACK_VIDEO_URL = "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/WhatsApp%20Video%202026-06-13%20at%209.33.29%20AM.mp4";

const StorytellingVideo = () => {
  const [videoData, setVideoData] = useState({
    videoUrl: FALLBACK_VIDEO_URL,
    videoTitle: "Paidhu Family Storytelling",
    videoSubtitle: "Experience the purity of our handcrafted organic treats",
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
            videoSubtitle: data.videoSubtitle || "Experience the purity of our handcrafted organic treats",
            videoThumbnail: data.videoThumbnail || videoThumbnail
          });
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch storytelling video settings:", err);
      });
  }, []);

  return (
    <section className="relative w-full bg-[#e9e3d5] overflow-hidden py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 relative">
        <div className="relative w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-xl">
          {/* Full Background Frame */}
          <img 
            src="/video_frame_bg.png" 
            alt="Paidhu Video Frame" 
            className="w-full h-auto block"
          />

          {/* Video Preview mapped onto the empty beige space */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pt-[-5%] pb-[10%]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              onClick={() => setIsModalOpen(true)}
              className="absolute top-[18%] left-[15%] w-[70%] h-[55%] rounded-[10px] md:rounded-[18px] overflow-hidden pointer-events-auto cursor-pointer group shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-[#662554]/10"
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
                  className="w-16 h-16 md:w-20 md:h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg relative"
                  whileHover={{ scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {/* Glowing Plum Ring */}
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping pointer-events-none"></div>
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-[#662554] ml-1 md:ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
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
              className="relative max-w-5xl w-full flex flex-col items-center"
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

