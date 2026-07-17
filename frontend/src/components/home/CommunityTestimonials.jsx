import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Mother of 2",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600",
    text: "Paidhu transformed our snacking. The hibiscus cookies are an absolute favorite. Finally, healthy food that is truly joyful!",
  },
  {
    id: 2,
    name: "Neha & Rahul",
    role: "Parents",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600",
    text: "The floral infusions are magical. Incredibly premium, yet perfect for everyday family wellness and safe snacking.",
  },
  {
    id: 3,
    name: "Anjali K.",
    role: "Wellness Coach",
    image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600",
    text: "I recommend Paidhu to my clients. The purity of ingredients and lack of preservatives gives me total peace of mind.",
  },
  {
    id: 4,
    name: "Shruti R.",
    role: "Working Mom",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600",
    text: "Every product is a luxurious treat, but knowing it's 100% natural makes it guilt-free. We are absolutely obsessed!",
  }
];

const CommunityTestimonials = () => {
  const carouselItems = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="relative w-full py-10 md:py-12 overflow-hidden font-sans">
      
      {/* 3D Format Glowing Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-gradient-to-br from-[#2E1125] via-[#4A1D3D] to-[#3A182D]">
        {/* Glow behind cards using Paidhu brand colors */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-[#ffc600]/25 rounded-full blur-[90px] animate-float-3d"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-[#e84a5f]/20 rounded-full blur-[120px] animate-float-3d" style={{ animationDelay: '2s' }}></div>
        
        {/* 3D Shadow Overlay at bottom to ground the section */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      {/* CSS for infinite moving carousel & 3D animations */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes float3d {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
        .animate-float-3d {
          animation: float3d 8s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full relative z-10">
        
        {/* Header - Adjusted colors for dark 3D background */}
        <div className="text-center mb-6 md:mb-8 px-4">
          <span className="text-[#ffc600] font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mb-2 block drop-shadow-md">
            The Community
          </span>
          <h2 className="text-white font-serif text-2xl md:text-3xl lg:text-4xl mb-2 leading-tight drop-shadow-lg">
            Loved by <span className="italic font-light text-[#ffc600]">Families</span>
          </h2>
          <p className="text-white/75 max-w-xl mx-auto text-xs md:text-sm leading-relaxed drop-shadow-sm">
            Real stories from parents who trust Paidhu for their children's healthy snacking.
          </p>
        </div>

        {/* Moving Carousel Layout */}
        <div className="relative w-full overflow-hidden py-4 perspective-[1000px]">
          <div className="flex gap-4 md:gap-5 w-max animate-marquee pl-4 md:pl-5">
            {carouselItems.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="w-[220px] md:w-[260px] bg-white/95 backdrop-blur-md rounded-[1rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(255,198,0,0.25)] transform transition-all duration-300 hover:-translate-y-3 flex flex-col group cursor-pointer border border-white/20"
              >
                
                {/* Hero Image for the Card */}
                <div className="w-full h-[120px] overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Subtle dark gradient to make the image pop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow relative">
                  
                  {/* 5 Stars */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700] drop-shadow-sm" />
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="text-gray-800 text-[12px] md:text-[13px] leading-relaxed mb-4 flex-grow font-serif italic font-medium">
                    "{item.text}"
                  </p>

                  {/* Reviewer Details (Footer of card) */}
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-[#3A182D] font-bold text-[13px]">{item.name}</h4>
                      <p className="text-[#662654] text-[9px] uppercase tracking-wider font-bold mt-0.5">
                        {item.role}
                      </p>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CommunityTestimonials;
