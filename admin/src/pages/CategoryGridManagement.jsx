import { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiSettings, FiGrid } from 'react-icons/fi';
import axios from 'axios';

const CategoryGridManagement = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Category Grid state
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get((import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/settings');
      if (response.data && response.data.categoryGridData) {
        setCategories(response.data.categoryGridData);
      } else {
        // Load default if empty
        setCategories([
          { title: "BLOOM COOKIES", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80", link: "/collections/bloom-cookies" },
        ]);
      }
    } catch (error) {
      console.error("Failed to load category grid data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCategories = [...categories];
        newCategories[index].image = reader.result;
        setCategories(newCategories);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...categories];
    newCategories[index][field] = value;
    setCategories(newCategories);
  };

  const addCategory = () => {
    setCategories([...categories, { title: '', image: '', link: '' }]);
  };

  const removeCategory = (index) => {
    const newCategories = [...categories];
    newCategories.splice(index, 1);
    setCategories(newCategories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const cleanedCategories = categories.filter(cat => cat.title.trim() !== '');
      await axios.put((import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/settings', {
        categoryGridData: cleanedCategories
      });
      
      setMessage('Category Grid updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Failed to save category grid data:", error);
      setMessage('Failed to save data. Please check logs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Category Grid...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair">Homepage Category Grid</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the circular category icons shown on the homepage.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg font-medium text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* CATEGORY GRID ICONS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="bg-brand-plum/10 p-2 rounded-lg text-brand-plum">
              <FiGrid size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Circular Categories</h2>
              <p className="text-xs text-gray-500 mt-1">Add, edit, or remove the circular images displayed on the homepage.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative group">
                <button type="button" onClick={() => removeCategory(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md hover:bg-red-600">
                  <FiTrash2 size={14} />
                </button>
                
                <div className="flex flex-col items-center mb-4">
                  {category.image ? (
                    <div className="h-24 w-24 rounded-full border-2 border-gray-300 overflow-hidden bg-white mb-2 relative">
                      <img src={category.image} alt={category.title} className="h-full w-full object-cover" />
                      <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity text-xs font-bold">
                        Edit
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, index)} />
                      </label>
                    </div>
                  ) : (
                    <label className="h-24 w-24 rounded-full border-2 border-dashed border-brand-plum/30 flex items-center justify-center bg-white cursor-pointer hover:bg-brand-plum/5 transition-colors mb-2 text-brand-plum">
                      <FiPlus size={24} />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, index)} />
                    </label>
                  )}
                  <span className="text-xs text-gray-500 font-medium">Category Image</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Title</label>
                    <input 
                      type="text" 
                      value={category.title} 
                      onChange={e => handleCategoryChange(index, 'title', e.target.value)}
                      placeholder="e.g. BLOOM COOKIES"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-brand-plum outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Link URL</label>
                    <input 
                      type="text" 
                      value={category.link} 
                      onChange={e => handleCategoryChange(index, 'link', e.target.value)}
                      placeholder="e.g. /collections/cookies"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-brand-plum outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" onClick={addCategory} className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 hover:text-brand-plum hover:border-brand-plum hover:bg-brand-plum/5 transition-all min-h-[260px]">
              <FiPlus size={32} className="mb-2" />
              <span className="font-semibold text-sm">Add New Category</span>
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
            {saving ? 'Saving...' : 'Save Category Grid'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CategoryGridManagement;
