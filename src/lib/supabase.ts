import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read credentials from environment variables (both Vite import.meta.env and Node process.env)
const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv[key]) {
    return metaEnv[key] as string;
  }
  return '';
};

const rawSupabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');

// Clean URL: Strip any trailing /rest/v1 or /rest/v1/ or trailing slash
export const supabaseUrl = rawSupabaseUrl
  ? rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
  : '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null;

if (isSupabaseConfigured) {
  console.log('Supabase initialized successfully with URL:', supabaseUrl);
} else {
  console.warn('Supabase is not configured. Missing SUPABASE_URL or SUPABASE_ANON_KEY.');
}

let bucketChecked = false;
export async function ensureBucketExists(bucketName: string = 'denon-images'): Promise<void> {
  if (!supabase || bucketChecked) return;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === bucketName);
    if (!exists) {
      await supabase.storage.createBucket(bucketName, { public: true });
    }
    bucketChecked = true;
  } catch (e) {
    console.warn('Bucket verification notice:', e);
  }
}

/**
 * Uploads an image (File object or base64 string) to Supabase Storage.
 * Returns the public CDN URL of the uploaded file.
 */
export async function uploadImageToSupabase(
  fileOrBase64: File | string,
  fileNamePrefix: string = 'image'
): Promise<string> {
  if (!supabase) {
    console.warn('Supabase client not available for image upload.');
    return typeof fileOrBase64 === 'string' ? fileOrBase64 : URL.createObjectURL(fileOrBase64);
  }

  try {
    await ensureBucketExists('denon-images');

    let fileBlob: Blob;
    let extension = 'png';

    if (typeof fileOrBase64 === 'string') {
      if (!fileOrBase64.startsWith('data:image/')) {
        // Already a HTTP URL, return as is
        return fileOrBase64;
      }
      const matches = fileOrBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches) return fileOrBase64;

      const mimeType = matches[1];
      extension = mimeType.split('/')[1] || 'png';
      const byteCharacters = atob(matches[2]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      fileBlob = new Blob([byteArray], { type: mimeType });
    } else {
      fileBlob = fileOrBase64;
      extension = fileOrBase64.name.split('.').pop() || 'png';
    }

    const bucketName = 'denon-images';
    const cleanPrefix = fileNamePrefix.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = `${cleanPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extension}`;

    // Upload to Supabase Storage bucket
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, fileBlob, {
      contentType: fileBlob.type || `image/${extension}`,
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      console.warn('Supabase storage upload notice:', error.message);
      return typeof fileOrBase64 === 'string' ? fileOrBase64 : URL.createObjectURL(fileOrBase64);
    }

    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Error uploading image to Supabase Storage:', err);
    return typeof fileOrBase64 === 'string' ? fileOrBase64 : URL.createObjectURL(fileOrBase64);
  }
}
