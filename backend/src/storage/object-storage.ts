import path from 'node:path';

const allowedMime = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
export function validateImageUpload(mimeType: string, size: number) {
  if (!allowedMime.has(mimeType)) throw new Error('Only JPEG, PNG, WebP, and AVIF images are allowed.');
  if (size > 10 * 1024 * 1024) throw new Error('Images must be 10 MB or smaller.');
}
export function storageKey(originalName: string) { return `products/${Date.now()}-${path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, '-')}`; }
