'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginCustomer } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    setLoading(true);
    try {
      await loginCustomer(email, password);
      showToast('Welcome back to Ellext.', 'success');
      router.push('/account');
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password.');
      showToast(err?.message || 'Login failed. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div
        className="auth-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#0D1117',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '40px 32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" aria-label="Home">
            <Logo variant="auth" priority />
          </Link>
          <h1 className="font-serif" style={{ fontSize: '1.625rem', fontWeight: 500, color: '#FFF', marginTop: '20px', letterSpacing: '0.02em' }}>
            Client Access
          </h1>
          <p style={{ color: '#888B96', fontSize: '0.875rem', marginTop: '6px' }}>
            Sign in to access your orders, private salon previews, and saved repertoire.
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
            <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '8px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@domain.com"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
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
              <label htmlFor="login-password" style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB' }}>
                Password
              </label>
              <Link href="/forgot-password" style={{ fontSize: '0.8125rem', color: '#C9A96E', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
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
            className="elx-btn elx-btn-primary"
            style={{
              width: '100%',
              minHeight: '48px',
              marginTop: '8px',
              fontSize: '0.875rem',
              letterSpacing: '0.08em',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.875rem', color: '#888B96' }}>
          New to the Maison?{' '}
          <Link href="/register" style={{ color: '#C9A96E', fontWeight: 500, textDecoration: 'none' }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
