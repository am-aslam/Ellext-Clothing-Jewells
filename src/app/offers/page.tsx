'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Offer } from '@/types';
import { api } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { LoadingState } from '@/components/ui/States';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getOffers(true);
        setOffers(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Privilege code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="offers-page-wrapper">
      <div className="elx-container" style={{ padding: '40px 16px 80px' }}>
        <div className="shop-page-header">
          <span className="section-sub-label">Private Client Privileges</span>
          <h1 className="shop-page-title font-serif">Seasonal Privileges & Offers</h1>
          <p className="shop-page-desc">
            Exclusive acquisition vouchers and courtesy privileges for patrons of Ellext Clothing & Jewells.
          </p>
        </div>

        {loading ? (
          <LoadingState message="Retrieving active privileges..." />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '20px',
              marginTop: '32px'
            }}
          >
            {offers.map(offer => (
              <div
                key={offer.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--color-gold-dark)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      marginBottom: '10px'
                    }}
                  >
                    <Sparkles size={14} />
                    <span>
                      {offer.applicableTo === 'all'
                        ? 'Storewide Privilege'
                        : `Exclusively on ${offer.applicableTo}`}
                    </span>
                  </div>

                  <h2
                    className="font-serif"
                    style={{ fontSize: '1.5rem', marginBottom: '8px', lineHeight: 1.25 }}
                  >
                    {offer.title}
                  </h2>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                    {offer.description}
                  </p>

                  {offer.minOrderValue && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-charcoal)', marginTop: '8px' }}>
                      Valid on acquisitions above ₹{offer.minOrderValue.toLocaleString('en-IN')}.
                    </p>
                  )}
                </div>

                <div
                  style={{
                    paddingTop: '20px',
                    borderTop: '1px solid var(--color-border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'var(--color-gold-bg)',
                      border: '1px dashed var(--color-gold-light)',
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-xs)',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      fontSize: '0.9375rem',
                      color: 'var(--color-noir)'
                    }}
                  >
                    <Tag size={15} color="var(--color-gold-dark)" />
                    <span>{offer.code}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(offer.code)}
                    className="elx-btn elx-btn-secondary elx-btn-sm"
                    style={{ padding: '8px 14px' }}
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check size={14} color="#0E8345" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Explore Collection Link */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link href="/shop" className="elx-btn elx-btn-primary elx-btn-md">
            Apply Privilege In Boutique <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
