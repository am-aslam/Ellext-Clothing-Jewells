'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User as UserIcon, Mail, Phone, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AccountProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate updating patron profile
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      showToast('Client profile updated successfully.', 'success');
      setTimeout(() => setSaved(false), 3000);
    }, 600);
  };

  return (
    <div className="account-page-wrapper" style={{ padding: '48px 24px 100px' }}>
      <div className="elx-container" style={{ maxWidth: '640px' }}>
        <Link
          href="/account"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8125rem',
            color: 'var(--color-muted)',
            textDecoration: 'none',
            marginBottom: '28px'
          }}
        >
          <ArrowLeft size={14} /> Back to Patron Dashboard
        </Link>

        <div style={{ marginBottom: '32px' }}>
          <span className="section-sub-label">Private Client Salon</span>
          <h1 className="font-serif" style={{ fontSize: '2rem', fontWeight: 400 }}>
            Profile & Security
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage your personal contact credentials and communication preferences.
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '32px'
          }}
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-noir)', marginBottom: '8px' }}>
                Full Legal Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    fontSize: '0.9375rem',
                    outline: 'none'
                  }}
                />
                <UserIcon size={17} style={{ position: 'absolute', left: '14px', top: '15px', color: '#9CA3AF' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-noir)', marginBottom: '8px' }}>
                Primary Email Address (Immutable)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  disabled
                  value={email}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    fontSize: '0.9375rem',
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    color: '#6B7280'
                  }}
                />
                <Mail size={17} style={{ position: 'absolute', left: '14px', top: '15px', color: '#9CA3AF' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px', display: 'block' }}>
                To change your registered email, contact the private concierge desk.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-noir)', marginBottom: '8px' }}>
                Contact Telephone
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    fontSize: '0.9375rem',
                    outline: 'none'
                  }}
                />
                <Phone size={17} style={{ position: 'absolute', left: '14px', top: '15px', color: '#9CA3AF' }} />
              </div>
            </div>

            <div style={{ paddingTop: '12px', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <button
                type="submit"
                disabled={isSaving}
                className="elx-btn elx-btn-primary"
                style={{ minHeight: '46px', minWidth: '150px' }}
              >
                {isSaving ? 'Updating...' : saved ? 'Changes Saved' : 'Save Changes'}
              </button>
              {saved && (
                <span style={{ color: '#10B981', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={16} /> Saved
                </span>
              )}
            </div>
          </form>

          <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} color="#C9A96E" /> Security Credentials
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginBottom: '16px' }}>
              Need to rotate your authentication password? We will transmit a single-use verification link to your registered email.
            </p>
            <Link href="/forgot-password" className="elx-btn elx-btn-outline elx-btn-sm" style={{ minHeight: '38px' }}>
              Request Password Reset Link
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
