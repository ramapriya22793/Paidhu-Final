import { useState, useEffect } from 'react';
import { FiSave, FiImage, FiType, FiList, FiUsers, FiHeart } from 'react-icons/fi';
import axios from 'axios';
import { uploadImage } from '../utils/uploadImage';

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
    buttonLink: '/our-community',
    illustration: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop'
  }
};

const AboutUsManagement = () => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    if (file.size > 8 * 1024 * 1024) {
      alert("Image must be smaller than 8MB");
      return;
    }
    
    setUploading(true);
    try {
      // Show local preview instantly
      const localUrl = URL.createObjectURL(file);
      setData(prev => ({
        ...prev,
        hero: { ...prev.hero, image: localUrl }
      }));
      
      // Upload to Supabase storage
      const { publicUrl, error } = await uploadImage(file, 'aboutus');
      if (error) {
        throw new Error(error);
      }
      
      // Update with uploaded public URL
      setData(prev => ({
        ...prev,
        hero: { ...prev.hero, image: publicUrl }
      }));
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
      fetchData();
    } finally {
      setUploading(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings');
      if (res.data?.aboutUsData) {
        const deepMerge = (defaultObj, dbObj) => {
          if (!dbObj || typeof dbObj !== 'object') return defaultObj;
          
          const merged = { ...defaultObj };
          
          for (const key in dbObj) {
            if (dbObj[key] === null || dbObj[key] === '') continue; // Skip empty/null values to keep defaults
            
            if (Array.isArray(dbObj[key])) {
              // If it's an array and it has items, use it. Otherwise, keep default array to avoid crashes.
              if (dbObj[key].length > 0) {
                merged[key] = dbObj[key];
              }
            } else if (typeof dbObj[key] === 'object') {
              // Recursively merge objects
              merged[key] = deepMerge(defaultObj[key] || {}, dbObj[key]);
            } else {
              // Primitives
              merged[key] = dbObj[key];
            }
          }
          return merged;
        };
        setData(deepMerge(defaultData, res.data.aboutUsData));
      }
    } catch (error) {
      console.error('Failed to load about us data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings', {
        aboutUsData: data
      });
      alert('About Us page updated successfully!');
    } catch (error) {
      console.error('Failed to save', error);
      alert(`Failed to save changes. Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Handlers for nested arrays
  const handleStartNowCardChange = (index, field, value) => {
    const newData = { ...data };
    newData.startNow.cards[index][field] = value;
    setData(newData);
  };

  const handleFounderChange = (index, field, value) => {
    const newData = { ...data };
    newData.founders.list[index][field] = value;
    setData(newData);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading About Us Settings...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Us Page Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the content and images for the /about-us page.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-plum text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-brand-plum/90 transition-colors disabled:opacity-50"
        >
          <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        {[
          { id: 'hero', label: 'Top Hero Image', icon: FiImage },
          { id: 'foodLabels', label: 'Food Labels', icon: FiType },
          { id: 'needToChange', label: 'Need to Change', icon: FiType },
          { id: 'startNow', label: 'Start Now Cards', icon: FiList },
          { id: 'founders', label: 'Founders', icon: FiUsers },
          { id: 'communityCta', label: 'Community CTA', icon: FiHeart }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-brand-gold text-brand-plum shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        
        {/* 1. HERO */}
        {activeTab === 'hero' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">Top Full-Width Hero Image</h2>
            
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center min-h-[220px] ${
                dragActive 
                  ? "border-brand-gold bg-brand-plum/5" 
                  : "border-gray-300 bg-gray-50 hover:bg-gray-50/50 hover:border-brand-plum/40"
              }`}
            >
              <input 
                type="file" 
                id="hero-image-upload" 
                className="hidden" 
                accept="image/*" 
                onChange={handleChange}
                disabled={uploading}
              />

              {uploading ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 border-4 border-brand-plum border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-semibold text-brand-plum">Uploading image to secure storage...</p>
                </div>
              ) : data.hero.image ? (
                <div className="w-full relative group">
                  <img 
                    src={data.hero.image} 
                    alt="Hero Preview" 
                    className="w-full max-h-72 object-cover rounded-xl border shadow-sm transition duration-300 group-hover:brightness-75" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <label 
                      htmlFor="hero-image-upload" 
                      className="bg-white/95 text-brand-plum px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition duration-200 cursor-pointer flex items-center gap-2"
                    >
                      <FiImage size={14} /> Replace Image
                    </label>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    Drag & Drop another file to replace
                  </div>
                </div>
              ) : (
                <label 
                  htmlFor="hero-image-upload" 
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer space-y-4 py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-plum/5 flex items-center justify-center text-brand-plum shadow-inner transition duration-300">
                    <FiImage size={28} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800">
                      <span className="text-brand-plum hover:underline">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, WebP up to 5MB</p>
                  </div>
                </label>
              )}
            </div>
          </div>
        )}

        {/* 2. FOOD LABELS */}
        {activeTab === 'foodLabels' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">"Time to read food labels" Section</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Section Title</label>
              <input type="text" value={data.foodLabels.title} onChange={(e) => setData({...data, foodLabels: {...data.foodLabels, title: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Paragraph 1</label>
              <textarea value={data.foodLabels.text1} onChange={(e) => setData({...data, foodLabels: {...data.foodLabels, text1: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Paragraph 2</label>
              <textarea value={data.foodLabels.text2} onChange={(e) => setData({...data, foodLabels: {...data.foodLabels, text2: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Paragraph 3</label>
              <textarea value={data.foodLabels.text3} onChange={(e) => setData({...data, foodLabels: {...data.foodLabels, text3: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Left Graphic Image URL</label>
              <input type="text" value={data.foodLabels.image} onChange={(e) => setData({...data, foodLabels: {...data.foodLabels, image: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
            </div>
          </div>
        )}

        {/* 3. NEED TO CHANGE */}
        {activeTab === 'needToChange' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">"Something needs to change" Section</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Section Title</label>
              <input type="text" value={data.needToChange.title} onChange={(e) => setData({...data, needToChange: {...data.needToChange, title: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Paragraph 1</label>
              <textarea value={data.needToChange.text1} onChange={(e) => setData({...data, needToChange: {...data.needToChange, text1: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={2}></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Paragraph 2</label>
              <textarea value={data.needToChange.text2} onChange={(e) => setData({...data, needToChange: {...data.needToChange, text2: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={5}></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Right Graphic/Field Image URL</label>
              <input type="text" value={data.needToChange.image} onChange={(e) => setData({...data, needToChange: {...data.needToChange, image: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
            </div>
          </div>
        )}

        {/* 4. START NOW CARDS */}
        {activeTab === 'startNow' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">"Start Now" Info Cards</h2>
            <div className="max-w-xl mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Main Title</label>
              <input type="text" value={data.startNow.title} onChange={(e) => setData({...data, startNow: {...data.startNow, title: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {data.startNow.cards.map((card, idx) => (
                <div key={card.id} className="bg-gray-50 border rounded-xl p-6 space-y-4">
                  <h3 className="font-bold text-lg text-gray-800">Card {idx + 1}</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Icon/Stamp Image URL</label>
                    <input type="text" value={card.icon} onChange={(e) => handleStartNowCardChange(idx, 'icon', e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
                    {card.icon && <img src={card.icon} alt="icon" className="w-16 h-16 object-contain mt-2 bg-white rounded-full p-2 border shadow-sm" />}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Card Title</label>
                    <input type="text" value={card.title} onChange={(e) => handleStartNowCardChange(idx, 'title', e.target.value)} className="w-full border rounded px-3 py-2 text-sm font-bold text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Card Text</label>
                    <textarea value={card.text} onChange={(e) => handleStartNowCardChange(idx, 'text', e.target.value)} className="w-full border rounded px-3 py-2 text-sm" rows={6}></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. FOUNDERS */}
        {activeTab === 'founders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">Founders Section</h2>
            <div className="max-w-xl mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Main Title</label>
              <input type="text" value={data.founders.title} onChange={(e) => setData({...data, founders: {...data.founders, title: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            
            <div className="space-y-8 max-w-4xl">
              {data.founders.list.map((founder, idx) => (
                <div key={founder.id} className="bg-gray-50 border rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-1/3 space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">Founder {idx + 1}</h3>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                      <input type="text" value={founder.name} onChange={(e) => handleFounderChange(idx, 'name', e.target.value)} className="w-full border rounded px-3 py-2 text-sm font-bold text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Portrait Image URL</label>
                      <input type="text" value={founder.image} onChange={(e) => handleFounderChange(idx, 'image', e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
                      {founder.image && <img src={founder.image} alt={founder.name} className="w-32 h-32 object-cover rounded-full mt-2 border-4 border-white shadow-sm" />}
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Biography</label>
                    <textarea value={founder.bio} onChange={(e) => handleFounderChange(idx, 'bio', e.target.value)} className="w-full border rounded px-3 py-2 text-sm" rows={10}></textarea>
                    <p className="text-xs text-gray-400 mt-1">Use double newlines to separate paragraphs.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. COMMUNITY CTA */}
        {activeTab === 'communityCta' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">Bottom Community Call-to-Action</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Illustration / Background Image URL</label>
              <input type="text" value={data.communityCta.illustration} onChange={(e) => setData({...data, communityCta: {...data.communityCta, illustration: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <textarea value={data.communityCta.title} onChange={(e) => setData({...data, communityCta: {...data.communityCta, title: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={2}></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Button Text</label>
                <input type="text" value={data.communityCta.buttonText} onChange={(e) => setData({...data, communityCta: {...data.communityCta, buttonText: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Button Link</label>
                <input type="text" value={data.communityCta.buttonLink} onChange={(e) => setData({...data, communityCta: {...data.communityCta, buttonLink: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AboutUsManagement;
