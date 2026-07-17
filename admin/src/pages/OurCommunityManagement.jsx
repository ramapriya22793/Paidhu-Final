import { useState, useEffect } from 'react';
import { FiSave, FiImage, FiUsers, FiBookOpen, FiCoffee, FiVideo } from 'react-icons/fi';
import axios from 'axios';

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

const OurCommunityManagement = () => {
  const [activeTab, setActiveTab] = useState('banners');
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
      const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings');
      if (res.data?.ourCommunityData) {
        setData({ ...defaultData, ...res.data.ourCommunityData });
      }
    } catch (error) {
      console.error("Failed to fetch community data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings', { ourCommunityData: data });
      setMessage('Community Page Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving community data", error);
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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Community Settings...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Our Community Page</h1>
          <p className="text-gray-500 mt-1">Manage the content for the 6 sections of the Our Community page.</p>
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
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        {[
          { id: 'banners', label: 'Banners', icon: FiImage },
          { id: 'connect', label: 'Connect', icon: FiUsers },

          { id: 'nourish', label: 'Nourish', icon: FiCoffee },
          { id: 'highlights', label: 'Highlights', icon: FiVideo }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'bg-brand-plum text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        
        {activeTab === 'banners' && (
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">1. Main Hero Banner</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input type="text" value={data.hero.title} onChange={(e) => setData({...data, hero: {...data.hero, title: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
                    <textarea value={data.hero.subtitle} onChange={(e) => setData({...data, hero: {...data.hero, subtitle: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={3}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Background Image URL</label>
                    <input type="text" value={data.hero.image} onChange={(e) => setData({...data, hero: {...data.hero, image: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preview</label>
                  <img src={data.hero.image} alt="Preview" className="w-full h-48 object-cover rounded-xl shadow-sm" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">2. "Find Your Tribe" Banner</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                  <input type="text" value={data.findYourTribe.image} onChange={(e) => setData({...data, findYourTribe: {...data.findYourTribe, image: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
                  <p className="text-xs text-gray-500 mt-2">This is the secondary banner image containing the text "Find Your Tribe and Get Advice".</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preview</label>
                  <img src={data.findYourTribe.image} alt="Preview" className="w-full h-32 object-cover rounded-xl shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'connect' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">CONNECT Section Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.connect.map((item, index) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                    <input type="text" value={item.image} onChange={(e) => handleArrayChange('connect', index, 'image', e.target.value)} className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description Text</label>
                    <textarea value={item.text} onChange={(e) => handleArrayChange('connect', index, 'text', e.target.value)} className="w-full border rounded-lg px-4 py-2" rows={3}></textarea>
                  </div>
                  <img src={item.image} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />
                </div>
              ))}
            </div>
          </div>
        )}



        {activeTab === 'nourish' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">NOURISH Section Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.nourish.map((item, index) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                    <input type="text" value={item.image} onChange={(e) => handleArrayChange('nourish', index, 'image', e.target.value)} className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description Text</label>
                    <textarea value={item.text} onChange={(e) => handleArrayChange('nourish', index, 'text', e.target.value)} className="w-full border rounded-lg px-4 py-2" rows={3}></textarea>
                  </div>
                  <img src={item.image} alt="Preview" className="w-full h-40 object-cover rounded-lg mt-2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">HIGHLIGHTS Image Banner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Highlight Image URL</label>
                  <input type="text" value={data.highlights.image} onChange={(e) => setData({...data, highlights: {...data.highlights, image: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Preview</label>
                <div className="relative">
                  <img src={data.highlights.image} alt="Preview" className="w-full h-64 object-cover rounded-xl shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OurCommunityManagement;
