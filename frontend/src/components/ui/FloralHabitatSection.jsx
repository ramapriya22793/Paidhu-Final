import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Volume2, VolumeX, X, Heart, Share2,
  ShoppingBag, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const VideoCard = ({ video, index, onClick }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        // Play silent preview on hover
        videoRef.current.muted = true;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Ignore autoplay interruptions
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <motion.div
      onClick={() => onClick(index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
      className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-b from-[#2a0e22] to-[#12040e] border border-white/10 shadow-lg cursor-pointer group"
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={video.url}
        preload="metadata"
        loop
        playsInline
        muted
        onLoadedData={() => setIsLoading(false)}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
        </div>
      )}

      {/* Glassmorphic Play Icon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25">
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <Play className="w-6 h-6 text-[#d4af37] fill-[#d4af37] translate-x-0.5" />
        </div>
      </div>

      {/* Static Play Icon for Mobile/Touch (when not hovered) */}
      <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center sm:hidden">
        <Play className="w-3.5 h-3.5 text-white fill-white translate-x-0.5" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end min-h-[100px] pointer-events-none">
        <span className="text-[10px] text-[#d4af37] font-extrabold uppercase tracking-widest mb-1">
          Paidhu Shorts
        </span>
        <h3 className="text-[14px] font-bold text-white leading-tight line-clamp-2">
          {video.title}
        </h3>
        <p className="text-[11px] text-gray-300 line-clamp-1 mt-1 font-medium">
          {video.description}
        </p>
      </div>
    </motion.div>
  );
};

const FloralHabitatSection = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Player state
  const [activeIndex, setActiveIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedVideos, setLikedVideos] = useState({});
  const [showShareToast, setShowShareToast] = useState(false);
  const [tapFeedback, setTapFeedback] = useState(null); // 'play' | 'pause'

  const activeVideoRef = useRef(null);

  const FALLBACK_VIDEOS = [
    {
      id: "WhatsApp Video 2026-06-15 at 12.39.48 PM.mp4",
      name: "WhatsApp Video 2026-06-15 at 12.39.48 PM.mp4",
      url: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/starting-floral-food-habitat/WhatsApp%20Video%202026-06-15%20at%2012.39.48%20PM.mp4",
      title: "Curated Floral Food Starter Pack 🌸",
      description: "Discover how our hand-selected botanical ingredients support daily vitality.",
      likes: 452,
      shares: 56
    },
    {
      id: "WhatsApp Video 2026-06-15 at 12.44.35 PM.mp4",
      name: "WhatsApp Video 2026-06-15 at 12.44.35 PM.mp4",
      url: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/starting-floral-food-habitat/WhatsApp%20Video%202026-06-15%20at%2012.44.35%20PM.mp4",
      title: "Nourishing Your Family Naturally 🍯",
      description: "Wholesome nutrients direct from organic floral habitats, zero preservatives.",
      likes: 239,
      shares: 103
    },
    {
      id: "WhatsApp Video 2026-06-15 at 12.49.22 PM.mp4",
      name: "WhatsApp Video 2026-06-15 at 12.49.22 PM.mp4",
      url: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/starting-floral-food-habitat/WhatsApp%20Video%202026-06-15%20at%2012.49.22%20PM.mp4",
      title: "Rich Organic Flower Medleys 🌺",
      description: "Hand-mixed blossoms and roots curated for premium flavor and nutrition.",
      likes: 376,
      shares: 30
    },
    {
      id: "WhatsApp Video 2026-06-15 at 12.51.57 PM.mp4",
      name: "WhatsApp Video 2026-06-15 at 12.51.57 PM.mp4",
      url: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/starting-floral-food-habitat/WhatsApp%20Video%202026-06-15%20at%2012.51.57%20PM.mp4",
      title: "Artisanal Farm-to-Table Process 🌿",
      description: "Our sustainable sourcing ensures the purest grade of floral wellness.",
      likes: 125,
      shares: 77
    },
    {
      id: "WhatsApp Video 2026-06-15 at 12.59.51 PM (1).mp4",
      name: "WhatsApp Video 2026-06-15 at 12.59.51 PM (1).mp4",
      url: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/starting-floral-food-habitat/WhatsApp%20Video%202026-06-15%20at%2012.59.51%20PM%20(1).mp4",
      title: "Healthy Living and Floral Habitats ✨",
      description: "Bring nature's premium superfoods into your home and pantry.",
      likes: 290,
      shares: 51
    }
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings/habitat-videos`);
        if (!res.ok) throw new Error("Failed to load habitat videos");
        const data = await res.json();
        if (data && data.length > 0) {
          setVideos(data);
        } else {
          setVideos(FALLBACK_VIDEOS);
        }
      } catch (err) {
        console.warn("API fetch failed, using fallback static video list:", err);
        setVideos(FALLBACK_VIDEOS);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Sync play state when video index changes
  useEffect(() => {
    if (activeIndex !== null) {
      setIsPlaying(true);
    }
  }, [activeIndex]);

  // Sync mute state of the HTML video element with isMuted state
  useEffect(() => {
    if (activeVideoRef.current) {
      activeVideoRef.current.muted = isMuted;
    }
  }, [isMuted, activeIndex]);

  const handleVideoClick = (index) => {
    setActiveIndex(index);
  };

  const handleClosePlayer = () => {
    setActiveIndex(null);
  };

  const handlePrevVideo = (e) => {
    e.stopPropagation();
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNextVideo = (e) => {
    e.stopPropagation();
    if (activeIndex < videos.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const togglePlay = () => {
    if (activeVideoRef.current) {
      if (isPlaying) {
        activeVideoRef.current.pause();
        setIsPlaying(false);
        triggerTapFeedback('pause');
      } else {
        activeVideoRef.current.play().catch(() => {});
        setIsPlaying(true);
        triggerTapFeedback('play');
      }
    }
  };

  const triggerTapFeedback = (type) => {
    setTapFeedback(type);
    setTimeout(() => {
      setTapFeedback(null);
    }, 500);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (activeVideoRef.current) {
      activeVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleLike = (e, videoId) => {
    e.stopPropagation();
    setLikedVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  const handleShare = (e, video) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/shop/starting-floral-food-habitat?v=${encodeURIComponent(video.name)}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2500);
      })
      .catch(() => {});
  };

  // Keyboard navigation for Shorts player
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') handleClosePlayer();
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') handlePrevVideo(e);
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') handleNextVideo(e);
      else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const activeVideo = activeIndex !== null ? videos[activeIndex] : null;

  return (
    <div className="relative w-full min-h-screen bg-[#FAF9F6] pb-16 font-sans">
      {/* ── HEADER BANNER ── */}
      <div className="relative w-full h-[320px] bg-gradient-to-r from-[#662654] via-[#4a183c] to-[#662654] flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-[#662654]/15">
        {/* Subtle decorative background circles */}
        <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] uppercase tracking-widest text-[#d4af37] font-extrabold bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10"
          >
            Welcome to the Habitat 🌸
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight"
          >
            Starting Floral Food Habitat
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-[13.5px] md:text-[14.5px] mt-3 leading-relaxed"
          >
            Discover the magical, healthy world of organic floral foods. Watch our curated reels below to learn how we blend nature's finest petals into premium nutrition for your family.
          </motion.p>
        </div>
      </div>

      {/* ── MAIN VIDEO GALLERY ── */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-10 h-10 text-[#662654] animate-spin" />
            <p className="text-[13px] font-semibold text-gray-500">Loading organic videos…</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-gray-800">Could not fetch videos</h3>
            <p className="text-[13px] text-gray-400 mt-2">{error}</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <div className="text-6xl mb-4">🌸</div>
            <h3 className="text-lg font-bold text-gray-800">Habitat Videos Coming Soon</h3>
            <p className="text-[13px] text-gray-400 mt-2">
              Our curated shorts about Starting Floral Food Habitats are being prepared. Check back shortly!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#662654] animate-pulse" />
              <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-widest">
                Latest Habitat Reels ({videos.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {videos.map((video, idx) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={idx}
                  onClick={handleVideoClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── FULL SCREEN SHORTS MODAL PLAYER ── */}
      <AnimatePresence>
        {activeIndex !== null && activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={handleClosePlayer}
          >
            {/* Close Button */}
            <button
              onClick={handleClosePlayer}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 transition-colors shadow-2xl"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Control Arrow */}
            {activeIndex > 0 && (
              <button
                onClick={handlePrevVideo}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/15 transition-all shadow-2xl hidden md:flex"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Control Arrow */}
            {activeIndex < videos.length - 1 && (
              <button
                onClick={handleNextVideo}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/15 transition-all shadow-2xl hidden md:flex"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Mobile Swipe / Arrow helpers */}
            <div className="absolute bottom-4 left-4 z-40 flex gap-2 md:hidden">
              {activeIndex > 0 && (
                <button
                  onClick={handlePrevVideo}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {activeIndex < videos.length - 1 && (
                <button
                  onClick={handleNextVideo}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Shorts Container: 9:16 layout strictly centered */}
            <div
              className="relative w-full max-w-[420px] h-full md:h-[90vh] md:max-h-[800px] aspect-[9/16] bg-black shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden md:rounded-2xl border border-white/10 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={activeVideoRef}
                src={activeVideo.url}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Center Tap Ripple / Icon Feedback */}
              <AnimatePresence>
                {tapFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    className="absolute z-20 pointer-events-none w-20 h-20 rounded-full bg-black/45 flex items-center justify-center backdrop-blur-sm border border-white/15"
                  >
                    {tapFeedback === 'play' ? (
                      <Play className="w-8 h-8 text-[#d4af37] fill-[#d4af37] translate-x-0.5" />
                    ) : (
                      <Pause className="w-8 h-8 text-white fill-white" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mute toggle button */}
              <button
                onClick={toggleMute}
                className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center transition-colors shadow-lg"
              >
                {isMuted ? (
                  <VolumeX className="w-4.5 h-4.5 text-red-400" />
                ) : (
                  <Volume2 className="w-4.5 h-4.5 text-[#d4af37]" />
                )}
              </button>

              {/* Sidebar Action Overlays */}
              <div className="absolute right-3.5 bottom-32 z-30 flex flex-col gap-5 items-center">
                {/* Like Button */}
                <div className="flex flex-col items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => toggleLike(e, activeVideo.id)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg border transition-all ${likedVideos[activeVideo.id] ? 'bg-red-500/25 border-red-500 text-red-500' : 'bg-black/40 border-white/15 text-white hover:bg-black/60'}`}
                  >
                    <Heart className={`w-5 h-5 ${likedVideos[activeVideo.id] ? 'fill-red-500' : ''}`} />
                  </motion.button>
                  <span className="text-[10px] text-white font-bold tracking-wide">
                    {activeVideo.likes + (likedVideos[activeVideo.id] ? 1 : 0)}
                  </span>
                </div>

                {/* Share Button */}
                <div className="flex flex-col items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => handleShare(e, activeVideo)}
                    className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                  <span className="text-[10px] text-white font-bold tracking-wide">
                    {activeVideo.shares}
                  </span>
                </div>

                {/* Direct Shop button */}
                <div className="flex flex-col items-center gap-1">
                  <motion.a
                    href="/shop/shop-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full bg-gradient-to-r from-[#662654] to-[#d4af37] border border-[#d4af37]/30 text-white flex items-center justify-center shadow-lg transition-all animate-bounce"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </motion.a>
                  <span className="text-[9px] text-[#d4af37] font-black uppercase tracking-wider">
                    Shop
                  </span>
                </div>
              </div>

              {/* Bottom Video metadata info overlays */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-5 pt-12 z-20 pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/paidhulogo.png" alt="Paidhu" className="w-7 h-7 rounded-full bg-white object-contain p-0.5 shadow border border-white/20" />
                  <span className="text-white text-[12.5px] font-extrabold tracking-wide">
                    Paidhu Floral Food
                  </span>
                  <span className="text-[10px] bg-[#d4af37] text-black font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Original
                  </span>
                </div>
                
                <h3 className="text-[14.5px] font-bold text-white leading-snug">
                  {activeVideo.title}
                </h3>
                <p className="text-[12px] text-gray-300 font-medium leading-relaxed mt-1 line-clamp-2">
                  {activeVideo.description}
                </p>

                {/* Sound wave icon when audio is active */}
                {!isMuted && (
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] text-[#d4af37] font-semibold">
                    <div className="flex gap-0.5 items-end h-3">
                      <span className="w-0.5 bg-[#d4af37] animate-[pulse_0.8s_infinite] h-full" />
                      <span className="w-0.5 bg-[#d4af37] animate-[pulse_0.5s_infinite] h-2/3" />
                      <span className="w-0.5 bg-[#d4af37] animate-[pulse_0.7s_infinite] h-4/5" />
                    </div>
                    <span>Paidhu Original Audio</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share copied Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-zinc-900 text-white text-[12px] font-bold px-5 py-3 rounded-full border border-white/10 shadow-2xl flex items-center gap-2"
          >
            <span>✨ Link copied to clipboard! Share the story.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloralHabitatSection;
