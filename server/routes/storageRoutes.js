const express = require('express');
const router = express.Router();
const { getDirectR2Url, isR2Configured, checkR2Status } = require('../utils/r2Client');

// Direct Cloudflare R2 Redirect / Delivery Route
router.use(async (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  try {
    // Extract key after /api/storage/ (e.g. products/172871-image.webp)
    const rawPath = req.path || '';
    const rawKey = rawPath.replace(/^\/+/, '');
    if (!rawKey) {
      return res.status(400).json({ error: 'No storage key provided' });
    }

    // Health check endpoint
    if (rawKey === 'status') {
      const status = await checkR2Status();
      return res.json(status);
    }

    // Sanitize key (prevent path traversal)
    const key = decodeURIComponent(rawKey).replace(/\.\./g, '').replace(/^\/+/, '');

    if (!isR2Configured()) {
      return res.status(503).json({ error: 'Cloudflare R2 storage is not configured' });
    }

    // Generate direct Cloudflare R2 URL (cached in memory for 6 days)
    // Redirecting (307) ensures the browser downloads images & streams videos
    // 100% directly from Cloudflare R2 edge (zero Vercel/Supabase egress).
    const directR2Url = await getDirectR2Url(key, req.method);

    res.setHeader('X-Storage-Provider', 'Cloudflare-R2');
    res.setHeader('X-R2-Bucket', 'paidhu-assets');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    return res.redirect(307, directR2Url);
  } catch (err) {
    console.error('Cloudflare R2 storage route error:', err.message);
    return res.status(500).json({ error: 'Failed to resolve Cloudflare R2 URL' });
  }
});

module.exports = router;
