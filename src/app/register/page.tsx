'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ArrowRight, Lock, Mail, User as UserIcon, Phone } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerCustomer } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError('Please provide all mandatory fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await registerCustomer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password
      });
      showToast('Registration successful. Welcome to Ellext.', 'success');
      router.push('/account');
    } catch (err: any) {
      const message = err?.message || 'Registration failed. Please check your information.';
      const displayMessage = /email rate limit exceeded|over_email_send_rate_limit/i.test(message)
        ? 'Email verification is temporarily limited for this store. Please wait before trying again. The store owner can raise this limit by configuring custom SMTP in Supabase Auth.'
        : message;
      setError(displayMessage);
      showToast(displayMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div
        className="auth-card"
        style={{
          width: '100%',
          maxWidth: '480px',
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
            Client Registration
          </h1>
          <p style={{ color: '#888B96', fontSize: '0.875rem', marginTop: '6px' }}>
            Join the registry of Ellext for regional delivery pricing, bespoke salon consultations, and private acquisitions.
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label htmlFor="reg-name" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Lady / Lord / Mx. Full Name"
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
              <UserIcon size={17} style={{ position: 'absolute', left: '14px', top: '15px', color: '#6B7280' }} />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-email"
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
            <label htmlFor="reg-phone" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
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
              <Phone size={17} style={{ position: 'absolute', left: '14px', top: '15px', color: '#6B7280' }} />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
              Password (minimum 8 characters) *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
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
            <label htmlFor="reg-confirm-password" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
              Confirm Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-confirm-password"
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
            {loading ? 'Creating Account...' : 'Register as Client'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.875rem', color: '#888B96' }}>
          Already have a client account?{' '}
          <Link href="/login" style={{ color: '#C9A96E', fontWeight: 500, textDecoration: 'none' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
