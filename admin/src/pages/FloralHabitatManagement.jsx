import { useState, useEffect } from 'react';
import { FiSave, FiImage, FiType, FiStar, FiPercent } from 'react-icons/fi';
import axios from 'axios';

const defaultData = {
  hero: {
    title: 'Starting Floral Food Habitat',
    subtitle: 'Experience the Luxury of Floral Wellness',
    description: 'Discover handcrafted floral delicacies, saffron-infused creations, exotic jams, floral cookies, and nature-inspired gourmet experiences.',
    bgImage: 'https://images.unsplash.com/photo-1490818387583-1b0570f550ce?q=80&w=2070&auto=format&fit=crop'
  },
  brandStory: {
    title: 'Our Floral Philosophy',
    content: 'At Paidhu Store, we believe food is more than taste — it is an experience of wellness, aroma, luxury, and tradition. Our floral creations combine premium saffron, natural ingredients, handcrafted recipes, and elegant presentation to create unforgettable moments.',
    image: 'https://images.unsplash.com/photo-1596647864375-9c9dd7348937?q=80&w=1000&auto=format&fit=crop'
  },
  whyChooseUs: [
    { title: 'Handcrafted Products', icon: 'Leaf' },
    { title: 'Premium Saffron', icon: 'Sun' },
    { title: 'Organic Ingredients', icon: 'Droplets' },
    { title: 'Luxury Packaging', icon: 'Gift' }
  ],
  experienceBanner: {
    text: 'Transform Everyday Moments Into Floral Experiences',
    subtext: 'Premium floral delicacies crafted for luxury gifting, wellness rituals, and elegant living.',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=2000&auto=format&fit=crop'
  },
  testimonials: [
    { name: 'Sarah L.', text: 'The saffron floral tea collection feels truly luxurious.', rating: 5 },
    { name: 'Priya M.', text: 'Every petal jam jar is a masterpiece of flavors.', rating: 5 }
  ],
  limitedOffer: {
    title: 'Luxury Floral Festival Sale',
    subtitle: 'Flat 20% OFF on Premium Hampers',
    bgImage: 'https://images.unsplash.com/photo-1621213459955-442460b64d1f?q=80&w=2000&auto=format&fit=crop'
  }
};

const FloralHabitatManagement = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/settings');
      if (response.data && response.data.floralHabitatData) {
        setData({ ...defaultData, ...response.data.floralHabitatData });
      }
    } catch (error) {
      console.error("Failed to load floral habitat data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      await axios.put('http://localhost:5000/api/settings', {
        floralHabitatData: data
      });
      setMessage('Floral Habitat content updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Failed to save data:", error);
      setMessage('Failed to save data. Please check logs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Floral Habitat Framework...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair">Floral Habitat Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the 12-section luxury landing page experience.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg font-medium text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'hero', label: 'Hero & Story', icon: <FiImage /> },
          { id: 'features', label: 'Features & Experience', icon: <FiType /> },
          { id: 'marketing', label: 'Marketing & Offers', icon: <FiPercent /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === tab.id ? 'border-brand-plum text-brand-plum' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* TAB 1: HERO & STORY */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Section 1: Hero Banner</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                  <input type="text" value={data.hero.title} onChange={e => handleNestedChange('hero', 'title', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
                  <input type="text" value={data.hero.subtitle} onChange={e => handleNestedChange('hero', 'subtitle', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea rows="3" value={data.hero.description} onChange={e => handleNestedChange('hero', 'description', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Background Image URL</label>
                  <input type="text" value={data.hero.bgImage} onChange={e => handleNestedChange('hero', 'bgImage', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  {data.hero.bgImage && <img src={data.hero.bgImage} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Section 2: Brand Story</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Story Title</label>
                  <input type="text" value={data.brandStory.title} onChange={e => handleNestedChange('brandStory', 'title', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Story Content</label>
                  <textarea rows="5" value={data.brandStory.content} onChange={e => handleNestedChange('brandStory', 'content', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Luxury Image URL</label>
                  <input type="text" value={data.brandStory.image} onChange={e => handleNestedChange('brandStory', 'image', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FEATURES & EXPERIENCE */}
        {activeTab === 'features' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Section 4: Why Choose Us (Icon Cards)</h2>
              <div className="grid grid-cols-2 gap-4">
                {data.whyChooseUs.map((feature, idx) => (
                  <div key={idx} className="border border-gray-200 p-4 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Feature {idx + 1}</label>
                    <input type="text" value={feature.title} onChange={e => handleArrayChange('whyChooseUs', idx, 'title', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2" />
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Icon Name (e.g. Leaf, Sun)</label>
                    <input type="text" value={feature.icon} onChange={e => handleArrayChange('whyChooseUs', idx, 'icon', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Section 6: Experience Banner</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Banner Text</label>
                  <input type="text" value={data.experienceBanner.text} onChange={e => handleNestedChange('experienceBanner', 'text', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subtext</label>
                  <input type="text" value={data.experienceBanner.subtext} onChange={e => handleNestedChange('experienceBanner', 'subtext', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Background Image URL</label>
                  <input type="text" value={data.experienceBanner.image} onChange={e => handleNestedChange('experienceBanner', 'image', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MARKETING */}
        {activeTab === 'marketing' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Section 7: Testimonials</h2>
              <div className="space-y-4">
                {data.testimonials.map((test, idx) => (
                  <div key={idx} className="border border-gray-200 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Name</label>
                      <input type="text" value={test.name} onChange={e => handleArrayChange('testimonials', idx, 'name', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
                      <input type="text" value={test.text} onChange={e => handleArrayChange('testimonials', idx, 'text', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Section 9: Limited Offer Banner</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Offer Title</label>
                  <input type="text" value={data.limitedOffer.title} onChange={e => handleNestedChange('limitedOffer', 'title', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Offer Subtitle / Discount</label>
                  <input type="text" value={data.limitedOffer.subtitle} onChange={e => handleNestedChange('limitedOffer', 'subtitle', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Background Image URL</label>
                  <input type="text" value={data.limitedOffer.bgImage} onChange={e => handleNestedChange('limitedOffer', 'bgImage', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end sticky bottom-6 z-20">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-plum text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-plum/90 transition-all shadow-xl disabled:opacity-70 text-lg"
          >
            <FiSave size={24} />
            {saving ? 'Saving...' : 'Save Floral Habitat Content'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default FloralHabitatManagement;
