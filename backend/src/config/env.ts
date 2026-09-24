import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
  SUPABASE_DB_URL: z.string().min(1),
  API_PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(12).optional(),
  ADMIN_NAME: z.string().default('Ellext Admin'),
  ADMIN_SETUP_KEY: z.string().min(1).optional(),
  ADMIN_APP_URL: z.string().url().optional(),
  ADMIN_ORDER_EMAIL: z.string().email().default('aslamsadique01@gmail.com'),
  EMAIL_FROM: z.string().default('Ellext <no-reply@ellext.com>'),
  EMAIL_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  STORAGE_ENDPOINT: z.string().optional(),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  PAYMENT_KEY_ID: z.string().optional(),
  PAYMENT_KEY_SECRET: z.string().optional(),
  PAYMENT_WEBHOOK_SECRET: z.string().optional(),
  TAX_RATE: z.coerce.number().default(0),
  SHIPPING_KERALA_RATE: z.coerce.number().default(60),
  SHIPPING_OUTSIDE_KERALA_RATE: z.coerce.number().default(90),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
});

export const env = schema.parse(process.env);
