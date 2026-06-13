import { supabase } from './supabaseClient';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const BUCKET_NAME = 'Products';

export const uploadImage = async (file, folder = 'products') => {
  try {
    // 1. Validation
    if (!file) throw new Error("No file provided");
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Invalid image format. Allowed: PNG, JPG, JPEG, WebP");
    }

    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(`Image size exceeds ${MAX_SIZE_MB}MB`);
    }

    // 2. Generate unique filename
    const fileExt = file.name.split('.').pop();
    const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${folder}/${Date.now()}-${cleanName}.${fileExt}`;

    // 3. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
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
