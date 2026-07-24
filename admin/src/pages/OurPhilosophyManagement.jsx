import { useState, useEffect } from 'react';
import { FiSave, FiAlignLeft, FiImage, FiList, FiHeart, FiShield } from 'react-icons/fi';
import axios from 'axios';

const defaultData = {
  hero: {
    title: 'What We Believe About Wellness',
    intro: 'We started Paidhu because we couldn’t find floral wellness products that we felt good about. The shelves were full of artificial colors and refined sugars disguised as healthy options. We wanted something better, something truly natural and authentic.'
  },
  beliefs: [
    {
      id: 1,
      heading: 'The only villain is EXCESS',
      text: 'We don’t believe sugar is evil, or that specific food groups are the enemy. We believe the greatest harm comes from excess – too much of anything, too little variety. That’s why we’ll never try to scare you into buying our products.'
    },
    {
      id: 2,
      heading: 'Balance is a full day, not a single serving',
      text: 'Wellness plays out across a day, a week, a life. That’s how we’ve designed our range: every product category has a balanced option. Because wellness is not a strict diet, it is a lifestyle choice that embraces joy.'
    }
  ],
  ingredients: {
    heading: 'What we use',
    text: 'Premium authentic ingredients like real Kashmiri saffron, dried rose petals, and natural honey. Just like one would use at home. Where we use sweetness, it’s natural date powder or raw unrefined sugar. We don’t use artificial preservatives or synthetic flavors. There’s a reason we chose natural luxury over artificial shortcuts. The way your body processes them is fundamentally different – slower absorption, more sustained energy.'
  },
  mission: {
    heading: 'What we’re for',
    text: 'We don’t compete with wellness rituals made from scratch at home. We advocate for that first! What we want is to be the best possible option for the times when that’s not possible – the rushed mornings, the busy evenings. We trust you to make the right choices. Our job is to make sure you have good ones to choose from.'
  },
  transparency: [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1621213459955-442460b64d1f?q=80&w=800&auto=format&fit=crop',
      title: 'Premium Saffron Tea',
      serving: '1 cup',
      sugarStats: 'Added sugar per serving: 1.2 g | % of added sugar of RDA*: 2.4%',
      sugarGraphicImage: 'https://images.unsplash.com/photo-1579361906239-ce3ffbb6df0a?q=80&w=200&auto=format&fit=crop',
      sugarGraphicText: '1/2 teaspoon of sugar'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
      title: 'Floral Wellness Cookies',
      serving: '2 cookies',
      sugarStats: 'Added sugar per serving: 4.5 g | % of added sugar of RDA*: 9.0%',
      sugarGraphicImage: 'https://images.unsplash.com/photo-1579361906239-ce3ffbb6df0a?q=80&w=200&auto=format&fit=crop',
      sugarGraphicText: '1 teaspoon of sugar'
    }
  ],
  noAddedSugar: {
    heading: 'These products have NO ADDED SUGAR*!',
    products: [
      { id: 1, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop', name: 'Dry Flower Teas' },
      { id: 2, image: 'https://images.unsplash.com/photo-1559564114-561b36585141?q=80&w=800&auto=format&fit=crop', name: 'Petal Jams' },
      { id: 3, image: 'https://images.unsplash.com/photo-1571115177098-24edf64c86eb?q=80&w=800&auto=format&fit=crop', name: 'Tea Pairings' }
    ]
  },
  naturalSugars: {
    disclaimer: '*No added sugar means that no sugars are added during processing, but naturally occurring sugars from fruit, honey or milk may be present.',
    heading: 'Naturally occurring sugars in everyday foods',
    items: [
      { id: 1, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&auto=format&fit=crop', name: 'Milk' },
      { id: 2, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop', name: 'Burger' },
      { id: 3, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?q=80&w=400&auto=format&fit=crop', name: 'Apple' },
      { id: 4, image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=400&auto=format&fit=crop', name: 'Banana' }
    ]
  }
};

const OurPhilosophyManagement = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get((import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/settings');
      if (res.data?.ourPhilosophyData) {
        setData({ ...defaultData, ...res.data.ourPhilosophyData });
      }
    } catch (error) {
      console.error("Failed to fetch philosophy data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await axios.put((import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/settings', { ourPhilosophyData: data });
      setMessage('Philosophy Page Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving philosophy data", error);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleArrayChange = (section, index, field, value) => {
    const newData = { ...data };
    newData[section][index][field] = value;
    setData(newData);
  };

  const handleNestedArrayChange = (section, nestedField, index, field, value) => {
    const newData = { ...data };
    newData[section][nestedField][index][field] = value;
    setData(newData);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Philosophy Settings...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Our Philosophy Page</h1>
          <p className="text-gray-500 mt-1">Manage the content and story for the 7 philosophy sections.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-brand-plum text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-plum/90 transition-colors shadow-lg"
        >
          <FiSave size={20} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg font-medium text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        {[
          { id: 'hero', label: 'Intro & Beliefs', icon: FiAlignLeft },
          { id: 'textBlocks', label: 'Ingredients & Mission', icon: FiList },
          { id: 'transparency', label: 'Transparency', icon: FiShield },
          { id: 'noAddedSugar', label: 'No Added Sugar', icon: FiImage },
          { id: 'naturalSugars', label: 'Natural Sugars', icon: FiHeart }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === tab.id ? 'bg-brand-plum text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        
        {activeTab === 'hero' && (
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">1. Hero Section</h2>
              <div className="space-y-4 max-w-3xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Main Heading</label>
                  <input type="text" value={data.hero.title} onChange={(e) => setData({...data, hero: {...data.hero, title: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Introductory Paragraph</label>
                  <textarea value={data.hero.intro} onChange={(e) => setData({...data, hero: {...data.hero, intro: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={5}></textarea>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">2. Core Beliefs</h2>
              <div className="space-y-6">
                {data.beliefs.map((belief, index) => (
                  <div key={belief.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Heading</label>
                      <input type="text" value={belief.heading} onChange={(e) => handleArrayChange('beliefs', index, 'heading', e.target.value)} className="w-full border rounded-lg px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Text</label>
                      <textarea value={belief.text} onChange={(e) => handleArrayChange('beliefs', index, 'text', e.target.value)} className="w-full border rounded-lg px-4 py-2" rows={3}></textarea>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'textBlocks' && (
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">3. What We Use (Solid Color Block)</h2>
              <div className="space-y-4 max-w-3xl bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Heading</label>
                  <input type="text" value={data.ingredients.heading} onChange={(e) => setData({...data, ingredients: {...data.ingredients, heading: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Text</label>
                  <textarea value={data.ingredients.text} onChange={(e) => setData({...data, ingredients: {...data.ingredients, text: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={6}></textarea>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">4. What We're For</h2>
              <div className="space-y-4 max-w-3xl bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Heading</label>
                  <input type="text" value={data.mission.heading} onChange={(e) => setData({...data, mission: {...data.mission, heading: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Text</label>
                  <textarea value={data.mission.text} onChange={(e) => setData({...data, mission: {...data.mission, text: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={5}></textarea>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transparency' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">5. What's Actually In It (Product Comparisons)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.transparency.map((item, index) => (
                <div key={item.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                  <div className="flex gap-4 mb-4">
                    <img src={item.image} alt="Product" className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Product Main Image URL</label>
                      <input type="text" value={item.image} onChange={(e) => handleArrayChange('transparency', index, 'image', e.target.value)} className="w-full border rounded px-3 py-1 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product Title</label>
                    <input type="text" value={item.title} onChange={(e) => handleArrayChange('transparency', index, 'title', e.target.value)} className="w-full border rounded-lg px-4 py-2 font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Recommended Serving text</label>
                    <input type="text" value={item.serving} onChange={(e) => handleArrayChange('transparency', index, 'serving', e.target.value)} className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sugar Stats Text (Bottom bullet points)</label>
                    <input type="text" value={item.sugarStats} onChange={(e) => handleArrayChange('transparency', index, 'sugarStats', e.target.value)} className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-100 mt-4">
                    <h3 className="font-bold text-sm text-brand-plum mb-3">Sugar Graphic Bubble</h3>
                    <div className="flex gap-4">
                      <img src={item.sugarGraphicImage} alt="Sugar Spoon" className="w-16 h-16 object-cover rounded-full" />
                      <div className="flex-1 space-y-2">
                        <input type="text" placeholder="Graphic Image URL" value={item.sugarGraphicImage} onChange={(e) => handleArrayChange('transparency', index, 'sugarGraphicImage', e.target.value)} className="w-full border rounded px-3 py-1 text-sm" />
                        <input type="text" placeholder="Graphic Text (e.g. 1/2 teaspoon of sugar)" value={item.sugarGraphicText} onChange={(e) => handleArrayChange('transparency', index, 'sugarGraphicText', e.target.value)} className="w-full border rounded px-3 py-1 text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'noAddedSugar' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">6. No Added Sugar Showcase</h2>
            <div className="mb-6 max-w-3xl">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Main Section Heading</label>
              <input type="text" value={data.noAddedSugar.heading} onChange={(e) => setData({...data, noAddedSugar: {...data.noAddedSugar, heading: e.target.value}})} className="w-full border rounded-lg px-4 py-2 font-bold text-lg" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.noAddedSugar.products.map((prod, index) => (
                <div key={prod.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4 text-center">
                  <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover rounded-lg" />
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
                    <input type="text" value={prod.image} onChange={(e) => handleNestedArrayChange('noAddedSugar', 'products', index, 'image', e.target.value)} className="w-full border rounded px-3 py-1 text-sm" />
                  </div>
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name</label>
                    <input type="text" value={prod.name} onChange={(e) => handleNestedArrayChange('noAddedSugar', 'products', index, 'name', e.target.value)} className="w-full border rounded px-3 py-1 text-sm font-bold" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'naturalSugars' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">7. Natural Sugars Display</h2>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-3xl">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Disclaimer Text (Wavy Banner)</label>
              <textarea value={data.naturalSugars.disclaimer} onChange={(e) => setData({...data, naturalSugars: {...data.naturalSugars, disclaimer: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={3}></textarea>
            </div>

            <div className="max-w-3xl">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Section Heading</label>
              <input type="text" value={data.naturalSugars.heading} onChange={(e) => setData({...data, naturalSugars: {...data.naturalSugars, heading: e.target.value}})} className="w-full border rounded-lg px-4 py-2 font-bold text-lg" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.naturalSugars.items.map((item, index) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full bg-brand-gold flex items-center justify-center p-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-full mix-blend-multiply" />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 text-center">Image URL</label>
                    <input type="text" value={item.image} onChange={(e) => handleNestedArrayChange('naturalSugars', 'items', index, 'image', e.target.value)} className="w-full border rounded px-3 py-1 text-sm" />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 text-center">Label Name</label>
                    <input type="text" value={item.name} onChange={(e) => handleNestedArrayChange('naturalSugars', 'items', index, 'name', e.target.value)} className="w-full border rounded px-3 py-1 text-sm font-bold text-center" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OurPhilosophyManagement;
