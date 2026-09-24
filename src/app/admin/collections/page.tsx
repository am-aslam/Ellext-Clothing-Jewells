import Link from 'next/link';

export default function AdminCollectionsPage() {
  return <div><h1 style={{ color: '#FFF', fontSize: '1.625rem' }}>Collections</h1><p style={{ color: '#9CA3AF', margin: '6px 0 24px' }}>Organize catalogue products into collections from the product editor.</p><div style={{ background: '#0F131C', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: 24, color: '#D1D5DB' }}><p>Collections are stored in Supabase and used by the customer storefront filters.</p><Link href="/admin/products" style={{ color: '#C9A96E' }}>Open product catalogue →</Link></div></div>;
}
