'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide your admin email and password.');
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(email.trim(), password);
      showToast('Admin session authorized.', 'success');
      router.push('/admin');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify admin credentials.');
      showToast(err?.message || 'Admin login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#07090E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#0F131C',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '40px 32px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Logo variant="admin" priority />
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              backgroundColor: 'rgba(201,169,110,0.12)',
              border: '1px solid rgba(201,169,110,0.25)',
              borderRadius: '20px',
              color: '#C9A96E',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}
          >
            <ShieldCheck size={14} />
            ADMINISTRATION
          </div>
          <p style={{ color: '#888B96', fontSize: '0.8125rem', margin: 0 }}>
            Secure Atelier Operations & Inventory Console
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              color: '#F87171',
              fontSize: '0.875rem',
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="admin-email" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '8px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@ellext.com"
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  minHeight: '46px'
                }}
              />
              <Mail size={17} style={{ position: 'absolute', left: '14px', top: '15px', color: '#6B7280' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label htmlFor="admin-password" style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB' }}>
                Password
              </label>
              <span style={{ fontSize: '0.8125rem', color: '#888B96', cursor: 'pointer' }} onClick={() => showToast('Contact Super Admin for credential rotation.', 'info')}>
                Forgot Password
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  minHeight: '46px'
                }}
              />
              <Lock size={17} style={{ position: 'absolute', left: '14px', top: '15px', color: '#6B7280' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              minHeight: '48px',
              backgroundColor: '#C9A96E',
              color: '#0A0D14',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
              transition: 'background-color 0.15s ease'
            }}
          >
            {loading ? 'Validating Session...' : 'Sign In'} <ArrowRight size={16} />
          </button>
          <Link href="/admin/register" style={{ display: 'block', textAlign: 'center', marginTop: '18px', color: '#C9A96E', fontSize: '0.8125rem' }}>
            Create initial admin account
          </Link>
        </form>
      </div>
    </div>
  );
}
