import { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiImage, FiSettings } from 'react-icons/fi';
import axios from 'axios';
import bannerService from '../services/bannerService';

const DealsManagement = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Banner state
  const [dealBanner, setDealBanner] = useState({ id: null, pageSlug: 'deals', webImage: '', mobileImage: '', size: 'medium', isActive: true });
  
  // Icons state
  const [dealCategories, setDealCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Banner
      const banners = await bannerService.getAllBanners();
      const existingBanner = banners.find(b => b.pageSlug === 'deals');
      if (existingBanner) {
        setDealBanner(existingBanner);
      }

      // Fetch Settings for Icons
      const response = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings');
      if (response.data && response.data.dealCategories) {
        setDealCategories(response.data.dealCategories);
      }
    } catch (error) {
      console.error("Failed to load deals data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e, target, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'webImage') {
          setDealBanner({ ...dealBanner, webImage: reader.result });
        } else if (target === 'mobileImage') {
          setDealBanner({ ...dealBanner, mobileImage: reader.result });
        } else if (target === 'categoryIcon') {
          const newCategories = [...dealCategories];
          newCategories[index].image = reader.result;
          setDealCategories(newCategories);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...dealCategories];
    newCategories[index][field] = value;
    setDealCategories(newCategories);
  };

  const addCategory = () => {
    setDealCategories([...dealCategories, { name: '', image: '', link: '' }]);
  };

  const removeCategory = (index) => {
    const newCategories = [...dealCategories];
    newCategories.splice(index, 1);
    setDealCategories(newCategories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      // 1. Save Banner
      if (dealBanner.id) {
        await bannerService.updateBanner(dealBanner.id, dealBanner);
      } else {
        const newBanner = await bannerService.createBanner(dealBanner);
        setDealBanner(newBanner);
      }

      // 2. Save Categories
      const cleanedCategories = dealCategories.filter(cat => cat.name.trim() !== '');
      await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings', {
        dealCategories: cleanedCategories
      });
      
      setMessage('Deals Page updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Failed to save deals data:", error);
      setMessage('Failed to save data. Please check logs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Deals Framework...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair">Deal of the Day Framework</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the hero banner and circular category icons for the Deals page.</p>
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
            <h2 className="text-lg font-bold text-gray-800">Deals Page Hero Banner</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Desktop Banner Image</label>
              {dealBanner.webImage ? (
                <div className="relative inline-block w-full">
                  <img src={dealBanner.webImage} alt="Desktop Preview" className="h-40 w-full object-cover rounded-lg border border-gray-200" />
                  <button type="button" onClick={() => setDealBanner({...dealBanner, webImage: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">Remove</button>
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
              {dealBanner.mobileImage ? (
                <div className="relative inline-block w-full">
                  <img src={dealBanner.mobileImage} alt="Mobile Preview" className="h-40 w-32 object-cover rounded-lg border border-gray-200 mx-auto block" />
                  <button type="button" onClick={() => setDealBanner({...dealBanner, mobileImage: ''})} className="absolute -top-2 right-[calc(50%-4rem)] bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">Remove</button>
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

        {/* CIRCULAR CATEGORY ICONS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="bg-brand-plum/10 p-2 rounded-lg text-brand-plum">
              <FiSettings size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Circular Category Icons</h2>
              <p className="text-xs text-gray-500 mt-1">These will appear as circular shortcuts below the banner (e.g. Brands, Sub-categories).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealCategories.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative group">
                <button type="button" onClick={() => removeCategory(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md hover:bg-red-600">
                  <FiTrash2 size={14} />
                </button>
                
                <div className="flex flex-col items-center mb-4">
                  {category.image ? (
                    <div className="h-20 w-20 rounded-full border border-gray-300 overflow-hidden bg-white mb-2 relative">
                      <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                      <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity text-xs font-bold">
                        Edit
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'categoryIcon', index)} />
                      </label>
                    </div>
                  ) : (
                    <label className="h-20 w-20 rounded-full border-2 border-dashed border-brand-plum/30 flex items-center justify-center bg-white cursor-pointer hover:bg-brand-plum/5 transition-colors mb-2 text-brand-plum">
                      <FiPlus size={24} />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'categoryIcon', index)} />
                    </label>
                  )}
                  <span className="text-xs text-gray-500 font-medium">Icon Image</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Title</label>
                    <input 
                      type="text" 
                      value={category.name} 
                      onChange={e => handleCategoryChange(index, 'name', e.target.value)}
                      placeholder="e.g. Floral Teas"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-brand-plum outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Link URL</label>
                    <input 
                      type="text" 
                      value={category.link} 
                      onChange={e => handleCategoryChange(index, 'link', e.target.value)}
                      placeholder="e.g. /category/teas"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-brand-plum outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" onClick={addCategory} className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 hover:text-brand-plum hover:border-brand-plum hover:bg-brand-plum/5 transition-all min-h-[220px]">
              <FiPlus size={32} className="mb-2" />
              <span className="font-semibold text-sm">Add New Icon</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end sticky bottom-6 z-20">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-plum text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-plum/90 transition-all shadow-xl disabled:opacity-70 text-lg"
          >
            <FiSave size={24} />
            {saving ? 'Saving Framework...' : 'Save Deals Framework'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default DealsManagement;
