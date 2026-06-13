import { useState, useEffect } from 'react';
import bannerService from '../services/bannerService';
import { uploadImage, deleteImage } from '../utils/uploadImage';
import { FiImage, FiPlus, FiEdit2, FiTrash2, FiX, FiMonitor, FiSmartphone, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';

const PAGES = [
  { slug: 'home',                       name: 'Home Page' },
  { slug: 'shop-all',                   name: 'Shop All' },
  { slug: 'deal-of-the-day',            name: 'Deal of the Day' },
  { slug: 'shop-by-category',           name: 'Shop by Category' },
  { slug: 'for-your-family',            name: 'For Your Family' },
  { slug: 'starting-floral-food-habitat', name: 'Starting Floral Food Habitat' },
  { slug: 'byoc',                       name: 'BYOC' },
  { slug: 'our-own-community',          name: 'Our Own Community' },
  { slug: 'our-philosophy',             name: 'Our Philosophy' },
  { slug: 'bulk-orders',                name: 'Bulk Orders' },
  { slug: 'about',                      name: 'About Us' },
  { slug: 'blogs',                      name: 'Blogs Page' },
];

const SIZES = [
  { value: 'small', name: 'Small (300px)' },
  { value: 'medium', name: 'Medium (500px)' },
  { value: 'large', name: 'Large (700px)' },
  { value: 'fullscreen', name: 'Full Screen (100vh)' }
];

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({ pageSlug: 'home', size: 'medium', webImage: '', webImagePath: '', mobileImage: '', mobileImagePath: '', isActive: true });
  const [newWebFile, setNewWebFile] = useState(null);
  const [newMobileFile, setNewMobileFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('All'); // All, Active, Inactive

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await bannerService.getAllBanners();
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Image must be smaller than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [type]: reader.result });
      };
      reader.readAsDataURL(file);

      if (type === 'webImage') setNewWebFile(file);
      if (type === 'mobileImage') setNewMobileFile(file);
    }
  };

  const removeImage = (type) => {
    if (type === 'webImage') {
      setFormData({ ...formData, webImage: '' });
      setNewWebFile(null);
    }
    if (type === 'mobileImage') {
      setFormData({ ...formData, mobileImage: '' });
      setNewMobileFile(null);
    }
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({ pageSlug: 'home', size: 'medium', webImage: '', webImagePath: '', mobileImage: '', mobileImagePath: '', isActive: true });
    setNewWebFile(null);
    setNewMobileFile(null);
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      pageSlug: banner.pageSlug,
      size: banner.size,
      webImage: banner.webImage,
      webImagePath: banner.webImagePath || '',
      mobileImage: banner.mobileImage || '',
      mobileImagePath: banner.mobileImagePath || '',
      isActive: banner.isActive
    });
    setNewWebFile(null);
    setNewMobileFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let finalWebImage = formData.webImage;
      let finalWebImagePath = formData.webImagePath;
      let finalMobileImage = formData.mobileImage;
      let finalMobileImagePath = formData.mobileImagePath;

      // Upload Web Image if new
      if (newWebFile) {
        if (editingBanner && editingBanner.webImagePath) {
          try { await deleteImage(editingBanner.webImagePath); } catch (err) { console.warn("Failed deleting old web banner", err); }
        }
        const { publicUrl, imagePath, error } = await uploadImage(newWebFile, 'banners');
        if (error) throw new Error(`Web banner upload failed: ${error}`);
        finalWebImage = publicUrl;
        finalWebImagePath = imagePath;
      }

      // Upload Mobile Image if new
      if (newMobileFile) {
        if (editingBanner && editingBanner.mobileImagePath) {
          try { await deleteImage(editingBanner.mobileImagePath); } catch (err) { console.warn("Failed deleting old mobile banner", err); }
        }
        const { publicUrl, imagePath, error } = await uploadImage(newMobileFile, 'banners');
        if (error) throw new Error(`Mobile banner upload failed: ${error}`);
        finalMobileImage = publicUrl;
        finalMobileImagePath = imagePath;
      }

      // Delete mobile image entirely if it was removed
      if (!formData.mobileImage && editingBanner && editingBanner.mobileImagePath) {
        try { await deleteImage(editingBanner.mobileImagePath); } catch (err) { console.warn(err); }
        finalMobileImage = '';
        finalMobileImagePath = '';
      }

      const payload = {
        ...formData,
        webImage: finalWebImage,
        webImagePath: finalWebImagePath,
        mobileImage: finalMobileImage,
        mobileImagePath: finalMobileImagePath
      };

      if (editingBanner) {
        await bannerService.updateBanner(editingBanner.id, payload);
      } else {
        await bannerService.createBanner(payload);
      }
      setShowModal(false);
      fetchBanners();
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Unknown error";
      alert("Failed to save banner: " + errMsg);
      console.error("Banner save error details:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (banner) => {
    if (window.confirm("Are you sure you want to delete this banner permanently?")) {
      try {
        if (banner.webImagePath) {
          try { await deleteImage(banner.webImagePath); } catch (err) { console.warn(err); }
        }
        if (banner.mobileImagePath) {
          try { await deleteImage(banner.mobileImagePath); } catch (err) { console.warn(err); }
        }
        await bannerService.deleteBanner(banner.id);
        toast.success("Banner deleted successfully");
        fetchBanners();
      } catch (error) {
        toast.error("Failed to delete banner");
      }
    }
  };

  const toggleActive = async (banner) => {
    // Optimistic UI Update
    const newStatus = !banner.isActive;
    setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, isActive: newStatus } : b));
    
    try {
      await bannerService.updateBanner(banner.id, { ...banner, isActive: newStatus });
      toast.success(`Banner is now ${newStatus ? 'Active' : 'Inactive'}`);
    } catch (error) {
      // Revert on failure
      setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, isActive: banner.isActive } : b));
      toast.error("Failed to toggle status");
    }
  };

  const filteredBanners = banners.filter(b => {
    if (filter === 'Active') return b.isActive;
    if (filter === 'Inactive') return !b.isActive;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
          <FiImage className="mr-3 text-brand-plum" /> Banner Management
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button onClick={() => setFilter('All')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'All' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>All</button>
            <button onClick={() => setFilter('Active')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'Active' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>Active</button>
            <button onClick={() => setFilter('Inactive')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'Inactive' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}>Inactive</button>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-brand-plum text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-brand-plum/90 transition-colors"
          >
            <FiPlus className="mr-2" /> Add Banner
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Page</th>
                <th className="px-6 py-4">Web Banner</th>
                <th className="px-6 py-4">Mobile Banner</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-brand-plum">Loading banners...</td>
                </tr>
              ) : filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No banners found for this filter.</td>
                </tr>
              ) : (
                filteredBanners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800 uppercase text-xs">{banner.pageSlug}</td>
                    
                    <td className="px-6 py-4">
                      {banner.webImage ? (
                        <div className="relative group w-32 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                          <img src={banner.webImage} alt="Web" className="w-full h-full object-cover" />
                        </div>
                      ) : <span className="text-red-400 italic text-xs">Missing</span>}
                    </td>

                    <td className="px-6 py-4">
                      {banner.mobileImage ? (
                        <div className="relative group w-12 h-16 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                          <img src={banner.mobileImage} alt="Mobile" className="w-full h-full object-cover" />
                        </div>
                      ) : <span className="text-gray-400 italic text-xs">Using Web Image</span>}
                    </td>

                    <td className="px-6 py-4 text-gray-600 capitalize">{banner.size}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {/* Animated Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => toggleActive(banner)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-plum focus:ring-offset-2 ${banner.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span className="sr-only">Toggle Active</span>
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${banner.isActive ? 'translate-x-5' : 'translate-x-0'}`}
                          />
                        </button>
                        
                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {banner.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(banner)} className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors mr-2">
                        <FiEdit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(banner)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 shrink-0">
              <h2 className="text-xl font-bold text-brand-plum">{editingBanner ? 'Edit Banner' : 'Create Banner'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><FiX size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="bannerForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Target Page</label>
                    <select 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white"
                      value={formData.pageSlug}
                      onChange={e => setFormData({...formData, pageSlug: e.target.value})}
                    >
                      {PAGES.map(p => <option key={p.slug} value={p.slug}>{p.name} ({p.slug})</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Banner Height (Size)</label>
                    <select 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white"
                      value={formData.size}
                      onChange={e => setFormData({...formData, size: e.target.value})}
                    >
                      {SIZES.map(s => <option key={s.value} value={s.value}>{s.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* IMAGES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  {/* Web Image */}
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      <FiMonitor className="mr-2 text-brand-plum" /> Web Banner Image <span className="text-red-500 ml-1">*</span>
                    </label>
                    {formData.webImage ? (
                      <div className="relative inline-block w-full">
                        <img src={formData.webImage} alt="Web Preview" className="h-32 w-full object-cover rounded-lg border border-gray-200" />
                        <button type="button" onClick={() => removeImage('webImage')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600"><FiX size={14} /></button>
                      </div>
                    ) : (
                      <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors h-32">
                        <span className="text-sm text-gray-600 font-bold">Upload Web Image</span>
                        <span className="text-xs text-gray-400 mt-1">1920 × 800 px (12:5 Aspect Ratio)</span>
                        <input type="file" required={!formData.webImage} accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'webImage')} />
                      </label>
                    )}
                  </div>

                  {/* Mobile Image */}
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      <FiSmartphone className="mr-2 text-brand-plum" /> Mobile Banner Image (Optional)
                    </label>
                    {formData.mobileImage ? (
                      <div className="relative inline-block w-full">
                        <img src={formData.mobileImage} alt="Mobile Preview" className="h-32 w-24 object-cover mx-auto rounded-lg border border-gray-200" />
                        <button type="button" onClick={() => removeImage('mobileImage')} className="absolute -top-2 right-1/4 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600"><FiX size={14} /></button>
                      </div>
                    ) : (
                      <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors h-32">
                        <span className="text-sm text-gray-600 font-bold">Upload Mobile Image</span>
                        <span className="text-xs text-gray-400 mt-1">1080 × 1920 px (Vertical)</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'mobileImage')} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    className="w-5 h-5 text-brand-plum rounded border-gray-300 focus:ring-brand-plum"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <label htmlFor="isActive" className="ml-3 text-sm font-bold text-gray-700 cursor-pointer">
                    Set as Active (Will immediately appear on live site if checked)
                  </label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex space-x-3 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">CANCEL</button>
              <button type="submit" form="bannerForm" disabled={submitting} className="flex-1 py-3 bg-brand-plum text-white font-bold rounded-lg hover:bg-brand-plum/90 disabled:opacity-50 transition-colors">
                {submitting ? 'SAVING...' : (editingBanner ? 'UPDATE BANNER' : 'CREATE BANNER')}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
