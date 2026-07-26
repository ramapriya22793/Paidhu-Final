const prisma = require('../prismaClient');
const { importWordPressBlogs } = require('../scripts/importBlogs');
const { runSync, getSyncStatus } = require('../cron/syncBlogs');

/**
 * Get all blogs with pagination, search, category filter, tag filter, and sorting
 */
const getAllBlogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const { search, category, tag, sort, featured } = req.query;

    const where = {};

    // Filter by Category
    if (category && category !== 'All') {
      where.OR = [
        { category: { equals: category, mode: 'insensitive' } },
        { categories: { array_contains: category } }
      ];
    }

    // Filter by Tag
    if (tag && tag !== 'All') {
      where.tags = { array_contains: tag };
    }

    // Filter by Search Query
    if (search && search.trim()) {
      const q = search.trim();
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { slug: { contains: q, mode: 'insensitive' } }
          ]
        }
      ];
    }

    // Sorting
    let orderBy = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'title') orderBy = { title: 'asc' };
    if (sort === 'readingTime') orderBy = { readingTime: 'desc' };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy
      }),
      prisma.blog.count({ where })
    ]);

    // Extract unique categories & tags from database for filter chips
    const allCategoriesRaw = await prisma.blog.findMany({
      select: { category: true, categories: true }
    });

    const categoriesSet = new Set(['All']);
    const tagsSet = new Set(['All']);

    allCategoriesRaw.forEach(b => {
      if (b.category) categoriesSet.add(b.category);
      if (Array.isArray(b.categories)) {
        b.categories.forEach(c => categoriesSet.add(c));
      }
    });

    res.json({
      blogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      categories: Array.from(categoriesSet),
      tags: Array.from(tagsSet)
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single blog by slug or ID with related articles
 */
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const isId = !isNaN(slug);

    const blog = await prisma.blog.findFirst({
      where: isId
        ? { OR: [{ id: parseInt(slug) }, { slug }] }
        : { slug }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Fetch 4 related blogs from same category or random
    const relatedBlogs = await prisma.blog.findMany({
      where: {
        id: { not: blog.id },
        ...(blog.category ? { category: blog.category } : {})
      },
      take: 4,
      orderBy: { createdAt: 'desc' }
    });

    // Previous and Next post navigation
    const [previousBlog, nextBlog] = await Promise.all([
      prisma.blog.findFirst({
        where: { createdAt: { lt: blog.createdAt } },
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, slug: true, featuredImage: true }
      }),
      prisma.blog.findFirst({
        where: { createdAt: { gt: blog.createdAt } },
        orderBy: { createdAt: 'asc' },
        select: { id: true, title: true, slug: true, featuredImage: true }
      })
    ]);

    res.json({
      blog,
      relatedBlogs,
      navigation: {
        previous: previousBlog,
        next: nextBlog
      }
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a custom manual blog post
 */
const createBlog = async (req, res) => {
  try {
    const { title, slug, content, excerpt, category, author, image, featuredImage } = req.body;

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const blog = await prisma.blog.create({
      data: {
        title,
        slug: generatedSlug,
        content,
        excerpt: excerpt || content.slice(0, 160),
        category: category || 'Wellness',
        author: author || 'Paidhu Team',
        image: image || featuredImage,
        featuredImage: featuredImage || image,
        readingTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
      }
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update existing blog post
 */
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const blog = await prisma.blog.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete blog post
 */
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.blog.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Manual trigger for WordPress blog import
 */
const importBlogsManual = async (req, res) => {
  try {
    const results = await importWordPressBlogs();
    res.json({ success: true, message: 'WordPress import completed', results });
  } catch (error) {
    console.error('Manual import error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Manual trigger for WordPress blog synchronization
 */
const syncBlogsManual = async (req, res) => {
  try {
    const results = await runSync();
    res.json({ success: true, message: 'WordPress synchronization completed', results });
  } catch (error) {
    console.error('Manual sync error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get sync status and summary metrics for admin dashboard
 */
const getSyncLogs = async (req, res) => {
  try {
    const status = getSyncStatus();
    const totalCount = await prisma.blog.count();
    const wpCount = await prisma.blog.count({ where: { wordpressId: { not: null } } });
    const lastPost = await prisma.blog.findFirst({ orderBy: { lastSynced: 'desc' } });

    res.json({
      status,
      metrics: {
        totalBlogsInDb: totalCount,
        importedFromWordPress: wpCount,
        lastSyncedAt: lastPost?.lastSynced || null
      }
    });
  } catch (error) {
/**
 * Delete all imported WordPress blogs
 */
const deleteAllImportedBlogs = async (req, res) => {
  try {
    const result = await prisma.blog.deleteMany({
      where: { wordpressId: { not: null } }
    });
    res.json({ success: true, message: `Deleted ${result.count} imported WordPress blogs.` });
  } catch (error) {
    console.error('Delete imported blogs error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  importBlogsManual,
  syncBlogsManual,
  getSyncLogs,
  deleteAllImportedBlogs
};
