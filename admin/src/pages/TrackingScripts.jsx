import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSave, FiCheck, FiPlus, FiTrash2, FiActivity } from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api/tracking';

const TrackingScripts = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for predefined forms
  const [ga4Id, setGa4Id] = useState('');
  const [ga4Active, setGa4Active] = useState(false);
  const [gtmId, setGtmId] = useState('');
  const [gtmActive, setGtmActive] = useState(false);
  const [pixelId, setPixelId] = useState('');
  const [pixelActive, setPixelActive] = useState(false);

  // State for Custom Scripts
  const [customScripts, setCustomScripts] = useState([]);
  const [newCustom, setNewCustom] = useState({ name: '', placement: 'HEAD', code: '', isActive: true });
  const [showCustomForm, setShowCustomForm] = useState(false);

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      const data = res.data;
      setScripts(data);

      // Populate predefined forms
      const ga4 = data.find(s => s.provider === 'GA4');
      if (ga4) {
        setGa4Id(ga4.settings?.measurementId || '');
        setGa4Active(ga4.isActive);
      }

      const gtm = data.find(s => s.provider === 'GTM_HEAD'); // We use GTM_HEAD and GTM_BODY
      if (gtm) {
        setGtmId(gtm.settings?.containerId || '');
        setGtmActive(gtm.isActive);
      }

      const pixel = data.find(s => s.provider === 'META_PIXEL');
      if (pixel) {
        setPixelId(pixel.settings?.pixelId || '');
        setPixelActive(pixel.isActive);
      }

      setCustomScripts(data.filter(s => s.provider === 'CUSTOM'));
    } catch (error) {
      console.error(error);
      alert("Failed to fetch tracking scripts");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGA4 = async () => {
    try {
      const code = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${ga4Id}');
      `;
      // We also need the external script tag for GA4, but since we are injecting dynamically:
      // The injector will create a script with src="https://www.googletagmanager.com/gtag/js?id=${ga4Id}"
      // So we can save that info in settings.
      await axios.post(API_URL, {
        name: 'Google Analytics 4',
        provider: 'GA4',
        placement: 'HEAD',
        code: code,
        settings: { measurementId: ga4Id },
        isActive: ga4Active
      });
      alert('GA4 Settings Saved!');
      fetchScripts();
    } catch (error) {
      alert('Failed to save GA4');
    }
  };

  const handleSaveGTM = async () => {
    try {
      // Save GTM Head
      const headCode = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      await axios.post(API_URL, {
        name: 'GTM Head',
        provider: 'GTM_HEAD',
        placement: 'HEAD',
        code: headCode,
        settings: { containerId: gtmId },
        isActive: gtmActive
      });

      // Save GTM Body
      const bodyCode = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      await axios.post(API_URL, {
        name: 'GTM NoScript',
        provider: 'GTM_BODY',
        placement: 'BODY_START',
        code: bodyCode,
        settings: { containerId: gtmId },
        isActive: gtmActive
      });

      alert('GTM Settings Saved!');
      fetchScripts();
    } catch (error) {
      alert('Failed to save GTM');
    }
  };

  const handleSavePixel = async () => {
    try {
      const code = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `;
      await axios.post(API_URL, {
        name: 'Meta Pixel',
        provider: 'META_PIXEL',
        placement: 'HEAD',
        code: code,
        settings: { pixelId: pixelId },
        isActive: pixelActive
      });
      alert('Meta Pixel Saved!');
      fetchScripts();
    } catch (error) {
      alert('Failed to save Meta Pixel');
    }
  };

  const handleAddCustom = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        ...newCustom,
        provider: 'CUSTOM'
      });
      setNewCustom({ name: '', placement: 'HEAD', code: '', isActive: true });
      setShowCustomForm(false);
      alert('Custom Script Added!');
      fetchScripts();
    } catch (error) {
      alert('Failed to add custom script');
    }
  };

  const handleDeleteScript = async (id) => {
    if (!window.confirm("Delete this script?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchScripts();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const toggleCustomScript = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/${id}/toggle`, { isActive: !currentStatus });
      fetchScripts();
    } catch (error) {
      alert("Failed to toggle");
    }
  };

  if (loading) return <div className="p-8 font-bold text-brand-plum">Loading Tracking Manager...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex items-center space-x-3">
        <FiActivity className="text-3xl text-brand-plum" />
        <h1 className="text-2xl font-bold text-gray-800 font-playfair">Tracking Codes & Snippets</h1>
      </div>
      <p className="text-gray-500">Manage all marketing pixels and analytics scripts dynamically without altering source code.</p>

      {/* Google Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center">
            <img src="https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg" alt="GA" className="w-5 h-5 mr-2" />
            Google Analytics 4
          </h2>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={ga4Active} onChange={() => setGa4Active(!ga4Active)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${ga4Active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${ga4Active ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">{ga4Active ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">GA4 Measurement ID (e.g., G-XXXXXXX)</label>
          <div className="flex space-x-4">
            <input 
              type="text" 
              value={ga4Id} 
              onChange={(e) => setGa4Id(e.target.value)}
              placeholder="G-"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-plum focus:border-brand-plum"
            />
            <button onClick={handleSaveGA4} className="bg-brand-plum text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-plum/90 transition flex items-center">
              <FiSave className="mr-2" /> Save
            </button>
          </div>
        </div>
      </div>

      {/* Google Tag Manager */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center">
            <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded text-xs mr-2 font-bold">G</span>
            Google Tag Manager
          </h2>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={gtmActive} onChange={() => setGtmActive(!gtmActive)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${gtmActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${gtmActive ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">{gtmActive ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>
        <div className="p-6">
          <p className="text-xs text-gray-500 mb-4">Automatically injects the standard Head script and the Body NoScript iframe.</p>
          <label className="block text-sm font-medium text-gray-700 mb-2">GTM Container ID (e.g., GTM-XXXXXXX)</label>
          <div className="flex space-x-4">
            <input 
              type="text" 
              value={gtmId} 
              onChange={(e) => setGtmId(e.target.value)}
              placeholder="GTM-"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-plum focus:border-brand-plum"
            />
            <button onClick={handleSaveGTM} className="bg-brand-plum text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-plum/90 transition flex items-center">
              <FiSave className="mr-2" /> Save
            </button>
          </div>
        </div>
      </div>

      {/* Meta Pixel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center">
            <span className="text-blue-600 font-bold text-lg mr-2">∞</span>
            Meta Pixel
          </h2>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={pixelActive} onChange={() => setPixelActive(!pixelActive)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${pixelActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${pixelActive ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">{pixelActive ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pixel ID</label>
          <div className="flex space-x-4">
            <input 
              type="text" 
              value={pixelId} 
              onChange={(e) => setPixelId(e.target.value)}
              placeholder="xxxxxxxxxxxxxx"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-plum focus:border-brand-plum"
            />
            <button onClick={handleSavePixel} className="bg-brand-plum text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-plum/90 transition flex items-center">
              <FiSave className="mr-2" /> Save
            </button>
          </div>
        </div>
      </div>

      {/* Custom Snippets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">Custom Scripts & Verification Tags</h2>
          <button 
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="flex items-center text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded transition"
          >
            <FiPlus className="mr-1" /> Add Custom Script
          </button>
        </div>

        {showCustomForm && (
          <form onSubmit={handleAddCustom} className="p-6 bg-brand-cream/30 border-b border-gray-200 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Snippet Name</label>
                <input required type="text" value={newCustom.name} onChange={e => setNewCustom({...newCustom, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-brand-plum focus:border-brand-plum" placeholder="e.g. Microsoft Clarity" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                <select value={newCustom.placement} onChange={e => setNewCustom({...newCustom, placement: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-brand-plum focus:border-brand-plum">
                  <option value="HEAD">Head &lt;head&gt;</option>
                  <option value="BODY_START">Body Start &lt;body&gt;</option>
                  <option value="BODY_END">Body End &lt;/body&gt;</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Script Content (HTML/JS)</label>
              <textarea required value={newCustom.code} onChange={e => setNewCustom({...newCustom, code: e.target.value})} rows="5" className="w-full font-mono text-sm px-3 py-2 border border-gray-300 rounded focus:ring-brand-plum focus:border-brand-plum" placeholder="<script>...</script>"></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setShowCustomForm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
              <button type="submit" className="bg-brand-plum text-white px-6 py-2 rounded hover:bg-brand-plum/90 font-medium flex items-center">
                <FiSave className="mr-2" /> Save Snippet
              </button>
            </div>
          </form>
        )}

        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-gray-100 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Placement</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customScripts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No custom scripts added yet.</td>
                </tr>
              ) : (
                customScripts.map(script => (
                  <tr key={script.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{script.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono">{script.placement}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleCustomScript(script.id, script.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition ${script.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
                      >
                        {script.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteScript(script.id)} className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition">
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrackingScripts;
