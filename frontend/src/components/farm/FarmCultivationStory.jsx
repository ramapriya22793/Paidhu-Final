import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles, BookOpen } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import FarmCultivationModal from './FarmCultivationModal';

const CULTIVATION_CARDS = [
  {
    id: 'women-collective',
    image: '/farm/women_farmers_collective.jpg',
    span: 'col-span-1 md:col-span-2 md:row-span-2',
    height: 'h-[320px] sm:h-[380px] md:h-[480px]',
    title: 'Women Farmers Collective'
  },
  {
    id: 'butterfly-pea-harvest',
    image: '/farm/founder_harvesting_butterfly_pea.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[232px]',
    title: 'Dawn Hand-Harvesting'
  },
  {
    id: 'butterfly-pea-basket',
    image: '/farm/butterfly_pea_basket.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[232px]',
    title: 'Fresh Blossom Collection'
  },
  {
    id: 'dried-marigolds',
    image: '/farm/dried_marigold_petals.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[232px]',
    title: 'Sun-Cured Marigold Petals'
  },
  {
    id: 'dried-hibiscus',
    image: '/farm/dried_hibiscus_petals.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[232px]',
    title: 'Artisanal Hibiscus Curing'
  }
];

const FarmCultivationStory = ({ onScrollToForm }) => {
  const [isCultivationModalOpen, setIsCultivationModalOpen] = useState(false);
  const location = useLocation();

  // Auto-open if query param contains story=open or popup=true or hash is #farm-story
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('story') === 'open' || params.get('story') === 'true' || params.get('popup') === 'true' || location.hash === '#farm-story') {
      setIsCultivationModalOpen(true);
    }
  }, [location]);

  return (
    <div className="w-full bg-[#F7F8F0] text-gray-800">
      
      {/* ──────────────── 1. LUXURY ACTION RIBBON DIRECTLY BELOW BANNER ──────────────── */}
      <div className="w-full bg-gradient-to-r from-[#2C3308] via-[#4E580F] to-[#2C3308] py-4 sm:py-5 px-4 sm:px-6 lg:px-8 border-b-2 border-[#F9E086] shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          
          {/* Left: Refined Elegant Badge & Text */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F9E086]/15 border border-[#F9E086]/40 flex items-center justify-center text-[#F9E086] flex-shrink-0 shadow-inner">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#F9E086]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#F9E086]">
                <span>Contract Botanical Farming</span>
                <span className="w-1 h-1 rounded-full bg-[#F9E086]" />
                <span>100% Guaranteed Buyback</span>
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-serif font-bold text-white tracking-wide mt-0.5">
                Cultivate Certified Edible Flowers with Paidhu
              </h3>
            </div>
          </div>

          {/* Right: Dual Action Buttons (Story Popup & Form Scroll) */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end flex-wrap">
            {/* Pop Up Trigger Button */}
            <button
              onClick={() => setIsCultivationModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#F9E086] font-serif font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-xl transition-all duration-300 border border-[#F9E086]/60 cursor-pointer flex-shrink-0 backdrop-blur-xs"
            >
              <BookOpen className="w-4 h-4 text-[#F9E086]" />
              <span>Explore The Farm (Story)</span>
            </button>

            {/* Shimmering Gold Luxury Button */}
            <button
              onClick={onScrollToForm}
              className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-gradient-to-r from-[#F9E086] via-[#FFF1B8] to-[#F9E086] hover:from-white hover:to-[#F9E086] text-[#2C3308] font-serif font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-white/50 flex-shrink-0"
            >
              <span>Fill Application Form</span>
              <ArrowDown className="w-4 h-4 text-[#2C3308] transform group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>

      {/* ──────────────── 2. ELEGANT SECTION HEADER WITH POPUP INVITE ──────────────── */}
      <div className="text-center max-w-xl mx-auto pt-8 sm:pt-10 pb-4 px-4">
        <button
          onClick={() => setIsCultivationModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#4E580F] bg-[#4E580F]/10 hover:bg-[#4E580F]/20 px-4 py-1.5 rounded-full border border-[#4E580F]/20 transition cursor-pointer mb-1 shadow-xs group"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#4E580F] group-hover:scale-110 transition-transform" />
          <span>Click to Read Farm Cultivation Story</span>
        </button>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-gray-900 mt-2 tracking-tight">
          From Our Botanical Fields in Tamil Nadu
        </h2>
        <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
          Tap on any photo to open our complete botanical cultivation journey popup.
        </p>
      </div>

      {/* ──────────────── 3. PURE HIGH-RES PHOTO GALLERY (ZERO WORDS ON CARDS) ──────────────── */}
      <section className="pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 sm:gap-4">
          {CULTIVATION_CARDS.map((card) => (
            <div 
              key={card.id}
              onClick={() => setIsCultivationModalOpen(true)}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-[#4E580F]/20 hover:border-[#F9E086] bg-gray-900 ${card.span} ${card.height}`}
            >
              <img 
                src={card.image} 
                alt="Just B Happy Botanical Farm Cultivation" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100" 
              />
              
              {/* Subtle Elegant Hover Overlay with Read Story Icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end justify-between p-3 sm:p-4 opacity-0 group-hover:opacity-100">
                <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  Read Farm Story
                </span>
                <div className="w-8 h-8 rounded-full bg-[#F9E086] text-[#2C3308] flex items-center justify-center border border-white/30 shadow-lg">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────── 4. DEDICATED FARM CULTIVATION STORY MODAL POPUP ──────────────── */}
      <FarmCultivationModal 
        isOpen={isCultivationModalOpen} 
        onClose={() => setIsCultivationModalOpen(false)}
        onScrollToForm={onScrollToForm}
      />

    </div>
  );
};

export default FarmCultivationStory;
