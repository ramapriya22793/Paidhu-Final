const { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const accountId = process.env.R2_ACCOUNT_ID ? process.env.R2_ACCOUNT_ID.trim() : '2288118ef7bc54f086a37f280b561158';
const accessKeyId = process.env.R2_ACCESS_KEY_ID ? process.env.R2_ACCESS_KEY_ID.trim() : 'cf1e1417fb20c7bb0765c07aa2d6be53';
let secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ? process.env.R2_SECRET_ACCESS_KEY.trim() : 'a5a4c01d8eac25b8e504f479b2c306cda9fc9707d09d5f3dba13dee0f640aad6';

// Clean any potential template prefix accidentally pasted
if (secretAccessKey.startsWith('your_actual_secret_access')) {
  secretAccessKey = secretAccessKey.replace('your_actual_secret_access', '');
}

const bucketName = process.env.R2_BUCKET_NAME ? process.env.R2_BUCKET_NAME.trim() : 'paidhu-assets';
const rawEndpoint = process.env.R2_ENDPOINT ? process.env.R2_ENDPOINT.trim() : `https://${accountId}.r2.cloudflarestorage.com`;
const endpoint = rawEndpoint.replace('your_actual_account_id', accountId);

let r2ClientInstance = null;

function getR2Client() {
  if (!r2ClientInstance) {
    r2ClientInstance = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }
  return r2ClientInstance;
}

const isR2Configured = () => {
  return Boolean(accountId && accessKeyId && secretAccessKey && bucketName);
};

// Cache signed URLs in memory for 6 days (signatures last 7 days = 604800s)
const signedUrlCache = new Map();
const SIGNATURE_EXPIRY_SECONDS = 604800; // 7 days
const CACHE_TTL_MS = 6 * 24 * 60 * 60 * 1000; // 6 days

/**
 * Generate a direct Cloudflare R2 URL (uses custom R2_PUBLIC_URL if set, otherwise 7-day presigned R2 URL)
 * Ensures 100% of image and video egress comes directly from Cloudflare R2 edge.
 */
async function getDirectR2Url(rawKey, method = 'GET') {
  if (!rawKey) return rawKey;

  // Clean key
  let key = rawKey;
  try {
    key = decodeURIComponent(rawKey);
  } catch (e) {}
  key = key.replace(/^\/+/, '').replace(/^api\/storage\/+/, '');

  if (process.env.R2_PUBLIC_URL) {
    const base = process.env.R2_PUBLIC_URL.replace(/\/+$/, '');
    const encodedKey = key.split('/').map(encodeURIComponent).join('/');
    return `${base}/${encodedKey}`;
  }

  const cacheKey = `${method}:${key}`;
  const now = Date.now();
  const cached = signedUrlCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.url;
  }

  const client = getR2Client();
  const CommandClass = method === 'HEAD' ? HeadObjectCommand : GetObjectCommand;
  const command = new CommandClass({
    Bucket: bucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn: SIGNATURE_EXPIRY_SECONDS });
  signedUrlCache.set(cacheKey, {
    url: signedUrl,
    expiresAt: now + CACHE_TTL_MS,
  });

  return signedUrl;
}

/**
 * Extract storage key if a string is a storage path or R2 URL
 */
function extractStorageKey(str) {
  if (typeof str !== 'string') return null;

  // Match /api/storage/<key> or http(s)://.../api/storage/<key>
  const apiStorageMatch = str.match(/(?:^|https?:\/\/[^/]+)\/api\/storage\/([^?#\s"']+)/i);
  if (apiStorageMatch && apiStorageMatch[1] && apiStorageMatch[1] !== 'status') {
    return apiStorageMatch[1];
  }

  // Match any legacy Supabase storage URL https://<proj>.supabase.co/storage/v1/object/public/products/<key>
  const supabaseMatch = str.match(/^https?:\/\/[a-z0-9_-]+\.supabase\.co\/storage\/v1\/object\/public\/(?:products|Products)\/([^?#\s"']+)/i);
  if (supabaseMatch && supabaseMatch[1]) {
    return supabaseMatch[1];
  }

  // Match direct R2 URL https://<bucket>.<account>.r2.cloudflarestorage.com/<key>?...
  const r2DirectMatch = str.match(/^https?:\/\/[^/]+\.r2\.cloudflarestorage\.com\/([^?#\s"']+)/i);
  if (r2DirectMatch && r2DirectMatch[1]) {
    let key = r2DirectMatch[1];
    if (key.startsWith(`${bucketName}/`)) {
      key = key.slice(bucketName.length + 1);
    }
    return key;
  }

  return null;
}

/**
 * Recursively sign all R2 storage URLs in an API response payload so the browser
 * fetches images/videos directly from Cloudflare R2 (100% Cloudflare egress).
 */
async function signStorageUrlsInData(data) {
  if (!data || !isR2Configured()) return data;

  if (typeof data === 'string') {
    // Check if the entire string is a storage URL
    const directKey = extractStorageKey(data);
    if (directKey && (data.startsWith('/api/storage/') || data.startsWith('http'))) {
      return getDirectR2Url(directKey);
    }
    // Check if it's a JSON string containing /api/storage/ or .supabase.co/storage/
    if (data.includes('/api/storage/') || data.includes('.supabase.co/storage/')) {
      try {
        const parsed = JSON.parse(data);
        const signedParsed = await signStorageUrlsInData(parsed);
        return JSON.stringify(signedParsed);
      } catch (e) {
        return data;
      }
    }
    return data;
  }

  if (Array.isArray(data)) {
    return Promise.all(data.map(item => signStorageUrlsInData(item)));
  }

  if (typeof data === 'object') {
    if (data instanceof Date || Buffer.isBuffer(data)) return data;
    const result = {};
    const entries = Object.entries(data);
    await Promise.all(entries.map(async ([k, v]) => {
      result[k] = await signStorageUrlsInData(v);
    }));
    return result;
  }

  return data;
}

/**
 * Normalize any signed Cloudflare R2 URLs in incoming request bodies back to permanent
 * `/api/storage/<key>` paths before saving to PostgreSQL.
 */
function normalizeStorageUrlsInBody(body) {
  if (!body) return body;

  if (typeof body === 'string') {
    if (body.includes('.r2.cloudflarestorage.com/')) {
      const key = extractStorageKey(body);
      if (key) {
        let decoded = key;
        try { decoded = decodeURIComponent(key); } catch (e) {}
        return `/api/storage/${decoded}`;
      }
    }
    return body;
  }

  if (Array.isArray(body)) {
    return body.map(item => normalizeStorageUrlsInBody(item));
  }

  if (typeof body === 'object') {
    const result = {};
    for (const [k, v] of Object.entries(body)) {
      result[k] = normalizeStorageUrlsInBody(v);
    }
    return result;
  }

  return body;
}

/**
 * Live health check to verify connection to Cloudflare R2 bucket
 */
async function checkR2Status() {
  if (!isR2Configured()) {
    return {
      connected: false,
      error: 'R2 environment variables are missing',
    };
  }

  try {
    const client = getR2Client();
    const res = await client.send(new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 1,
    }));

    return {
      connected: true,
      provider: 'Cloudflare R2',
      bucket: bucketName,
      endpoint: endpoint,
      egress: 'Direct Cloudflare R2 Edge (Zero Egress Fee)',
      status: 'Connected & Operational',
      keyCount: res.KeyCount ?? 0,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      connected: false,
      provider: 'Cloudflare R2',
      bucket: bucketName,
      error: err.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Upload a buffer to Cloudflare R2
 */
async function uploadToR2(buffer, key, contentType = 'image/webp') {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  await client.send(command);
  return { key, bucket: bucketName };
}

/**
 * Retrieve an object stream from Cloudflare R2 (supports HTTP Range headers for video streaming)
 */
async function getFromR2(key, range = null) {
  const client = getR2Client();
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  if (range) {
    params.Range = range;
  }
  const command = new GetObjectCommand(params);
  const response = await client.send(command);
  return {
    body: response.Body,
    contentType: response.ContentType || 'image/jpeg',
    contentLength: response.ContentLength,
    contentRange: response.ContentRange,
    etag: response.ETag,
    lastModified: response.LastModified,
    isPartial: Boolean(range && response.ContentRange),
  };
}

/**
 * Delete an object from Cloudflare R2
 */
async function deleteFromR2(key) {
  const client = getR2Client();
  const cleanKey = extractStorageKey(key) || key.replace(/^\/+/, '').replace(/^api\/storage\/+/, '');
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: cleanKey,
  });
  return client.send(command);
}

/**
 * Resolve public URL for an R2 key
 */
function getR2PublicUrl(key) {
  if (process.env.R2_PUBLIC_URL) {
    const base = process.env.R2_PUBLIC_URL.replace(/\/+$/, '');
    return `${base}/${key}`;
  }
  return `/api/storage/${key}`;
}

module.exports = {
  getR2Client,
  isR2Configured,
  checkR2Status,
  uploadToR2,
  getFromR2,
  deleteFromR2,
  getR2PublicUrl,
  getDirectR2Url,
  signStorageUrlsInData,
  normalizeStorageUrlsInBody,
  bucketName,
  endpoint,
};
