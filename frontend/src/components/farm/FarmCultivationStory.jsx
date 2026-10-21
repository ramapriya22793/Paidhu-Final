import React, { useState } from 'react';
import { ArrowDown, Sparkles, Maximize2, X } from 'lucide-react';

const CULTIVATION_CARDS = [
  {
    id: 'women-collective',
    image: '/farm/women_farmers_collective.jpg',
    span: 'col-span-1 md:col-span-2 md:row-span-2',
    height: 'h-[320px] sm:h-[380px] md:h-[480px]'
  },
  {
    id: 'butterfly-pea-harvest',
    image: '/farm/founder_harvesting_butterfly_pea.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[232px]'
  },
  {
    id: 'butterfly-pea-basket',
    image: '/farm/butterfly_pea_basket.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[232px]'
  },
  {
    id: 'dried-marigolds',
    image: '/farm/dried_marigold_petals.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[232px]'
  },
  {
    id: 'dried-hibiscus',
    image: '/farm/dried_hibiscus_petals.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[232px]'
  }
];

const FarmCultivationStory = ({ onScrollToForm }) => {
  const [activeModalImg, setActiveModalImg] = useState(null);

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

          {/* Right: Shimmering Gold Luxury Button */}
          <button
            onClick={onScrollToForm}
            className="group inline-flex items-center justify-center gap-2 px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#F9E086] via-[#FFF1B8] to-[#F9E086] hover:from-white hover:to-[#F9E086] text-[#2C3308] font-serif font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-white/50 flex-shrink-0"
          >
            <span>Fill Application Form</span>
            <ArrowDown className="w-4 h-4 text-[#2C3308] transform group-hover:translate-y-0.5 transition-transform" />
          </button>

        </div>
      </div>

      {/* ──────────────── 2. ELEGANT SECTION HEADER ──────────────── */}
      <div className="text-center max-w-xl mx-auto pt-8 sm:pt-10 pb-4 px-4">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#4E580F] bg-[#4E580F]/10 px-3.5 py-1 rounded-full border border-[#4E580F]/20">
          Authentic Farm Harvest
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-gray-900 mt-2.5 tracking-tight">
          From Our Botanical Fields in Tamil Nadu
        </h2>
      </div>

      {/* ──────────────── 3. PURE HIGH-RES PHOTO GALLERY (ZERO WORDS ON CARDS) ──────────────── */}
      <section className="pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 sm:gap-4">
          {CULTIVATION_CARDS.map((card) => (
            <div 
              key={card.id}
              onClick={() => setActiveModalImg(card.image)}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-[#4E580F]/20 hover:border-[#F9E086] bg-gray-900 ${card.span} ${card.height}`}
            >
              <img 
                src={card.image} 
                alt="Just B Happy Botanical Farm Cultivation"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100" 
              />
              
              {/* Subtle Elegant Hover Overlay with Expand Icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-end p-3 sm:p-4 opacity-0 group-hover:opacity-100">
                <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-[#F9E086] flex items-center justify-center border border-white/30 shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────── 4. LIGHTBOX MODAL FOR FULL-RES VIEW ──────────────── */}
      {activeModalImg && (
        <div 
          onClick={() => setActiveModalImg(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center cursor-zoom-out animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative bg-black rounded-2xl sm:rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/20 cursor-default"
          >
            <button 
              onClick={() => setActiveModalImg(null)}
              className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-black text-white p-2 rounded-full cursor-pointer transition shadow"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={activeModalImg} 
              alt="Just B Happy Farm Full Resolution View" 
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmCultivationStory;
