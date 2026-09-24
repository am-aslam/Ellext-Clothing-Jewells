import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { query, closeDatabase } from './db/supabase';
import { errorHandler, requestId } from './utils/http';
import auth from './routes/auth';
import publicRoutes from './routes/public';
import customer from './routes/customer';
import admin from './routes/admin';
import payments from './routes/payments';

export const app = express();
app.disable('x-powered-by'); app.use(helmet()); app.use(requestId); app.use(cors({ origin: env.FRONTEND_URL.split(',').map(x => x.trim()), credentials: true })); app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));
// Vercel Services routes the original /api/backend path to this service.
// Normalize that public mount to the API's established /api route prefix.
app.use((req, _res, next) => {
  if (req.url === '/api/backend' || req.url.startsWith('/api/backend/')) {
    const suffix = req.url.slice('/api/backend'.length);
    const queryIndex = suffix.indexOf('?');
    const pathname = queryIndex < 0 ? suffix : suffix.slice(0, queryIndex);
    const search = queryIndex < 0 ? '' : suffix.slice(queryIndex);
    req.url = `${pathname.startsWith('/api/') || pathname === '/api' ? pathname : `/api${pathname || ''}`}${search}`;
  }
  next();
});
app.get(['/health', '/api/health'], async (_req,res)=>{try{await query('select 1');res.json({success:true,data:{service:'ellext-api',status:'ok',timestamp:new Date().toISOString()}});}catch{res.status(503).json({success:false,error:{code:'DATABASE_UNAVAILABLE',message:'Service is temporarily unavailable.'}});}});
app.get('/api/docs',(_req,res)=>res.json({success:true,data:{openapi:'3.0.3',info:{title:'Ellext API',version:'1.0.0'},servers:[{url:'/api'}]}}));
app.use('/api/payments/webhook', express.raw({ type: 'application/json', limit: '2mb' })); app.use(express.json({ limit: '2mb' }));
app.use('/api/auth',auth); app.use('/api',publicRoutes); app.use('/api',customer); app.use('/api/admin',admin); app.use('/api/payments',payments); app.use((_req,res)=>res.status(404).json({success:false,error:{code:'NOT_FOUND',message:'Route not found.'}})); app.use(errorHandler);
if (require.main === module) { const server=app.listen(env.API_PORT,()=>console.log(`Ellext API listening on ${env.API_PORT}`)); const shutdown=async()=>{server.close();await closeDatabase();process.exit(0);}; process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown); }

export default app;
