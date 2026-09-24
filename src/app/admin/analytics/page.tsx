'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { AdminMetrics } from '@/types';
import { LoadingState } from '@/components/ui/States';

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getAdminMetrics().then(setMetrics).catch(err => setError(err?.message ?? 'Could not load analytics.'));
  }, []);

  if (!metrics && !error) return <LoadingState message="Loading operational analytics..." />;
  if (error) return <div style={{ color: '#FCA5A5', padding: 24 }}>{error}</div>;

  const cards = [
    ['Revenue', `₹${Number(metrics?.todaySales ?? 0).toLocaleString('en-IN')}`],
    ['Orders', String(metrics?.ordersCount ?? 0)],
    ['Pending orders', String(metrics?.pendingOrdersCount ?? 0)],
    ['Customers', String(metrics?.customersCount ?? 0)],
    ['Active products', String(metrics?.activeProductsCount ?? 0)],
    ['Low-stock items', String(metrics?.lowStockCount ?? 0)]
  ];

  return <div><h1 style={{ color: '#FFF', fontSize: '1.625rem' }}>Analytics</h1><p style={{ color: '#9CA3AF', margin: '6px 0 24px' }}>Live operational metrics from Supabase.</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>{cards.map(([label, value]) => <div key={label} style={{ background: '#0F131C', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: 20 }}><div style={{ color: '#9CA3AF', fontSize: '.75rem', textTransform: 'uppercase' }}>{label}</div><strong style={{ color: '#C9A96E', display: 'block', fontSize: '1.5rem', marginTop: 8 }}>{value}</strong></div>)}</div></div>;
}
