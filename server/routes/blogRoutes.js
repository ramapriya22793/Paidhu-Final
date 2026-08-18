const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  importBlogsManual,
  syncBlogsManual,
  getSyncLogs,
  deleteAllImportedBlogs
} = require('../controllers/blogController');

// Public Blog Routes
router.get('/', getAllBlogs);
router.get('/sync-status', getSyncLogs);
router.get('/:slug', getBlogBySlug);

const { verifyToken, verifyAdmin, checkPermission } = require('../middleware/authMiddleware');

// Import & Sync Routes
router.post('/import', verifyToken, verifyAdmin, checkPermission('blogs'), importBlogsManual);
router.post('/sync', verifyToken, verifyAdmin, checkPermission('blogs'), syncBlogsManual);
router.delete('/imported/all', verifyToken, verifyAdmin, checkPermission('blogs'), deleteAllImportedBlogs);

// Admin Custom CRUD Routes
router.post('/', verifyToken, verifyAdmin, checkPermission('blogs'), createBlog);
router.put('/:id', verifyToken, verifyAdmin, checkPermission('blogs'), updateBlog);
router.delete('/:id', verifyToken, verifyAdmin, checkPermission('blogs'), deleteBlog);

module.exports = router;
