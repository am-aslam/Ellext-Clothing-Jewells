'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Copy,
  Percent,
  Calendar,
  Check,
  Power
} from 'lucide-react';
import { api } from '@/services/api';
import { CouponItem, Product, ProductCategory } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { LoadingState, EmptyState } from '@/components/ui/States';
import { useToast } from '@/context/ToastContext';

export default function AdminCouponsPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: 15,
    minimumOrder: 25000,
    maximumDiscount: 10000,
    usageLimit: 100,
    perUserLimit: 1,
    startAt: new Date().toISOString().split('T')[0],
    endAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    applicableCategories: 'all',
    active: true
  });

  // Archive / Delete Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const list = await api.getAdminCoupons();
      setCoupons(list);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minimumOrder: 25000,
      maximumDiscount: 10000,
      usageLimit: 100,
      perUserLimit: 1,
      startAt: new Date().toISOString().split('T')[0],
      endAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      applicableCategories: 'all',
      active: true
    });
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowModal(true);
  };

  const openEditModal = (coupon: CouponItem) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrder: coupon.minimumOrder || 0,
      maximumDiscount: coupon.maximumDiscount || 0,
      usageLimit: coupon.usageLimit || 100,
      perUserLimit: coupon.perUserLimit || 1,
      startAt: coupon.startAt ? coupon.startAt.split('T')[0] : new Date().toISOString().split('T')[0],
      endAt: coupon.endAt ? coupon.endAt.split('T')[0] : new Date().toISOString().split('T')[0],
      applicableCategories: 'all',
      active: coupon.active
    });
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.code.trim()) {
      setErrorMessage('Coupon code is required.');
      return;
    }

    if (formData.discountValue <= 0) {
      setErrorMessage('Discount value must be greater than zero.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCoupon) {
        await api.updateAdminCoupon(editingCoupon.id, {
          code: formData.code.toUpperCase().trim(),
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue),
          minimumOrder: Number(formData.minimumOrder),
          maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : null,
          usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
          perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : 1,
          startAt: new Date(formData.startAt).toISOString(),
          endAt: new Date(formData.endAt).toISOString(),
          active: formData.active
        });
        setSuccessMessage('Coupon updated successfully.');
        showToast(`Coupon ${formData.code.toUpperCase()} updated.`, 'success');
      } else {
        await api.createAdminCoupon({
          code: formData.code.toUpperCase().trim(),
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue),
          minimumOrder: Number(formData.minimumOrder),
          maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : null,
          usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
          perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : 1,
          startAt: new Date(formData.startAt).toISOString(),
          endAt: new Date(formData.endAt).toISOString(),
          active: formData.active
        });
        setSuccessMessage('Coupon created successfully.');
        showToast(`Coupon ${formData.code.toUpperCase()} created successfully.`, 'success');
      }

      await loadCoupons();
      setTimeout(() => setShowModal(false), 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save coupon. Please review the form inputs.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (coupon: CouponItem) => {
    try {
      await api.updateAdminCoupon(coupon.id, { active: !coupon.active });
      showToast(`Coupon ${coupon.code} is now ${!coupon.active ? 'active' : 'disabled'}.`, 'info');
      loadCoupons();
    } catch (err: any) {
      showToast(err?.message || 'Failed to toggle status.', 'error');
    }
  };

  const handleArchiveCoupon = async (id: string) => {
    try {
      await api.deleteAdminCoupon(id);
      showToast('Coupon safely archived to preserve historical records.', 'success');
      setConfirmDeleteId(null);
      loadCoupons();
    } catch (err: any) {
      showToast(err?.message || 'Failed to archive coupon.', 'error');
    }
  };

  const filteredCoupons = coupons.filter(c => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase());
    const isArchived = c.status === 'ARCHIVED';
    const matchStatus =
      statusFilter === 'ALL'
        ? !isArchived
        : statusFilter === 'ARCHIVED'
        ? isArchived
        : statusFilter === 'ACTIVE'
        ? !isArchived && c.active && new Date(c.endAt) >= new Date()
        : !isArchived && (!c.active || new Date(c.endAt) < new Date());
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#FFF' }}>
            Promotional Coupons & Privilege Vouchers
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '2px' }}>
            Manage discount codes, percentage reductions, and seasonal luxury offers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="elx-btn elx-btn-primary elx-btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', minHeight: '42px' }}
        >
          <PlusCircle size={15} /> Create Coupon
        </button>
      </div>

      {/* Toolbar: Search and Filter */}
      <div
        style={{
          backgroundColor: '#0F131C',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '380px' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search coupon code (e.g. ROYAL15)..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              color: '#FFF',
              fontSize: '0.875rem',
              outline: 'none',
              minHeight: '40px'
            }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#6B7280' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', color: '#888B96' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#171C26',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              color: '#FFF',
              fontSize: '0.8125rem',
              outline: 'none',
              minHeight: '40px'
            }}
          >
            <option value="ALL">Current Coupons ({coupons.filter(c => c.status !== 'ARCHIVED').length})</option>
            <option value="ACTIVE">Active & Valid</option>
            <option value="INACTIVE">Inactive / Expired</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading promotional coupons..." />
      ) : filteredCoupons.length === 0 ? (
        <EmptyState
          icon="tag"
          title="No Coupons Found"
          description="There are currently no discount vouchers matching your criteria."
          actionText="Create New Coupon"
          onAction={openCreateModal}
        />
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div
            className="hidden md-block"
            style={{
              backgroundColor: '#0F131C',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '14px 18px', color: '#888B96', fontWeight: 600 }}>Code</th>
                  <th style={{ padding: '14px 16px', color: '#888B96', fontWeight: 600 }}>Discount</th>
                  <th style={{ padding: '14px 16px', color: '#888B96', fontWeight: 600 }}>Usage</th>
                  <th style={{ padding: '14px 16px', color: '#888B96', fontWeight: 600 }}>Validity Range</th>
                  <th style={{ padding: '14px 14px', color: '#888B96', fontWeight: 600, textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '14px 18px', color: '#888B96', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map(coupon => {
                  const isExpired = new Date(coupon.endAt) < new Date();
                  return (
                    <tr
                      key={coupon.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      {/* Code */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9375rem', color: '#C9A96E', letterSpacing: '0.05em' }}>
                            {coupon.code}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#888B96', marginTop: '2px' }}>
                          Min Order: ₹{Number(coupon.minimumOrder ?? 0).toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Discount */}
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#FFF' }}>
                        {coupon.discountType === 'PERCENTAGE'
                          ? `${coupon.discountValue}% OFF`
                          : `₹${Number(coupon.discountValue ?? 0).toLocaleString('en-IN')} OFF`}
                        {coupon.maximumDiscount ? (
                          <div style={{ fontSize: '0.75rem', color: '#888B96', fontWeight: 400, marginTop: '2px' }}>
                            Max: ₹{Number(coupon.maximumDiscount ?? 0).toLocaleString('en-IN')}
                          </div>
                        ) : null}
                      </td>

                      {/* Usage */}
                      <td style={{ padding: '14px 16px', fontSize: '0.8125rem', color: '#E0E0E0' }}>
                        <div style={{ fontWeight: 600 }}>
                          {coupon.usedCount} used {coupon.usageLimit ? `/ ${coupon.usageLimit}` : '(unlimited)'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#888B96' }}>
                          Limit: {coupon.perUserLimit || 1}/customer
                        </div>
                      </td>

                      {/* Validity */}
                      <td style={{ padding: '14px 16px', fontSize: '0.8125rem', color: '#9CA3AF' }}>
                        <div>{new Date(coupon.startAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(coupon.endAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        {isExpired && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>Expired</span>}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                        <Badge variant={coupon.active && !isExpired ? 'success' : 'danger'}>
                          {coupon.active && !isExpired ? 'ACTIVE' : isExpired ? 'EXPIRED' : 'DISABLED'}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(coupon)}
                            className="elx-btn elx-btn-secondary elx-btn-sm"
                            style={{ padding: '6px 10px', minHeight: '32px' }}
                            title="Edit coupon parameters"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(coupon)}
                            className="elx-btn elx-btn-outline elx-btn-sm"
                            style={{ padding: '6px 10px', minHeight: '32px', color: coupon.active ? '#F59E0B' : '#10B981' }}
                            title={coupon.active ? 'Disable Coupon' : 'Enable Coupon'}
                          >
                            <Power size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(coupon.id)}
                            className="elx-btn elx-btn-outline elx-btn-sm"
                            style={{ padding: '6px 10px', minHeight: '32px', color: '#EF4444' }}
                            title="Archive coupon safely"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS (Requirement 16) */}
          <div className="md-hidden" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredCoupons.map(coupon => {
              const isExpired = new Date(coupon.endAt) < new Date();
              return (
                <div
                  key={coupon.id}
                  style={{
                    backgroundColor: '#0F131C',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.125rem', color: '#C9A96E' }}>
                      {coupon.code}
                    </span>
                    <Badge variant={coupon.active && !isExpired ? 'success' : 'danger'}>
                      {coupon.active && !isExpired ? 'ACTIVE' : isExpired ? 'EXPIRED' : 'DISABLED'}
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#888B96' }}>Discount:</span>
                    <strong style={{ color: '#FFF' }}>
                      {coupon.discountType === 'PERCENTAGE'
                        ? `${coupon.discountValue}% OFF`
                        : `₹${Number(coupon.discountValue ?? 0).toLocaleString('en-IN')} OFF`}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#888B96' }}>Usage Count:</span>
                    <span style={{ color: '#FFF' }}>{coupon.usedCount} / {coupon.usageLimit || '∞'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#888B96' }}>Validity:</span>
                    <span style={{ color: '#9CA3AF' }}>Ends {new Date(coupon.endAt).toLocaleDateString('en-IN')}</span>
                  </div>

                  {/* Actions Strip */}
                  <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(coupon)}
                      className="elx-btn elx-btn-secondary elx-btn-sm"
                      style={{ flex: 1, minHeight: '44px' }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(coupon)}
                      className="elx-btn elx-btn-outline elx-btn-sm"
                      style={{ minHeight: '44px', minWidth: '44px', color: coupon.active ? '#F59E0B' : '#10B981' }}
                    >
                      <Power size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(coupon.id)}
                      className="elx-btn elx-btn-outline elx-btn-sm"
                      style={{ minHeight: '44px', minWidth: '44px', color: '#EF4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CREATE / EDIT COUPON MODAL (Requirement 9) */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#0F131C',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
              color: '#FFF'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {editingCoupon ? 'Edit Privilege Coupon' : 'Create New Coupon'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', minWidth: '44px', minHeight: '44px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{ padding: '12px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#F87171', fontSize: '0.875rem', marginBottom: '16px' }}>
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div style={{ padding: '12px', backgroundColor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', color: '#34D399', fontSize: '0.875rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Code */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE25"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '0.9375rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    outline: 'none',
                    minHeight: '44px'
                  }}
                />
              </div>

              {/* Discount Type & Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={e => setFormData({ ...formData, discountType: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#171C26',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontSize: '0.875rem',
                      outline: 'none',
                      minHeight: '44px'
                    }}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      minHeight: '44px'
                    }}
                  />
                </div>
              </div>

              {/* Minimum Order & Maximum Discount */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                    Minimum Order (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minimumOrder}
                    onChange={e => setFormData({ ...formData, minimumOrder: Number(e.target.value) })}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      minHeight: '44px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.maximumDiscount}
                    onChange={e => setFormData({ ...formData, maximumDiscount: Number(e.target.value) })}
                    placeholder="Optional cap"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      minHeight: '44px'
                    }}
                  />
                </div>
              </div>

              {/* Usage Limit & Per User Limit */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.usageLimit}
                    onChange={e => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    placeholder="100"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      minHeight: '44px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                    Per Customer Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.perUserLimit}
                    onChange={e => setFormData({ ...formData, perUserLimit: Number(e.target.value) })}
                    placeholder="1"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      minHeight: '44px'
                    }}
                  />
                </div>
              </div>

              {/* Start Date & End Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startAt}
                    onChange={e => setFormData({ ...formData, startAt: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontSize: '0.875rem',
                      outline: 'none',
                      minHeight: '44px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#D1D5DB', marginBottom: '6px' }}>
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endAt}
                    onChange={e => setFormData({ ...formData, endAt: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontSize: '0.875rem',
                      outline: 'none',
                      minHeight: '44px'
                    }}
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '6px' }}>
                <input
                  type="checkbox"
                  id="coupon-active"
                  checked={formData.active}
                  onChange={e => setFormData({ ...formData, active: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="coupon-active" style={{ fontSize: '0.875rem', color: '#D1D5DB', cursor: 'pointer' }}>
                  Coupon is Active and Available for Application
                </label>
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="elx-btn elx-btn-secondary"
                  style={{ flex: 1, minHeight: '46px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="elx-btn elx-btn-primary"
                  style={{ flex: 1, minHeight: '46px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  {isSaving ? 'Saving...' : editingCoupon ? 'SAVE CHANGES' : 'CREATE COUPON'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM ARCHIVE DIALOG */}
      {confirmDeleteId && (
        <div
          onClick={() => setConfirmDeleteId(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#0F131C',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '24px',
              color: '#FFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={20} color="#EF4444" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Archive Coupon?</h3>
            </div>

            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '24px' }}>
              To preserve accounting and historical order integrity, this coupon will be archived and deactivated rather than permanently destroyed.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="elx-btn elx-btn-secondary"
                style={{ flex: 1, minHeight: '42px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleArchiveCoupon(confirmDeleteId)}
                className="elx-btn"
                style={{
                  flex: 1,
                  minHeight: '42px',
                  backgroundColor: '#DC2626',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
