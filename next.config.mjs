/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  async rewrites() {
    // On Vercel, /api/* is served by the Express function in /api. Locally,
    // keep the same-origin proxy pointed at the separately running API server.
    if (process.env.VERCEL) return [];
    const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');
    return [{ source: '/api/:path*', destination: `${apiOrigin}/api/:path*` }];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
