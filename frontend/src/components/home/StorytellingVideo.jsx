import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import videoThumbnail from '../../assets/video_thumbnail.jpg';

const LOCAL_FALLBACK_VIDEO = '/videos/storytelling.mp4';
const ALT_LOCAL_VIDEO = '/videos/WhatsApp%20Video%202026-08-06%20at%2011.23.18%20AM.mp4';
const R2_FALLBACK_VIDEO = '/api/storage/videos/WhatsApp%20Video%202026-08-06%20at%2011.23.18%20AM.mp4';

const resolveVideoUrl = (url) => {
  if (!url) return LOCAL_FALLBACK_VIDEO;
  // If the backend returned the default WhatsApp storytelling video name or path,
  // prioritize the lightning-fast, edge-cached same-origin static MP4:
  if (url.includes('WhatsApp%20Video%202026-08-06') || url.includes('WhatsApp Video')) {
    return LOCAL_FALLBACK_VIDEO;
  }
  return url;
};

const StorytellingVideo = () => {
  const [videoData, setVideoData] = useState({
    videoUrl: LOCAL_FALLBACK_VIDEO,
    videoTitle: "Paidhu Family Storytelling",
    videoSubtitle: "Experience the purity of our handcrafted natural treats",
    videoThumbnail: videoThumbnail
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewVideoRef = useRef(null);

  // Fetch settings from the backend safely using relative route
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setVideoData({
            videoUrl: resolveVideoUrl(data.videoUrl),
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

  // Ensure autoplay starts smoothly for background preview
  useEffect(() => {
    if (previewVideoRef.current) {
      previewVideoRef.current.defaultMuted = true;
      previewVideoRef.current.muted = true;
      const playPromise = previewVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Normal browser autoplay restrictions handling
        });
      }
    }
  }, [videoData.videoUrl]);

  return (
    <section className="relative w-full bg-white overflow-hidden py-10 md:py-16">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 relative">
        {/* Full Background Frame Container */}
        <div className="relative w-full overflow-hidden rounded-[1.8rem] md:rounded-[2.5rem] shadow-xl">
          <img 
            src="/video_frame_bg.png" 
            alt="Paidhu Video Frame" 
            width={1024}
            height={554}
            loading="lazy"
            className="w-full h-auto block"
          />

          {/* Video Preview mapped onto the frame - moderate / medium balanced scale */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              onClick={() => setIsModalOpen(true)}
              className="absolute top-[14%] left-[10%] w-[80%] h-[64%] rounded-[14px] sm:rounded-[20px] md:rounded-[26px] overflow-hidden pointer-events-auto cursor-pointer group shadow-[0_8px_30px_rgba(0,0,0,0.18)] border border-[#662554]/10 bg-black/5"
            >
              {/* Autoplay preview video with multiple source fallbacks */}
              <video 
                ref={previewVideoRef}
                key={videoData.videoUrl}
                poster={videoData.videoThumbnail || videoThumbnail}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                muted
                loop
                autoPlay
                playsInline
                preload="auto"
              >
                <source src={videoData.videoUrl} type="video/mp4" />
                {videoData.videoUrl !== LOCAL_FALLBACK_VIDEO && (
                  <source src={LOCAL_FALLBACK_VIDEO} type="video/mp4" />
                )}
                <source src={ALT_LOCAL_VIDEO} type="video/mp4" />
                <source src={R2_FALLBACK_VIDEO} type="video/mp4" />
              </video>
              
              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300"></div>
              
              {/* Play Button Overlay with glowing pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl relative"
                  whileHover={{ scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {/* Glowing Plum Ring */}
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping pointer-events-none"></div>
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-[#662554] ml-1" fill="currentColor" viewBox="0 0 20 20">
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
              className="relative max-w-6xl md:max-w-7xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-14 right-0 md:-top-16 text-white hover:text-[#d4af37] transition-colors p-2.5 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center group cursor-pointer"
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
                  key={`modal-${videoData.videoUrl}`}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  poster={videoData.videoThumbnail || videoThumbnail}
                  className="w-full h-full object-contain"
                >
                  <source src={videoData.videoUrl} type="video/mp4" />
                  {videoData.videoUrl !== LOCAL_FALLBACK_VIDEO && (
                    <source src={LOCAL_FALLBACK_VIDEO} type="video/mp4" />
                  )}
                  <source src={ALT_LOCAL_VIDEO} type="video/mp4" />
                  <source src={R2_FALLBACK_VIDEO} type="video/mp4" />
                  Your browser does not support HTML5 video playback.
                </video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StorytellingVideo;
