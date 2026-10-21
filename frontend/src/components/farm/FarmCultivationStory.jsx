import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const CULTIVATION_CARDS = [
  {
    id: 'women-collective',
    image: '/farm/women_farmers_collective.jpg',
    span: 'col-span-1 md:col-span-2 md:row-span-2',
    height: 'h-[340px] sm:h-[400px] md:h-[480px]'
  },
  {
    id: 'butterfly-pea-harvest',
    image: '/farm/founder_harvesting_butterfly_pea.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[230px]'
  },
  {
    id: 'butterfly-pea-basket',
    image: '/farm/butterfly_pea_basket.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[230px]'
  },
  {
    id: 'dried-marigolds',
    image: '/farm/dried_marigold_petals.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[230px]'
  },
  {
    id: 'dried-hibiscus',
    image: '/farm/dried_hibiscus_petals.jpg',
    span: 'col-span-1',
    height: 'h-[220px] sm:h-[240px] md:h-[230px]'
  }
];

const FarmCultivationStory = ({ onScrollToForm }) => {
  const [activeModalImg, setActiveModalImg] = useState(null);

  return (
    <div className="w-full bg-[#F7F8F0] text-gray-800">
      
      {/* ──────────────── 1. ACTION BUTTON DIRECTLY BELOW THE BANNER ──────────────── */}
      <div className="w-full bg-[#4E580F] py-3.5 px-4 flex items-center justify-center border-b-2 border-[#F9E086] shadow-sm">
        <button
          onClick={onScrollToForm}
          className="px-8 py-3 rounded-full bg-[#F9E086] hover:bg-white text-[#3A420B] font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
        >
          <span>Fill Application Form Below</span>
          <ArrowRight className="w-4 h-4 text-[#3A420B]" />
        </button>
      </div>

      {/* ──────────────── 2. PURE PHOTOGRAPHY SHOWCASE (NO WORDS ON PICTURES) ──────────────── */}
      <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 sm:gap-4">
          {CULTIVATION_CARDS.map((card) => (
            <div 
              key={card.id}
              onClick={() => setActiveModalImg(card.image)}
              className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#4E580F]/20 bg-gray-100 ${card.span} ${card.height}`}
            >
              <img 
                src={card.image} 
                alt="Just B Happy Botanical Farm Cultivation"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────── 3. LIGHTBOX MODAL FOR PURE FULL-RES VIEW ──────────────── */}
      {activeModalImg && (
        <div 
          onClick={() => setActiveModalImg(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center cursor-zoom-out animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative bg-black rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/20 cursor-default"
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
