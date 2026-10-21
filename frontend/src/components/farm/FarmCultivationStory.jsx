import React, { useState } from 'react';
import { 
  Sprout, 
  Sun, 
  Heart, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Flower2, 
  Droplets,
  Layers
} from 'lucide-react';

const CULTIVATION_CARDS = [
  {
    id: 'women-collective',
    title: 'Women-Led Agriculture',
    subtitle: 'Tamil Nadu Farmers Collective',
    badge: 'Empowerment',
    image: '/farm/women_farmers_collective.jpg',
    span: 'col-span-1 md:col-span-2 md:row-span-2',
    height: 'h-[360px] sm:h-[420px] md:h-[480px]'
  },
  {
    id: 'butterfly-pea-harvest',
    title: 'Hand-Picked at Sunrise',
    subtitle: 'Fresh Blue Butterfly Pea Blooms',
    badge: 'Dawn Harvest',
    image: '/farm/founder_harvesting_butterfly_pea.jpg',
    span: 'col-span-1',
    height: 'h-[240px] sm:h-[260px] md:h-[230px]'
  },
  {
    id: 'butterfly-pea-basket',
    title: 'Zero Chemical Residue',
    subtitle: 'Delicate Unbruised Petals',
    badge: '100% Pure',
    image: '/farm/butterfly_pea_basket.jpg',
    span: 'col-span-1',
    height: 'h-[240px] sm:h-[260px] md:h-[230px]'
  },
  {
    id: 'dried-marigolds',
    title: 'Solar Cured Marigolds',
    subtitle: 'Golden Petals Rich in Lutein',
    badge: 'Natural Drying',
    image: '/farm/dried_marigold_petals.jpg',
    span: 'col-span-1',
    height: 'h-[240px] sm:h-[260px] md:h-[230px]'
  },
  {
    id: 'dried-hibiscus',
    title: 'Sun-Dried Crimson Roselle',
    subtitle: 'Antioxidant-Rich Hibiscus Calyces',
    badge: 'Artisanal Curing',
    image: '/farm/dried_hibiscus_petals.jpg',
    span: 'col-span-1',
    height: 'h-[240px] sm:h-[260px] md:h-[230px]'
  }
];

const STEPS = [
  {
    number: '01',
    title: 'Living Soil',
    desc: 'Organic compost & zero synthetic chemicals',
    icon: Sprout
  },
  {
    number: '02',
    title: 'Dawn Hand-Pick',
    desc: 'Harvested before sunrise to retain vital aroma',
    icon: Sun
  },
  {
    number: '03',
    title: 'Solar Cured',
    desc: 'Naturally sun & shade dried without sulfur',
    icon: Droplets
  },
  {
    number: '04',
    title: '100% Buyback',
    desc: 'Guaranteed fair market purchase for growers',
    icon: ShieldCheck
  }
];

const FarmCultivationStory = ({ onScrollToForm }) => {
  const [activeModalImg, setActiveModalImg] = useState(null);

  return (
    <div className="w-full bg-[#F7F8F0] text-gray-800">
      
      {/* ──────────────── 1. SLEEK, MINIMAL HEADER ──────────────── */}
      <section className="bg-white border-b border-[#4E580F]/15 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4E580F]/10 text-[#4E580F] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Flower2 className="w-3.5 h-3.5" />
            <span>Just B Happy Botanical Cultivation</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-gray-900 tracking-tight">
            Cultivated with Care. Harvested by Hand.
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-xl mx-auto">
            100% pesticide-free edible flowers grown sustainably across Tamil Nadu by our women-led farming collective.
          </p>

          {/* Quick Metrics Strip */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-bold">
            <span className="px-3 py-1 rounded-full bg-[#F7F8F0] border border-[#4E580F]/20 text-[#4E580F]">
              🌿 100% Chemical-Free
            </span>
            <span className="px-3 py-1 rounded-full bg-[#F7F8F0] border border-[#4E580F]/20 text-[#4E580F]">
              ☀️ Solar Air-Cured
            </span>
            <span className="px-3 py-1 rounded-full bg-[#F7F8F0] border border-[#4E580F]/20 text-[#4E580F]">
              👩‍🌾 Women-Led Harvest
            </span>
            <span className="px-3 py-1 rounded-full bg-[#F7F8F0] border border-[#4E580F]/20 text-[#4E580F]">
              🤝 100% Buyback
            </span>
          </div>
        </div>
      </section>

      {/* ──────────────── 2. IMAGE-ORIENTED BENTO GRID SHOWCASE ──────────────── */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 sm:gap-4">
          {CULTIVATION_CARDS.map((card) => (
            <div 
              key={card.id}
              onClick={() => setActiveModalImg(card)}
              className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#4E580F]/20 bg-gray-900 ${card.span} ${card.height}`}
            >
              <img 
                src={card.image} 
                alt={card.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100" 
              />
              
              {/* Badge Top Left */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#F9E086] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-white/20">
                  {card.badge}
                </span>
              </div>

              {/* Minimal Gradient Overlay with Title & Subtitle */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold text-white group-hover:text-[#F9E086] transition-colors">
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-white/80 font-medium mt-0.5">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────── 3. VISUAL 4-STEP CULTIVATION CYCLE ──────────────── */}
      <section className="bg-white border-y border-[#4E580F]/15 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
            {STEPS.map((step) => {
              const IconComp = step.icon;
              return (
                <div 
                  key={step.number} 
                  className="p-4 sm:p-5 rounded-2xl bg-[#F7F8F0] border border-[#4E580F]/15 hover:border-[#4E580F] transition shadow-sm text-center flex flex-col items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#4E580F] text-[#F9E086] flex items-center justify-center font-bold text-xs shadow mb-2.5">
                    {step.number}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────── 4. STREAMLINED ACTION CALLOUT ──────────────── */}
      <section className="bg-[#4E580F] text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F9E086]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F9E086]">
              Partner With Just B Happy Farm
            </h3>
            <p className="text-xs text-white/90 mt-0.5">
              100% buyback guarantee, free soil testing, and full agronomist guidance.
            </p>
          </div>
          <button
            onClick={onScrollToForm}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#F9E086] hover:bg-white text-[#3A420B] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            <span>Fill Application Form Below</span>
            <ArrowRight className="w-4 h-4 text-[#3A420B]" />
          </button>
        </div>
      </section>

      {/* ──────────────── 5. LIGHTBOX MODAL FOR FULL-RES VIEW ──────────────── */}
      {activeModalImg && (
        <div 
          onClick={() => setActiveModalImg(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center cursor-zoom-out animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative bg-black rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl border border-white/20 cursor-default"
          >
            <button 
              onClick={() => setActiveModalImg(null)}
              className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-black text-white p-2 rounded-full cursor-pointer transition shadow"
            >
              ✕
            </button>
            <img 
              src={activeModalImg.image} 
              alt={activeModalImg.title} 
              className="w-full h-auto max-h-[75vh] object-contain"
            />
            <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#F9E086]">{activeModalImg.badge}</span>
                <h4 className="text-sm sm:text-base font-serif font-bold text-white">{activeModalImg.title}</h4>
              </div>
              <span className="text-xs text-gray-400">{activeModalImg.subtitle}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmCultivationStory;
