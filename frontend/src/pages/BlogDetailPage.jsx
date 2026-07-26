import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Tag, 
  BookOpen, 
  Check, 
  Copy, 
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import SEO from '../components/seo/SEO';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetch(`${API_BASE}/api/blogs/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Blog article not found');
        return res.json();
      })
      .then((data) => {
        setBlogData(data);
      })
      .catch((err) => {
        console.error('Fetch blog error:', err);
        setError('Article not found or could not be loaded.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] bg-[#faf9f7] flex flex-col items-center justify-center p-6 text-gray-500">
        <div className="w-12 h-12 border-4 border-[#662654] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#662654] tracking-wider uppercase">Loading Story...</p>
      </div>
    );
  }

  if (error || !blogData?.blog) {
    return (
      <div className="w-full min-h-[70vh] bg-[#faf9f7] flex flex-col items-center justify-center p-6 text-center">
        <BookOpen size={56} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Article Not Found</h2>
        <p className="text-gray-500 text-sm mt-2 mb-6">The article you are looking for might have been moved or removed.</p>
        <Link
          to="/blogs"
          className="bg-[#662654] text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#7a2e64] transition-all shadow-md"
        >
          <ArrowLeft size={16} /> Back to Journal
        </Link>
      </div>
    );
  }

  const { blog, relatedBlogs = [], navigation = {} } = blogData;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://paidhu.com/blogs/${blog.slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getCuratedFloralImage = (title = '', category = '', originalUrl = '') => {
    const text = (title + ' ' + (category || '')).toLowerCase();

    const isGeneric = !originalUrl || 
      originalUrl.includes('wp.paidhu.com/wp-content') ||
      originalUrl.includes('placeholder') || 
      originalUrl.includes('default') || 
      originalUrl.includes('child') || 
      originalUrl.includes('camera') || 
      originalUrl.includes('toy') ||
      originalUrl.includes('teacora') ||
      originalUrl.includes('516627145497') ||
      originalUrl.includes('kms') ||
      originalUrl.includes('broccoli') ||
      originalUrl.includes('galaxy') ||
      originalUrl.includes('space');

    if (originalUrl && !isGeneric && (originalUrl.startsWith('http') || originalUrl.startsWith('/'))) {
      return originalUrl;
    }

    if (text.includes('hibiscus') || text.includes('sembaruthi')) {
      return '/blogs/hibiscus_gourmet_drink.png';
    }
    if (text.includes('rose') || text.includes('gulkand') || text.includes('damask')) {
      return '/blogs/rose_petal_delicacy.png';
    }
    if (text.includes('blue pea') || text.includes('butterfly pea') || text.includes('bluepea') || text.includes('blue bloom')) {
      return '/blogs/blue_pea_floral_tea.png';
    }
    if (text.includes('aavaram') || text.includes('neem') || text.includes('kondrai') || text.includes('cassia') || text.includes('chamomile') || text.includes('lavender') || text.includes('herbal tea') || text.includes('traditional') || text.includes('brew flora')) {
      return '/blogs/aavaram_herbal_tea.png';
    }

    return '/blogs/gourmet_floral_salad.png';
  };

  const getBlogImageSrc = (b) => {
    const img = b?.featuredImage || b?.image;
    return getCuratedFloralImage(b?.title, b?.category, img);
  };

  // Generate Table of Contents from h2/h3 tags
  const extractTableOfContents = (htmlContent) => {
    if (!htmlContent) return [];
    const headings = [];
    const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
    let match;
    while ((match = regex.exec(htmlContent)) !== null) {
      const text = match[2].replace(/<[^>]*>?/gm, '').trim();
      if (text) {
        headings.push({ level: parseInt(match[1]), text });
      }
    }
    return headings;
  };

  const toc = extractTableOfContents(blog.content);

  // Schema.org Article JSON-LD structured data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.excerpt || blog.seoDescription,
    "image": getBlogImageSrc(blog),
    "author": {
      "@type": "Person",
      "name": blog.author || "Paidhu Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Paidhu Store",
      "logo": {
        "@type": "ImageObject",
        "url": "https://paidhu.com/logo.png"
      }
    },
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "mainEntityOfPage": currentUrl
  };

  return (
    <div className="w-full bg-[#faf9f7] min-h-screen font-sans pb-24">
      <SEO 
        title={blog.seoTitle || `${blog.title} | Paidhu Journal`}
        description={blog.seoDescription || blog.excerpt}
        url={currentUrl}
        image={getBlogImageSrc(blog)}
      />

      {/* Schema.org Article JSON-LD Script Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Breadcrumbs Navigation Bar */}
      <div className="bg-white border-b border-gray-100 py-3.5 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs font-semibold text-gray-500 overflow-x-auto hide-scrollbar">
          <Link to="/" className="hover:text-[#662654] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-gray-300 shrink-0" />
          <Link to="/blogs" className="hover:text-[#662654] transition-colors">Journal</Link>
          <ChevronRight size={14} className="text-gray-300 shrink-0" />
          <span className="text-gray-800 font-bold truncate max-w-[200px] sm:max-w-md">{blog.title}</span>
        </div>
      </div>

      {/* Article Hero Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Category & Title */}
        <div className="space-y-3 text-center sm:text-left">
          {blog.category && (
            <span className="inline-flex items-center gap-1.5 bg-[#662654] text-white text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
              <Tag size={12} /> {blog.category}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-gray-900 tracking-tight leading-tight">
            {blog.title}
          </h1>

          {/* Author & Meta Bar */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs font-bold uppercase tracking-wider text-gray-500 pt-2 border-b border-gray-200/60 pb-4">
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-[#662654]" /> By {blog.author || 'Paidhu Team'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#662654]" /> {formatDate(blog.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#662654]" /> {blog.readingTime || 2} Min Read
            </span>
          </div>
        </div>

        {/* Hero Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 bg-gray-100">
          <img
            src={getBlogImageSrc(blog)}
            alt={blog.featuredImageAlt || blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Social Share Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4 flex-wrap">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Share2 size={15} className="text-[#662654]" /> Share Article
          </span>

          <div className="flex items-center gap-2">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${blog.title} - ${currentUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
            >
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-500 hover:bg-sky-600 text-white p-2.5 rounded-xl font-bold text-xs transition-all shadow-sm"
            >
              Twitter
            </a>
            <button
              onClick={copyToClipboard}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Table of Contents Box */}
        {toc.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-[#662654] uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} /> Table of Contents
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold text-gray-600">
              {toc.map((item, idx) => (
                <li key={idx} style={{ paddingLeft: `${(item.level - 2) * 16}px` }} className="flex items-start gap-2 hover:text-[#662654] transition-colors cursor-pointer">
                  <span className="text-[#662654] font-black">•</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Article HTML Body Content */}
        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div 
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-800 font-medium leading-relaxed prose-headings:font-serif prose-headings:text-[#662654] prose-headings:font-black prose-a:text-[#662654] prose-a:font-bold hover:prose-a:underline prose-img:rounded-3xl prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-[#662654] prose-blockquote:pl-4 prose-blockquote:italic text-justify space-y-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Navigation Next & Previous Articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {navigation.previous ? (
            <Link
              to={`/blogs/${navigation.previous.slug}`}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-1 block group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                <ArrowLeft size={12} /> Previous Article
              </span>
              <p className="font-bold text-sm text-gray-800 group-hover:text-[#662654] transition-colors line-clamp-1">
                {navigation.previous.title}
              </p>
            </Link>
          ) : <div />}

          {navigation.next && (
            <Link
              to={`/blogs/${navigation.next.slug}`}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-1 block text-right group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-end gap-1">
                Next Article <ChevronRight size={12} />
              </span>
              <p className="font-bold text-sm text-gray-800 group-hover:text-[#662654] transition-colors line-clamp-1">
                {navigation.next.title}
              </p>
            </Link>
          )}
        </div>

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <div className="pt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-serif font-black text-gray-900 tracking-tight">
                Related Articles
              </h3>
              <Link to="/blogs" className="text-xs font-bold text-[#662654] uppercase tracking-wider hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedBlogs.map((rel, idx) => (
                <Link
                  key={rel.id || idx}
                  to={`/blogs/${rel.slug}`}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all p-4 flex gap-4 items-center group"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={getBlogImageSrc(rel)}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#662654]">
                      {rel.category || 'Wellness'}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-[#662654] transition-colors">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-gray-400 block">
                      {formatDate(rel.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Subscription Banner */}
        <div className="bg-gradient-to-br from-[#662654] to-[#4c163b] text-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl text-center space-y-4 relative overflow-hidden">
          <div className="relative z-10 max-w-lg mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#d4af37] bg-white/10 px-4 py-1 rounded-full border border-white/15 inline-block">
              Paidhu Floral Food Club
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
              Love Floral Wellness Stories?
            </h3>
            <p className="text-white/80 text-xs sm:text-sm font-medium">
              Subscribe to get seasonal recipes, edible flower guides, and exclusive organic store discounts delivered to your inbox.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="w-full px-4 py-3 rounded-full text-gray-900 text-xs font-semibold focus:outline-none bg-white"
              />
              <button className="bg-[#d4af37] hover:bg-[#c29f2e] text-[#4c163b] font-black text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all cursor-pointer shadow-md shrink-0">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
