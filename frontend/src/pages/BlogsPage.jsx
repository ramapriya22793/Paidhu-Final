import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Search, 
  X, 
  BookOpen, 
  Tag, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';
import SEO from '../components/seo/SEO';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

// Safe Image Component with Skeleton Loading and Fallback
const BlogCardImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const fallbackUrl = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={error || !src ? fallbackUrl : src}
        alt={alt || 'Paidhu Journal Blog'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [tags, setTags] = useState(['All']);
  const [sortBy, setSortBy] = useState('latest');

  const searchDebounceRef = useRef(null);

  // Fetch blogs from API
  const fetchBlogs = (currentPage = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage,
      limit: 9,
      sort: sortBy
    });

    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    if (selectedTag !== 'All') params.append('tag', selectedTag);

    fetch(`${API_BASE}/api/blogs?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { blogs: [], totalPages: 1, total: 0, categories: [], tags: [] }))
      .then((data) => {
        const fetchedBlogs = data.blogs || [];
        setBlogs(fetchedBlogs);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);

        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
        if (data.tags && data.tags.length > 0) {
          setTags(data.tags);
        }

        // Set top item as featured blog if on page 1 and no search filter
        if (currentPage === 1 && !searchQuery && selectedCategory === 'All' && fetchedBlogs.length > 0) {
          setFeaturedBlog(fetchedBlogs[0]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch blogs:', err);
        setBlogs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setPage(1);
      fetchBlogs(1);
    }, 300);

    return () => clearTimeout(searchDebounceRef.current);
  }, [searchQuery, selectedCategory, selectedTag, sortBy]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchBlogs(newPage);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
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
      originalUrl.includes('kms');

    if (originalUrl && !isGeneric && (originalUrl.startsWith('http') || originalUrl.startsWith('/'))) {
      return originalUrl;
    }

    if (text.includes('hibiscus')) {
      return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop';
    }
    if (text.includes('rose') || text.includes('gulkand') || text.includes('damask')) {
      return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop';
    }
    if (text.includes('saffron') || text.includes('kesar')) {
      return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop';
    }
    if (text.includes('blue pea') || text.includes('butterfly pea') || text.includes('bluepea')) {
      return 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop';
    }
    if (text.includes('chamomile')) {
      return 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800&auto=format&fit=crop';
    }
    if (text.includes('neem') || text.includes('aavaram') || text.includes('kondrai') || text.includes('cassia')) {
      return 'https://images.unsplash.com/photo-1546852199-2d7e912e98c6?q=80&w=800&auto=format&fit=crop';
    }
    if (text.includes('lavender')) {
      return 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?q=80&w=800&auto=format&fit=crop';
    }
    if (text.includes('jasmine')) {
      return 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=800&auto=format&fit=crop';
    }
    if (text.includes('salad') || text.includes('fruit')) {
      return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop';
    }
    if (text.includes('rasam') || text.includes('tea') || text.includes('drink') || text.includes('syrup') || text.includes('lemonade')) {
      return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop';
    }
    if (text.includes('idli') || text.includes('rice') || text.includes('pancake') || text.includes('cookie') || text.includes('halwa') || text.includes('panna cotta')) {
      return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop';
    }

    return 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop';
  };

  const getBlogImageSrc = (blog) => {
    const img = blog?.featuredImage || blog?.image;
    return getCuratedFloralImage(blog?.title, blog?.category, img);
  };

  return (
    <div className="w-full bg-[#faf9f7] min-h-screen font-sans pb-24">
      <SEO 
        title="Paidhu Journal | Edible Flowers, Wellness & Floral Food Stories"
        description="Explore wellness articles, floral recipes, saffron benefits, organic food stories, and holistic lifestyle insights from Paidhu Store."
        url="https://paidhu.com/blogs"
      />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-[#662654] via-[#521d43] to-[#3b1230] text-white py-16 sm:py-20 px-4 sm:px-8 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-black uppercase tracking-[0.3em] text-[#d4af37] bg-white/10 px-4 py-1.5 rounded-full border border-white/15 inline-flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles size={13} className="text-[#d4af37]" />
            Paidhu Wellness Journal
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight"
          >
            Floral Food Stories &amp; Insights
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base font-medium leading-relaxed"
          >
            Discover holistic wellness, culinary edible flower recipes, saffron heritage, and natural health tips curated by our specialists.
          </motion.p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Filters and Search Control Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar scroll-smooth">
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#662654] text-white shadow-md shadow-[#662654]/25 scale-105'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box & Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64 group">
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-full focus:outline-none focus:border-[#662654] cursor-pointer"
            >
              <option value="latest">Sort: Latest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="readingTime">Sort: Reading Time</option>
            </select>
          </div>
        </div>

        {/* Featured Hero Article Banner (Page 1 without active search filter) */}
        {featuredBlog && page === 1 && !searchQuery && selectedCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-lg grid grid-cols-1 lg:grid-cols-12 group hover:shadow-2xl transition-all duration-300"
          >
            <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative min-h-[300px]">
              <BlogCardImage src={getBlogImageSrc(featuredBlog)} alt={featuredBlog.title} />
              {featuredBlog.category && (
                <span className="absolute top-6 left-6 bg-[#662654] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <Tag size={11} /> {featuredBlog.category}
                </span>
              )}
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#662654]" /> {formatDate(featuredBlog.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-[#662654]" /> {featuredBlog.readingTime || 2} Min Read
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 leading-snug group-hover:text-[#662654] transition-colors">
                  <Link to={`/blogs/${featuredBlog.slug || featuredBlog.id}`}>{featuredBlog.title}</Link>
                </h2>

                <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-4">
                  {featuredBlog.excerpt || featuredBlog.content?.replace(/<[^>]*>?/gm, '').slice(0, 200)}...
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  By {featuredBlog.author || 'Paidhu Team'}
                </span>
                <Link
                  to={`/blogs/${featuredBlog.slug || featuredBlog.id}`}
                  className="bg-[#662654] hover:bg-[#7a2e64] text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-md transition-all group-hover:translate-x-1 cursor-pointer"
                >
                  <span>Read Story</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        <div>
          {loading ? (
            /* Loading Skeleton Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-3xl overflow-hidden border border-gray-100 p-4 space-y-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-2xl" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-12 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <BookOpen size={48} className="mx-auto text-gray-300" />
              <h3 className="text-xl font-bold text-gray-800">No articles found</h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                We couldn't find any articles matching your search criteria. Try resetting your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedTag('All');
                }}
                className="mt-2 px-6 py-2.5 bg-[#662654] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#7a2e64] transition-all shadow-md cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, idx) => (
                <motion.article
                  key={blog.id || blog.slug || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
                >
                  <Link to={`/blogs/${blog.slug || blog.id}`} className="flex flex-col h-full">
                    {/* Featured Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <BlogCardImage src={getBlogImageSrc(blog)} alt={blog.title} />
                      {blog.category && (
                        <span className="absolute top-4 left-4 bg-[#662654] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Tag size={10} /> {blog.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-[#662654]" /> {formatDate(blog.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-[#662654]" /> {blog.readingTime || 2} Min
                          </span>
                        </div>

                        <h3 className="text-[17px] font-bold text-gray-900 leading-snug group-hover:text-[#662654] transition-colors line-clamp-2">
                          {blog.title}
                        </h3>

                        <p className="text-[12.5px] text-gray-500 font-medium leading-relaxed line-clamp-3">
                          {blog.excerpt || blog.content?.replace(/<[^>]*>?/gm, '').slice(0, 120)}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400">
                          {blog.author || 'Paidhu Team'}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#662654] uppercase tracking-wider group-hover:translate-x-1.5 transition-transform">
                          <span>Read</span>
                          <ArrowRight size={14} strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-8">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-10 h-10 rounded-full font-bold text-xs transition-all ${
                  page === p
                    ? 'bg-[#662654] text-white shadow-md shadow-[#662654]/25 scale-105'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
