import { useState, useEffect } from 'react';
import { FiSearch, FiEdit2, FiX, FiCheck, FiGlobe, FiBox } from 'react-icons/fi';
import seoService from '../services/seoService';
import productService from '../services/productService';

const GLOBAL_PAGES = [
  { slug: 'home', name: 'Home Page' },
  { slug: 'shop', name: 'Shop All Page' },
  { slug: 'about', name: 'About Us' },
  { slug: 'contact', name: 'Contact Us' },
  { slug: 'blogs', name: 'Blogs Page' }
];

const SeoManagement = () => {
  const [activeTab, setActiveTab] = useState('global'); // 'global' or 'products'
  
  // Global SEO State
  const [globalSeo, setGlobalSeo] = useState([]);
  const [editingGlobal, setEditingGlobal] = useState(null);
  const [globalFormData, setGlobalFormData] = useState({ title: '', description: '', keywords: '' });
  
  // Products SEO State
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({ seoTitle: '', seoDescription: '' });

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
      setGlobalSeo(seoRes);
      setProducts(prodRes);
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

  // --- PRODUCT SEO HANDLERS ---
  const startEditProduct = (product) => {
    setProductFormData({ 
      seoTitle: product.seoTitle || '', 
      seoDescription: product.seoDescription || '',
      seoKeywords: product.seoKeywords || ''
    });
    setEditingProduct(product.id);
  };

  const saveProductSeo = async (productId) => {
    setSaving(true);
    try {
      // Create a partial update just for SEO
      const product = products.find(p => p.id === productId);
      await productService.updateProduct(productId, {
        ...product, // Need full product data for the update API, but we just override SEO fields
        seoTitle: productFormData.seoTitle,
        seoDescription: productFormData.seoDescription,
        seoKeywords: productFormData.seoKeywords
      });
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      alert("Failed to save Product SEO");
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-brand-plum text-center py-20">Loading SEO Data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
          <FiGlobe className="mr-3 text-brand-plum" /> SEO Management
        </h1>
      </div>

      {/* TABS */}
      <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 max-w-md">
        <button 
          onClick={() => setActiveTab('global')}
          className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'global' ? 'bg-brand-plum text-white shadow' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <FiGlobe className="mr-2" /> Global Pages
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'products' ? 'bg-brand-plum text-white shadow' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <FiBox className="mr-2" /> Products
        </button>
      </div>

      {/* TAB CONTENT: GLOBAL */}
      {activeTab === 'global' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs">
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
                    <td className="px-6 py-4 font-bold text-gray-800">{page.name} <span className="block text-xs text-gray-400 font-normal">/{page.slug}</span></td>
                    
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input type="text" className="w-full px-3 py-2 border border-brand-plum/30 rounded focus:outline-none focus:ring-1 focus:ring-brand-plum bg-white" placeholder="SEO Title" value={globalFormData.title} onChange={e => setGlobalFormData({...globalFormData, title: e.target.value})} />
                      ) : (
                        <div className="text-gray-600 truncate max-w-[200px]" title={seoData.title}>{seoData.title || <span className="text-red-400 italic">Not set</span>}</div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {isEditing ? (
                        <textarea rows="2" className="w-full px-3 py-2 border border-brand-plum/30 rounded focus:outline-none focus:ring-1 focus:ring-brand-plum bg-white text-xs" placeholder="SEO Description" value={globalFormData.description} onChange={e => setGlobalFormData({...globalFormData, description: e.target.value})}></textarea>
                      ) : (
                        <div className="text-gray-500 text-xs line-clamp-2" title={seoData.description}>{seoData.description || <span className="text-red-400 italic">Not set</span>}</div>
                      )}
                      
                      {isEditing && (
                        <input type="text" className="w-full px-3 py-2 mt-2 border border-brand-plum/30 rounded focus:outline-none focus:ring-1 focus:ring-brand-plum bg-white text-xs" placeholder="Keywords (comma separated)" value={globalFormData.keywords} onChange={e => setGlobalFormData({...globalFormData, keywords: e.target.value})} />
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => setEditingGlobal(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"><FiX size={18} /></button>
                          <button onClick={() => saveGlobalSeo(page.slug)} disabled={saving} className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"><FiCheck size={18} /></button>
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

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="relative w-72">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <div className="text-sm text-gray-500">{filteredProducts.length} Products</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 w-1/4">Product</th>
                  <th className="px-6 py-4 w-1/4">SEO Title</th>
                  <th className="px-6 py-4 w-1/3">SEO Description</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const isEditing = editingProduct === product.id;

                  return (
                    <tr key={product.id} className={`transition-colors ${isEditing ? 'bg-brand-plum/5' : 'hover:bg-gray-50/50'}`}>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        <div className="flex items-center space-x-3">
                          <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded shadow-sm" />
                          <span className="line-clamp-2">{product.name}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input type="text" className="w-full px-3 py-2 border border-brand-plum/30 rounded focus:outline-none focus:ring-1 focus:ring-brand-plum bg-white" placeholder="SEO Title" value={productFormData.seoTitle} onChange={e => setProductFormData({...productFormData, seoTitle: e.target.value})} />
                        ) : (
                          <div className="text-gray-600 truncate max-w-[200px]" title={product.seoTitle}>{product.seoTitle || <span className="text-red-400 italic">Not set</span>}</div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {isEditing ? (
                          <>
                            <textarea rows="2" className="w-full px-3 py-2 border border-brand-plum/30 rounded focus:outline-none focus:ring-1 focus:ring-brand-plum bg-white text-xs" placeholder="SEO Description" value={productFormData.seoDescription} onChange={e => setProductFormData({...productFormData, seoDescription: e.target.value})}></textarea>
                            <input type="text" className="w-full px-3 py-2 mt-2 border border-brand-plum/30 rounded focus:outline-none focus:ring-1 focus:ring-brand-plum bg-white text-xs" placeholder="Keywords (comma separated)" value={productFormData.seoKeywords} onChange={e => setProductFormData({...productFormData, seoKeywords: e.target.value})} />
                          </>
                        ) : (
                          <>
                            <div className="text-gray-500 text-xs line-clamp-2" title={product.seoDescription}>{product.seoDescription || <span className="text-red-400 italic">Not set</span>}</div>
                            {product.seoKeywords && <div className="text-gray-400 text-[10px] mt-1 truncate" title={product.seoKeywords}>Keywords: {product.seoKeywords}</div>}
                          </>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => setEditingProduct(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"><FiX size={18} /></button>
                            <button onClick={() => saveProductSeo(product.id)} disabled={saving} className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"><FiCheck size={18} /></button>
                          </div>
                        ) : (
                          <button onClick={() => startEditProduct(product)} className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><FiEdit2 size={18} /></button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoManagement;
