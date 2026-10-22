import React, { useEffect, useState } from 'react';
import { 
  X, 
  Sparkles, 
  Sprout, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Users, 
  FileText,
  Sun,
  ChevronRight
} from 'lucide-react';

const CULTIVATION_PILLARS = [
  {
    id: 'harvest',
    title: 'Dawn Hand-Harvesting',
    subtitle: 'Blossom by blossom in early dew',
    image: '/farm/founder_harvesting_butterfly_pea.jpg',
    tag: 'Harvest Craft',
    badgeColor: 'bg-[#4E580F] text-[#F9E086]',
    text: 'Edible flower cultivation is one of the most meticulous agrarian arts. Botanical blooms such as Butterfly Pea (Clitoria ternatea), Roselle Hibiscus, and French Marigold open at dawn, when essential floral nectar, vivid natural pigments, and gentle aromatics reach their peak. Our farmers hand-harvest each blossom individually in the early morning dew before the midday sun warms the fields, ensuring delicate petals remain completely intact and fresh.'
  },
  {
    id: 'curing',
    title: 'Traditional Sun & Shade Curing',
    subtitle: 'Slow, low-temperature natural moisture evaporation',
    image: '/farm/dried_marigold_petals.jpg',
    tag: 'Petal Curing',
    badgeColor: 'bg-[#5A6611] text-[#F9E086]',
    text: 'Fine botanical foods are a work of nature perfected through time-honored artisanal methods. Immediately following dawn harvest, fresh blossoms are hand-sorted on clean woven wicker trays. The petals are gently shade-cured and slow sun-dried over several days without high heat, chemical fumigation, or synthetic stabilizers. This preserves the deep jewel-toned hues, floral perfume, and pure botanical integrity.'
  },
  {
    id: 'fields',
    title: 'Our Agrarian Fields in Tamil Nadu',
    subtitle: 'Rooted in the foothills of the Western Ghats',
    image: '/farm/farm_landscape_wide.jpg',
    tag: 'Soil & Terroir',
    badgeColor: 'bg-[#2C3308] text-[#F9E086]',
    text: 'Situated across the sun-drenched agrarian landscapes of Tamil Nadu, our cultivation plots benefit from natural sunlight, clean aquifer well waters, and aerated loamy soils. We nurture our land using traditional composting, neem-based natural pest deterrence, and companion planting, maintaining absolute transparency and field-level traceability from seedling to harvest.'
  },
  {
    id: 'contract-farming',
    title: 'Paidhu Contract Farming Initiative',
    subtitle: '100% Guaranteed buyback at fair prices',
    image: '/farm/farmer_marigold_wide.jpg',
    tag: 'Farmer Partnership',
    badgeColor: 'bg-[#4E580F] text-[#F9E086]',
    text: 'The Paidhu Contract Botanical Farming Initiative was created to empower smallholder farmers with a dependable, profitable alternative to volatile cash crops. Planters are provided with high-germination botanical saplings, regular agronomic field inspections, soil health guidance, and a binding 100% Guaranteed Buyback agreement at transparent farm-gate prices, removing market uncertainty.'
  },
  {
    id: 'women-empowerment',
    title: 'Rural Women Farmer Collectives',
    subtitle: 'Dignified livelihoods & economic independence',
    image: '/farm/women_farmers_collective.jpg',
    tag: 'Community',
    badgeColor: 'bg-[#3A420B] text-[#F9E086]',
    text: 'At Just B Happy Farm, rural women lead the harvest. The gentle handling of edible petals requires exceptional patience and finesse. Through our women self-help collective farming model, local village women earn stable year-round incomes, work flexible morning hours, and gain financial autonomy, bringing pride and prosperity to rural farming households.'
  },
  {
    id: 'farm-to-table',
    title: 'From Field to Flavor at Paidhu',
    subtitle: 'Pure floral teas, jams, and gourmet cookies',
    image: '/farm/butterfly_pea_basket.jpg',
    tag: 'Farm to Fork',
    badgeColor: 'bg-[#4E580F] text-[#F9E086]',
    text: 'Every flower grown under the Just B Happy initiative flows directly into the wholesome kitchen of Paidhu Ethical Foods: transforming into Brew Flora whole-flower infusions, handcrafted Petal Jams, Bloom Cookies, and pure Kashmir Saffron delicacies. We bring unadulterated nature directly to your table.'
  }
];

const FarmCultivationModal = ({ isOpen, onClose, onScrollToForm }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplyClick = () => {
    onClose();
    setTimeout(() => {
      if (onScrollToForm) {
        onScrollToForm();
      } else {
        const el = document.getElementById('farm-application-form');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#F7F8F0] rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#4E580F]/30 overflow-hidden flex flex-col max-h-[92vh] text-gray-800"
      >
        {/* ──────── STICKY MODAL HEADER ──────── */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-[#2C3308] via-[#4E580F] to-[#2C3308] text-white px-4 sm:px-6 py-3.5 sm:py-4 border-b-2 border-[#F9E086] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-[#F9E086]/50 flex items-center justify-center p-1 flex-shrink-0">
              <img 
                src="/just_b_happy_logo_navbar.png" 
                alt="Just B Happy Farms" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = '/just_b_happy_logo.png';
                }}
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#F9E086]">
                <Sparkles className="w-3 h-3 text-[#F9E086]" />
                <span>Cultivation & Botanical Heritage</span>
              </div>
              <h2 className="text-xs sm:text-sm md:text-base font-serif font-black text-white tracking-wide">
                Just B Happy Farm · Paidhu Ethical Foods
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Cultivation Story"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* ──────── SCROLLABLE MODAL BODY ──────── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-8">

          {/* Core Philosophy Banner / Quote */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#4E580F]/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#F9E086]/20 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#4E580F] bg-[#4E580F]/10 px-3 py-1 rounded-full border border-[#4E580F]/20">
              Our Farming Ethos
            </span>
            <h3 className="text-sm sm:text-lg md:text-xl font-serif font-bold text-gray-900 mt-3 leading-snug tracking-tight">
              THE QUINTESSENTIAL PURITY OF PAIDHU BOTANICAL FOODS IS A RESULT OF OUR DEDICATED FARMERS, NUTRIENT-RICH SOIL, AND THE ALL-NATURAL WAY OF CULTIVATION WE PURSUE.
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed max-w-3xl">
              Inspired by time-honored botanical traditions, Just B Happy Farm cultivates premium edible flowers across Tamil Nadu through transparent, farmer-first stewardship. From dawn harvest to gentle sun-curing, every petal is treated as a delicate work of nature.
            </p>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#4E580F]/15 text-center shadow-xs">
              <Sun className="w-5 h-5 text-[#4E580F] mx-auto mb-1.5" />
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Harvest Time</p>
              <p className="text-xs sm:text-sm font-black text-[#4E580F]">Dawn Dew Hours</p>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#4E580F]/15 text-center shadow-xs">
              <Sprout className="w-5 h-5 text-[#4E580F] mx-auto mb-1.5" />
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Soil Practice</p>
              <p className="text-xs sm:text-sm font-black text-[#4E580F]">All-Natural Composting</p>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#4E580F]/15 text-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#4E580F] mx-auto mb-1.5" />
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Guarantee</p>
              <p className="text-xs sm:text-sm font-black text-[#4E580F]">100% Contract Buyback</p>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#4E580F]/15 text-center shadow-xs">
              <Users className="w-5 h-5 text-[#4E580F] mx-auto mb-1.5" />
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Empowerment</p>
              <p className="text-xs sm:text-sm font-black text-[#4E580F]">Women Collectives</p>
            </div>
          </div>

          {/* 6 Narrative Chapters with Visual Photo Cards */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-[#4E580F]/20 pb-2">
              <FileText className="w-4 h-4 text-[#4E580F]" />
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4E580F]">
                The Journey of Just B Happy Botanical Cultivation
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {CULTIVATION_PILLARS.map((pillar, idx) => (
                <div 
                  key={pillar.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#4E580F]/15 shadow-sm hover:shadow-md transition-shadow flex flex-col group"
                >
                  {/* Photo Container */}
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gray-900">
                    <img 
                      src={pillar.image} 
                      alt={pillar.title} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow ${pillar.badgeColor}`}>
                        Chapter 0{idx + 1} · {pillar.tag}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="text-sm sm:text-base font-serif font-bold text-white drop-shadow">
                        {pillar.title}
                      </h4>
                      <p className="text-[11px] text-[#F9E086] font-medium drop-shadow-sm">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {pillar.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Farming Callout Card inside Popup */}
          <div className="bg-gradient-to-br from-[#2C3308] via-[#3A420B] to-[#4E580F] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white border-2 border-[#F9E086]/40 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#F9E086] bg-[#F9E086]/10 px-3 py-1 rounded-full border border-[#F9E086]/30 inline-block">
                  Agrarian Partnership Program
                </span>
                <h4 className="text-base sm:text-xl md:text-2xl font-serif font-black text-white">
                  Cultivate Edible Flowers with Paidhu
                </h4>
                <p className="text-xs sm:text-sm text-gray-200 max-w-xl leading-relaxed">
                  Have farmland in Tamil Nadu or neighboring districts? Join our network of contract flower growers. We provide certified planting stock, expert agronomist guidance, and an ironclad 100% buyback guarantee directly at your farm gate.
                </p>
              </div>

              <button
                onClick={handleApplyClick}
                className="px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-[#F9E086] via-[#FFF1B8] to-[#F9E086] text-[#2C3308] font-serif font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-white/40 flex-shrink-0"
              >
                <span>Fill Farm Application Form</span>
                <ArrowRight className="w-4 h-4 text-[#2C3308]" />
              </button>
            </div>
          </div>

        </div>

        {/* ──────── STICKY MODAL FOOTER ──────── */}
        <div className="sticky bottom-0 z-20 bg-white border-t border-[#4E580F]/20 px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="text-[11px] sm:text-xs text-gray-500 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#4E580F] flex-shrink-0" />
            <span>Paidhu Ethical Foods & Just B Happy Farm Initiative</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
            >
              Close Story
            </button>
            <button
              onClick={handleApplyClick}
              className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#4E580F] hover:bg-[#3A420B] text-[#F9E086] text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer border border-[#F9E086]/40"
            >
              <span>Apply for Contract Farming</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FarmCultivationModal;
