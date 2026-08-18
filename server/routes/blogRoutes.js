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

// Import & Sync Routes
router.post('/import', importBlogsManual);
router.post('/sync', syncBlogsManual);
router.delete('/imported/all', deleteAllImportedBlogs);

// Admin Custom CRUD Routes
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
