import path from 'node:path';
import { supabase } from '../db/supabase';

const allowedMime = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const allowedStorageMimeTypes = [...allowedMime];
export function validateImageUpload(mimeType: string, size: number) {
  if (!allowedMime.has(mimeType)) throw new Error('Only JPEG, PNG, WebP, and AVIF images are allowed.');
  if (size > 10 * 1024 * 1024) throw new Error('Images must be 10 MB or smaller.');
}
export function storageKey(originalName: string) { return `products/${Date.now()}-${path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, '-')}`; }

type BucketSetupResult =
  | { ok: true }
  | { ok: false; code: 'STORAGE_UNAVAILABLE' | 'STORAGE_SETUP_FAILED'; detail: string };

/** Ensure product images have a public bucket; tolerate concurrent first uploads. */
export async function ensureProductImageBucket(bucketName: string): Promise<BucketSetupResult> {
  const listed = await supabase.storage.listBuckets();
  if (listed.error) {
    return { ok: false, code: 'STORAGE_UNAVAILABLE', detail: listed.error.message };
  }

  let bucket = listed.data.find(item => item.name === bucketName);
  if (!bucket) {
    const created = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: '10MB',
      allowedMimeTypes: allowedStorageMimeTypes
    });
    if (!created.error) return { ok: true };

    // Another upload may have created the bucket after listBuckets returned.
    const existing = await supabase.storage.getBucket(bucketName);
    if (existing.error) {
      return { ok: false, code: 'STORAGE_SETUP_FAILED', detail: created.error.message };
    }
    bucket = existing.data;
  }

  if (!bucket.public) {
    const updated = await supabase.storage.updateBucket(bucketName, {
      public: true,
      fileSizeLimit: '10MB',
      allowedMimeTypes: allowedStorageMimeTypes
    });
    if (updated.error) {
      return { ok: false, code: 'STORAGE_SETUP_FAILED', detail: updated.error.message };
    }
  }

  return { ok: true };
}
