import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, BookOpen, Heart, ArrowRight, Play } from 'lucide-react';
import TiffinModal from '../home/TiffinModal';

const API_BASE = 'https://paidhu-final-anm2.vercel.app';
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/EDlauzE5x1B6U23RamfCej?s=sh&p=a&ilr=0";

const defaultData = {
  hero: {
    image: '/hero_family.png',
    title: 'WELCOME TO THE PAIDHU COMMUNITY!',
    subtitle: 'Your supportive space for elegant living and floral wellness, together.'
  },
  findYourTribe: {
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop'
  },
  connect: [
    { id: 1, image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop', text: 'Share experiences, recipes and wellness insights' },
    { id: 2, image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop', text: 'Meet fellow enthusiasts in your city' },
    { id: 3, image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop', text: 'Get invited to exclusive meet-ups and tasting sessions' }
  ],
  learn: [
    { id: 1, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop', name: 'ZAINAB GINWALA', title: 'FLORAL WELLNESS EXPERT', text: 'Get your questions answered by experts who have been there' },
    { id: 2, image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop', name: 'DR BHAVYA', title: 'NUTRITIONIST', text: 'Real solutions for modern holistic living and immunity' },
    { id: 3, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop', name: 'DR VIDYA TANEJA', title: 'AYURVEDIC EXPERT', text: 'Live sessions with nutritionists and holistic experts' }
  ],
  nourish: [
    { id: 1, image: 'https://images.unsplash.com/photo-1490818387583-1b0570f550ce?q=80&w=800&auto=format&fit=crop', text: 'Help your family develop a positive relationship with wellness' },
    { id: 2, image: 'https://images.unsplash.com/photo-1495474472207-464a4d9435b6?q=80&w=800&auto=format&fit=crop', text: 'Get easy, healthy and yummy floral recipes' },
    { id: 3, image: 'https://images.unsplash.com/photo-1556910103-1c02745a872e?q=80&w=800&auto=format&fit=crop', text: 'Tips on how to make healthy eating easy and delicious' }
  ],
  highlights: {
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
};

const OurCommunitySection = () => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings?t=${new Date().getTime()}`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((settings) => {
        if (settings && settings.ourCommunityData) {
          setData({
            hero: { ...defaultData.hero, ...settings.ourCommunityData.hero },
            findYourTribe: { ...defaultData.findYourTribe, ...settings.ourCommunityData.findYourTribe },
            connect: settings.ourCommunityData.connect || defaultData.connect,
            learn: settings.ourCommunityData.learn || defaultData.learn,
            nourish: settings.ourCommunityData.nourish || defaultData.nourish,
            highlights: { ...defaultData.highlights, ...settings.ourCommunityData.highlights }
          });
        }
      })
      .catch((err) => console.warn('Failed to load community content:', err))
      .finally(() => setLoading(false));
  }, []);




  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#522742]/20 border-t-[#522742] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-800 bg-[#faf9f7] overflow-hidden">
      {/* ══════════════════════════════════════════════════
          HERO BANNER
          ══════════════════════════════════════════════════ */}
      <section className="relative w-full h-[460px] flex items-center justify-center bg-[#522742]">
        <div className="absolute inset-0 z-0">
          <img
            src={data.hero.image}
            alt="Paidhu Community"
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-[#fdfaf6]">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif italic text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-4 text-[#fbc225]"
          >
            {data.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed text-[#fdfaf6]/90 mb-8"
          >
            {data.hero.subtitle}
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#fbc225] hover:bg-[#e0ad20] text-[#522742] font-black text-sm md:text-base uppercase tracking-wider py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MessageSquare size={18} strokeWidth={2.5} />
            Join Our WhatsApp Community
          </motion.button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHATSAPP PROMINENT CALL TO ACTION
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 -mt-16 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', damping: 25 }}
          className="bg-white rounded-3xl border border-emerald-100 p-8 md:p-10 shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden"
        >
          {/* Subtle background decoration */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl z-0"></div>

          <div className="space-y-4 flex-1 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Fastest Growing Community
            </span>
            <h2 className="text-xl md:text-2xl font-black text-gray-800 font-serif leading-tight">
              Follow this link to join my WhatsApp group
            </h2>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-xl font-medium">
              Join local, health-conscious moms sharing recipes, kid nutrition tips, and direct advice on natural wellness and edible floral foods.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 z-10 text-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider py-4 px-8 rounded-xl transition-all shadow-md shadow-emerald-600/10 hover:shadow-lg active:scale-[0.98] cursor-pointer"
            >
              <MessageSquare size={16} strokeWidth={2.5} />
              Join WhatsApp Group
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          CONNECT SECTION
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block">
            Find Your Tribe
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-[#5a2141] uppercase tracking-tight font-serif">
            CONNECT WITH LIKE-MINDED MOMS
          </h2>
          <div className="w-20 h-1 bg-[#662654] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.connect.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={item.image}
                  alt="Connect card"
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <div className="p-6">
                <p className="text-gray-600 font-semibold text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>



      {/* ══════════════════════════════════════════════════
          NOURISH SECTION
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block">
            Health & Nutrition
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-[#5a2141] uppercase tracking-tight font-serif">
            NOURISH YOUR FAMILY NATURALLY
          </h2>
          <div className="w-20 h-1 bg-[#662654] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.nourish.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={item.image}
                  alt="Nourish card"
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <div className="p-6">
                <p className="text-gray-600 font-semibold text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HIGHLIGHTS & VIDEO
          ══════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block">
              Community Highlights
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#5a2141] uppercase tracking-tight font-serif">
              WATCH OUR EXCLUSIVE COMMMUNITY HIGHLIGHTS
            </h2>
            <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
              Witness how mothers across major cities connect, learn, and nourish their families through Paidhu workshops, group meets, and collaborative recipe sharing.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#662654] hover:bg-[#7e3068] text-white font-bold text-sm uppercase tracking-wider py-3.5 px-7 rounded-xl shadow-md cursor-pointer"
              >
                Join India's Moms Tribe
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative w-full h-[240px] sm:h-[350px] rounded-3xl overflow-hidden shadow-xl border border-gray-100 group"
            >
              <img
                src={data.highlights.image}
                alt="Community Highlight"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FINAL BIG CTA
          ══════════════════════════════════════════════════ */}
      <section className="bg-[#522742] py-16 text-center text-[#fdfaf6]">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <Heart size={48} className="text-[#fbc225] fill-[#fbc225] mx-auto animate-pulse" />
          <h2 className="font-serif italic text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#fbc225]">
            BE A PART OF THE PAIDHU FAMILY
          </h2>
          <p className="text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed opacity-95">
            Follow this link to join my WhatsApp group: Connect with elegant living and natural floral wellness with thousands of health-conscious mothers.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#fbc225] hover:bg-[#e0ad20] text-[#522742] font-black text-base uppercase tracking-widest py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Join Group Now
            </button>
          </div>
        </div>
      </section>

      <TiffinModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Join the Paidhu WhatsApp Community" 
        subtitle="Get healthy recipe ideas, expert wellness advice, and connect with other moms." 
      />
    </div>
  );
};

export default OurCommunitySection;
