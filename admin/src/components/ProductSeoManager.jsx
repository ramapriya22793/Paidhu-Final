import React, { useState, useEffect } from 'react';
import { 
  FiGlobe, FiCheckCircle, FiAlertTriangle, FiXCircle, FiSave, FiRefreshCw, 
  FiEye, FiPlus, FiTrash2, FiArrowUp, FiArrowDown, FiSearch, FiCheck, FiX, 
  FiLink, FiImage, FiFileText, FiCode, FiHelpCircle, FiBarChart2, FiCopy, FiExternalLink
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import seoService from '../services/seoService';

const ProductSeoManager = ({ productId, initialProduct, onSaveSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [product, setProduct] = useState(initialProduct || null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugStatus, setSlugStatus] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' or 'mobile'
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'basic', 'content', 'media', 'advanced'
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditResults, setAuditResults] = useState(null);

  // Form Fields State
  const [seo, setSeo] = useState({
    primaryKeyword: '',
    secondaryKeywords: [],
    seoFriendlyPageTitle: '',
    seoTitle: '',
    metaDescription: '',
    seoSlug: '',
    seoProductDescription: '',
    internalLinks: [],
    imageSeo: [],
    productSchema: null,
    faqs: [],
    canonicalUrl: '',
    robotsIndex: 'index',
    robotsFollow: 'follow',
    seoScore: 0
  });

  const [keywordPlacement, setKeywordPlacement] = useState([]);
  const [newSecondaryKw, setNewSecondaryKw] = useState('');
  const [schemaJsonText, setSchemaJsonText] = useState('');
  const [schemaValid, setSchemaValid] = useState(true);

  // Load SEO data for given productId
  useEffect(() => {
    if (productId) {
      fetchSeoData(productId);
    }
  }, [productId]);

  const fetchSeoData = async (id) => {
    setLoading(true);
    try {
      const data = await seoService.getProductSeo(id);
      if (data && data.seo) {
        setSeo(data.seo);
        setKeywordPlacement(data.keywordPlacement || []);
        if (data.product) {
          setProduct(data.product);
        }
        if (data.seo.productSchema) {
          setSchemaJsonText(JSON.stringify(data.seo.productSchema, null, 2));
        }
      }
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to load SEO data:", error);
      toast.error("Failed to load product SEO data");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setSeo(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  // --- SECONDARY KEYWORDS ---
  const addSecondaryKeyword = () => {
    const kw = newSecondaryKw.trim();
    if (kw && !seo.secondaryKeywords.includes(kw)) {
      handleFieldChange('secondaryKeywords', [...seo.secondaryKeywords, kw]);
      setNewSecondaryKw('');
    }
  };

  const removeSecondaryKeyword = (index) => {
    const updated = seo.secondaryKeywords.filter((_, i) => i !== index);
    handleFieldChange('secondaryKeywords', updated);
  };

  // --- AUTO-GENERATE SLUG ---
  const handleAutoGenerateSlug = () => {
    const source = seo.seoFriendlyPageTitle || seo.seoTitle || product?.name || '';
    const generated = source
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    handleFieldChange('seoSlug', generated);
  };

  const handleCheckSlug = async () => {
    if (!seo.seoSlug) return;
    setSlugChecking(true);
    try {
      const res = await seoService.checkSlugAvailability(seo.seoSlug, productId);
      setSlugStatus(res);
      if (res.isAvailable) {
        toast.success("Slug is unique & available!");
      } else {
        toast.warn(res.message);
      }
    } catch (e) {
      toast.error("Slug check failed");
    } finally {
      setSlugChecking(false);
    }
  };

  // --- INTERNAL LINKS ---
  const addInternalLink = () => {
    const newLink = {
      anchorText: 'Buy Edible Flowers',
      targetType: 'category',
      targetId: 'combos',
      url: '/shop?category=Combos'
    };
    handleFieldChange('internalLinks', [...seo.internalLinks, newLink]);
  };

  const updateInternalLink = (index, key, val) => {
    const updated = [...seo.internalLinks];
    updated[index][key] = val;
    handleFieldChange('internalLinks', updated);
  };

  const removeInternalLink = (index) => {
    const updated = seo.internalLinks.filter((_, i) => i !== index);
    handleFieldChange('internalLinks', updated);
  };

  // --- IMAGE SEO ---
  const updateImageSeo = (index, key, val) => {
    const updated = [...seo.imageSeo];
    updated[index][key] = val;
    handleFieldChange('imageSeo', updated);
  };

  // --- FAQS ---
  const addFaq = () => {
    const newFaq = {
      question: '',
      answer: '',
      order: seo.faqs.length + 1
    };
    handleFieldChange('faqs', [...seo.faqs, newFaq]);
  };

  const updateFaq = (index, key, val) => {
    const updated = [...seo.faqs];
    updated[index][key] = val;
    handleFieldChange('faqs', updated);
  };

  const removeFaq = (index) => {
    const updated = seo.faqs.filter((_, i) => i !== index);
    handleFieldChange('faqs', updated);
  };

  const moveFaq = (index, direction) => {
    const updated = [...seo.faqs];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    handleFieldChange('faqs', updated);
  };

  // --- SCHEMA GENERATION & VALIDATION ---
  const handleAutoGenerateSchema = () => {
    const domain = 'https://www.paidhuethicalfoods.com';
    const slug = seo.seoSlug || product?.slug || '';
    const generated = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": seo.seoTitle || seo.seoFriendlyPageTitle || product?.name || '',
      "description": seo.metaDescription || product?.shortDescription || '',
      "image": product?.image ? [product.image] : [],
      "sku": `PDH-PROD-${productId}`,
      "brand": {
        "@type": "Brand",
        "name": "Paidhu"
      },
      "offers": {
        "@type": "Offer",
        "url": `${domain}/product/${slug}`,
        "priceCurrency": "INR",
        "price": (product?.discountPrice || product?.price || 0).toString(),
        "availability": (product?.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    };
    setSchemaJsonText(JSON.stringify(generated, null, 2));
    handleFieldChange('productSchema', generated);
    setSchemaValid(true);
    toast.success("Product Schema generated!");
  };

  const handleSchemaJsonChange = (text) => {
    setSchemaJsonText(text);
    setIsDirty(true);
    try {
      const parsed = JSON.parse(text);
      setSchemaValid(true);
      setSeo(prev => ({ ...prev, productSchema: parsed }));
    } catch (e) {
      setSchemaValid(false);
    }
  };

  // --- RUN SEO AUDIT ---
  const handleRunAudit = () => {
    setAuditRunning(true);
    setTimeout(() => {
      const passes = [];
      const warnings = [];
      const errors = [];

      // Keyword check
      if (seo.primaryKeyword) {
        passes.push("Primary keyword is defined.");
      } else {
        errors.push("Primary keyword is missing.");
      }

      // Title check
      const titleLen = (seo.seoTitle || seo.seoFriendlyPageTitle || '').length;
      if (titleLen >= 50 && titleLen <= 60) {
        passes.push(`SEO Title length (${titleLen} chars) is optimal (50-60).`);
      } else if (titleLen === 0) {
        errors.push("SEO Title is missing.");
      } else {
        warnings.push(`SEO Title length (${titleLen} chars) should ideally be 50-60 characters.`);
      }

      // Meta Desc check
      const descLen = (seo.metaDescription || '').length;
      if (descLen >= 140 && descLen <= 160) {
        passes.push(`Meta Description length (${descLen} chars) is optimal (140-160).`);
      } else if (descLen === 0) {
        errors.push("Meta Description is missing.");
      } else {
        warnings.push(`Meta Description length (${descLen} chars) should ideally be 140-160 characters.`);
      }

      // Slug check
      if (seo.seoSlug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(seo.seoSlug)) {
        passes.push("SEO Slug is valid and URL-friendly.");
      } else {
        errors.push("SEO Slug is missing or contains invalid characters.");
      }

      // Internal Links check
      if (seo.internalLinks && seo.internalLinks.length > 0) {
        passes.push(`${seo.internalLinks.length} internal link(s) configured.`);
      } else {
        warnings.push("No internal links configured. Adding 1-2 internal links improves indexing.");
      }

      // Image SEO check
      if (seo.imageSeo && seo.imageSeo.length > 0) {
        const missingAlts = seo.imageSeo.filter(i => !i.altText || !i.altText.trim());
        if (missingAlts.length === 0) {
          passes.push("All images have Alt text configured.");
        } else {
          warnings.push(`${missingAlts.length} image(s) missing Alt text.`);
        }
      } else {
        warnings.push("Image SEO metadata not configured.");
      }

      // Schema check
      if (seo.productSchema && schemaValid) {
        passes.push("Structured Product Schema (JSON-LD) configured.");
      } else {
        errors.push("Product Schema is invalid or unconfigured.");
      }

      // FAQ check
      if (seo.faqs && seo.faqs.length > 0) {
        passes.push(`${seo.faqs.length} FAQ item(s) configured.`);
      } else {
        warnings.push("No FAQs configured for this product.");
      }

      setAuditResults({ passes, warnings, errors });
      setAuditRunning(false);
      toast.info("SEO Audit Completed!");
    }, 400);
  };

  // --- SAVE ALL SEO DATA ---
  const handleSave = async () => {
    if (!schemaValid) {
      toast.error("Please fix invalid Schema JSON syntax before saving.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...seo,
        seoSlug: seo.seoSlug.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        productSchema: schemaJsonText ? JSON.parse(schemaJsonText) : seo.productSchema
      };

      const res = await seoService.updateProductSeo(productId, payload);
      if (res && res.success) {
        setSeo(res.seo);
        setKeywordPlacement(res.keywordPlacement || []);
        setIsDirty(false);
        toast.success("SEO Configuration saved successfully to database!");
        if (onSaveSuccess) onSaveSuccess(res.seo);
      }
    } catch (error) {
      console.error("Save SEO Error:", error);
      toast.error(error.response?.data?.message || "Failed to save SEO configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
        <div className="w-10 h-10 border-4 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-brand-plum font-bold">Loading SEO Management Suite...</p>
      </div>
    );
  }

  const titleLength = (seo.seoTitle || seo.seoFriendlyPageTitle || '').length;
  const descLength = (seo.metaDescription || '').length;
  const contentWordCount = (seo.seoProductDescription || '').split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* HEADER BAR & OVERVIEW */}
      <div className="bg-gradient-to-r from-brand-plum to-[#4a1b3d] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
              SEO Engine & Analytics
            </span>
            <h2 className="text-2xl font-bold font-playfair mt-2">
              SEO Management: {product?.name || `Product #${productId}`}
            </h2>
            <p className="text-white/80 text-xs mt-1">
              Configure meta tags, structured schema, keywords, and internal links for maximum search ranking.
            </p>
          </div>

          {/* DYNAMIC SCORE GAUGE */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-white/70 font-semibold">SEO Score</div>
              <div className="text-3xl font-black text-white">
                {seo.seoScore || 0}<span className="text-lg text-white/70">/100</span>
              </div>
            </div>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-4 ${
              (seo.seoScore || 0) >= 80 ? 'border-emerald-400 text-emerald-300' : 
              (seo.seoScore || 0) >= 50 ? 'border-amber-400 text-amber-300' : 'border-rose-400 text-rose-300'
            }`}>
              {(seo.seoScore || 0) >= 80 ? 'A+' : (seo.seoScore || 0) >= 50 ? 'B' : 'C'}
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH ENGINE LIVE PREVIEW */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FiEye className="text-brand-plum" /> Google Search Preview
          </h3>
          <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPreviewMode('desktop')}
              className={`px-3 py-1 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-white shadow text-brand-plum font-bold' : 'text-gray-500'}`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-1 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-white shadow text-brand-plum font-bold' : 'text-gray-500'}`}
            >
              Mobile
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-xl border border-gray-200 bg-[#f8f9fa] ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}`}>
          <div className="text-xs text-[#202124] flex items-center gap-1.5 mb-1 font-sans">
            <span className="bg-gray-200 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-gray-600">P</span>
            <span className="truncate">paidhuethicalfoods.com › product › {seo.seoSlug || 'product-slug'}</span>
          </div>
          <h4 className="text-[#1a0dab] font-semibold text-lg hover:underline cursor-pointer leading-snug line-clamp-1">
            {seo.seoTitle || seo.seoFriendlyPageTitle || product?.name || 'Product Title'} | Paidhu
          </h4>
          <p className="text-[#4d5156] text-xs mt-1 leading-relaxed line-clamp-2">
            {seo.metaDescription || product?.shortDescription || 'Enter a meta description to see how this product appears in Google search engine results...'}
          </p>
        </div>
      </div>

      {/* FORM SECTIONS (CARD LAYOUT) */}

      {/* 1. KEYWORDS SECTION */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiSearch className="text-brand-plum" /> 1. Keyword Optimization
          </h3>
          <p className="text-xs text-gray-500">Specify the main focus search term and supporting secondary keywords for search indexing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Keyword */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Primary Keyword <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-brand-plum focus:ring-1 focus:ring-brand-plum outline-none text-sm bg-gray-50/50 focus:bg-white transition-all"
              placeholder="e.g., edible blue pea flowers"
              value={seo.primaryKeyword || ''}
              onChange={e => handleFieldChange('primaryKeyword', e.target.value)}
            />
            <div className="flex justify-between items-center text-[11px] mt-1.5 px-1">
              <span className={!seo.primaryKeyword ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}>
                {!seo.primaryKeyword ? '⚠️ Primary keyword is missing' : '✓ Focus keyword set'}
              </span>
              <span className="text-gray-400">{(seo.primaryKeyword || '').length} chars</span>
            </div>
          </div>

          {/* Secondary Keywords */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Secondary Keywords (Tags/Chips)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:border-brand-plum focus:ring-1 focus:ring-brand-plum outline-none text-sm bg-gray-50/50 focus:bg-white"
                placeholder="Add secondary keyword and press Add..."
                value={newSecondaryKw}
                onChange={e => setNewSecondaryKw(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSecondaryKeyword(); } }}
              />
              <button
                type="button"
                onClick={addSecondaryKeyword}
                className="px-4 py-2 bg-brand-plum text-white text-xs font-bold rounded-xl hover:bg-brand-plum/90 transition-all cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-gray-50 rounded-xl border border-gray-100">
              {(seo.secondaryKeywords || []).map((kw, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-white border border-brand-plum/20 text-brand-plum px-3 py-1 rounded-lg text-xs font-semibold shadow-xs">
                  {kw}
                  <button type="button" onClick={() => removeSecondaryKeyword(i)} className="text-gray-400 hover:text-rose-500 ml-1">
                    <FiX size={12} />
                  </button>
                </span>
              ))}
              {(!seo.secondaryKeywords || seo.secondaryKeywords.length === 0) && (
                <span className="text-xs text-gray-400 italic p-1">No secondary keywords added yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. TITLES & META DESCRIPTION */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiFileText className="text-brand-plum" /> 2. Titles & Meta Descriptions
          </h3>
          <p className="text-xs text-gray-500">Configure page title tags and meta descriptions optimized for Click-Through-Rate (CTR).</p>
        </div>

        <div className="space-y-5">
          {/* SEO-Friendly Page Title */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                SEO-Friendly Page Title
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                titleLength >= 50 && titleLength <= 60 ? 'bg-emerald-100 text-emerald-800' :
                titleLength === 0 ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-800'
              }`}>
                {titleLength >= 50 && titleLength <= 60 ? 'Good (50-60)' : titleLength < 50 ? 'Too Short' : 'Too Long'}
              </span>
            </div>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-brand-plum focus:ring-1 focus:ring-brand-plum outline-none text-sm bg-gray-50/50 focus:bg-white"
              placeholder="e.g., Organic Edible Blue Pea Flowers | Premium Food-Grade Flowers"
              value={seo.seoFriendlyPageTitle || ''}
              onChange={e => handleFieldChange('seoFriendlyPageTitle', e.target.value)}
            />
            <div className="text-[11px] text-gray-400 text-right mt-1">{titleLength} / 60 recommended characters</div>
          </div>

          {/* SEO Title (Search Engine Display Title) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              SEO Title (Google Title)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-brand-plum focus:ring-1 focus:ring-brand-plum outline-none text-sm bg-gray-50/50 focus:bg-white"
              placeholder="e.g., Buy Edible Blue Pea Flowers Online | Paidhu"
              value={seo.seoTitle || ''}
              onChange={e => handleFieldChange('seoTitle', e.target.value)}
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Meta Description
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                descLength >= 140 && descLength <= 160 ? 'bg-emerald-100 text-emerald-800' :
                descLength === 0 ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-800'
              }`}>
                {descLength >= 140 && descLength <= 160 ? 'Optimal (140-160)' : descLength < 140 ? 'Too Short' : 'Too Long'}
              </span>
            </div>
            <textarea
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-brand-plum focus:ring-1 focus:ring-brand-plum outline-none text-sm bg-gray-50/50 focus:bg-white leading-relaxed"
              placeholder="e.g., Buy premium edible blue pea flowers online from Paidhu. Perfect for teas, desserts and food decoration. Fast pan-India shipping."
              value={seo.metaDescription || ''}
              onChange={e => handleFieldChange('metaDescription', e.target.value)}
            ></textarea>
            <div className="text-[11px] text-gray-400 text-right mt-1">{descLength} / 160 recommended characters</div>
          </div>
        </div>
      </div>

      {/* 3. URL SLUG, CANONICAL & ROBOTS */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiGlobe className="text-brand-plum" /> 3. URL Slug & Indexing Directives
          </h3>
          <p className="text-xs text-gray-500">Manage permanent product URL structure, canonical tags, and search engine crawler indexing rules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SEO URL Slug */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              SEO URL Slug
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-brand-plum focus-within:bg-white">
                <span className="px-3 text-xs text-gray-400 font-mono border-r border-gray-200 bg-gray-100 py-2.5">/product/</span>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 outline-none text-sm font-mono bg-transparent"
                  placeholder="edible-blue-pea-flowers"
                  value={seo.seoSlug || ''}
                  onChange={e => handleFieldChange('seoSlug', e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={handleAutoGenerateSlug}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all cursor-pointer"
              >
                Auto Generate
              </button>
              <button
                type="button"
                onClick={handleCheckSlug}
                disabled={slugChecking}
                className="px-4 py-2.5 bg-brand-plum text-white text-xs font-bold rounded-xl hover:bg-brand-plum/90 transition-all cursor-pointer"
              >
                {slugChecking ? 'Checking...' : 'Check Unique'}
              </button>
            </div>
            {slugStatus && (
              <p className={`text-xs mt-1.5 ${slugStatus.isAvailable ? 'text-emerald-600' : 'text-rose-600'} font-semibold`}>
                {slugStatus.message}
              </p>
            )}
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Canonical URL
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-brand-plum focus:ring-1 focus:ring-brand-plum outline-none text-sm bg-gray-50/50 focus:bg-white font-mono text-xs"
              placeholder="https://www.paidhuethicalfoods.com/product/edible-blue-pea-flowers"
              value={seo.canonicalUrl || ''}
              onChange={e => handleFieldChange('canonicalUrl', e.target.value)}
            />
          </div>

          {/* Robots Directives */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Robots Index
              </label>
              <select
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-plum focus:ring-1 focus:ring-brand-plum outline-none text-sm bg-gray-50/50 font-semibold"
                value={seo.robotsIndex || 'index'}
                onChange={e => handleFieldChange('robotsIndex', e.target.value)}
              >
                <option value="index">Index (Recommended)</option>
                <option value="noindex">No Index</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Robots Follow
              </label>
              <select
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-plum focus:ring-1 focus:ring-brand-plum outline-none text-sm bg-gray-50/50 font-semibold"
                value={seo.robotsFollow || 'follow'}
                onChange={e => handleFieldChange('robotsFollow', e.target.value)}
              >
                <option value="follow">Follow (Recommended)</option>
                <option value="nofollow">No Follow</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SEO PRODUCT DESCRIPTION */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiFileText className="text-brand-plum" /> 4. SEO Product Description (Rich Text)
            </h3>
            <p className="text-xs text-gray-500">Provide an SEO structured description with headings (H2/H3), lists, and keywords.</p>
          </div>
          <div className="text-xs text-gray-500 font-semibold bg-gray-100 px-3 py-1 rounded-lg">
            Word Count: <span className="text-brand-plum font-bold">{contentWordCount}</span> words
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold">
          <button type="button" onClick={() => handleFieldChange('seoProductDescription', (seo.seoProductDescription || '') + '\n<h2>Heading 2</h2>\n')} className="px-2.5 py-1 bg-white border rounded hover:bg-gray-100">+ H2</button>
          <button type="button" onClick={() => handleFieldChange('seoProductDescription', (seo.seoProductDescription || '') + '\n<h3>Heading 3</h3>\n')} className="px-2.5 py-1 bg-white border rounded hover:bg-gray-100">+ H3</button>
          <button type="button" onClick={() => handleFieldChange('seoProductDescription', (seo.seoProductDescription || '') + '<strong>Bold Text</strong>')} className="px-2.5 py-1 bg-white border rounded hover:bg-gray-100 font-bold">B</button>
          <button type="button" onClick={() => handleFieldChange('seoProductDescription', (seo.seoProductDescription || '') + '<em>Italic Text</em>')} className="px-2.5 py-1 bg-white border rounded hover:bg-gray-100 italic">I</button>
          <button type="button" onClick={() => handleFieldChange('seoProductDescription', (seo.seoProductDescription || '') + '\n<ul>\n  <li>Feature point 1</li>\n  <li>Feature point 2</li>\n</ul>\n')} className="px-2.5 py-1 bg-white border rounded hover:bg-gray-100">• Bullet List</button>
        </div>

        <textarea
          rows="7"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-plum focus:ring-1 focus:ring-brand-plum outline-none text-sm font-mono bg-gray-50/30 focus:bg-white leading-relaxed"
          placeholder="<h2>Premium Edible Blue Pea Flowers</h2>..."
          value={seo.seoProductDescription || ''}
          onChange={e => handleFieldChange('seoProductDescription', e.target.value)}
        ></textarea>
      </div>

      {/* 5. INTERNAL LINKING */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiLink className="text-brand-plum" /> 5. Internal Links Manager
            </h3>
            <p className="text-xs text-gray-500">Build internal page authority by linking to relevant categories and related products.</p>
          </div>
          <button
            type="button"
            onClick={addInternalLink}
            className="px-3.5 py-1.5 bg-brand-plum text-white text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-brand-plum/90 cursor-pointer"
          >
            <FiPlus size={14} /> Add Internal Link
          </button>
        </div>

        <div className="space-y-3">
          {(seo.internalLinks || []).map((link, idx) => (
            <div key={idx} className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Anchor Text</label>
                <input
                  type="text"
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
                  value={link.anchorText || ''}
                  onChange={e => updateInternalLink(idx, 'anchorText', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Target Type</label>
                <select
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white font-semibold"
                  value={link.targetType || 'category'}
                  onChange={e => updateInternalLink(idx, 'targetType', e.target.value)}
                >
                  <option value="category">Category</option>
                  <option value="product">Product</option>
                  <option value="page">Page</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Target URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white font-mono"
                  value={link.url || ''}
                  onChange={e => updateInternalLink(idx, 'url', e.target.value)}
                />
              </div>
              <div className="flex justify-end pt-3 md:pt-0">
                <button
                  type="button"
                  onClick={() => removeInternalLink(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {(!seo.internalLinks || seo.internalLinks.length === 0) && (
            <p className="text-xs text-gray-400 italic p-3 text-center bg-gray-50 rounded-xl">No internal links configured yet.</p>
          )}
        </div>
      </div>

      {/* 6. IMAGE SEO MANAGER */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiImage className="text-brand-plum" /> 6. Image SEO Manager
          </h3>
          <p className="text-xs text-gray-500">Manage Alt text, Title, Captions, and Descriptions for image search visibility.</p>
        </div>

        <div className="space-y-4">
          {(seo.imageSeo || []).map((img, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
              <div className="font-bold text-xs text-brand-plum uppercase tracking-wider border-b border-gray-200 pb-1 flex justify-between">
                <span>Image #{idx + 1} ({img.imageId || 'Product Image'})</span>
                <span className={!img.altText ? 'text-rose-500 font-bold' : 'text-emerald-600 font-bold'}>
                  {!img.altText ? '⚠️ Alt text missing' : '✓ Alt set'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600">Alt Text (Required)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
                    placeholder="Describe image for screen readers & Google"
                    value={img.altText || ''}
                    onChange={e => updateImageSeo(idx, 'altText', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600">Image Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
                    placeholder="Image tooltip title"
                    value={img.title || ''}
                    onChange={e => updateImageSeo(idx, 'title', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          {(!seo.imageSeo || seo.imageSeo.length === 0) && (
            <p className="text-xs text-gray-400 italic p-3 text-center bg-gray-50 rounded-xl">No images registered for SEO metadata yet.</p>
          )}
        </div>
      </div>

      {/* 7. PRODUCT SCHEMA (JSON-LD) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiCode className="text-brand-plum" /> 7. Structured Product Schema (JSON-LD)
            </h3>
            <p className="text-xs text-gray-500">Rich snippets for Google search results including price, availability, and brand.</p>
          </div>
          <button
            type="button"
            onClick={handleAutoGenerateSchema}
            className="px-3.5 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
          >
            Auto Generate Schema
          </button>
        </div>

        <div className="space-y-2">
          <textarea
            rows="8"
            className={`w-full p-4 border rounded-xl font-mono text-xs leading-relaxed outline-none ${
              schemaValid ? 'border-gray-200 focus:border-brand-plum bg-gray-900 text-emerald-400' : 'border-rose-400 bg-rose-950 text-rose-200'
            }`}
            value={schemaJsonText}
            onChange={e => handleSchemaJsonChange(e.target.value)}
          ></textarea>
          <div className="flex justify-between items-center text-xs">
            <span className={schemaValid ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
              {schemaValid ? '✓ Valid JSON Schema Syntax' : '❌ Invalid JSON Syntax'}
            </span>
            <span className="text-gray-400">Schema.org Product Spec</span>
          </div>
        </div>
      </div>

      {/* 8. FAQ MANAGEMENT */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiHelpCircle className="text-brand-plum" /> 8. Product FAQ Management
            </h3>
            <p className="text-xs text-gray-500">Frequently Asked Questions rendered as rich dropdown accordions on the product detail page.</p>
          </div>
          <button
            type="button"
            onClick={addFaq}
            className="px-3.5 py-1.5 bg-brand-plum text-white text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-brand-plum/90 cursor-pointer"
          >
            <FiPlus size={14} /> Add FAQ
          </button>
        </div>

        <div className="space-y-4">
          {(seo.faqs || []).map((faq, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50/40 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="font-bold text-xs text-brand-plum uppercase">FAQ #{idx + 1}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveFaq(idx, -1)} className="p-1 hover:bg-gray-200 rounded text-gray-600"><FiArrowUp size={14} /></button>
                  <button type="button" onClick={() => moveFaq(idx, 1)} className="p-1 hover:bg-gray-200 rounded text-gray-600"><FiArrowDown size={14} /></button>
                  <button type="button" onClick={() => removeFaq(idx)} className="p-1 hover:bg-rose-100 text-rose-600 rounded ml-2"><FiTrash2 size={14} /></button>
                </div>
              </div>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white font-bold"
                placeholder="Question (e.g., What are edible blue pea flowers?)"
                value={faq.question || ''}
                onChange={e => updateFaq(idx, 'question', e.target.value)}
              />
              <textarea
                rows="2"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
                placeholder="Answer detail..."
                value={faq.answer || ''}
                onChange={e => updateFaq(idx, 'answer', e.target.value)}
              ></textarea>
            </div>
          ))}

          {(!seo.faqs || seo.faqs.length === 0) && (
            <p className="text-xs text-gray-400 italic p-3 text-center bg-gray-50 rounded-xl">No FAQs configured for this product yet.</p>
          )}
        </div>
      </div>

      {/* 9. KEYWORD PLACEMENT ANALYSIS TABLE */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiBarChart2 className="text-brand-plum" /> 9. Primary Keyword Placement Analysis
          </h3>
          <p className="text-xs text-gray-500">Live inspection of primary keyword deployment across critical page locations.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-100">
              <tr>
                <th className="p-3">SEO Target Location</th>
                <th className="p-3">Optimization Status</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {keywordPlacement.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="p-3 font-bold text-gray-800">{item.location}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[11px] ${
                      item.status === 'optimized' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'needs_improvement' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status === 'optimized' && <FiCheckCircle size={12} />}
                      {item.status === 'needs_improvement' && <FiAlertTriangle size={12} />}
                      {item.status === 'missing' && <FiXCircle size={12} />}
                      {item.status === 'optimized' ? 'Optimized' : item.status === 'needs_improvement' ? 'Needs Work' : 'Missing'}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">{item.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 10. SEO AUDIT PANEL */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiCheckCircle className="text-brand-plum" /> 10. Automated SEO Audit
            </h3>
            <p className="text-xs text-gray-500">Run an instant diagnostic test across all technical and content SEO rules.</p>
          </div>
          <button
            type="button"
            onClick={handleRunAudit}
            disabled={auditRunning}
            className="px-4 py-2 bg-brand-plum text-white text-xs font-bold rounded-xl hover:bg-brand-plum/90 transition-all cursor-pointer"
          >
            {auditRunning ? 'Running Audit...' : 'Run SEO Audit'}
          </button>
        </div>

        {auditResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
                <FiCheckCircle /> Passed Checks ({auditResults.passes.length})
              </h4>
              <ul className="text-xs text-emerald-900 space-y-1 pl-4 list-disc">
                {auditResults.passes.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-800 text-xs flex items-center gap-1.5">
                <FiAlertTriangle /> Warnings ({auditResults.warnings.length})
              </h4>
              <ul className="text-xs text-amber-900 space-y-1 pl-4 list-disc">
                {auditResults.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <h4 className="font-bold text-rose-800 text-xs flex items-center gap-1.5">
                <FiXCircle /> Critical Errors ({auditResults.errors.length})
              </h4>
              <ul className="text-xs text-rose-900 space-y-1 pl-4 list-disc">
                {auditResults.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* STICKY FOOTER SAVE BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 shadow-xl z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isDirty ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isDirty ? '● Unsaved Changes' : '✓ All Saved'}
            </span>
            <span className="text-xs text-gray-500 hidden md:inline">
              Target Product: <strong className="text-gray-800">{product?.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchSeoData(productId)}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-brand-plum text-white text-xs font-extrabold rounded-xl hover:bg-brand-plum/90 shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <FiSave size={16} />
              {saving ? 'Saving to Database...' : 'Save SEO Configuration'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductSeoManager;
