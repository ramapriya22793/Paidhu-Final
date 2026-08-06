import { supabase } from './supabaseClient';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const BUCKET_NAME = 'products';

export const uploadImage = async (file, folder = 'products') => {
  try {
    if (!supabase) {
      throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
    }
    // 1. Validation
    if (!file) throw new Error("No file provided");

    let processedFile = file;
    if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
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
        throw new Error("Failed to convert HEIC image: " + err.message);
      }
    }
    
    if (!ALLOWED_TYPES.includes(processedFile.type)) {
      throw new Error("Invalid image format. Allowed: PNG, JPG, JPEG, WebP");
    }

    if (processedFile.size > MAX_SIZE_BYTES) {
      throw new Error(`Image size exceeds ${MAX_SIZE_MB}MB`);
    }

    // 2. Generate unique filename
    const fileExt = processedFile.name.split('.').pop();
    const cleanName = processedFile.name.replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${folder}/${Date.now()}-${cleanName}.${fileExt}`;

    // 3. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, processedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // 4. Generate Public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return {
      publicUrl: publicUrlData.publicUrl,
      imagePath: fileName,
      error: null
    };

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
    if (!supabase) {
      throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
    }
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([imagePath]);

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message || "Failed to delete image" };
  }
};
