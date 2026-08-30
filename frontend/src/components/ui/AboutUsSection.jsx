import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';


// ── Founders/Team data ───────────────────────────────────────────────────────
const foundersData = [
  {
    id: 1,
    name: 'Ragapriya Karunakaran',
    role: 'Founder',
    bio: 'As the Founder of Paidhu, I am driven by a vision to redefine the way generations experience floral-based foods through authenticity, purity, and innovation. At Paidhu, we curate premium floral foods and value-added products that preserve nature\'s goodness while honoring traditional wisdom for today\'s lifestyle. Our flagship Kashmiri saffron is sourced directly from trusted farmers, ensuring unmatched quality and authenticity in every strand. My entrepreneurial journey and years of experience in the FMCG industry inspired me to build a brand founded on ethical sourcing, transparency, and trust. Through Paidhu, our mission is to create a legacy of natural wellness by bringing nature\'s finest offerings to every generation with products that are minimally processed, rich in natural goodness, and crafted for a healthier future.',
    image: '/ragapriya.jpg'
  },
  {
    id: 2,
    name: 'Vikram AVB',
    role: 'Co-founder',
    bio: 'As the Co-founder of Paidhu Ethical Foods Pvt. Ltd., I support the company\'s vision of promoting natural wellness through authentic floral and herbal products. I contribute to product development, brand growth, and day-to-day operations while helping strengthen Paidhu\'s commitment to quality, ethical sourcing, and customer trust. Together, we aim to bring nature-inspired wellness products to more people and build a brand that reflects authenticity, sustainability, and care.',
    image: '/vikram.jpg'
  }
];

// ── Component ─────────────────────────────────────────────────────────────────
const AboutUsSection = () => {
  return (
    <div className="w-full bg-[#faf9f7] font-sans pb-16">

      {/* ══════════════════════════════════════════════════
          1. HERO / INTRODUCTION SECTION
          ══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#662654] to-[#4c1a3e] py-16 md:py-24 text-white">
        {/* Background Subtle Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <span className="inline-block text-[11px] font-black uppercase tracking-[0.3em] text-[#d4af37] bg-white/10 px-4 py-1.5 rounded-full border border-white/15">
                Who We Are
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight leading-tight">
                Paidhu Ethical Foods
              </h1>
              <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                Discover premium quality edible flowers, saffron, and handcrafted floral jams at Paidhu. Sourced directly from local farms to enhance your culinary and wellness experience.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-[#d4af37] hover:bg-[#ffd700] text-[#662654] font-black uppercase text-xs sm:text-sm tracking-wider py-4 px-8 rounded-full shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Explore Our Collection
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 ring-8 ring-[#662654]/10 bg-white/5">
                <Link to="/shop/shop-by-category?category=Bloom%20Cookies" className="block cursor-pointer">
                  <img
                    src="/banner_cookies.jpeg"
                    alt="Paidhu Wholesome Cookies"
                    className="w-full h-auto block object-cover hover:scale-[1.02] transition-transform duration-350"
                  />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          2. ABOUT THE BRAND (STORYTELLING SECTION Flow)
          ══════════════════════════════════════════════════ */}
      
      {/* Part A: The Food Label Realization */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          
          {/* Left Column: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
              <Link to="/shop/shop-by-category?category=Medley%20Teas" className="block cursor-pointer">
                <img
                  src="/banner_tea.jpeg"
                  alt="Paidhu Brew Flora Tea"
                  className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-350"
                />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6 text-left order-1 lg:order-2"
          >
            <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block">
              The Realization
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#5a2141] font-serif leading-tight">
              Time to read food labels we understand
            </h2>
            <div className="w-12 h-1 bg-[#d4af37] rounded" />
            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
              <p>
                Globally, children's diets are loaded with nutrient-poor foods made with Refined Wheat Flour (Maida), Trans fats, and excess Sugar and Salt.
              </p>
              <p>
                An alarming number of children are developing health problems and allergies related to unhealthy diets. Childhood obesity is on the rise and children are at a greater risk of developing lifestyle disorders.
              </p>
              <p>
                Our pattern of eating and the nutrition content of our meals have dramatically changed, adversely affecting our health and our planet's health.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Part B: The Need to Change */}
      <section className="w-full bg-[#f6f2ee] border-y border-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            
            {/* Left Column: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-left"
            >
              <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-[#5a2141] font-serif leading-tight">
                Something needs to change
              </h2>
              <div className="w-12 h-1 bg-[#d4af37] rounded" />
              <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                <p>
                  To solve this we must start by addressing our daily food choices.
                </p>
                <p className="text-[#5a2141] font-bold">
                  Paidhu was born from the concern of parents who realised that the current food system is broken, and requires innovation and creativity to re-introduce sustainable, nutrient dense and diverse ingredients back into our children's diet.
                </p>
                <p>
                  We believe this is the single best way to ensure that our kids grow up healthy, our hard-working farmers are supported ethically, and our beautiful planet stays happy and sustainable.
                </p>
              </div>
            </motion.div>

            {/* Right Column: Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
                <Link to="/shop/shop-by-category?category=Petal%20Jam" className="block cursor-pointer">
                  <img
                    src="/banner_jam.jpeg"
                    alt="Paidhu Handcrafted Petal Jams"
                    className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-350"
                  />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          3. WHY PAIDHU / PURPOSE & VALUES
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block mb-2">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#5a2141] font-serif leading-tight">
            Start Now with Wholesome Habits
          </h2>
          <div className="w-16 h-1 bg-[#d4af37] mx-auto mt-4 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Card 1: Good For You */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#662654]/10 flex items-center justify-center mb-6">
              <Sparkles size={24} className="text-[#662654]" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-[#5a2141] mb-3">
              Choose food which is Good for you.
            </h3>
            <p className="text-gray-550 font-medium text-sm sm:text-base leading-relaxed text-justify">
              At Paidhu we love using a diverse range of superfoods! A variety of nutrient dense ingredients like edible flowers, herbal infusions, premium saffron, oats, combined with good fats like real butter and natural sweeteners, go into making our products.
            </p>
          </motion.div>

          {/* Card 2: Good For The Environment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#662654]/10 flex items-center justify-center mb-6">
              <Leaf size={24} className="text-[#662654]" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-[#5a2141] mb-3">
              Good for the Environment
            </h3>
            <p className="text-gray-550 font-medium text-sm sm:text-base leading-relaxed text-justify">
              Our ingredients are ethically sourced directly from small farmers who practice organic and clean farming. By focusing on sustainable crops, Paidhu aims to empower local agricultural communities and help build a healthier planet.
            </p>
          </motion.div>

        </div>
      </section>





      {/* ══════════════════════════════════════════════════
          5. TEAM / MEMBERS SECTION (Slurrp Farm inspired)
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block mb-2">
            Who Leads Us
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#5a2141] font-serif leading-tight">
            About the Founders
          </h2>
          <div className="w-16 h-1 bg-[#d4af37] mx-auto mt-4 rounded" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {foundersData.map((founder, i) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={`flex flex-col md:flex-row gap-8 lg:gap-12 items-start p-8 md:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Photo */}
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden shrink-0 shadow-lg border-4 border-[#662654]/10 bg-gray-50 self-start mx-auto md:mx-0">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 15%' }}
                  onError={(e) => {
                    e.target.src = founder.name.toLowerCase().includes('vikram') ? '/vikram.jpg' : '/ragapriya.jpg';
                  }}
                />
              </div>
              
              {/* Bio & Details */}
              <div className="flex-1 space-y-4 text-left">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#5a2141] font-serif">
                    {founder.name}
                  </h3>
                  <p className="text-[#d4af37] font-black uppercase text-xs tracking-widest mt-1">
                    {founder.role}
                  </p>
                </div>
                <div className="w-12 h-0.5 bg-gray-200" />
                <div className="text-gray-650 text-sm sm:text-base leading-relaxed text-justify space-y-3 font-medium">
                  {founder.bio.split('\n').filter(p => p.trim()).map((para, idx) => (
                    <p key={idx}>{para.trim()}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          6. FINAL BRAND MESSAGE & COMMUNITY CTA
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-[#f5f0eb] rounded-[2.5rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-sm border border-[#e8e0d8] relative">
          
          {/* Left Column: Text */}
          <div className="p-10 md:p-16 flex flex-col justify-center space-y-6 text-left">
            <div>
              <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block mb-2">
                Join Our Family
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-[#5a2141] font-serif leading-tight">
                Paidhu Moms Community
              </h2>
              <p className="text-[#662654] font-bold text-sm sm:text-base mt-3 leading-relaxed">
                A supportive space for moms to share tips on clean eating, child nutrition, and natural family wellness.
              </p>
            </div>
            
            <hr className="border-[#d4b8c8]" />
            
            <ul className="space-y-3 text-gray-700 text-sm font-medium">
              {[
                'Connect with health-conscious moms in your city',
                'Get expert advice on child nutrition, healthy growth, and natural remedies',
                'Share unique, kids-friendly recipes using floral petal jams and natural ingredients',
                'Receive invitations to exclusive local meetups, wellness workshops, and events',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#662654] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/shop/our-own-community"
              className="inline-flex items-center gap-2 self-start bg-[#662654] hover:bg-[#4c1a3e] text-white font-black uppercase text-xs tracking-wider py-4 px-8 rounded-full shadow transition-all hover:-translate-y-0.5"
            >
              Join Our Community
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right Column: Real Community Image */}
          <div className="relative min-h-[320px] lg:min-h-[auto]">
            <img
              src="/wp_community_1.jpg"
              alt="Paidhu Moms Community"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutUsSection;
