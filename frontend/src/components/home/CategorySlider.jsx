import { motion } from 'framer-motion';

// Reliable placeholder images mapped to the new requested categories
const categories = [
  { name: 'Edible Flowers', image: 'https://picsum.photos/seed/flowers/150/150' },
  { name: 'Saffron', image: 'https://picsum.photos/seed/saffron/150/150' },
  { name: 'Honey', image: 'https://picsum.photos/seed/honey/150/150' },
  { name: 'Floral Jams', image: 'https://picsum.photos/seed/jams/150/150' },
  { name: 'Gift Boxes', image: 'https://picsum.photos/seed/gifts/150/150' },
  { name: 'Herbal Collection', image: 'https://picsum.photos/seed/herbal/150/150' },
  { name: 'Organic Essentials', image: 'https://picsum.photos/seed/essentials/150/150' },
];

const CategorySlider = () => {
  // Create an extended array for a smooth infinite marquee loop
  const repeatedCategories = [...categories, ...categories, ...categories];

  return (
    <div className="w-full bg-[var(--color-brand-cream)] py-6 md:py-8 border-b border-gray-200 overflow-hidden relative z-40">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
        <motion.div 
          className="flex space-x-8 md:space-x-12"
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {repeatedCategories.map((category, index) => (
            <div key={index} className="flex flex-col items-center group cursor-pointer flex-shrink-0">
              
              {/* Image Circle Container */}
              <motion.div 
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#ede7d7] shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-2 border-white flex items-center justify-center p-1 overflow-visible relative group-hover:shadow-[0_8px_25px_rgba(102,38,84,0.15)]"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = "https://picsum.photos/150/150?blur=2";
                  }}
                />
              </motion.div>
              
              {/* Category Label */}
              <span className="mt-3 md:mt-4 text-[10px] md:text-xs font-semibold text-[var(--color-brand-plum)] tracking-wider uppercase text-center w-20 md:w-28 leading-tight">
                {category.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      
    </div>
  );
};

export default CategorySlider;
