const express = require('express');
const router = express.Router();
const { getR2Client, isR2Configured, checkR2Status } = require('../utils/r2Client');
const { GetObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

// Direct Cloudflare R2 Stream / Delivery Route
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

    if (process.env.R2_PUBLIC_URL) {
      const base = process.env.R2_PUBLIC_URL.replace(/\/+$/, '');
      const encodedKey = key.split('/').map(encodeURIComponent).join('/');
      return res.redirect(307, `${base}/${encodedKey}`);
    }

    const client = getR2Client();
    const CommandClass = req.method === 'HEAD' ? HeadObjectCommand : GetObjectCommand;
    const commandParams = {
      Bucket: 'paidhu-assets',
      Key: key
    };

    if (req.headers.range && req.method === 'GET') {
      commandParams.Range = req.headers.range;
    }

    const s3Res = await client.send(new CommandClass(commandParams));

    if (s3Res.ContentType) res.setHeader('Content-Type', s3Res.ContentType);
    if (s3Res.ContentLength) res.setHeader('Content-Length', s3Res.ContentLength);
    if (s3Res.ETag) res.setHeader('ETag', s3Res.ETag);
    res.setHeader('Accept-Ranges', 'bytes');
    if (s3Res.ContentRange) {
      res.setHeader('Content-Range', s3Res.ContentRange);
      res.status(206);
    }
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    res.setHeader('X-Storage-Provider', 'Cloudflare-R2');

    if (req.method === 'HEAD') {
      return res.status(200).end();
    }

    return s3Res.Body.pipe(res);
  } catch (err) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      return res.status(404).json({ error: 'Object not found in Cloudflare R2' });
    }
    console.error('Cloudflare R2 storage route error:', err.message);
    return res.status(500).json({ error: 'Failed to deliver object from Cloudflare R2' });
  }
});

module.exports = router;
