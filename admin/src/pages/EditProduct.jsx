import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../services/productService';
import { uploadImage, deleteImage } from '../utils/uploadImage';
import { FiSave, FiArrowLeft, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';

const categories = [
  'Bloom Cookies',
  'Bloom Powder',
  'Petal Jam',
  'Medley Teas',
  'Brew Flora',
  'Saffron',
  'Combos'
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('basic'); // basic, media, details, nutrition, faq

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    category: categories[0],
    price: '',
    offerPrice: '',
    stock: '',
    image: '',
    imagePath: '',
    images: [],
    newImageFiles: [],
    newImagePreviewUrls: [],
    imagesToDelete: [], // paths of images to delete
    tags: '',
    seoTitle: '',
    seoDescription: '',
    ingredients: '',
    benefits: [],
    highlights: [],
    nutritionInfo: { calories: '', protein: '', fat: '', carbs: '' },
    faqData: [],
    variants: []
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await productService.getProductById(id);
        setFormData({
          name: product.name || '',
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          category: product.category || categories[0],
          price: product.price || '',
          offerPrice: product.offerPrice || '',
          stock: product.stock || '',
          image: product.image || '',
          imagePath: product.imagePath || '',
          images: product.images || [], // { imageUrl, imagePath }
          newImageFiles: [],
          newImagePreviewUrls: [],
          imagesToDelete: [],
          tags: product.tags || '',
          seoTitle: product.seoTitle || '',
          seoDescription: product.seoDescription || '',
          ingredients: product.ingredients || '',
          benefits: product.benefits || [],
          highlights: product.highlights || [],
          nutritionInfo: product.nutritionInfo || { calories: '', protein: '', fat: '', carbs: '' },
          faqData: product.faqData || [],
          variants: product.variants ? (typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants) : []
        });
      } catch (error) {
        console.error("Failed to load product", error);
        alert("Failed to load product data");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNutritionChange = (e) => {
    setFormData({
      ...formData,
      nutritionInfo: { ...formData.nutritionInfo, [e.target.name]: e.target.value }
    });
  };

  const handleArrayAdd = (field) => {
    if (field === 'faqData') {
      setFormData({ ...formData, faqData: [...formData.faqData, { question: '', answer: '' }] });
    } else {
      setFormData({ ...formData, [field]: [...formData[field], ''] });
    }
  };

  const handleArrayChange = (field, index, value, key = null) => {
    const newArray = [...formData[field]];
    if (key) {
      newArray[index][key] = value;
    } else {
      newArray[index] = value;
    }
    setFormData({ ...formData, [field]: newArray });
  };

  const handleArrayRemove = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleVariantAdd = () => {
    setFormData({ ...formData, variants: [...formData.variants, { size: '', price: '', offerPrice: '', stock: '' }] });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleVariantRemove = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const urls = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        newImageFiles: [...prev.newImageFiles, ...files],
        newImagePreviewUrls: [...prev.newImagePreviewUrls, ...urls]
      }));
    }
  };

  const removeNewImage = (index) => {
    setFormData(prev => {
      const newFiles = [...prev.newImageFiles];
      const newUrls = [...prev.newImagePreviewUrls];
      newFiles.splice(index, 1);
      newUrls.splice(index, 1);
      return { ...prev, newImageFiles: newFiles, newImagePreviewUrls: newUrls };
    });
  };

  const removeOldImage = (index) => {
    setFormData(prev => {
      const remainingImages = [...prev.images];
      const removed = remainingImages.splice(index, 1)[0];
      const toDelete = [...prev.imagesToDelete];
      if (removed.imagePath) toDelete.push(removed.imagePath);
      
      // If we remove the primary image (index 0 usually), clear it if needed
      // Actually, image is stored directly. 
      return { ...prev, images: remainingImages, imagesToDelete: toDelete };
    });
  };

  const removePrimaryOldImage = () => {
    setFormData(prev => {
      const toDelete = [...prev.imagesToDelete];
      if (prev.imagePath) toDelete.push(prev.imagePath);
      return { ...prev, image: '', imagePath: '', imagesToDelete: toDelete };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Delete old images from Supabase
      for (const path of formData.imagesToDelete) {
        await deleteImage(path);
      }

      // 2. Upload new images
      let uploadedPrimaryImage = formData.image;
      let uploadedPrimaryImagePath = formData.imagePath;
      const uploadedProductImages = [...formData.images]; // keep remaining old ones

      for (let i = 0; i < formData.newImageFiles.length; i++) {
        const file = formData.newImageFiles[i];
        const { publicUrl, imagePath, error } = await uploadImage(file, 'products');
        
        if (error) throw new Error(`Upload failed for ${file.name}: ${error}`);

        // If no primary image exists, make the first new image the primary
        if (!uploadedPrimaryImage) {
          uploadedPrimaryImage = publicUrl;
          uploadedPrimaryImagePath = imagePath;
        } else {
          uploadedProductImages.push({
            imageUrl: publicUrl,
            imagePath: imagePath
          });
        }
      }

      const payload = {
        ...formData,
        image: uploadedPrimaryImage,
        imagePath: uploadedPrimaryImagePath,
        productImages: uploadedProductImages
      };

      delete payload.newImageFiles;
      delete payload.newImagePreviewUrls;
      delete payload.imagesToDelete;
      delete payload.images;

      await productService.updateProduct(id, payload);
      alert('Product updated successfully!');
      navigate('/products');
    } catch (error) {
      console.error(error);
      alert('Failed to update product: ' + (error.message || 'Check console for errors.'));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-20 text-brand-plum">Loading product data...</div>;
  }

  const TabButton = ({ id, label }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
        activeTab === id ? 'border-brand-plum text-brand-plum' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair">Edit Premium Product</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
          <TabButton id="basic" label="Basic Info & Pricing" />
          <TabButton id="media" label="Media & Gallery" />
          <TabButton id="details" label="Ingredients & Highlights" />
          <TabButton id="nutrition" label="Nutrition" />
          <TabButton id="faq" label="FAQs & SEO" />
        </div>

        <div className="p-8">
          
          {/* TAB: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Product Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 outline-none bg-white">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Offer Price (₹)</label>
                  <input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Stock Quantity *</label>
                  <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 outline-none" />
                </div>
              </div>

              {/* Variants Section */}
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Product Options / Variations</h3>
                    <p className="text-xs text-gray-500">Optional. Add different options (Combos, Sizes, Weights) with independent pricing.</p>
                  </div>
                  <button type="button" onClick={handleVariantAdd} className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-brand-plum font-medium flex items-center hover:bg-gray-50">
                    <FiPlus className="mr-1"/> Add Variant
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.variants.map((v, idx) => (
                    <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-white p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1 min-w-[120px]">
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Option Name (e.g. 30g, Combo 1)</label>
                        <input type="text" value={v.size} onChange={(e) => handleVariantChange(idx, 'size', e.target.value)} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm" placeholder="Enter Option Name (e.g. 1G Super Negin)" />
                      </div>
                      <div className="flex-1 min-w-[100px]">
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Price</label>
                        <input type="number" value={v.price} onChange={(e) => handleVariantChange(idx, 'price', e.target.value)} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm" placeholder="₹" />
                      </div>
                      <div className="flex-1 min-w-[100px]">
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Offer Price</label>
                        <input type="number" value={v.offerPrice} onChange={(e) => handleVariantChange(idx, 'offerPrice', e.target.value)} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm" placeholder="₹" />
                      </div>
                      <div className="flex-1 min-w-[100px]">
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Stock</label>
                        <input type="number" value={v.stock} onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm" placeholder="Qty" />
                      </div>
                      <button type="button" onClick={() => handleVariantRemove(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded mt-4">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Short Description (2-3 lines) *</label>
                <textarea name="shortDescription" required rows="2" value={formData.shortDescription} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 outline-none"></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Detailed Description *</label>
                <textarea name="description" required rows="6" value={formData.description} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-plum/20 outline-none"></textarea>
              </div>

              {/* Placement Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Feature on Pages</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Home Page</h3>
                    {['home_page', 'bestseller', 'new_launch'].map(tag => (
                      <label key={tag} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.tags.includes(tag)} onChange={(e) => {
                            let tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t !== tag && t !== '');
                            if (e.target.checked) tagsArray.push(tag);
                            setFormData({ ...formData, tags: tagsArray.join(', ') });
                          }} className="w-4 h-4 text-brand-plum" />
                        <span className="text-sm text-gray-700">{tag.replace('_', ' ').toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Special Pages</h3>
                    {['shop_all', 'deal_of_the_day', 'family_combos', 'floral_habitat', 'byoc'].map(tag => (
                      <label key={tag} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.tags.includes(tag)} onChange={(e) => {
                            let tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t !== tag && t !== '');
                            if (e.target.checked) tagsArray.push(tag);
                            setFormData({ ...formData, tags: tagsArray.join(', ') });
                          }} className="w-4 h-4 text-brand-plum" />
                        <span className="text-sm text-gray-700">{tag.replace(/_/g, ' ').toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700 block">Product Images *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                  <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Drag and drop images here, or click to select files</p>
                  <p className="text-xs text-gray-500 mb-4">PNG, JPG, WebP up to 5MB</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    Select New Images
                  </label>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Existing Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {formData.image && (
                      <div className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                        <img src={formData.image} alt="Primary" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={removePrimaryOldImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                        >
                          <FiTrash2 size={14} />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-brand-plum text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
                          Primary
                        </span>
                      </div>
                    )}
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                        <img src={img.imageUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeOldImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.newImagePreviewUrls.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-brand-plum mb-3">Newly Added Images (Unsaved)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {formData.newImagePreviewUrls.map((url, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-brand-plum/20 border-2 aspect-square">
                          <img src={url} alt={`New Preview ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                          >
                            <FiTrash2 size={14} />
                          </button>
                          {(!formData.image && idx === 0) && (
                            <span className="absolute bottom-2 left-2 bg-brand-plum text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
                              Will be Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ingredients Description</label>
                <textarea name="ingredients" rows="4" value={formData.ingredients} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none" placeholder="e.g. Pearl Millet, Finger Millet, Country Jaggery..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Highlights */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Product Highlights</label>
                    <button type="button" onClick={() => handleArrayAdd('highlights')} className="text-sm text-brand-plum font-medium flex items-center">
                      <FiPlus className="mr-1"/> Add
                    </button>
                  </div>
                  {formData.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="text" value={item} onChange={(e) => handleArrayChange('highlights', idx, e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-4 py-2 outline-none" placeholder="e.g. Handmade" />
                      <button type="button" onClick={() => handleArrayRemove('highlights', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                    </div>
                  ))}
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Benefits</label>
                    <button type="button" onClick={() => handleArrayAdd('benefits')} className="text-sm text-brand-plum font-medium flex items-center">
                      <FiPlus className="mr-1"/> Add
                    </button>
                  </div>
                  {formData.benefits.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="text" value={item} onChange={(e) => handleArrayChange('benefits', idx, e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-4 py-2 outline-none" placeholder="e.g. Rich Floral Flavor" />
                      <button type="button" onClick={() => handleArrayRemove('benefits', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: NUTRITION */}
          {activeTab === 'nutrition' && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-gray-500">Provide nutritional information per 100g.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Calories (kcal)</label>
                  <input type="text" name="calories" value={formData.nutritionInfo.calories} onChange={handleNutritionChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none" placeholder="e.g. 450" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Protein (g)</label>
                  <input type="text" name="protein" value={formData.nutritionInfo.protein} onChange={handleNutritionChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none" placeholder="e.g. 12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Fat (g)</label>
                  <input type="text" name="fat" value={formData.nutritionInfo.fat} onChange={handleNutritionChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none" placeholder="e.g. 15" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Carbohydrates (g)</label>
                  <input type="text" name="carbs" value={formData.nutritionInfo.carbs} onChange={handleNutritionChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none" placeholder="e.g. 60" />
                </div>
              </div>
            </div>
          )}

          {/* TAB: FAQ & SEO */}
          {activeTab === 'faq' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Frequently Asked Questions</label>
                  <button type="button" onClick={() => handleArrayAdd('faqData')} className="text-sm text-brand-plum font-medium flex items-center">
                    <FiPlus className="mr-1"/> Add FAQ
                  </button>
                </div>
                {formData.faqData.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex-1 space-y-3">
                      <input type="text" value={item.question} onChange={(e) => handleArrayChange('faqData', idx, e.target.value, 'question')} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none" placeholder="Question..." />
                      <textarea value={item.answer} onChange={(e) => handleArrayChange('faqData', idx, e.target.value, 'answer')} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none" placeholder="Answer..." rows="2"></textarea>
                    </div>
                    <button type="button" onClick={() => handleArrayRemove('faqData', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-1"><FiTrash2 /></button>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">SEO Title</label>
                  <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">SEO Description</label>
                  <input type="text" name="seoDescription" value={formData.seoDescription} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none" />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Submit Button Sticky Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button type="submit" disabled={loading} className="flex items-center space-x-2 bg-brand-plum text-white px-8 py-3 rounded-lg hover:bg-brand-plum/90 transition-colors shadow-md font-medium">
            <FiSave />
            <span>{loading ? 'Saving...' : 'Update Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
