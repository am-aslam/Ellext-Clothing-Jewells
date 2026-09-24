'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Plus, Check, ArrowLeft } from 'lucide-react';
import { Address } from '@/types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { LoadingState } from '@/components/ui/States';
import { useAuth } from '@/context/AuthContext';

export default function AccountAddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  const [newAddr, setNewAddr] = useState<Address>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    houseBuilding: '',
    street: '',
    area: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    country: 'India',
    label: 'Primary Residence'
  });

  useEffect(() => {
    if (user) {
      setNewAddr(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAddresses();
        setAddresses(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.houseBuilding || !newAddr.city || !newAddr.pinCode) {
      showToast('Please fill out all address fields.', 'error');
      return;
    }
    const saved = await api.saveAddress(newAddr);
    setAddresses(prev => [...prev, saved]);
    setShowAddModal(false);
    showToast('New residence address saved successfully.', 'success');
  };

  return (
    <div className="account-addresses-wrapper" style={{ padding: '48px 24px 100px' }}>
      <div className="elx-container">
        <div className="pdp-breadcrumbs" style={{ marginBottom: '24px' }}>
          <Link href="/account">Account</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-noir)' }}>Saved Residences</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 400 }}>
              Saved Residences & Ateliers
            </h1>
            <p style={{ color: 'var(--color-muted)', marginTop: '4px' }}>
              Locations registered for secure armoured delivery.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add New Residence
          </Button>
        </div>

        {loading ? (
          <LoadingState message="Loading saved residences..." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {addresses.map(addr => (
              <div
                key={addr.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gold-dark)' }}>
                      {addr.label || 'Residence'}
                    </span>
                    {addr.isDefault && (
                      <span style={{ fontSize: '0.6875rem', backgroundColor: 'var(--color-bg)', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontWeight: 600 }}>
                        Default Destination
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '6px' }}>
                    {addr.fullName}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                    {addr.houseBuilding}, {addr.street}<br />
                    {addr.area ? `${addr.area}, ` : ''}{addr.city} — {addr.pinCode}<br />
                    {addr.state}, {addr.country}
                  </p>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '10px' }}>
                    Phone: {addr.phone}
                  </p>
                </div>

                <div style={{ paddingTop: '20px', borderTop: '1px solid var(--color-border-light)', marginTop: '20px', display: 'flex', gap: '12px' }}>
                  <button type="button" className="elx-btn elx-btn-secondary elx-btn-sm" style={{ flex: 1 }}>
                    Edit Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Address Modal */}
        {showAddModal && (
          <div className="elx-modal-backdrop" onClick={() => setShowAddModal(false)}>
            <div
              className="elx-modal-container elx-modal-md"
              onClick={e => e.stopPropagation()}
              style={{ padding: '32px' }}
            >
              <h2 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
                Add New Residence
              </h2>

              <form onSubmit={handleSaveAddress}>
                <Input
                  label="Address Label (e.g. Jaipur Haveli / Primary Penthouse)"
                  value={newAddr.label}
                  onChange={e => setNewAddr({ ...newAddr, label: e.target.value })}
                  required
                />
                <Input
                  label="Recipient Full Name"
                  value={newAddr.fullName}
                  onChange={e => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  required
                />
                <Input
                  label="Flat / Villa / Suite"
                  value={newAddr.houseBuilding}
                  onChange={e => setNewAddr({ ...newAddr, houseBuilding: e.target.value })}
                  required
                />
                <Input
                  label="Street / Landmark"
                  value={newAddr.street}
                  onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}
                  required
                />
                <div className="form-2col">
                  <Input
                    label="City"
                    value={newAddr.city}
                    onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                    required
                  />
                  <Input
                    label="State"
                    value={newAddr.state}
                    onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
                    required
                  />
                </div>
                <div className="form-2col">
                  <Input
                    label="PIN Code"
                    value={newAddr.pinCode}
                    onChange={e => setNewAddr({ ...newAddr, pinCode: e.target.value })}
                    required
                  />
                  <Input
                    label="Contact Phone"
                    value={newAddr.phone}
                    onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="elx-btn elx-btn-secondary elx-btn-md"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <Button type="submit" variant="primary" size="md" fullWidth style={{ flex: 1 }}>
                    Save Destination
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
