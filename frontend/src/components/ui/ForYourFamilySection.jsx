import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Heart, Sparkles, BookOpen, ArrowRight, ShieldCheck, Sun,
  CheckCircle, HelpCircle, Eye, RefreshCw, Info, Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ForYourFamilySection = () => {
  const [activeFlower, setActiveFlower] = useState(0);

  // 1. EDIBLE FLOWER ENCYCLOPEDIA DATA
  const flowerEncyclopedia = [
    {
      name: "Saffron",
      scientific: "Crocus sativus",
      color: "from-amber-500 to-red-600",
      bgLight: "bg-amber-50",
      textDark: "text-amber-900",
      borderCol: "border-amber-200",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop",
      familyBenefit: "Improves children's memory, enhances vision health, boosts mood, and builds strong defense against seasonal colds.",
      nutrition: "Loaded with Crocin, Safranal, and Riboflavin (Vitamin B2) which support cellular regeneration and brain health.",
      howToUse: "Stir 2-3 strands into warm milk, blend in breakfast smoothies, or add to saffron-scented rice (Biryani/Kheer).",
      productName: "Kashmiri Mongra Saffron",
      productSlug: "kashmiri-mongra",
      productImage: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780938979730-SuperNeiginbig1600x600jpg.jpg"
    },
    {
      name: "Hibiscus",
      scientific: "Hibiscus rosa-sinensis",
      color: "from-rose-500 to-red-700",
      bgLight: "bg-rose-50",
      textDark: "text-rose-900",
      borderCol: "border-rose-200",
      image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=600&auto=format&fit=crop",
      familyBenefit: "Rich in Vitamin C, supports heart health, improves iron absorption, and maintains excellent digestion.",
      nutrition: "High concentration of anthocyanins (powerful red antioxidants) and organic acids that fight free radicals.",
      howToUse: "Brew as a tart iced tea, cook down into organic petal jams, or use as a natural pink food coloring for bakes.",
      productName: "Hibiscus Petal Jam",
      productSlug: "hibiscus-petal-jam",
      productImage: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780856723641-WhatsAppImage20260417at10558PM600x750jpeg.jpeg"
    },
    {
      name: "Butterfly Pea",
      scientific: "Clitoria ternatea",
      color: "from-blue-600 to-indigo-800",
      bgLight: "bg-blue-50",
      textDark: "text-blue-900",
      borderCol: "border-blue-200",
      image: "https://images.unsplash.com/photo-1599388836585-7833075c3db0?q=80&w=600&auto=format&fit=crop",
      familyBenefit: "Enhances cognitive function, relieves stress, promotes healthy skin, and stimulates natural hair growth.",
      nutrition: "Contains high amounts of 'Proanthocyanidin' which increases blood flow in capillaries, and acts as a brain tonic.",
      howToUse: "Infuse in hot water to create a magical blue tea. Squeeze in lemon juice to watch it turn into bright purple!",
      productName: "Brew Flora - Blue Pea (30g)",
      productSlug: "brew-flora-blue-pea-30g",
      productImage: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937499230-WhatsAppImage20251113at233020322c5e7d600x800jpg.jpg"
    },
    {
      name: "Rose Petals",
      scientific: "Rosa",
      color: "from-pink-400 to-rose-600",
      bgLight: "bg-pink-50",
      textDark: "text-pink-900",
      borderCol: "border-pink-200",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
      familyBenefit: "Cools body heat, relieves stress, cures mild throat soreness, and acts as an elegant digestive aid after heavy meals.",
      nutrition: "Packed with Vitamins A, C, and E, as well as polyphenols that soothe internal inflammation.",
      howToUse: "Mix rose water into desserts, spread organic petal jam on toast, or garnish cookies and cakes with dry petals.",
      productName: "Rose Gulkhand Jam",
      productSlug: "rose-gulkhand-jam",
      productImage: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1781535450213-Gulkandfinaljpg.jpg"
    },
    {
      name: "Chamomile",
      scientific: "Matricaria chamomilla",
      color: "from-yellow-400 to-yellow-600",
      bgLight: "bg-yellow-50",
      textDark: "text-yellow-900",
      borderCol: "border-yellow-200",
      image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=600&auto=format&fit=crop",
      familyBenefit: "Relieves hyper-activity in kids, calms anxiety, relaxes tense muscles, and induces deep, restful sleep.",
      nutrition: "Rich in 'Apigenin', an antioxidant that binds to specific receptors in the brain to decrease insomnia and promote peace.",
      howToUse: "Steep in warm water for 5 minutes before bedtime, sweeten with raw honey, and serve to children and adults alike.",
      productName: "Brew Flora - Chamomile (30g)",
      productSlug: "brew-flora-chamomile-30g",
      productImage: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937914670-WhatsAppImage20251113at2330215f60b43f600x800jpg.jpg"
    }
  ];

  // 2. FLORAL WELLNESS MATRIX DATA
  const floralMatrix = [
    {
      title: "Brain & Focus Booster",
      desc: "Supports cognitive function, sharpens focus, and reduces mental fatigue in children and working parents.",
      badge: "Blue Pea & Saffron",
      pic: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937499230-WhatsAppImage20251113at233020322c5e7d600x800jpg.jpg",
      color: "from-blue-500/10 to-indigo-500/10 border-blue-100 text-blue-900"
    },
    {
      title: "Immunity Shield",
      desc: "Rich in Vitamin C and active bioflavonoids that help protect your children from seasonal coughs and infections.",
      badge: "Hibiscus & Rose",
      pic: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780856723641-WhatsAppImage20260417at10558PM600x750jpeg.jpeg",
      color: "from-rose-500/10 to-red-500/10 border-rose-100 text-rose-900"
    },
    {
      title: "Sleep & Calm Aid",
      desc: "Relieves hyper-activity in kids and creates a relaxing bedtime routine by naturally soothing the nervous system.",
      badge: "Chamomile & Lavender",
      pic: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1780937914670-WhatsAppImage20251113at2330215f60b43f600x800jpg.jpg",
      color: "from-amber-500/10 to-yellow-500/10 border-amber-100 text-amber-900"
    },
    {
      title: "Digestive Cooler",
      desc: "Traditional cooling botanicals that soothe internal heat, support gut health, and ease food digestion.",
      badge: "Rose & Calendula",
      pic: "https://szgqtggokqqaoomryljr.supabase.co/storage/v1/object/public/Products/products/1781535450213-Gulkandfinaljpg.jpg",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-100 text-emerald-900"
    }
  ];

  return (
    <div className="font-sans text-gray-800 bg-[#faf9f7] pb-16">
      {/* ══════════════════════════════════════════════════
          1. HERO BANNER
          ══════════════════════════════════════════════════ */}
      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[300px] md:h-[480px] bg-white overflow-hidden">
        <img
          src="/hero_family_banner.png"
          alt="Family Floral Wellness"
          className="w-full h-full object-cover brightness-[0.95]"
        />
      </section>

      {/* Page Title Section below the banner */}
      <section className="max-w-7xl mx-auto px-6 mt-12 text-center">
        <span className="text-xs font-black uppercase tracking-widest text-[#662654] bg-[#662654]/5 px-3 py-1 rounded-full">
          Edible Flower Learning Guide
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold mt-4 text-gray-900 leading-tight">
          Edible Flowers for Family Wellness
        </h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto mt-3 text-sm md:text-base leading-relaxed">
          Edible flowers are nature's premium superfoods. Explore our interactive guide below to learn how adding flowers to your family's daily meals promotes lifetime health.
        </p>
      </section>

      {/* ══════════════════════════════════════════════════
          2. UNIQUE INTERACTIVE FLOWER ENCYCLOPEDIA
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 mt-16 md:mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#662654] bg-[#662654]/5 px-3 py-1 rounded-full">
            Interactive Encyclopedia
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-4 mb-4 text-gray-900">
            Meet the Healing Flowers
          </h2>
          <p className="text-gray-500 font-medium">
            Click on any flower below to discover its scientific profile, health benefits, nutritional secrets, and family recipe ideas!
          </p>
        </div>

        {/* Unique Interactive Tab Layout */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Flower Tabs Selector */}
          <div className="lg:col-span-4 bg-gray-50 p-6 border-r border-gray-100 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible custom-scrollbar">
            {flowerEncyclopedia.map((flower, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFlower(idx)}
                className={`flex-shrink-0 flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-left transition-all text-sm w-[240px] lg:w-full border cursor-pointer ${
                  activeFlower === idx
                    ? `bg-[#662654] text-white border-[#662654] shadow-md shadow-[#662654]/10`
                    : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${flower.color} font-black text-xs shadow-inner`}>
                  {flower.name.charAt(0)}
                </div>
                <div>
                  <div className="block leading-tight">{flower.name}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Flower Details Display */}
          <div className="lg:col-span-8 p-8 md:p-12 flex flex-col justify-between min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFlower}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-gradient-to-r ${flowerEncyclopedia[activeFlower].color} text-white shadow-sm`}>
                      Active Botanical
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
                      {flowerEncyclopedia[activeFlower].name}
                    </h3>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-5 rounded-2xl border ${flowerEncyclopedia[activeFlower].borderCol} ${flowerEncyclopedia[activeFlower].bgLight}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart size={18} className="text-[#662654]" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">Family Health Benefit</h4>
                    </div>
                    <p className={`text-sm font-semibold leading-relaxed ${flowerEncyclopedia[activeFlower].textDark}`}>
                      {flowerEncyclopedia[activeFlower].familyBenefit}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf size={18} className="text-emerald-600" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">Nutritional Profile</h4>
                    </div>
                    <p className="text-sm text-gray-600 font-semibold leading-relaxed">
                      {flowerEncyclopedia[activeFlower].nutrition}
                    </p>
                  </div>
                </div>

                {/* How to use */}
                <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-inner flex gap-3 items-start">
                  <Info size={20} className="text-[#662654] flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 mb-1">How to include in family meals</h4>
                    <p className="text-sm text-gray-500 font-semibold leading-relaxed">
                      {flowerEncyclopedia[activeFlower].howToUse}
                    </p>
                  </div>
                </div>

                {/* Recommended Product Box */}
                {flowerEncyclopedia[activeFlower].productName && (
                  <div className="pt-5 border-t border-gray-100 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50 flex items-center justify-center p-1 shadow-sm">
                        <img 
                          src={flowerEncyclopedia[activeFlower].productImage} 
                          alt={flowerEncyclopedia[activeFlower].productName} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-widest text-[#662654] uppercase block mb-0.5">Featured Product</span>
                        <h5 className="text-sm font-black text-gray-900 leading-snug">{flowerEncyclopedia[activeFlower].productName}</h5>
                      </div>
                    </div>
                    <Link
                      to={`/product/${flowerEncyclopedia[activeFlower].productSlug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#662654] hover:bg-[#7a2e64] text-white px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-md shadow-[#662654]/10 hover:shadow-[#662654]/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>Shop Now</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
      {/* ══════════════════════════════════════════════════
          3. FLORAL WELLNESS MATRIX FOR FAMILIES
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 mt-16 md:mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#662654] bg-[#662654]/5 px-3 py-1 rounded-full">
            Floral Power Matrix
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-4 mb-4 text-gray-900 leading-tight">
            Wellness Benefits for the Entire Family
          </h2>
          <p className="text-gray-500 font-medium">
            Explore how different edible flowers combine to support key areas of your family's daily vitality and immune protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {floralMatrix.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${item.color} rounded-[2rem] p-6 md:p-8 border flex gap-5 items-start hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-white border border-gray-100 p-1 flex items-center justify-center">
                <img 
                  src={item.pic} 
                  alt={item.title} 
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-black tracking-wider bg-white/90 border border-current/10 px-2 py-0.5 rounded uppercase">
                  {item.badge}
                </span>
                <h4 className="font-black text-lg text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. COMMUNITY CALL TO ACTION
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 mt-16 md:mt-24">
        <div className="bg-[#662654] rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle floral pattern background effect */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay">
            <div className="absolute top-10 left-10 text-6xl">🌸</div>
            <div className="absolute bottom-10 right-10 text-6xl">🌺</div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <Users size={48} className="text-[#fbc225] mx-auto animate-bounce-slow" />
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#fdfaf6] leading-tight">
              Join Our Floral Wellness Tribe
            </h3>
            <p className="text-[#fdfaf6]/80 font-medium leading-relaxed text-sm md:text-base">
              Share recipes, learn how other moms introduce floral wellness to their homes, and get access to exclusive workshops led by clinical nutritionists and wellness experts.
            </p>
            <div className="pt-4">
              <Link
                to="/shop/our-own-community"
                className="inline-flex items-center gap-2 bg-[#fbc225] hover:bg-[#eab015] text-[#522742] px-8 py-4 rounded-full font-black text-sm transition-all shadow-lg hover:scale-105 active:scale-[0.98]"
              >
                <span>Visit Our Community Page</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForYourFamilySection;
