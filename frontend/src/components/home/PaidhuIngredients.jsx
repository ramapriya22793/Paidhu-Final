import React from 'react';
import { motion } from 'framer-motion';

const ingredients = [
  {
    id: 1,
    title: "Kashmiri Saffron",
    aka: "AKA Kesari, Zafran",
    description: "The world's most premium spice. Richest source of antioxidants, known to elevate mood, improve memory, and provide a radiant glow.",
    taste: "Floral & Earthy",
    tasteColor: "bg-[#fdf3f1] text-[#d1593e]",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=800&auto=format&fit=crop",
    delay: 0.1
  },
  {
    id: 2,
    title: "Edible Hibiscus",
    aka: "AKA Roselle, Gudhal",
    description: "A vibrant, ruby-red powerhouse. Exceptional as a tea substitute, packed with Vitamin C and iron to promote deep heart health.",
    taste: "Tart & Cranberry-like",
    tasteColor: "bg-[#fdf2f6] text-[#9d2b56]",
    image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=800&auto=format&fit=crop",
    delay: 0.2
  },
  {
    id: 3,
    title: "Dried Rose Petals",
    aka: "AKA Gulab, Taruni",
    description: "Hand-plucked and naturally dried. Delivers potent calming properties, aids digestion, and naturally relieves everyday stress.",
    taste: "Sweet & Floral",
    tasteColor: "bg-[#fffbf0] text-[#b2821d]",
    image: "https://images.unsplash.com/photo-1559564104-589f7f45b597?q=80&w=800&auto=format&fit=crop",
    delay: 0.3
  }
];

const PaidhuIngredients = () => {
  return (
    <section className="w-full py-24 bg-gradient-to-b from-[#ffffff] to-[#f9f8f6] relative font-sans">
      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        
        {/* Modern Header */}
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-[#662654] uppercase tracking-[0.2em] mb-4"
          >
            Source of Wellness
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight mb-6"
          >
            Pure Ingredients. <br className="hidden md:block" />
            <span className="text-gray-400 font-medium">Exceptional Health.</span>
          </motion.h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
          {ingredients.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: item.delay }}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col cursor-pointer"
            >
              {/* Image Header */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-10 flex flex-col flex-grow bg-white relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-[#662654] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                  {item.aka}
                </p>
                <p className="text-gray-600 leading-relaxed text-[15px] mb-8 flex-grow">
                  {item.description}
                </p>
                
                {/* Taste Tag */}
                <div className="mt-auto">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider ${item.tasteColor}`}>
                    Taste: {item.taste}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PaidhuIngredients;
