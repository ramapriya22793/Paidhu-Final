import React, { useState } from 'react';
import { 
  Sprout, 
  Sun, 
  Heart, 
  ShieldCheck, 
  Award, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Flower2, 
  Droplets, 
  Leaf, 
  Layers,
  MapPin,
  Calendar,
  Compass
} from 'lucide-react';

const CULTIVATION_GALLERY = [
  {
    id: 'women-collective',
    title: 'Women Farmers & Artisans Collective',
    category: 'Community & Empowerment',
    badge: 'Women-Led Agriculture',
    image: '/farm/women_farmers_collective.jpg',
    description: 'Founder Ragapriya with our devoted women farming team in Tamil Nadu. Together, they hand-nurture, harvest, and protect our pristine botanical crops with utmost dignity and safety.'
  },
  {
    id: 'butterfly-pea-harvest',
    title: 'Morning Harvest of Butterfly Pea',
    category: 'Handpicked Blooms',
    badge: 'Delicate Hand-Picking',
    image: '/farm/founder_harvesting_butterfly_pea.jpg',
    description: 'Founder Ragapriya gently harvesting tender blue butterfly pea (Shankhupushpi / Aparajita) blossoms at sunrise when the nectar and natural vibrant anthocyanins are at their highest potency.'
  },
  {
    id: 'butterfly-pea-basket',
    title: 'Freshly Picked Aparajita Blooms',
    category: 'Botanical Purity',
    badge: '100% Pesticide-Free',
    image: '/farm/butterfly_pea_basket.jpg',
    description: 'Handcrafted bamboo basket cradling pristine blue butterfly pea flowers, freshly gathered without bruising a single petal. Handpicked every single morning before noon.'
  },
  {
    id: 'dried-marigolds',
    title: 'Sun-Cured Golden Marigold Petals',
    category: 'Traditional Curing',
    badge: 'Rich in Lutein',
    image: '/farm/dried_marigold_petals.jpg',
    description: 'Sun-dried golden marigold petals resting in a traditional vessel. Carefully separated by hand and dried under gentle natural sunlight to preserve culinary aroma and vibrant color.'
  },
  {
    id: 'dried-hibiscus',
    title: 'Sun-Cured Crimson Roselle / Hibiscus',
    category: 'Pure Calyces',
    badge: 'Natural Vitamin C',
    image: '/farm/dried_hibiscus_petals.jpg',
    description: 'Natural sun-cured hibiscus calyces radiating deep burgundy tones. Hand-harvested and air-cured for Paidhu’s artisanal herbal infusions, jams, and therapeutic botanical teas.'
  }
];

const FarmCultivationStory = ({ onScrollToForm }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className="w-full bg-[#F7F8F0] text-gray-800">
      
      {/* ──────────────── 1. HERO PHILOSOPHY STATEMENT ──────────────── */}
      {/* Inspired directly by Goodness Vanilla Cultivation page style */}
      <section className="relative overflow-hidden bg-white border-b border-[#4E580F]/15 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4E580F]/10 border border-[#4E580F]/25 text-[#4E580F] text-xs sm:text-sm font-bold tracking-wider uppercase mb-5">
            <Flower2 className="w-4 h-4 text-[#4E580F]" />
            <span>Cultivation & Botanical Heritage</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-black text-gray-900 tracking-tight leading-tight sm:leading-snug">
            Cultivation at Just B Happy Farm
          </h2>

          <div className="w-20 h-1 bg-[#4E580F] mx-auto my-6 rounded-full" />

          <p className="text-sm sm:text-base md:text-lg font-serif italic text-[#4E580F] max-w-3xl mx-auto uppercase tracking-wide leading-relaxed font-semibold">
            “THE QUINTESSENTIAL PURITY AND VITALITY OF PAIDHU ETHICAL FOODS IS A RESULT OF OUR CARING AND HARDWORKING WOMEN FARMERS AND THE ALL-NATURAL WAY OF HARVESTING WE PURSUE.”
          </p>

          <p className="mt-6 text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-sans">
            Edible botanicals are nature's most delicate gifts. From the morning bloom of blue butterfly pea to the golden glory of marigolds and rich crimson hibiscus, our entire farming practice is rooted in ethical stewardship, zero synthetic chemicals, and rural women empowerment.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onScrollToForm}
              className="px-6 py-3 rounded-full bg-[#4E580F] text-[#F9E086] font-bold text-xs sm:text-sm shadow-lg hover:bg-[#3A420B] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Apply for Contract Farming</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#cultivation-process"
              className="px-6 py-3 rounded-full bg-[#F7F8F0] text-[#4E580F] font-bold text-xs sm:text-sm border border-[#4E580F]/30 hover:bg-[#4E580F]/10 transition-all cursor-pointer"
            >
              Explore Our Process
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────── 2. FROM BLOSSOM TO HARVEST: THE CROP STORY ──────────────── */}
      <section id="cultivation-process" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Rich Storytelling Text */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4E580F] uppercase tracking-wider">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>The Nature of the Crop</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-gray-900 leading-tight">
              A Labour of Love: From First Morning Light to Pristine Petal
            </h3>

            <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
              Cultivating edible botanical flowers is one of the world's most labour-intensive and patient agricultural arts. Unlike industrial commercial crops, edible flowers require absolute purity—they are grown without synthetic sprays, toxic chemical pesticides, or artificial growth stimulants.
            </p>

            <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
              Our botanical blossoms, such as the sacred <strong>Blue Butterfly Pea (Shankhupushpi / Clitoria ternatea)</strong>, bloom before sunrise and stay open for only a fleeting window during the morning hours. Our trained farmers gently pluck each flower by hand before the midday heat, preserving the delicate bioactive anthocyanins, natural sugars, and soothing essential oils.
            </p>

            <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
              Every single flower is handled with reverence: inspected by hand, sorted under natural shade, and transferred to clean drying trays to ensure that the wholesome spirit of the soil reaches your dining table without compromise.
            </p>

            {/* Micro Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
              <div className="p-3 bg-white rounded-xl border border-[#4E580F]/15 shadow-sm">
                <span className="text-lg sm:text-xl font-serif font-black text-[#4E580F] block">6:00 AM</span>
                <span className="text-[11px] text-gray-500 font-medium">Morning hand-picking peak</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#4E580F]/15 shadow-sm">
                <span className="text-lg sm:text-xl font-serif font-black text-[#4E580F] block">0% Chemicals</span>
                <span className="text-[11px] text-gray-500 font-medium">Pesticide & residue-free</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#4E580F]/15 shadow-sm col-span-2 sm:col-span-1">
                <span className="text-lg sm:text-xl font-serif font-black text-[#4E580F] block">100% Hand</span>
                <span className="text-[11px] text-gray-500 font-medium">Gentle artisan sorting</span>
              </div>
            </div>
          </div>

          {/* Right: Authentic Farm Photos (Founder Harvesting + Basket) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div 
              onClick={() => setSelectedPhoto(CULTIVATION_GALLERY[1])}
              className="relative group rounded-2xl overflow-hidden shadow-lg border-2 border-white cursor-pointer aspect-[3/4]"
            >
              <img 
                src="/farm/founder_harvesting_butterfly_pea.jpg" 
                alt="Founder harvesting butterfly pea flowers"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] font-bold text-[#F9E086] uppercase tracking-wider">Morning Harvest</span>
                <p className="text-xs font-semibold leading-tight line-clamp-2">Founder Ragapriya harvesting fresh blooms</p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedPhoto(CULTIVATION_GALLERY[2])}
              className="relative group rounded-2xl overflow-hidden shadow-lg border-2 border-white cursor-pointer aspect-[3/4] mt-6"
            >
              <img 
                src="/farm/butterfly_pea_basket.jpg" 
                alt="Fresh blue butterfly pea flowers in bamboo basket"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] font-bold text-[#F9E086] uppercase tracking-wider">Handcrafted Basket</span>
                <p className="text-xs font-semibold leading-tight line-clamp-2">Fresh Blue Butterfly Pea flowers</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────── 3. TRADITIONAL CURING & SUN PROCESSING ──────────────── */}
      <section className="bg-white border-y border-[#4E580F]/15 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Curing Photos (Marigolds + Hibiscus) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 order-2 lg:order-1">
              <div 
                onClick={() => setSelectedPhoto(CULTIVATION_GALLERY[3])}
                className="relative group rounded-2xl overflow-hidden shadow-lg border-2 border-[#4E580F]/20 cursor-pointer aspect-square"
              >
                <img 
                  src="/farm/dried_marigold_petals.jpg" 
                  alt="Sun dried marigold petals"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                  <span className="text-[10px] font-bold text-[#F9E086] uppercase tracking-wider">Golden Marigolds</span>
                  <p className="text-xs font-bold leading-tight">Sun-cured flower petals</p>
                </div>
              </div>

              <div 
                onClick={() => setSelectedPhoto(CULTIVATION_GALLERY[4])}
                className="relative group rounded-2xl overflow-hidden shadow-lg border-2 border-[#4E580F]/20 cursor-pointer aspect-square mt-4"
              >
                <img 
                  src="/farm/dried_hibiscus_petals.jpg" 
                  alt="Sun cured hibiscus calyces"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                  <span className="text-[10px] font-bold text-[#F9E086] uppercase tracking-wider">Crimson Roselle</span>
                  <p className="text-xs font-bold leading-tight">Sun-cured hibiscus petals</p>
                </div>
              </div>
            </div>

            {/* Right: Curing Process Text */}
            <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4E580F] uppercase tracking-wider">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span>Traditional Curing & Processing</span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-gray-900 leading-tight">
                From Flower to Flavour: Perfected Through Traditional Drying
              </h3>

              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                Fine botanical ingredients are a masterpiece of nature perfected through time-honored artisanal methods. Post-harvest, our freshly picked blossoms are carefully destemmed, cleaned of any foreign particles, and gently spread across hygienic drying frames.
              </p>

              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                We employ slow shade drying and filtered solar curing—preserving the natural antioxidants, vibrant natural colours, and complex floral aromas without scorching or nutrient degradation. Our golden marigold petals and crimson roselle hibiscus achieve the ideal balance of moisture retention and crisp botanical purity.
              </p>

              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                These perfected petals are subsequently blended into Paidhu’s acclaimed edible flower teas, culinary cookies, festive treats, and nutrient-dense postpartum superfoods.
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs font-bold text-[#4E580F]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No Chemical Fumigation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Solar Air-Cured</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Preservatives</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────── 4. OUR GARDENS & TERROIR ──────────────── */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E580F] uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4 text-[#4E580F]" />
            <span>The Terroir & Soil</span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-gray-900 leading-tight">
            Our Gardens: The Fertile Foothills of Tamil Nadu
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-3 leading-relaxed">
            Welcome to the sun-blessed soils of Tamil Nadu and the Western Ghats periphery, where warm tropical sunlight, pristine groundwater, and nutrient-dense loamy soils nurture vibrant edible botanical flowers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#4E580F]/15 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[#4E580F]/10 flex items-center justify-center text-[#4E580F] mb-4">
              <Sprout className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-serif font-bold text-gray-900 mb-2">Living Bio-Diverse Soil</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Enriched with organic vermicompost, cow dung manure, and neem cake. Every farm plot undergoes comprehensive soil testing to ensure clean agrarian health.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#4E580F]/15 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[#4E580F]/10 flex items-center justify-center text-[#4E580F] mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-serif font-bold text-gray-900 mb-2">Pure Water & Micro-Drip</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Tested borewell water delivered through modern micro-drip irrigation, conserving precious groundwater while providing the exact hydration each flower vine desires.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#4E580F]/15 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[#4E580F]/10 flex items-center justify-center text-[#4E580F] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-serif font-bold text-gray-900 mb-2">Natural Pollinator Sanctuary</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Our organic flower fields act as sanctuaries for native honeybees, butterflies, and friendly insects, fostering a balanced ecological sanctuary that rejects chemical sprays.
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────── 5. JUST B HAPPY FARM INITIATIVE & WOMEN EMPOWERMENT ──────────────── */}
      {/* Featuring the uploaded group photo of the women farmers! */}
      <section className="bg-gradient-to-b from-white via-[#F7F8F0] to-white border-y border-[#4E580F]/15 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: The Inspiring Women Group Photo */}
            <div className="lg:col-span-6">
              <div 
                onClick={() => setSelectedPhoto(CULTIVATION_GALLERY[0])}
                className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-[#4E580F]/20 cursor-pointer"
              >
                <img 
                  src="/farm/women_farmers_collective.jpg" 
                  alt="Paidhu Just B Happy Women Farmers Collective" 
                  className="w-full h-auto object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4E580F] text-[#F9E086] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 w-fit">
                    <Users className="w-3.5 h-3.5" />
                    <span>The Heart of Our Farms</span>
                  </div>
                  <h4 className="text-base sm:text-xl font-serif font-bold text-white">
                    Women Farmers & Artisans Collective
                  </h4>
                  <p className="text-xs text-white/90 line-clamp-2 mt-1">
                    Founder Ragapriya with rural women farmers in Tamil Nadu—empowered through dignified contract farming, certified training, and fair financial growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: The Initiative Details */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4E580F]/10 border border-[#4E580F]/20 text-[#4E580F] text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 text-rose-600" />
                <span>Just B Happy Farm Initiative</span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-gray-900 leading-tight">
                Empowering Rural Hands, Guaranteeing Dignified Livelihoods
              </h3>

              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                The <strong>Just B Happy Farm Initiative</strong> is the agrarian foundation of <strong>Paidhu Ethical Foods</strong>. Conceived to organize small and marginal farmers across Tamil Nadu, this initiative transforms traditional agriculture into high-value, sustainable botanical floriculture.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[#4E580F]/15 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-gray-900">100% Guaranteed Buyback Agreement</h5>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Participating farmers enjoy complete price security. Every single certified harvest is purchased by Paidhu Ethical Foods at premium fair prices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[#4E580F]/15 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-gray-900">Dedicated Agronomist & Technical Guidance</h5>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Our in-house agronomy specialists provide free soil testing, organic input schedules, protective harvest eyewear, and post-harvest drying setup.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[#4E580F]/15 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-gray-900">Women Economic Independence</h5>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Over 80% of our daily harvest and sorting operations are led by local women, generating direct bank payouts and strengthening rural families.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onScrollToForm}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#4E580F] text-[#F9E086] font-bold text-xs sm:text-sm shadow-xl hover:bg-[#3A420B] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Join the Farm Initiative Today</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ──────────────── 6. COMPLETE BOTANICAL HARVEST GALLERY ──────────────── */}
      {/* Featuring all 5 user uploaded images in a responsive gallery */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E580F] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Visual Chronicle</span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-gray-900 leading-tight">
            The Botanical Harvest Gallery
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
            Click on any photograph to explore the authentic journey of our edible flowers—from morning harvest vines to sun-cured perfection.
          </p>
        </div>

        {/* 5-Image Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CULTIVATION_GALLERY.map((item, idx) => (
            <div 
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className={`group bg-white rounded-2xl overflow-hidden border border-[#4E580F]/20 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${idx === 0 ? 'h-64 sm:h-80' : 'h-56 sm:h-64'}`}>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-3 left-3 bg-[#4E580F]/90 backdrop-blur-md text-[#F9E086] text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow">
                  {item.badge}
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.category}</span>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-gray-900 mt-1 mb-2 group-hover:text-[#4E580F] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#4E580F]">
                  <span>View Full Photo</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────── 7. LIGHTBOX MODAL FOR HIGH-RES PREVIEW ──────────────── */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fade-in cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border-2 border-[#4E580F]/30 cursor-default"
          >
            <div className="relative max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
              <img 
                src={selectedPhoto.image} 
                alt={selectedPhoto.title} 
                className="w-full h-auto max-h-[65vh] object-contain"
              />
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-2 rounded-full cursor-pointer transition shadow"
              >
                ✕
              </button>
            </div>
            <div className="p-5 sm:p-6 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#4E580F] text-[#F9E086] text-[10px] font-bold uppercase tracking-wider">
                  {selectedPhoto.badge}
                </span>
                <span className="text-xs text-gray-400 font-medium">Just B Happy Farm Purity</span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── 8. CALL TO ACTION BANNER LEADING TO FORM ──────────────── */}
      <section className="bg-[#4E580F] text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-t-4 border-[#F9E086]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-[#F9E086] text-xs font-bold uppercase tracking-wider border border-[#F9E086]/30">
            Open Enrollment for Growers
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white">
            Ready to Cultivate With Just B Happy Farm?
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            Whether you own 50 cents or 5 acres of land, partner with Paidhu Ethical Foods for contract botanical farming with 100% buyback guarantee, free soil analysis, and full agronomy support.
          </p>
          <div className="pt-2">
            <button
              onClick={onScrollToForm}
              className="px-8 py-4 rounded-full bg-[#F9E086] text-[#3A420B] font-black text-xs sm:text-sm shadow-xl hover:bg-white transition-all transform hover:scale-105 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Fill Contract Farming Application Below</span>
              <ArrowRight className="w-4 h-4 text-[#3A420B]" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FarmCultivationStory;
