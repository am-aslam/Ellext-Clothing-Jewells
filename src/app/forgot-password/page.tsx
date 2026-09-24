'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { api } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      setSubmitted(true);
      showToast('Reset instructions dispatched.', 'success');
    } catch (err: any) {
      setError(err?.message || 'Failed to process password reset request.');
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
            Password Recovery
          </h1>
          <p style={{ color: '#888B96', fontSize: '0.875rem', marginTop: '6px' }}>
            Enter your registered email address to receive secure reset credentials.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} style={{ color: '#C9A96E', margin: '0 auto 16px' }} />
            <h3 style={{ color: '#FFF', fontSize: '1.125rem', marginBottom: '8px' }}>Instructions Dispatched</h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '24px' }}>
              If a client account exists for <strong>{email}</strong>, you will receive a secure password reset link shortly.
            </p>
            <Link href="/login" className="elx-btn elx-btn-secondary" style={{ width: '100%', minHeight: '44px' }}>
              <ArrowLeft size={16} /> Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

            <div>
              <label htmlFor="recovery-email" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '8px' }}>
                Account Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="recovery-email"
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
              {loading ? 'Transmitting...' : 'Send Recovery Link'} <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <Link href="/login" style={{ color: '#9CA3AF', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
