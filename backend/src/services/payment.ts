import crypto from 'node:crypto';
import { env } from '../config/env';

export function verifyWebhookSignature(payload: Buffer | string, signature: string | undefined) {
  if (!env.PAYMENT_WEBHOOK_SECRET || !signature) return false;
  const digest = crypto.createHmac('sha256', env.PAYMENT_WEBHOOK_SECRET).update(payload).digest('hex');
  if (digest.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
