import { useState, useEffect } from 'react';
import { FiSave, FiSettings, FiPlus, FiTrash2, FiMenu, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import axios from 'axios';
import authService from '../services/authService';

const Settings = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [clearing, setClearing] = useState(false);

  const handleClearTestData = async () => {
    if (!window.confirm("WARNING: This will permanently delete all orders, payments, and refunds from the database. Are you sure you want to proceed and reset to go live?")) {
      return;
    }
    
    setClearing(true);
    setMessage('');
    try {
      const config = { headers: { Authorization: `Bearer ${authService.getToken()}` } };
      await axios.delete((import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/admin/clear-test-data', config);
      setMessage('Test transaction data successfully cleared! Refreshing page...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Failed to clear test data:", error);
      setMessage('Failed to clear test data: ' + (error.response?.data?.message || error.message));
    } finally {
      setClearing(false);
    }
  };

  // Using the updated navItems as our default fallback
  const defaultLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'Deal of the Day', path: '/deals' },
    { name: 'Shop By Category', path: '/categories' },
    { name: 'For Your Family Combo', path: '/family-combos' },
    { name: 'Starting Floral Food Habitat', path: '/floral-habitat' },
    { name: 'BYOC', path: '/byoc' },
    { name: 'Our Community', path: '/community' },
    { name: 'Our Philosophy', path: '/philosophy' },
    { name: 'Bulk Orders', path: '/bulk-orders' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About Us', path: '/about' },
  ];

  const [navbarLinks, setNavbarLinks] = useState([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get((import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/settings');
      if (response.data && response.data.navbarLinks) {
        setNavbarLinks(response.data.navbarLinks);
      } else {
        setNavbarLinks(defaultLinks);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      setNavbarLinks(defaultLinks);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...navbarLinks];
    newLinks[index][field] = value;
    setNavbarLinks(newLinks);
  };

  const addLink = () => {
    setNavbarLinks([...navbarLinks, { name: '', path: '' }]);
  };

  const removeLink = (index) => {
    const newLinks = [...navbarLinks];
    newLinks.splice(index, 1);
    setNavbarLinks(newLinks);
  };

  const moveLink = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === navbarLinks.length - 1)) return;
    const newLinks = [...navbarLinks];
    const temp = newLinks[index];
    newLinks[index] = newLinks[index + direction];
    newLinks[index + direction] = temp;
    setNavbarLinks(newLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    // Filter out completely empty links
    const cleanedLinks = navbarLinks.filter(link => link.name.trim() !== '' || link.path.trim() !== '');

    try {
      await axios.put((import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/settings', {
        navbarLinks: cleanedLinks
      });
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair">Global Settings</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg font-medium text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
        
        <div className="border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-brand-plum/10 p-3 rounded-lg text-brand-plum">
              <FiMenu size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Navigation Menu</h2>
              <p className="text-gray-500 text-sm">Manage the links appearing in the top header</p>
            </div>
          </div>

          <div className="space-y-4">
            {navbarLinks.map((link, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-brand-plum/30 transition-colors">
                
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => moveLink(index, -1)} className="text-gray-400 hover:text-brand-plum disabled:opacity-30" disabled={index === 0}>
                    <FiChevronUp size={20} />
                  </button>
                  <button type="button" onClick={() => moveLink(index, 1)} className="text-gray-400 hover:text-brand-plum disabled:opacity-30" disabled={index === navbarLinks.length - 1}>
                    <FiChevronDown size={20} />
                  </button>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                    placeholder="e.g. Shop All"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none"
                    required
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">URL Path</label>
                  <input
                    type="text"
                    value={link.path}
                    onChange={(e) => handleLinkChange(index, 'path', e.target.value)}
                    placeholder="e.g. /shop"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum outline-none font-mono text-sm"
                    required
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="mt-5 p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Link"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addLink}
            className="mt-6 flex items-center justify-center gap-2 w-full border-2 border-dashed border-brand-plum/30 text-brand-plum font-semibold py-3 rounded-xl hover:bg-brand-plum/5 transition-colors"
          >
            <FiPlus /> Add New Menu Item
          </button>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-plum text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-plum/90 transition-all shadow-md disabled:opacity-70"
          >
            <FiSave size={20} />
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>

      </form>

      {/* Go Live / Danger Zone Card */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 p-3 rounded-lg text-red-600">
            <FiTrash2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Danger Zone (Go Live Reset)</h2>
            <p className="text-gray-500 text-sm">Clear test records before opening the store to real customers</p>
          </div>
        </div>

        <div className="border-t border-red-50 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">Clear Test Transactions</h4>
            <p className="text-gray-500 text-xs mt-0.5">Permanently deletes all Orders, Payments, and Refunds from the database.</p>
          </div>
          <button
            type="button"
            onClick={handleClearTestData}
            disabled={clearing}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors text-sm shadow-sm disabled:opacity-70"
          >
            {clearing ? 'Clearing Data...' : 'Clear Test Transactions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
