const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../utils/supabaseClient');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const folder = req.body.folder || 'products';
    const originalName = req.file.originalname || 'upload.jpg';
    const ext = originalName.split('.').pop() || 'jpg';
    const cleanName = originalName.replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${folder}/${Date.now()}-${cleanName}.${ext}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype || 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Server upload error:', error.message);
      return res.status(500).json({ success: false, error: error.message });
    }

    const { data: pubData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return res.json({
      success: true,
      publicUrl: pubData.publicUrl,
      imagePath: fileName
    });
  } catch (err) {
    console.error('Upload handler error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
