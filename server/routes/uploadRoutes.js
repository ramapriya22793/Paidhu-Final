const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToR2, deleteFromR2, getR2PublicUrl, isR2Configured, checkR2Status } = require('../utils/r2Client');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// GET /api/upload/status - Health check for Cloudflare R2 connection
router.get('/status', async (req, res) => {
  const status = await checkR2Status();
  return res.json({
    ...status,
    uploadRoute: '/api/upload',
    storageRoute: '/api/storage',
  });
});

router.post('/', upload.any(), async (req, res) => {
  try {
    const file = req.files && req.files.length > 0 ? req.files[0] : req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const folder = req.body.folder || 'products';
    const originalName = file.originalname || 'upload.jpg';
    const ext = originalName.split('.').pop() || 'jpg';
    const cleanName = originalName.replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${folder}/${Date.now()}-${cleanName}.${ext}`;
    const contentType = file.mimetype || 'image/jpeg';

    if (!isR2Configured()) {
      return res.status(503).json({ success: false, error: 'Cloudflare R2 storage is not configured' });
    }

    await uploadToR2(file.buffer, fileName, contentType);
    const publicUrl = getR2PublicUrl(fileName, req);

    return res.json({
      success: true,
      publicUrl,
      imagePath: fileName,
      storage: 'cloudflare-r2'
    });
  } catch (err) {
    console.error('Cloudflare R2 Upload handler error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE endpoint for image cleanup from Cloudflare R2
router.delete('/', async (req, res) => {
  try {
    const { imagePath } = req.body;
    if (!imagePath) {
      return res.status(400).json({ success: false, error: 'imagePath is required' });
    }

    if (isR2Configured()) {
      await deleteFromR2(imagePath);
    }

    return res.json({ success: true, storage: 'cloudflare-r2' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
