import { Request, Response, NextFunction } from 'express';
import { supabase } from '../db/supabase';
import { query } from '../db/supabase';
import { ApiError } from '../utils/http';

function accessToken(req: Request) {
  const header = req.header('authorization');
  return header?.startsWith('Bearer ') ? header.slice(7) : undefined;
}

export async function requireUser(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = accessToken(req);
    if (!token) throw new ApiError(401, 'AUTH_REQUIRED', 'Authentication is required.');
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) throw new ApiError(401, 'AUTH_INVALID', 'Invalid authentication token.');
    const result = await query<{ id: string; email: string; status: string }>('select id, email, status from public.users where id = $1', [data.user.id]);
    if (!result.rowCount || result.rows[0].status !== 'ACTIVE') throw new ApiError(401, 'ACCOUNT_UNAVAILABLE', 'Your customer account is not active.');
    req.auth = { sub: data.user.id, kind: 'user', email: result.rows[0].email, token };
    next();
  } catch (error) { next(error instanceof ApiError ? error : new ApiError(401, 'AUTH_INVALID', 'Invalid authentication token.')); }
}

export function requireAdmin(...roles: string[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = accessToken(req);
      if (!token) throw new ApiError(401, 'AUTH_REQUIRED', 'Admin authentication is required.');
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) throw new ApiError(401, 'AUTH_INVALID', 'Invalid authentication token.');
      const result = await query<{ id: string; email: string; role: string; status: string }>('select id, email, role, status from public.admin_users where id = $1', [data.user.id]);
      if (!result.rowCount || result.rows[0].status !== 'ACTIVE') throw new ApiError(403, 'ADMIN_REQUIRED', 'Active admin access is required.');
      const admin = result.rows[0];
      if (roles.length && !roles.includes(admin.role) && admin.role !== 'SUPER_ADMIN') throw new ApiError(403, 'INSUFFICIENT_ROLE', 'Your admin role cannot perform this action.');
      req.auth = { sub: admin.id, kind: 'admin', role: admin.role, email: admin.email, token };
      next();
    } catch (error) { next(error instanceof ApiError ? error : new ApiError(401, 'AUTH_INVALID', 'Invalid admin authentication token.')); }
  };
}
