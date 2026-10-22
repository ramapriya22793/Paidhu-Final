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

      {/* ──────────────── 2. START OF PAGE APPLICATION ACTION RIBBON ──────────────── */}
      {/* Placed prominently at start of the page directly below the banner */}
      <section className="w-full bg-gradient-to-r from-[#2C3308] via-[#4E580F] to-[#2C3308] py-4 sm:py-5 px-4 sm:px-6 lg:px-8 border-b-2 border-[#F9E086] shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3.5 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F9E086]/15 border border-[#F9E086]/40 flex items-center justify-center text-[#F9E086] flex-shrink-0 shadow-inner">
              <Sparkles className="w-5 h-5 text-[#F9E086]" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#F9E086]">
                  Contract Botanical Farming
                </span>
                <span className="w-1 h-1 rounded-full bg-[#F9E086]" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/90">
                  100% Guaranteed Buyback
                </span>
              </div>
              <h2 className="text-sm sm:text-base md:text-lg font-serif font-bold text-white mt-0.5 tracking-wide">
                Cultivate Certified Edible Flowers with Paidhu
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsApplicationModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-gradient-to-r from-[#F9E086] via-[#FFF1B8] to-[#F9E086] hover:from-white hover:to-[#F9E086] text-[#2C3308] font-serif font-black text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-white/50 flex-shrink-0"
          >
            <FileText className="w-4 h-4 text-[#2C3308]" />
            <span>Fill Farm Application Form</span>
            <ArrowRight className="w-4 h-4 text-[#2C3308]" />
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
