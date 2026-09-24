'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { api } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams?.get('token') || '';
  const { showToast } = useToast();

  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('A valid reset token is required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({ token: token.trim(), password });
      setSuccess(true);
      showToast('Password updated successfully.', 'success');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      setError(err?.message || 'Password reset link is invalid or has expired.');
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
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" aria-label="Home">
            <Logo variant="auth" priority />
          </Link>
          <h1 className="font-serif" style={{ fontSize: '1.625rem', fontWeight: 500, color: '#FFF', marginTop: '20px', letterSpacing: '0.02em' }}>
            Set New Password
          </h1>
          <p style={{ color: '#888B96', fontSize: '0.875rem', marginTop: '6px' }}>
            Enter your new credentials to restore access to your account.
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} style={{ color: '#10B981', margin: '0 auto 16px' }} />
            <h3 style={{ color: '#FFF', fontSize: '1.125rem', marginBottom: '8px' }}>Password Successfully Updated</h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Redirecting you to client sign-in...
            </p>
            <Link href="/login" className="elx-btn elx-btn-primary" style={{ width: '100%', minHeight: '44px' }}>
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  color: '#F87171',
                  fontSize: '0.875rem'
                }}
              >
                {error}
              </div>
            )}

            {!tokenFromQuery && (
              <div>
                <label htmlFor="reset-token" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                  Reset Security Token *
                </label>
                <input
                  id="reset-token"
                  type="text"
                  required
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="Paste token from email"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    minHeight: '46px'
                  }}
                />
              </div>
            )}

            <div>
              <label htmlFor="new-password" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                New Password (minimum 8 characters) *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
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

            <div>
              <label htmlFor="confirm-new-password" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                Confirm New Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirm-new-password"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
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
                marginTop: '10px',
                fontSize: '0.875rem',
                letterSpacing: '0.08em',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}
            >
              {loading ? 'Updating Password...' : 'Save New Password'} <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#FFF' }}>Loading security form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
