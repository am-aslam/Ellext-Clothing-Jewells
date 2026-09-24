import Link from 'next/link';

export default function AdminSettingsPage() {
  return <div><h1 style={{ color: '#FFF', fontSize: '1.625rem' }}>Settings</h1><p style={{ color: '#9CA3AF', margin: '6px 0 24px' }}>Manage operational access and platform configuration.</p><div style={{ display: 'grid', gap: 16, maxWidth: 620 }}><div style={{ background: '#0F131C', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: 24 }}><h2 style={{ color: '#FFF', fontSize: '1.1rem' }}>Team access</h2><p style={{ color: '#9CA3AF' }}>Create, suspend, and update admin accounts.</p><Link href="/admin/team" style={{ color: '#C9A96E' }}>Open Team & Access →</Link></div><div style={{ background: '#0F131C', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: 24 }}><h2 style={{ color: '#FFF', fontSize: '1.1rem' }}>Backend status</h2><p style={{ color: '#86EFAC' }}>Connected to the configured backend API.</p></div></div></div>;
}
