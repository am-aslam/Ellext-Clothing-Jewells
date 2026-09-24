declare global {
  namespace Express {
    interface Request {
      auth?: { sub: string; kind: 'user' | 'admin'; role?: string; email?: string; token?: string };
    }
  }
}
export {};
