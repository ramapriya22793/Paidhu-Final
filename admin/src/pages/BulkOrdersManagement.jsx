import { useState, useEffect } from 'react';
import { FiSave, FiList, FiMessageCircle, FiHeart, FiPhoneCall } from 'react-icons/fi';
import axios from 'axios';

const defaultData = {
  heroSection: {
    heading: 'BUY YOUR PAIDHU\nfavourites in bulk\n& resell ahead!',
    discountBtnText: 'Click Here For Discounts',
    bannerImage: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
    buttons: [
      { id: 1, label: 'Explore Bulk Offers', link: '#offers' },
      { id: 2, label: 'Download catalogue', link: '#catalogue' },
      { id: 3, label: 'Order in Bulk', link: '#order' }
    ]
  },
  formSection: {
    disclaimer: 'Disclaimer: We do not accept international bulk orders. For Further Queries Contact us at +91 7042018256 or help@paidhu.com',
    formTitle: 'Fill in Your Details',
    buttonText: 'Send Request'
  },
  whyChooseUs: {
    title: 'WHY CHOOSE PAIDHU?',
    trustedText: 'TRUSTED BY\n1 MILLION PARENTS',
    bullets: 'No artificial colors\nMade with real floral ingredients\nNo preservatives',
    image: 'https://images.unsplash.com/photo-1621213459955-442460b64d1f?q=80&w=800&auto=format&fit=crop'
  },
  foundersNote: {
    title: 'MADE BY\nTwo Friends',
    text: 'Choose wellness which is good for you. At Paidhu, we love using a diverse range of premium superfoods! Our products are made with a variety of nutrient-dense ingredients such as Kashmiri Saffron, Dried Rose Petals, and pure honey combined with natural sweetness.',
    logosTitle: 'ALSO AVAILABLE ON',
    logos: [
      { id: 1, image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
      { id: 2, image: 'https://cdn.worldvectorlogo.com/logos/flipkart.svg' },
      { id: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png' }
    ]
  },
  contactAssistance: {
    title: 'Need help with your order? Contact us!',
    text: 'Ready to place a bulk order? Contact us today for a special discount and dedicated assistance.',
    phone: '+91 70420 18256',
    email: 'help@paidhu.com',
    buttonText: 'Chat with us'
  }
};

const BulkOrdersManagement = () => {
  const [activeTab, setActiveTab] = useState('formSection');
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
      if (res.data?.bulkOrdersData) {
        setData({ ...defaultData, ...res.data.bulkOrdersData });
      }
    } catch (error) {
      console.error("Failed to fetch bulk orders data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings', { bulkOrdersData: data });
      setMessage('Bulk Orders Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving bulk orders data", error);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (index, value) => {
    const newData = { ...data };
    newData.foundersNote.logos[index].image = value;
    setData(newData);
  };

  const handleHeroButtonChange = (index, field, value) => {
    const newData = { ...data };
    newData.heroSection.buttons[index][field] = value;
    setData(newData);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Bulk Orders Settings...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Bulk Orders Page</h1>
          <p className="text-gray-500 mt-1">Manage the content for the B2B / Bulk Orders landing page.</p>
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
          { id: 'heroSection', label: 'Top Hero Banner', icon: FiList },
          { id: 'formSection', label: 'Form Section', icon: FiList },
          { id: 'whyChooseUs', label: 'Why Choose Us', icon: FiMessageCircle },
          { id: 'foundersNote', label: 'Founders Note', icon: FiHeart },
          { id: 'contactAssistance', label: 'Contact Assistance', icon: FiPhoneCall }
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
        
        {activeTab === 'heroSection' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">Top Hero Banner</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Banner Heading</label>
              <textarea value={data.heroSection.heading} onChange={(e) => setData({...data, heroSection: {...data.heroSection, heading: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Button Text</label>
              <input type="text" value={data.heroSection.discountBtnText} onChange={(e) => setData({...data, heroSection: {...data.heroSection, discountBtnText: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Right Graphic Image URL</label>
              <input type="text" value={data.heroSection.bannerImage} onChange={(e) => setData({...data, heroSection: {...data.heroSection, bannerImage: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            
            <div className="pt-6 border-t mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">Bottom Action Buttons (Max 3)</label>
              <div className="space-y-4">
                {data.heroSection.buttons.map((btn, idx) => (
                  <div key={btn.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg border">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Button {idx + 1} Label</label>
                      <input type="text" value={btn.label} onChange={(e) => handleHeroButtonChange(idx, 'label', e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Link URL</label>
                      <input type="text" value={btn.link} onChange={(e) => handleHeroButtonChange(idx, 'link', e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'formSection' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">Top Disclaimer & Form Settings</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Top Bar Disclaimer Text</label>
              <textarea value={data.formSection.disclaimer} onChange={(e) => setData({...data, formSection: {...data.formSection, disclaimer: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={2}></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Form Box Title</label>
              <input type="text" value={data.formSection.formTitle} onChange={(e) => setData({...data, formSection: {...data.formSection, formTitle: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Submit Button Text</label>
              <input type="text" value={data.formSection.buttonText} onChange={(e) => setData({...data, formSection: {...data.formSection, buttonText: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
            </div>
          </div>
        )}

        {activeTab === 'whyChooseUs' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">Why Choose Us Block</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Section Title</label>
                  <input type="text" value={data.whyChooseUs.title} onChange={(e) => setData({...data, whyChooseUs: {...data.whyChooseUs, title: e.target.value}})} className="w-full border rounded-lg px-4 py-2 font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bold Statistic Text (e.g. TRUSTED BY 1 MILLION)</label>
                  <textarea value={data.whyChooseUs.trustedText} onChange={(e) => setData({...data, whyChooseUs: {...data.whyChooseUs, trustedText: e.target.value}})} className="w-full border rounded-lg px-4 py-2 font-black" rows={2}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bullet Points (One per line)</label>
                  <textarea value={data.whyChooseUs.bullets} onChange={(e) => setData({...data, whyChooseUs: {...data.whyChooseUs, bullets: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={4}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Accompanying Image URL</label>
                  <input type="text" value={data.whyChooseUs.image} onChange={(e) => setData({...data, whyChooseUs: {...data.whyChooseUs, image: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image Preview</label>
                <img src={data.whyChooseUs.image} alt="Preview" className="w-full h-64 object-cover rounded-xl shadow-sm" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'foundersNote' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">Founders Note & Partner Logos</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Note Title (e.g. MADE BY Two Mothers)</label>
              <textarea value={data.foundersNote.title} onChange={(e) => setData({...data, foundersNote: {...data.foundersNote, title: e.target.value}})} className="w-full border rounded-lg px-4 py-2 font-bold" rows={2}></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Note Paragraph</label>
              <textarea value={data.foundersNote.text} onChange={(e) => setData({...data, foundersNote: {...data.foundersNote, text: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={4}></textarea>
            </div>
            
            <div className="pt-6 border-t mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Partner Logos Title</label>
              <input type="text" value={data.foundersNote.logosTitle} onChange={(e) => setData({...data, foundersNote: {...data.foundersNote, logosTitle: e.target.value}})} className="w-full border rounded-lg px-4 py-2 font-bold mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.foundersNote.logos.map((logo, idx) => (
                  <div key={logo.id} className="bg-gray-50 p-3 rounded-lg border">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Logo URL {idx + 1}</label>
                    <input type="text" value={logo.image} onChange={(e) => handleLogoChange(idx, e.target.value)} className="w-full border rounded px-2 py-1 text-sm mb-2" />
                    <div className="h-12 bg-white flex items-center justify-center p-2 rounded">
                      <img src={logo.image} alt={`Logo ${idx+1}`} className="max-h-full object-contain" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contactAssistance' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-bold text-brand-plum border-b pb-2 mb-6">Bottom Contact Assistance Block</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Main Title</label>
              <input type="text" value={data.contactAssistance.title} onChange={(e) => setData({...data, contactAssistance: {...data.contactAssistance, title: e.target.value}})} className="w-full border rounded-lg px-4 py-2 font-black text-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subtext Description</label>
              <textarea value={data.contactAssistance.text} onChange={(e) => setData({...data, contactAssistance: {...data.contactAssistance, text: e.target.value}})} className="w-full border rounded-lg px-4 py-2" rows={2}></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone / WhatsApp Number</label>
                <input type="text" value={data.contactAssistance.phone} onChange={(e) => setData({...data, contactAssistance: {...data.contactAssistance, phone: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input type="email" value={data.contactAssistance.email} onChange={(e) => setData({...data, contactAssistance: {...data.contactAssistance, email: e.target.value}})} className="w-full border rounded-lg px-4 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Chat Button Text</label>
              <input type="text" value={data.contactAssistance.buttonText} onChange={(e) => setData({...data, contactAssistance: {...data.contactAssistance, buttonText: e.target.value}})} className="w-full border rounded-lg px-4 py-2 w-1/2" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BulkOrdersManagement;
