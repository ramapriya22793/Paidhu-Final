import React, { useState } from 'react';
import { ArrowDown, ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Maximize2, X } from 'lucide-react';

const FarmCultivationStory = ({ onScrollToForm, onOpenApplication }) => {
  const [activeZoomImg, setActiveZoomImg] = useState(null);

  const handleOpenForm = () => {
    if (onOpenApplication) {
      onOpenApplication();
    } else if (onScrollToForm) {
      onScrollToForm();
    } else {
      const el = document.getElementById('farm-application-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <article className="w-full bg-[#F7F8F0] text-gray-800">
      
      {/* ──────────────── MAIN EDITORIAL CONTENT (GOODNESS VANILLA CULTIVATION LAYOUT) ──────────────── */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-14">

        {/* Lead Quote / Philosophy */}
        <div className="text-center my-6 sm:my-10">
          <p className="font-serif font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-wider text-[#4E580F] leading-snug sm:leading-relaxed max-w-3xl mx-auto">
            THE QUINTESSENTIAL PURITY OF PAIDHU BOTANICAL FOODS IS A RESULT OF OUR CARING AND HARDWORKING FARMERS AND THE ALL-NATURAL WAY OF CULTIVATION WE PURSUE.
          </p>
        </div>

        {/* Cultivate Content Paragraphs */}
        <div className="space-y-6 sm:space-y-7 text-[16px] sm:text-[18px] text-gray-700 leading-[1.85] sm:leading-[1.9] text-left md:text-justify font-sans">
          <p>
            Edible flower farming is one of the world&apos;s most delicate and labour-intensive agrarian crafts. Botanical blossoms such as Butterfly Pea (<em>Clitoria ternatea</em>), Roselle Hibiscus, French Marigold, and Damask Rose bloom once daily with large, fragrant, and vibrant petals. They usually open in the early morning dew and are receptive to harvest for only a few morning hours before the midday sun rises. A single plant produces dozens of blossoms over its flowering season, yet each blossom must be picked individually by hand.
          </p>
          <p>
            Botanical flower cultivation in Tamil Nadu requires immense care, dedication, and attention, and our labour of love begins with the healthy soil bed. The flowers open at dawn and every flower is gently hand-picked blossom by blossom by our farmers. The petals are harvested when they are in full, fresh bloom with rich, saturated jewel pigments. If they are harvested too early, the delicate floral aroma and natural nectar content will be lower. If they are left on the plant too long under the harsh sun, they wilt and split.
          </p>
          <p>
            Different curing methods are practiced around the world, but our goal is to produce unblemished, supple, aromatic petals that retain their vibrant natural hues. From flower to flavour, our petals are cured to perfection, bringing out the delicate undertones and captivating fragrance of true botanical blooms.
          </p>
          <p>
            Fine botanical foods are a work of nature perfected through traditional artisanal processes. Post-harvest, the finest scores of fresh petals are carefully sorted on clean woven wicker trays and then cured by means of our indigenously developed, low-temperature natural drying method. The petals are gently shade-cured and sun-dried over a period of days until they reach optimal moisture levels while keeping their vivid color and fragrance intact. They are then conditioned to lock in their natural floral essence, ready to be handcrafted into pure flower teas, infused cookies, and gourmet preserves.
          </p>
        </div>

        {/* ──────────────── SECTION: OUR GARDENS ──────────────── */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-[#4E580F]/30 pb-10 border-b border-[#4E580F]/30">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#4E580F] font-normal mb-5 tracking-tight">
            Our Gardens
          </h2>
          <p className="text-[16px] sm:text-[18px] text-gray-700 leading-[1.85] sm:leading-[1.9] text-left md:text-justify">
            Welcome to the fertile agrarian landscapes of Tamil Nadu and the foothills of the Western Ghats, on which grow our finest botanical edible flowers. Spread across pristine rural farming belts, we have a highly organized flower cultivation system under the Just B Happy Agrarian Initiative. We take every possible step to ensure the crop&apos;s quality, all-natural characteristics, and captivating purity. Several farming families and village collectives engage in the meticulous process of natural floral production to bring to life a truly wonderful promise &mdash; Paidhu Ethical Foods.
          </p>
        </div>

        {/* ──────────────── SECTION: BOTANICAL INITIATIVE ──────────────── */}
        <div className="mt-10 sm:mt-12 space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#4E580F] font-normal mb-5 tracking-tight">
            Just B Happy Botanical Initiative
          </h2>
          <div className="space-y-6 text-[16px] sm:text-[18px] text-gray-700 leading-[1.85] sm:leading-[1.9] text-left md:text-justify">
            <p>
              It is the chronicle of an extraordinary agrarian enterprise that proved to the world that ethical, community-driven farming creates lasting abundance. The Just B Happy Botanical Initiative is the dream child of Paidhu Ethical Foods, founded right here in Tamil Nadu out of a deep reverence for traditional Indian agriculture.
            </p>
            <p>
              With decades of combined experience in the botanical and agrarian value chain right from seed cultivation to consumer table, our team sensed the viability of high-value edible horticulture and started the Just B Happy Initiative. It was begun with a noble aim to organize flower growers across Tamil Nadu and neighboring districts and to help them receive fair, stable prices for their hard work.
            </p>
            <p>
              Under this Initiative, large and small farms cultivate edible flowers through contract farming partnerships making use of our proprietary, pesticide-free cultivation techniques. The Initiative ensures a 100% buyback guarantee for the growers, complete soil health support, and full farm-to-fork traceability across Tamil Nadu. The edible blossoms that we grow here are later introduced in all their purity to the market under the brand name Paidhu Ethical Foods.
            </p>
          </div>
        </div>

        {/* ──────────────── MID-SECTION AUTHENTIC PHOTO (GOODNESS VANILLA STYLE) ──────────────── */}
        <div className="my-10 sm:my-14 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-[#4E580F]/20 relative group bg-gray-900">
          <img 
            src="/farm/women_farmers_collective.jpg" 
            alt="Women Farmers Collective in Tamil Nadu - Just B Happy Farm" 
            className="w-full h-[280px] sm:h-[380px] md:h-[480px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end justify-between p-4 sm:p-6 text-white">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F9E086]">
                Rural Women Farmer Collectives
              </p>
              <p className="text-xs sm:text-sm text-gray-200 mt-0.5 font-serif">
                Hand-harvesting fresh petals in our Tamil Nadu botanical fields
              </p>
            </div>
            <button
              onClick={() => setActiveZoomImg('/farm/women_farmers_collective.jpg')}
              aria-label="Zoom Photo"
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-[#4E580F] text-[#F9E086] flex items-center justify-center transition border border-white/30 cursor-pointer shadow"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ──────────────── SECTION: PAIDHU ETHICAL FOODS ENTERPRISE ──────────────── */}
        <div className="mt-8 sm:mt-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#4E580F] font-normal mb-5 tracking-tight">
            Paidhu Ethical Foods Enterprise
          </h2>
          <div className="space-y-6 text-[16px] sm:text-[18px] text-gray-700 leading-[1.85] sm:leading-[1.9] text-left md:text-justify">
            <p>
              Paidhu Ethical Foods is the marketing and culinary entity of Just B Happy Farm which offers the world a platter of the finest, all-natural botanical foods. The venture is dedicated to presenting painstakingly cultivated and traditionally processed Indian edible flowers, keeping their purity and nutrient vitality completely intact.
            </p>
            <p>
              After successful cultivation and harvesting under the supervision and technological assistance of the Just B Happy Initiative, the high-quality petals are meticulously graded, cured, and value-added into pure Brew Flora teas, Bloom Cookies, artisan Petal Jams, and royal Saffron threads. From our sunlit fields, this pure, all-natural collection of floral foods is delivered directly to families across India by Paidhu Ethical Foods.
            </p>
          </div>
        </div>

        {/* ──────────────── FOUR HIGH-RES BOTANICAL DETAIL CARDS ──────────────── */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-[#4E580F]/20">
          <div className="text-center mb-8">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#4E580F] bg-[#4E580F]/10 px-3.5 py-1 rounded-full border border-[#4E580F]/20">
              Botanical Harvest Gallery
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mt-2">
              From Blossom to Finished Petal
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { img: '/farm/founder_harvesting_butterfly_pea.jpg', label: 'Dawn Harvest' },
              { img: '/farm/butterfly_pea_basket.jpg', label: 'Fresh Basket' },
              { img: '/farm/dried_marigold_petals.jpg', label: 'Sun-Cured Petals' },
              { img: '/farm/dried_hibiscus_petals.jpg', label: 'Artisan Curing' }
            ].map((item, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveZoomImg(item.img)}
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 aspect-square border border-[#4E580F]/20 cursor-pointer bg-gray-900"
              >
                <img 
                  src={item.img} 
                  alt={item.label} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5 sm:p-3">
                  <span className="text-[11px] sm:text-xs font-bold text-white drop-shadow">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ──────────────── CONTRACT FARMING INVITATION CALLOUT CARD ──────────────── */}
        <div className="mt-14 sm:mt-18 bg-gradient-to-r from-[#2C3308] via-[#4E580F] to-[#2C3308] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white border-2 border-[#F9E086] shadow-xl text-center">
          <div className="w-12 h-12 rounded-full bg-[#F9E086]/15 border border-[#F9E086]/40 flex items-center justify-center text-[#F9E086] mx-auto mb-4 shadow-inner">
            <Sparkles className="w-6 h-6 text-[#F9E086]" />
          </div>
          
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#F9E086]">
            <span>Contract Botanical Farming</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F9E086]" />
            <span>100% Guaranteed Buyback</span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-white mt-2 mb-3">
            Cultivate Certified Edible Flowers with Paidhu
          </h3>

          <p className="text-xs sm:text-sm md:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed mb-6">
            Join the Just B Happy Agrarian Initiative. We provide technical agronomic support, high-germination saplings, soil testing, and guaranteed buyback at stable, transparent farm-gate prices.
          </p>

          <button
            onClick={handleOpenForm}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-[#F9E086] via-[#FFF1B8] to-[#F9E086] hover:from-white hover:to-[#F9E086] text-[#2C3308] font-serif font-black text-xs sm:text-sm tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-white/50"
          >
            <span>Fill Farm Application Form</span>
            <ArrowRight className="w-4 h-4 text-[#2C3308] transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>

      {/* ──────────────── FULL RESOLUTION LIGHTBOX MODAL ──────────────── */}
      {activeZoomImg && (
        <div 
          onClick={() => setActiveZoomImg(null)}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center cursor-zoom-out animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative bg-black rounded-2xl sm:rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/20 cursor-default"
          >
            <button 
              onClick={() => setActiveZoomImg(null)}
              className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-black text-white p-2 rounded-full cursor-pointer transition shadow"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={activeZoomImg} 
              alt="Just B Happy Farm Full Resolution View" 
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}

    </article>
  );
};

export default FarmCultivationStory;
