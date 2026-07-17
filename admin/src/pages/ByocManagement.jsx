import { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiTag, FiLayout } from 'react-icons/fi';
import axios from 'axios';

const defaultData = {
  tiers: [
    { id: 1, items: 3, price: 900 },
    { id: 2, items: 4, price: 1200 },
    { id: 3, items: 5, price: 1500 }
  ],
  title: 'BUILD YOUR OWN COMBO',
  tagline: 'SINGLE & COMBO PACKS INCLUDED!'
};

const ByocManagement = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings');
      if (response.data && response.data.byocData) {
        setData({ ...defaultData, ...response.data.byocData });
      }
    } catch (error) {
      console.error("Failed to load BYOC data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...data.tiers];
    newTiers[index] = { ...newTiers[index], [field]: Number(value) };
    setData({ ...data, tiers: newTiers });
  };

  const addTier = () => {
    const newId = data.tiers.length > 0 ? Math.max(...data.tiers.map(t => t.id)) + 1 : 1;
    setData({
      ...data,
      tiers: [...data.tiers, { id: newId, items: 3, price: 1000 }]
    });
  };

  const removeTier = (index) => {
    const newTiers = [...data.tiers];
    newTiers.splice(index, 1);
    setData({ ...data, tiers: newTiers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      // Sort tiers by item count to ensure logic works perfectly on the frontend
      const sortedData = {
        ...data,
        tiers: [...data.tiers].sort((a, b) => a.items - b.items)
      };

      await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings', {
        byocData: sortedData
      });
      setMessage('BYOC Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      setData(sortedData);
    } catch (error) {
      console.error("Failed to save data:", error);
      setMessage('Failed to save data. Please check logs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading BYOC Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair">Build Your Own Combo (BYOC)</h1>
          <p className="text-sm text-gray-500 mt-1">Configure pricing tiers and bundle rules.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg font-medium text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Instructions Card */}
      <div className="bg-brand-plum/10 border border-brand-plum/20 rounded-xl p-6 flex gap-4">
        <div className="text-brand-plum mt-1"><FiTag size={24} /></div>
        <div>
          <h3 className="font-bold text-brand-plum mb-1">How to add products to the BYOC page</h3>
          <p className="text-sm text-brand-plum/80 leading-relaxed">
            To make a product appear on the customer's "Build Your Own Combo" page, simply edit that product in the <b>Products</b> tab and add the tag <b><code>BYOC</code></b> to its "Other Tags" field. It will automatically show up in the bundle builder!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* TEXT CONTENT */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="bg-brand-plum/10 p-2 rounded-lg text-brand-plum">
              <FiLayout size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Banner Text Content</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Main Title</label>
              <input 
                type="text" 
                value={data.title}
                onChange={(e) => setData({...data, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tagline (Right side text)</label>
              <input 
                type="text" 
                value={data.tagline}
                onChange={(e) => setData({...data, tagline: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none"
              />
            </div>
          </div>
        </div>

        {/* PRICING TIERS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-brand-plum/10 p-2 rounded-lg text-brand-plum">
                <FiTag size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Pricing Tiers</h2>
            </div>
            <button type="button" onClick={addTier} className="flex items-center gap-2 text-brand-plum font-semibold hover:bg-brand-plum/5 px-4 py-2 rounded-lg transition-colors text-sm">
              <FiPlus /> Add Tier
            </button>
          </div>

          <div className="space-y-4">
            {data.tiers.map((tier, index) => (
              <div key={tier.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Required Items</label>
                  <input 
                    type="number" 
                    min="2"
                    value={tier.items}
                    onChange={(e) => handleTierChange(index, 'items', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none"
                  />
                </div>
                <div className="flex items-center pt-5 text-gray-400 font-bold">for</div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Fixed Combo Price (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={tier.price}
                    onChange={(e) => handleTierChange(index, 'price', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none"
                  />
                </div>
                
                {data.tiers.length > 1 && (
                  <button type="button" onClick={() => removeTier(index)} className="mt-5 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <FiTrash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 italic">
            * The system will automatically use the highest tier the customer qualifies for.
          </p>
        </div>

        <div className="flex justify-end sticky bottom-6 z-20">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-plum text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-plum/90 transition-all shadow-xl disabled:opacity-70 text-lg"
          >
            <FiSave size={24} />
            {saving ? 'Saving...' : 'Save BYOC Settings'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ByocManagement;
