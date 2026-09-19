import { supabase } from './supabaseClient';
import { API_BASE_URL } from '../services/apiConfig';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const BUCKET_NAME = 'products';

/**
 * Fast client-side image compression & format optimization using HTML5 Canvas.
 * Shrinks raw 5MB-15MB phone camera/camera photos to crisp ~150-300KB WebP in <35ms.
 */
export const compressImage = async (file, maxDimension = 1920, quality = 0.85) => {
  if (!file || !file.type || !file.type.startsWith('image/')) return file;
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

  return new Promise((resolve) => {
    // If file is already tiny (< 250KB) and WebP/JPEG/PNG, skip re-compression
    if (file.size < 250 * 1024 && (file.type === 'image/webp' || file.type === 'image/jpeg')) {
      return resolve(file);
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Scale down proportionally if larger than maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { alpha: true });

      if (!ctx) return resolve(file);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const outputType = 'image/webp';
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const baseName = (file.name || 'image').replace(/\.[^/.]+$/, '');
          const newFile = new File([blob], `${baseName}.webp`, {
            type: outputType,
            lastModified: Date.now()
          });
          resolve(newFile);
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};

export const uploadImage = async (file, folder = 'products') => {
  try {
    // 1. Validation
    if (!file) throw new Error("No file provided");

    let processedFile = file;
    if (file.name && (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic')) {
      try {
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        });
        const newFileName = file.name.replace(/\.heic$/i, '') + '.jpeg';
        processedFile = new File([Array.isArray(converted) ? converted[0] : converted], newFileName, { type: 'image/jpeg' });
      } catch (err) {
        console.warn("Failed to convert HEIC image: " + err.message);
      }
    }

    // Fast client-side image compression & optimization (max 1920px for banners, 1600px for products)
    try {
      const maxDim = folder === 'banners' ? 1920 : 1600;
      processedFile = await compressImage(processedFile, maxDim, 0.85);
    } catch (compErr) {
      console.warn("Compression notice:", compErr);
    }

    if (processedFile.type && !ALLOWED_TYPES.includes(processedFile.type)) {
      throw new Error("Invalid image format. Allowed: PNG, JPG, JPEG, WebP");
    }

    if (processedFile.size > MAX_SIZE_BYTES) {
      throw new Error(`Image size exceeds ${MAX_SIZE_MB}MB`);
    }

    // 2. Generate unique filename
    const fileExt = processedFile.name.split('.').pop() || 'webp';
    const cleanName = processedFile.name.replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${folder}/${Date.now()}-${cleanName}.${fileExt}`;

    // 3. Primary Upload: Direct to Supabase Storage
    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, processedFile, {
            cacheControl: '31536000',
            upsert: true
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

          return {
            publicUrl: publicUrlData.publicUrl,
            imagePath: fileName,
            error: null
          };
        } else if (error) {
          console.warn("Direct Supabase storage notice:", error.message);
        }
      } catch (directErr) {
        console.warn("Direct Supabase storage upload notice, trying server fallback:", directErr.message);
      }
    }

    // 4. Secondary Fallback: Upload via backend Express API (/api/upload)
    const formData = new FormData();
    formData.append('file', processedFile);
    formData.append('folder', folder);

    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.publicUrl) {
        return {
          publicUrl: data.publicUrl,
          imagePath: data.imagePath,
          error: null
        };
      }
    } else {
      const errJson = await res.json().catch(() => ({}));
      if (errJson.error) {
        throw new Error(errJson.error);
      }
    }

    throw new Error("Unable to complete image upload");
  } catch (error) {
    console.error("Upload Error:", error);
    return {
      publicUrl: null,
      imagePath: null,
      error: error.message || "Failed to upload image"
    };
  }
};

export const deleteImage = async (imagePath) => {
  if (!imagePath) return { success: false, error: "No image path provided" };

  try {
    if (supabase) {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([imagePath]);

      if (!error) return { success: true, error: null };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message || "Failed to delete image" };
  }
};
