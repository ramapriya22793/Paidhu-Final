import React, { useState } from 'react';
import { Sparkles, FileText, ArrowRight } from 'lucide-react';
import SEO from '../components/seo/SEO';
import FarmBannerSlider from '../components/farm/FarmBannerSlider';
import FarmCultivationStory from '../components/farm/FarmCultivationStory';
import FarmApplicationModal from '../components/farm/FarmApplicationModal';

const JustBHappyPage = () => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-gray-800 overflow-x-hidden">
      <SEO 
        title="Cultivation & Botanical Heritage | Just B Happy Farm - Paidhu Ethical Foods"
        description="Explore the botanical cultivation journey of Just B Happy Farm by Paidhu Ethical Foods. Learn about our hand-harvested edible flowers, traditional sun-curing, rural women empowerment, and contract farming initiative."
        slug="just-b-happy"
        image="/just_b_happy_logo.png"
      />

      {/* ──────────────── 1. SCROLLING BANNER IMAGE CAROUSEL ──────────────── */}
      <FarmBannerSlider 
        onOpenApplication={() => setIsApplicationModalOpen(true)} 
      />

      {/* ──────────────── 2. START OF PAGE APPLICATION ACTION CARD ──────────────── */}
      {/* Refined, airy botanical invitation card placed right below the banner */}
      <section className="w-full bg-[#F7F8F0] pt-5 pb-2 sm:pt-7 sm:pb-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl lg:max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-full p-4 sm:py-3.5 sm:px-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#4E580F]/20 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full p-1 bg-[#F7F8F0] border border-[#4E580F]/20 shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img 
                src="/just_b_happy_logo.png" 
                alt="Just B Happy Farm" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4E580F]">
                  Contract Botanical Farming
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4E580F]/40" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8A701C]">
                  100% Guaranteed Buyback
                </span>
              </div>
              <h2 className="text-sm sm:text-base md:text-lg font-serif font-bold text-gray-900 mt-0.5 tracking-tight">
                Cultivate Certified Edible Flowers with Paidhu
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsApplicationModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#4E580F] hover:bg-[#3A420B] text-[#F9E086] hover:text-white font-serif font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] active:scale-95 cursor-pointer border border-[#F9E086]/30 flex-shrink-0 group"
          >
            <Sparkles className="w-4 h-4 text-[#F9E086] group-hover:rotate-12 transition-transform" />
            <span>Fill Farm Application Form</span>
            <ArrowRight className="w-4 h-4 text-[#F9E086] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ──────────────── 3. CULTIVATION & BOTANICAL HERITAGE STORY ──────────────── */}
      {/* Editorial flow replicating Goodness Vanilla cultivation page */}
      <FarmCultivationStory 
        onOpenApplication={() => setIsApplicationModalOpen(true)} 
      />

      {/* ──────────────── 4. MODAL POP UP APPLICATION FORM ──────────────── */}
      {/* 3-Step comprehensive farm application opens smoothly in modal pop up */}
      <FarmApplicationModal 
        isOpen={isApplicationModalOpen} 
        onClose={() => setIsApplicationModalOpen(false)} 
      />
    </div>
  );
};

export default JustBHappyPage;
