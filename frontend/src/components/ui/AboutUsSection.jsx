import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultData = {
  hero: {
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop'
  },
  foodLabels: {
    title: 'Time to read food labels we understand',
    text1: 'Globally, children\'s diets are loaded with nutrient-poor foods made with Refined Wheat Flour (Maida), Trans fats, and excess Sugar and Salt.',
    text2: 'An alarming number of children are developing health problems and allergies related to unhealthy diets. Childhood obesity is on the rise and children are at a greater risk of developing lifestyle disorders.',
    text3: 'Our pattern of eating and the nutrition content of our meals have dramatically changed, adversely affecting our health and our planet\'s health.',
    image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=800&auto=format&fit=crop'
  },
  needToChange: {
    title: 'Something needs to change',
    text1: 'To solve this we must start by addressing our daily food choices.',
    text2: 'Paidhu was born from the concern of two mothers who realised that the current food system is broken, and requires innovation and creativity to re-introduce sustainable, nutrient dense and diverse ingredients back into our children\'s diet. This we thought is the best way to ensure that kids, farmers and the planet stay happy.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop'
  },
  startNow: {
    title: 'Start now',
    cards: [
      {
        id: 1,
        title: 'Choose food which is Good for you.',
        text: 'At Paidhu we love using a diverse range of superfoods! A variety of nutrient dense ingredients like Ragi, Jowar, Foxtail Millet, Lentils, Oats, Amaranth, Nuts, combined with good fats like real Butter, real Fruits and Vegetable, natural sweeteners like Jaggery and Honey go into making our products.',
        icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917629.png'
      },
      {
        id: 2,
        title: 'Good for the Environment',
        text: 'Ingredients like Millets need a third of the water required by Rice. They are hardy grains which can withstand long periods of drought, and they require little pesticides or fertilisers to thrive. This makes them inherently Organic in nature. Paidhu aims to empower small farmers and help build a sustainable community by encouraging the use of indigenous crops.',
        icon: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png'
      }
    ]
  },
  founders: {
    title: 'About the founders',
    list: [
      {
        id: 1,
        name: 'Meghana Narayan',
        bio: 'Meghana is passionate about children\'s nutrition and health. She is committed to make a positive change to childhood malnutrition statistics. Her efforts to feed her daughter healthy, tasty food is what led her to starting this venture. Before starting Paidhu, Meghana led the Public Health practise at McKinsey & Company. She holds an MBA from Harvard Business School, a BA in Computation as a Rhodes Scholar from Oxford University and a BE with Distinction in Computer Engineering from Bangalore University.\n\nMeghana swam for India for eight years, including at the Asian Games. She has more than 400 national gold medals in her kitty and her dream is to help India have a more golden Olympic table.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 2,
        name: 'Shauravi Malik',
        bio: 'Shauravi\'s passion is to get her own children to gobble up all the exciting and healthy food she makes. She loves food, eating it and making it! Shauravi brings over a decade of finance experience. She worked in the Consumer, Healthcare, and Retail Advisory team and the Leveraged Finance team at J.P.Morgan. She was an Investment Manager at Sir Richard Branson\'s Group Holding entity at the Virgin Group in London. She holds a Master\'s degree in Economics from Cambridge University and a BA in Economics from St. Stephen\'s College, Delhi University.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop'
      }
    ]
  },
  communityCta: {
    title: 'Connect with a community that cares\nabout your child\'s nutrition as you do!',
    buttonText: 'Join Our Community',
    buttonLink: '/shop/our-own-community',
    illustration: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop'
  }
};

const AboutUsSection = () => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((settings) => {
        if (settings && settings.aboutUsData) {
          setData({
            hero: { ...defaultData.hero, ...settings.aboutUsData.hero },
            foodLabels: { ...defaultData.foodLabels, ...settings.aboutUsData.foodLabels },
            needToChange: { ...defaultData.needToChange, ...settings.aboutUsData.needToChange },
            startNow: { ...defaultData.startNow, ...settings.aboutUsData.startNow },
            founders: { ...defaultData.founders, ...settings.aboutUsData.founders },
            communityCta: { ...defaultData.communityCta, ...settings.aboutUsData.communityCta }
          });
        }
      })
      .catch((err) => console.warn('Failed to load about us content:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#662654]"></div>
      </div>
    );
  }

  const renderTextWithBreaks = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="w-full bg-[#faf9f7] font-sans pb-16">
      
      {/* ══════════════════════════════════════════════════
          HERO COVER IMAGE
          ══════════════════════════════════════════════════ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative h-auto sm:h-[350px] md:h-[450px] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 bg-[#662654]/5">
          <img
            src={data.hero.image}
            alt="About Paidhu"
            className="w-full h-auto block sm:absolute sm:inset-0 sm:h-full sm:object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#662654]/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 md:bottom-12 md:left-12">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-serif font-black text-white drop-shadow-md">
              Our Story
            </h1>
            <p className="text-white/80 font-bold uppercase tracking-widest text-[9px] sm:text-xs mt-1 sm:mt-2 drop-shadow-sm">
              We are Paidhu — The Edible Flower Co.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOD LABELS SECTION (Row 1)
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          {/* Text Left */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block">
              Nutrition Awareness
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#5a2141] tracking-tight leading-[1.2]">
              {data.foodLabels.title}
            </h2>
            <div className="space-y-4 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              <p>{data.foodLabels.text1}</p>
              <p>{data.foodLabels.text2}</p>
              <p>{data.foodLabels.text3}</p>
            </div>
          </div>

          {/* Image Right */}
          <div className="lg:col-span-5 h-[320px] md:h-[420px] rounded-[2rem] overflow-hidden relative shadow-md">
            <img
              src={data.foodLabels.image}
              alt="Read food labels"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=800&auto=format&fit=crop';
              }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SOMETHING NEEDS TO CHANGE (Row 2)
          ══════════════════════════════════════════════════ */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          {/* Image Left */}
          <div className="lg:col-span-5 h-[320px] md:h-[420px] rounded-[2rem] overflow-hidden relative shadow-md">
            <img
              src={data.needToChange.image}
              alt="Something needs to change"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop';
              }}
            />
          </div>

          {/* Text Right */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block">
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#5a2141] tracking-tight leading-[1.2]">
              {data.needToChange.title}
            </h2>
            <div className="space-y-4 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              <p className="font-bold text-gray-800 text-lg">{data.needToChange.text1}</p>
              <p>{data.needToChange.text2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          START NOW SECTION (Cards)
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block mb-2">
            Taking Action
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#5a2141] uppercase tracking-tight">
            {data.startNow.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.startNow.cards?.map((card, i) => (
            <div 
              key={card.id || i}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#662654]/10 flex items-center justify-center overflow-hidden p-2.5">
                  <img
                    src={card.icon}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <Sparkles size={24} className="text-[#662654] hidden" />
                </div>
                <h3 className="text-xl font-bold text-[#5a2141] tracking-tight">{card.title}</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOUNDERS SECTION
          ══════════════════════════════════════════════════ */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#662654] font-black tracking-[0.2em] text-xs uppercase block mb-2">
              Meet the Team
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#5a2141] uppercase tracking-tight">
              {data.founders.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {data.founders.list?.map((founder, i) => (
              <div key={founder.id || i} className="flex flex-col md:flex-row gap-6 items-start">
                {/* Photo */}
                <div className="w-full md:w-44 h-56 rounded-2xl overflow-hidden shrink-0 shadow-md relative">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop';
                    }}
                  />
                </div>
                {/* Bio */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-[#5a2141]">{founder.name}</h3>
                  <p className="text-gray-500 font-medium text-[13px] md:text-sm leading-relaxed whitespace-pre-line">
                    {founder.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          COMMUNITY CTA SECTION
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-gradient-to-br from-[#662654] to-[#501b41] rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_60%)] pointer-events-none" />
          
          <div className="lg:col-span-8 space-y-6 relative z-10">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-snug">
              {renderTextWithBreaks(data.communityCta.title)}
            </h2>
            <Link
              to={data.communityCta.buttonLink || '/shop/our-own-community'}
              className="inline-flex bg-gradient-to-r from-[#d4af37] to-[#fde047] hover:from-[#ffd700] hover:to-[#fff] text-[#662654] font-black uppercase text-xs sm:text-sm tracking-wider py-3.5 px-8 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {data.communityCta.buttonText}
            </Link>
          </div>

          <div className="lg:col-span-4 h-[220px] rounded-[1.5rem] overflow-hidden relative shadow-lg z-10">
            <img
              src={data.communityCta.illustration}
              alt="Our Community"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop';
              }}
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUsSection;
