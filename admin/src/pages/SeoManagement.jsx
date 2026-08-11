import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiGlobe, FiBox, FiSearch, FiEdit2, FiX, FiCheck, FiSliders } from 'react-icons/fi';
import seoService from '../services/seoService';
import productService from '../services/productService';
import ProductSeoManager from '../components/ProductSeoManager';

const GLOBAL_PAGES = [
  { slug: 'home', name: 'Home Page' },
  { slug: 'shop', name: 'Shop All Page' },
  { slug: 'about', name: 'About Us' },
  { slug: 'contact', name: 'Contact Us' },
  { slug: 'blogs', name: 'Blogs Page' }
];

const SeoManagement = () => {
  const [searchParams] = useSearchParams();
  const initialProductId = searchParams.get('productId');

  const [activeTab, setActiveTab] = useState(initialProductId ? 'product' : 'product'); // 'product' or 'global'
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(initialProductId ? parseInt(initialProductId) : null);
  const [searchTerm, setSearchTerm] = useState('');

  // Global SEO State
  const [globalSeo, setGlobalSeo] = useState([]);
  const [editingGlobal, setEditingGlobal] = useState(null);
  const [globalFormData, setGlobalFormData] = useState({ title: '', description: '', keywords: '' });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [seoRes, prodRes] = await Promise.all([
        seoService.getGlobalSeo(),
        productService.getProducts()
      ]);
      setGlobalSeo(seoRes || []);
      const productList = prodRes || [];
      setProducts(productList);
      
      if (!selectedProductId && productList.length > 0) {
        setSelectedProductId(productList[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch SEO data", error);
    } finally {
      setLoading(false);
    }
  };

  // --- GLOBAL SEO HANDLERS ---
  const getSeoForSlug = (slug) => {
    return globalSeo.find(s => s.pageSlug === slug) || { title: '', description: '', keywords: '' };
  };

  const startEditGlobal = (slug) => {
    const data = getSeoForSlug(slug);
    setGlobalFormData({ title: data.title, description: data.description, keywords: data.keywords || '' });
    setEditingGlobal(slug);
  };

  const saveGlobalSeo = async (slug) => {
    setSaving(true);
    try {
      await seoService.updateSeoBySlug(slug, globalFormData);
      setEditingGlobal(null);
      fetchData();
    } catch (error) {
      alert("Failed to save SEO data");
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeProduct = products.find(p => p.id === selectedProductId);

  if (loading) {
    return <div className="text-brand-plum font-bold text-center py-20">Loading SEO Suite...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center gap-2">
            <FiGlobe className="text-brand-plum" /> SEO Management Suite
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage permanent search engine optimizations, schema, keywords, and metadata across all products & static pages.
          </p>
        </div>

        {/* MAIN TAB SWITCHER */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl text-xs font-bold self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('product')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'product' ? 'bg-brand-plum text-white shadow' : 'text-gray-600 hover:text-brand-plum'
            }`}
          >
            <FiBox size={14} /> Product SEO Module
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'global' ? 'bg-brand-plum text-white shadow' : 'text-gray-600 hover:text-brand-plum'
            }`}
          >
            <FiGlobe size={14} /> Static Pages SEO
          </button>
        </div>
      </div>

      {/* TABS CONTENT */}
      {activeTab === 'product' && (
        <div className="space-y-6">
          {/* PRODUCT SELECTOR BAR */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Select Product:
              </span>
              <select
                className="w-full md:w-80 px-4 py-2 border border-gray-200 rounded-xl focus:border-brand-plum focus:ring-1 focus:ring-brand-plum outline-none text-sm font-semibold bg-gray-50"
                value={selectedProductId || ''}
                onChange={e => setSelectedProductId(parseInt(e.target.value))}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category || 'Uncategorized'})
                  </option>
                ))}
              </select>
            </div>

            {activeProduct && (
              <div className="text-xs text-gray-500 flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-2 md:pt-0 md:pl-4 w-full md:w-auto justify-between md:justify-start">
                <span>Slug: <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-brand-plum">{activeProduct.slug}</code></span>
                <span>Price: <strong>₹{activeProduct.price}</strong></span>
              </div>
            )}
          </div>

          {/* PRODUCT SEO MANAGER SUITE */}
          {selectedProductId ? (
            <ProductSeoManager key={selectedProductId} productId={selectedProductId} initialProduct={activeProduct} />
          ) : (
            <div className="bg-white p-12 rounded-2xl text-center text-gray-400 font-medium">
              Please select a product above to configure SEO settings.
            </div>
          )}
        </div>
      )}

      {activeTab === 'global' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm">Static Page Meta Tags</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 w-1/4">Page</th>
                <th className="px-6 py-4 w-1/4">Meta Title</th>
                <th className="px-6 py-4 w-1/3">Meta Description</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {GLOBAL_PAGES.map((page) => {
                const isEditing = editingGlobal === page.slug;
                const seoData = getSeoForSlug(page.slug);

                return (
                  <tr key={page.slug} className={`transition-colors ${isEditing ? 'bg-brand-plum/5' : 'hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {page.name} 
                      <span className="block text-xs text-gray-400 font-normal font-mono">/{page.slug}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-brand-plum/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-plum bg-white text-xs"
                          placeholder="SEO Title"
                          value={globalFormData.title}
                          onChange={e => setGlobalFormData({...globalFormData, title: e.target.value})}
                        />
                      ) : (
                        <div className="text-gray-600 text-xs font-semibold truncate max-w-[200px]" title={seoData.title}>
                          {seoData.title || <span className="text-rose-400 italic">Not set</span>}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            rows="2"
                            className="w-full px-3 py-2 border border-brand-plum/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-plum bg-white text-xs"
                            placeholder="SEO Description"
                            value={globalFormData.description}
                            onChange={e => setGlobalFormData({...globalFormData, description: e.target.value})}
                          ></textarea>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-brand-plum/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-plum bg-white text-xs"
                            placeholder="Keywords (comma separated)"
                            value={globalFormData.keywords}
                            onChange={e => setGlobalFormData({...globalFormData, keywords: e.target.value})}
                          />
                        </div>
                      ) : (
                        <div className="text-gray-500 text-xs line-clamp-2" title={seoData.description}>
                          {seoData.description || <span className="text-rose-400 italic">Not set</span>}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => setEditingGlobal(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"><FiX size={18} /></button>
                          <button onClick={() => saveGlobalSeo(page.slug)} disabled={saving} className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"><FiCheck size={18} /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEditGlobal(page.slug)} className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><FiEdit2 size={18} /></button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SeoManagement;
