'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Check, X, Calendar, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { Offer } from '@/types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';
import { LoadingState } from '@/components/ui/States';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const [newOffer, setNewOffer] = useState<{
    code: string;
    title: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue: number;
    applicableTo: 'all' | 'clothing' | 'jewells';
    startDate: string;
    endDate: string;
    usageLimit: number;
    isActive: boolean;
  }>({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 20000,
    applicableTo: 'all',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 200,
    isActive: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getOffers(false);
      setOffers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (offer: Offer) => {
    try {
      const nextActive = !offer.isActive;
      await api.toggleOfferStatus(offer.id, nextActive);
      setOffers(prev =>
        prev.map(o => (o.id === offer.id ? { ...o, isActive: nextActive } : o))
      );
      showToast(
        `Privilege code ${offer.code} is now ${nextActive ? 'Active' : 'Disabled'}.`,
        'info'
      );
    } catch {
      showToast('Failed to change offer status.', 'error');
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.code.trim() || !newOffer.title.trim()) {
      showToast('Please provide code and title.', 'error');
      return;
    }

    try {
      const created = await api.createOffer({
        code: newOffer.code.toUpperCase().trim(),
        title: newOffer.title,
        description: newOffer.description,
        discountType: newOffer.discountType,
        discountValue: Number(newOffer.discountValue),
        minOrderValue: Number(newOffer.minOrderValue),
        applicableTo: newOffer.applicableTo,
        startDate: new Date(newOffer.startDate).toISOString(),
        endDate: new Date(newOffer.endDate).toISOString(),
        usageLimit: Number(newOffer.usageLimit),
        isActive: newOffer.isActive
      });

      setOffers(prev => [created, ...prev]);
      setShowModal(false);
      showToast(`Privilege offer "${created.code}" created successfully!`, 'success');
      setNewOffer({
        code: '',
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: 15,
        minOrderValue: 20000,
        applicableTo: 'all',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 200,
        isActive: true
      });
    } catch {
      showToast('Failed to create offer.', 'error');
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#101828' }}>
            Privilege Offers & Coupons
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#667085', marginTop: '2px' }}>
            Configure percentage discounts, flat credits, and customer acquisition campaigns.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowModal(true)} id="btn-create-offer">
          <Plus size={15} /> Create Privilege Offer
        </Button>
      </div>

      {/* Offers Cards Grid */}
      {loading ? (
        <LoadingState message="Loading promotions ledger..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {offers.map(offer => {
            const isExpired = new Date(offer.endDate) < new Date();

            return (
              <div
                key={offer.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: !offer.isActive || isExpired ? 0.75 : 1
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#F2F4F7',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs)',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.875rem'
                      }}
                    >
                      <Tag size={13} /> {offer.code}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(offer)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: offer.isActive ? '#0E8345' : '#667085',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    >
                      {offer.isActive ? (
                        <>
                          <ToggleRight size={22} color="#0E8345" /> Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={22} color="#888" /> Disabled
                        </>
                      )}
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#101828', marginBottom: '4px' }}>
                    {offer.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#667085', lineHeight: 1.5, marginBottom: '14px' }}>
                    {offer.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#344054' }}>
                    <div>
                      <strong>Discount: </strong>
                      {offer.discountType === 'percentage'
                        ? `${offer.discountValue}% OFF`
                        : `₹${Number(offer.discountValue ?? 0).toLocaleString('en-IN')} Flat Credit`}
                    </div>
                    {offer.minOrderValue && (
                      <div>
                        <strong>Minimum Order: </strong>
                        ₹{Number(offer.minOrderValue ?? 0).toLocaleString('en-IN')}
                      </div>
                    )}
                    <div>
                      <strong>Scope: </strong>
                      <span style={{ textTransform: 'uppercase' }}>{offer.applicableTo}</span>
                    </div>
                    <div>
                      <strong>Redemptions: </strong>
                      {offer.usedCount} {offer.usageLimit ? `/ ${offer.usageLimit} limit` : 'used'}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--admin-border)', fontSize: '0.6875rem', color: '#667085', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> Valid until {new Date(offer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Offer Modal */}
      {showModal && (
        <div className="elx-modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="elx-modal-container elx-modal-md"
            onClick={e => e.stopPropagation()}
            style={{ padding: '32px' }}
          >
            <h2 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
              Create Privilege Offer
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#667085', marginBottom: '24px' }}>
              Clients can enter this promotional code during checkout or inside their bag drawer.
            </p>

            <form onSubmit={handleCreateOffer}>
              <div className="form-2col">
                <Input
                  label="Coupon Code (UPPERCASE)"
                  required
                  value={newOffer.code}
                  onChange={e => setNewOffer({ ...newOffer, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. ROYAL25"
                />
                <Select
                  label="Discount Type"
                  value={newOffer.discountType}
                  onChange={e => setNewOffer({ ...newOffer, discountType: e.target.value as 'percentage' | 'fixed' })}
                >
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="fixed">Fixed Currency Credit (₹)</option>
                </Select>
              </div>

              <div className="form-2col">
                <Input
                  label={newOffer.discountType === 'percentage' ? 'Discount % (e.g. 15)' : 'Credit Amount (₹)'}
                  type="number"
                  required
                  value={newOffer.discountValue}
                  onChange={e => setNewOffer({ ...newOffer, discountValue: parseInt(e.target.value) || 0 })}
                />
                <Input
                  label="Minimum Order Value (₹)"
                  type="number"
                  value={newOffer.minOrderValue}
                  onChange={e => setNewOffer({ ...newOffer, minOrderValue: parseInt(e.target.value) || 0 })}
                />
              </div>

              <Input
                label="Offer Title"
                required
                value={newOffer.title}
                onChange={e => setNewOffer({ ...newOffer, title: e.target.value })}
                placeholder="e.g. Autumn High Jewellery Privilege"
              />

              <div className="elx-input-group">
                <label className="elx-label">Description / Fine Print</label>
                <input
                  type="text"
                  value={newOffer.description}
                  onChange={e => setNewOffer({ ...newOffer, description: e.target.value })}
                  placeholder="Applies to all bridal chokers and uncut stones..."
                  className="elx-input"
                />
              </div>

              <div className="form-2col">
                <Select
                  label="Applicable Category"
                  value={newOffer.applicableTo}
                  onChange={e => setNewOffer({ ...newOffer, applicableTo: e.target.value as 'all' | 'clothing' | 'jewells' })}
                >
                  <option value="all">Storewide (Clothing & Jewells)</option>
                  <option value="jewells">Fine Jewells Only</option>
                  <option value="clothing">Couture Clothing Only</option>
                </Select>

                <Input
                  label="Usage Limit (Total times)"
                  type="number"
                  value={newOffer.usageLimit}
                  onChange={e => setNewOffer({ ...newOffer, usageLimit: parseInt(e.target.value) || 100 })}
                />
              </div>

              <div className="form-2col">
                <Input
                  label="Valid From"
                  type="date"
                  value={newOffer.startDate}
                  onChange={e => setNewOffer({ ...newOffer, startDate: e.target.value })}
                />
                <Input
                  label="Valid Until"
                  type="date"
                  value={newOffer.endDate}
                  onChange={e => setNewOffer({ ...newOffer, endDate: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="elx-btn elx-btn-secondary elx-btn-md"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" size="md" fullWidth style={{ flex: 1 }}>
                  Create Offer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
