import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Search, X, BookOpen, Tag } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/blogs`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setBlogs(data);
      })
      .catch((err) => console.error('Failed to fetch blogs:', err))
      .finally(() => setLoading(false));
  }, []);

  const getBlogImageSrc = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop';
    if (img.startsWith('data:image') || img.startsWith('http')) return img;
    return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  const formatDate = (dateStr) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  };

  // Extract categories dynamically
  const categories = ['All', ...new Set(blogs.map((b) => b.category).filter(Boolean))];

  // Filter and search
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Helper to strip HTML tags for clean card summary/excerpt
  const getExcerpt = (htmlContent, limit = 120) => {
    const doc = new Parser().parseFromString(htmlContent);
    const text = doc || htmlContent.replace(/<[^>]*>/g, '');
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  // Helper parser for simple excerpt fallback
  class Parser {
    parseFromString(html) {
      if (typeof window === 'undefined') return html;
      const el = document.createElement('div');
      el.innerHTML = html;
      return el.textContent || el.innerText || '';
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-[#faf9f7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#662654]"></div>
        <p className="mt-4 text-sm font-semibold text-[#662654] uppercase tracking-widest animate-pulse">Loading Blogs...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#faf9f7] min-h-screen font-sans pb-20">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-[#662654] to-[#4c163b] text-white py-16 px-4 md:px-8 overflow-hidden">
        {/* Subtle decorative shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-black uppercase tracking-[0.3em] text-[#d4af37] bg-white/10 px-4 py-1.5 rounded-full border border-white/15 inline-block"
          >
            Paidhu Journal
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight"
          >
            Insights &amp; Floral Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 max-w-xl mx-auto text-sm md:text-base font-medium"
          >
            Explore our articles on edible flowers, healthy recipes, organic farming, and holistic floral food lifestyles.
          </motion.p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#662654] text-white shadow-md shadow-[#662654]/25 scale-105'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-xs group">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#662654] transition-colors" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#662654] focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <span className="text-6xl">📖</span>
            <h3 className="text-lg font-bold text-gray-700 mt-4">No articles found</h3>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search keywords.</p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-6 px-6 py-2.5 bg-[#662654] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#7a2e64] transition-all shadow-md"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredBlogs.map((blog, idx) => (
              <motion.article
                layout
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
                onClick={() => setSelectedBlog(blog)}
              >
                {/* Featured Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={getBlogImageSrc(blog.image)}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {blog.category && (
                    <span className="absolute top-4 left-4 bg-[#662654] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Tag size={9} />
                      {blog.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Meta details */}
                  <div className="flex items-center gap-4 text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(blog.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {blog.author || 'Paidhu Team'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[17px] font-bold text-gray-900 leading-snug group-hover:text-[#662654] transition-colors line-clamp-2 mb-3">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[12.5px] text-gray-500 font-medium leading-relaxed line-clamp-3 mb-6 flex-1">
                    {getExcerpt(blog.content)}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#662654] uppercase tracking-wider group-hover:translate-x-1.5 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      {/* Full Article Overlay Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header Actions */}
              <div className="absolute top-6 right-6 z-50">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="w-10 h-10 rounded-full bg-white/80 backdrop-blur hover:bg-white text-gray-700 hover:text-black shadow-md flex items-center justify-center transition-all cursor-pointer border border-gray-100 hover:scale-105"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="overflow-y-auto flex-1 hide-scrollbar">
                {/* Cover Image */}
                <div className="relative h-[250px] md:h-[400px] w-full bg-gray-100">
                  <img
                    src={getBlogImageSrc(selectedBlog.image)}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 text-white space-y-2">
                    {selectedBlog.category && (
                      <span className="bg-[#662654] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md inline-block">
                        {selectedBlog.category}
                      </span>
                    )}
                    <h2 className="text-2xl md:text-4xl font-serif font-black tracking-tight leading-tight">
                      {selectedBlog.title}
                    </h2>
                  </div>
                </div>

                {/* Article Info & Body */}
                <div className="px-6 py-8 md:px-10 md:py-10 max-w-3xl mx-auto space-y-6">
                  {/* Author Meta */}
                  <div className="flex items-center gap-6 pb-6 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#662654]" />
                      <span>{formatDate(selectedBlog.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-[#662654]" />
                      <span>By {selectedBlog.author || 'Paidhu Team'}</span>
                    </div>
                  </div>

                  {/* Rich Text / Raw HTML Content Rendering */}
                  <div
                    className="prose prose-sm md:prose-base max-w-none text-gray-700 font-medium leading-relaxed space-y-4 prose-headings:font-serif prose-headings:text-[#662654] prose-headings:font-black prose-a:text-[#662654] prose-a:font-bold hover:prose-a:underline prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogsSection;
