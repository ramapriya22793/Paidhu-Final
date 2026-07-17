import { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiImage, FiSettings, FiType } from 'react-icons/fi';
import axios from 'axios';
import bannerService from '../services/bannerService';

const FamilyManagement = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Banner state
  const [familyBanner, setFamilyBanner] = useState({ id: null, pageSlug: 'family-combos', webImage: '', mobileImage: '', size: 'medium', isActive: true });
  
  // Title state
  const [familyTitle, setFamilyTitle] = useState('Mille Supergrains');

  // Tabs state
  const [familyTabs, setFamilyTabs] = useState(['Protein Powder', 'Protein Pancakes', 'High Fibre Oats']);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Banner
      const banners = await bannerService.getAllBanners();
      const existingBanner = banners.find(b => b.pageSlug === 'family-combos');
      if (existingBanner) {
        setFamilyBanner(existingBanner);
      }

      // Fetch Settings
      const response = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings');
      if (response.data) {
        if (response.data.familyTitle) setFamilyTitle(response.data.familyTitle);
        if (response.data.familyTabs) setFamilyTabs(response.data.familyTabs);
      }
    } catch (error) {
      console.error("Failed to load family data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e, target) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'webImage') setFamilyBanner({ ...familyBanner, webImage: reader.result });
        else if (target === 'mobileImage') setFamilyBanner({ ...familyBanner, mobileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTabChange = (index, value) => {
    const newTabs = [...familyTabs];
    newTabs[index] = value;
    setFamilyTabs(newTabs);
  };

  const addTab = () => {
    setFamilyTabs([...familyTabs, 'New Tab']);
  };

  const removeTab = (index) => {
    const newTabs = [...familyTabs];
    newTabs.splice(index, 1);
    setFamilyTabs(newTabs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      // 1. Save Banner
      if (familyBanner.id) {
        await bannerService.updateBanner(familyBanner.id, familyBanner);
      } else {
        const newBanner = await bannerService.createBanner(familyBanner);
        setFamilyBanner(newBanner);
      }

      // 2. Save Settings
      const cleanedTabs = familyTabs.filter(tab => tab.trim() !== '');
      await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings', {
        familyTitle,
        familyTabs: cleanedTabs
      });
      
      setMessage('Family Combos Framework updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Failed to save data:", error);
      setMessage('Failed to save data. Please check logs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Family Framework...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair">Family Combos Framework</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the hero banner, title, and tabs for the For Your Family page.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg font-medium text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* HERO BANNER SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="bg-brand-plum/10 p-2 rounded-lg text-brand-plum">
              <FiImage size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Family Page Hero Banner</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Desktop Banner Image</label>
              {familyBanner.webImage ? (
                <div className="relative inline-block w-full">
                  <img src={familyBanner.webImage} alt="Desktop Preview" className="h-40 w-full object-cover rounded-lg border border-gray-200" />
                  <button type="button" onClick={() => setFamilyBanner({...familyBanner, webImage: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">Remove</button>
                </div>
              ) : (
                <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 h-40">
                  <span className="text-sm font-semibold text-brand-plum">Upload Desktop Banner</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'webImage')} />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Banner Image</label>
              {familyBanner.mobileImage ? (
                <div className="relative inline-block w-full">
                  <img src={familyBanner.mobileImage} alt="Mobile Preview" className="h-40 w-32 object-cover rounded-lg border border-gray-200 mx-auto block" />
                  <button type="button" onClick={() => setFamilyBanner({...familyBanner, mobileImage: ''})} className="absolute -top-2 right-[calc(50%-4rem)] bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">Remove</button>
                </div>
              ) : (
                <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 h-40">
                  <span className="text-sm font-semibold text-brand-plum">Upload Mobile Banner</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'mobileImage')} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* TITLE AND TABS SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="bg-brand-plum/10 p-2 rounded-lg text-brand-plum">
              <FiSettings size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Page Content & Tabs</h2>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Main Section Title</label>
              <input 
                type="text" 
                value={familyTitle}
                onChange={(e) => setFamilyTitle(e.target.value)}
                placeholder="e.g. Paidhu Superfoods"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">This appears inside a styled pill background above the tabs.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Text Tabs (Categories)</label>
              <div className="space-y-3">
                {familyTabs.map((tab, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded text-gray-500"><FiType /></div>
                    <input 
                      type="text" 
                      value={tab}
                      onChange={(e) => handleTabChange(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none"
                      placeholder="e.g. Protein Powder"
                    />
                    <button type="button" onClick={() => removeTab(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addTab} className="mt-4 flex items-center gap-2 text-brand-plum font-semibold hover:bg-brand-plum/5 px-4 py-2 rounded-lg transition-colors">
                <FiPlus /> Add New Tab
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end sticky bottom-6 z-20">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-plum text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-plum/90 transition-all shadow-xl disabled:opacity-70 text-lg"
          >
            <FiSave size={24} />
            {saving ? 'Saving Framework...' : 'Save Family Framework'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default FamilyManagement;
