import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import settingsService from '../services/settingsService';
import { FiSave, FiImage, FiType, FiArrowLeft, FiChevronDown, FiChevronUp, FiLayout } from 'react-icons/fi';

const PageEditor = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openSection, setOpenSection] = useState('hero'); // 'hero', 'community', 'faq'

  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    communityTitle: '',
    communitySubtitle: '',
    communityImage: '',
    faqList: '',
    videoTitle: '',
    videoSubtitle: '',
    videoUrl: '',
    videoThumbnail: '',
    productTabs: ''
  });

  useEffect(() => {
    if (pageId !== 'landing-page') {
      // In the future, fetch different data for different pages. 
      // For now, we only support landing-page.
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        if (data) {
          setFormData({
            ...data,
            faqList: data.faqList ? JSON.stringify(data.faqList, null, 2) : '',
            productTabs: data.productTabs ? JSON.stringify(data.productTabs, null, 2) : ''
          });
        }
      } catch (err) {
        console.error("Failed to load page content");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [pageId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let payload = { ...formData };
      if (payload.faqList) {
        try {
          payload.faqList = JSON.parse(payload.faqList);
        } catch (e) {
          alert("Invalid JSON in FAQ List");
          setSaving(false);
          return;
        }
      } else {
        payload.faqList = null;
      }
      if (payload.productTabs) {
        try {
          payload.productTabs = JSON.parse(payload.productTabs);
        } catch (e) {
          alert("Invalid JSON in Product Tabs");
          setSaving(false);
          return;
        }
      } else {
        payload.productTabs = null;
      }
      await settingsService.updateSettings(payload);
      alert('Page content updated successfully!');
    } catch (err) {
      alert('Failed to update page content');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (pageId !== 'landing-page') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-playfair text-brand-plum font-bold mb-4">Page Editor Not Found</h1>
        <p className="text-gray-500 mb-6">The editor for '{pageId}' is not yet implemented.</p>
        <button onClick={() => navigate('/pages')} className="text-brand-plum underline font-medium">Return to Pages</button>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-brand-plum">Loading page content...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/pages')} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 font-playfair">Edit Landing Page</h1>
            <p className="text-sm text-gray-500 mt-1">Manage the sections displayed on the homepage.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${openSection === 'hero' ? 'bg-brand-cream/30 border-b border-gray-100' : 'hover:bg-gray-50'}`}
            onClick={() => toggleSection('hero')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-plum/10 flex items-center justify-center text-brand-plum">
                <FiImage size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Hero Banner Section</h2>
                <p className="text-xs text-gray-500">Main background image and heading text</p>
              </div>
            </div>
            {openSection === 'hero' ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
          </div>
          
          {openSection === 'hero' && (
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Banner Background Image URL</label>
                <input 
                  type="text" 
                  name="heroImage" 
                  value={formData.heroImage} 
                  onChange={handleChange} 
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none transition-all" 
                  placeholder="https://images.unsplash.com/..." 
                />
                {formData.heroImage && (
                  <div className="mt-4 aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 w-full md:w-1/2">
                    <img src={formData.heroImage} alt="Banner Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Hero Title</label>
                  <input 
                    type="text" 
                    name="heroTitle" 
                    value={formData.heroTitle} 
                    onChange={handleChange} 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none" 
                    placeholder="Premium Artisanal Floral Foods" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Hero Subtitle</label>
                  <textarea 
                    name="heroSubtitle" 
                    rows="3" 
                    value={formData.heroSubtitle} 
                    onChange={handleChange} 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none" 
                    placeholder="Handcrafted with the finest botanical ingredients..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Community Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${openSection === 'community' ? 'bg-brand-cream/30 border-b border-gray-100' : 'hover:bg-gray-50'}`}
            onClick={() => toggleSection('community')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-plum/10 flex items-center justify-center text-brand-plum">
                <FiType size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Community Section</h2>
                <p className="text-xs text-gray-500">The "Paidhu Club" content area</p>
              </div>
            </div>
            {openSection === 'community' ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
          </div>
          
          {openSection === 'community' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Community Title</label>
                  <input 
                    type="text" 
                    name="communityTitle" 
                    value={formData.communityTitle} 
                    onChange={handleChange} 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Community Subtitle</label>
                  <input 
                    type="text" 
                    name="communitySubtitle" 
                    value={formData.communitySubtitle} 
                    onChange={handleChange} 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Community Image URL</label>
                  <input 
                    type="text" 
                    name="communityImage" 
                    value={formData.communityImage} 
                    onChange={handleChange} 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${openSection === 'faq' ? 'bg-brand-cream/30 border-b border-gray-100' : 'hover:bg-gray-50'}`}
            onClick={() => toggleSection('faq')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-plum/10 flex items-center justify-center text-brand-plum">
                <FiType size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">FAQ Section</h2>
                <p className="text-xs text-gray-500">Frequently Asked Questions (JSON config)</p>
              </div>
            </div>
            {openSection === 'faq' ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
          </div>
          
          {openSection === 'faq' && (
            <div className="p-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">FAQ List [{`{"question": "...", "answer": "..."}`}]</label>
                <textarea 
                  name="faqList" 
                  rows="8" 
                  value={formData.faqList} 
                  onChange={handleChange} 
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none" 
                  placeholder='[{"question": "How to order?", "answer": "Online..."}]'
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Product Carousel Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${openSection === 'carousel' ? 'bg-brand-cream/30 border-b border-gray-100' : 'hover:bg-gray-50'}`}
            onClick={() => toggleSection('carousel')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-plum/10 flex items-center justify-center text-brand-plum">
                <FiLayout size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Product Carousel Section</h2>
                <p className="text-xs text-gray-500">Manage tabs (e.g., Bestsellers, New Launches) (JSON config)</p>
              </div>
            </div>
            {openSection === 'carousel' ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
          </div>
          
          {openSection === 'carousel' && (
            <div className="p-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Tabs [{`{"name": "...", "type": "tag", "value": "bestseller"}`}]</label>
                <textarea 
                  name="productTabs" 
                  rows="8" 
                  value={formData.productTabs || ''} 
                  onChange={handleChange} 
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none" 
                  placeholder='[{"name": "Bestsellers", "type": "tag", "value": "bestseller"}]'
                ></textarea>
                <p className="text-xs text-gray-500 mt-2">
                  Use "type": "tag" or "type": "category" to filter products. Set "value" to the tag/category name.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${openSection === 'video' ? 'bg-brand-cream/30 border-b border-gray-100' : 'hover:bg-gray-50'}`}
            onClick={() => toggleSection('video')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-plum/10 flex items-center justify-center text-brand-plum">
                <FiImage size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Video Section</h2>
                <p className="text-xs text-gray-500">The "Paidhu TV" video feature</p>
              </div>
            </div>
            {openSection === 'video' ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
          </div>
          
          {openSection === 'video' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Video Title</label>
                  <input 
                    type="text" 
                    name="videoTitle" 
                    value={formData.videoTitle || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none" 
                    placeholder="Paidhu TV"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Video Subtitle</label>
                  <input 
                    type="text" 
                    name="videoSubtitle" 
                    value={formData.videoSubtitle || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none" 
                    placeholder="Real Food, Really Elegant!"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Video Thumbnail URL</label>
                  <input 
                    type="text" 
                    name="videoThumbnail" 
                    value={formData.videoThumbnail || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Video URL (YouTube/Vimeo link)</label>
                  <input 
                    type="text" 
                    name="videoUrl" 
                    value={formData.videoUrl || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 flex justify-end sticky bottom-6 z-10">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center space-x-2 bg-brand-plum text-white px-8 py-3 rounded-lg hover:bg-brand-plum/90 transition-colors shadow-lg font-medium"
          >
            <FiSave />
            <span>{saving ? 'Saving...' : 'Save Page Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageEditor;
