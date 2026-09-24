import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message);
  }
}

export const ok = (res: Response, data: unknown, pagination?: unknown) =>
  res.json(pagination ? { success: true, data, pagination } : { success: true, data });

export const asyncHandler = (fn: (req: any, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.header('x-request-id') || crypto.randomUUID();
  res.setHeader('x-request-id', id);
  (req as Request & { requestId?: string }).requestId = id;
  next();
};

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ApiError) return res.status(error.status).json({ success: false, error: { code: error.code, message: error.message, details: error.details } });
  if ((error as { code?: string })?.code === 'P2002') return res.status(409).json({ success: false, error: { code: 'DUPLICATE_RESOURCE', message: 'A resource with that value already exists.' } });
  console.error(error);
  return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected server error occurred.' } });
}
