'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Check,
  AlertCircle,
  XCircle,
  RotateCcw,
  Clock,
  Printer
} from 'lucide-react';
import { Order, OrderStage } from '@/types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';
import { LoadingState } from '@/components/ui/States';
import { printAddressLabels } from '@/utils/printAddressLabels';

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionNote, setActionNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  const loadOrder = async () => {
    setLoading(true);
    try {
      const found = await api.getOrderById(id);
      setOrder(found);
    } catch (error) {
      console.error('Could not load admin order details.', error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleStageAction = async (stage: OrderStage, customNote?: string) => {
    setUpdating(true);
    try {
      const updated = await api.updateOrderStatus(id, stage, customNote || actionNote);
      setOrder(updated);
      setActionNote('');
      showToast(`Order status updated to: ${stage.toUpperCase()}`, 'success');
    } catch {
      showToast('Failed to update status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading order manifest..." />;
  }

  if (!order) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link href="/admin/orders" className="elx-btn elx-btn-primary elx-btn-sm" style={{ marginTop: '16px' }}>
          <ArrowLeft size={14} /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '20px' }}>
        <Link
          href="/admin/orders"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#667085' }}
        >
          <ArrowLeft size={14} /> Back to Orders List
        </Link>
      </div>

      {/* Header with Title & Operational Actions Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--admin-border)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#101828' }}>
              Order #{order.orderNumber}
            </h1>
            <Badge
              variant={
                order.orderStatus === 'delivered'
                  ? 'success'
                  : order.orderStatus === 'shipped'
                  ? 'gold'
                  : order.orderStatus === 'cancelled'
                  ? 'danger'
                  : 'neutral'
              }
            >
              {order.orderStatus.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#667085', marginTop: '4px' }}>
            Created {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>

        {/* Operational Actions Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {order.orderStatus !== 'confirmed' && order.orderStatus === 'placed' && (
            <Button
              variant="secondary"
              size="sm"
              isLoading={updating}
              onClick={() => handleStageAction('confirmed', 'Atelier confirmed hallmark & authenticity.')}
            >
              Confirm
            </Button>
          )}

          {order.orderStatus !== 'packed' && ['placed', 'confirmed'].includes(order.orderStatus) && (
            <Button
              variant="secondary"
              size="sm"
              isLoading={updating}
              onClick={() => handleStageAction('packed', 'Item packaged in signature Ellext velvet coffret.')}
            >
              Pack
            </Button>
          )}

          {order.orderStatus !== 'shipped' && ['placed', 'confirmed', 'packed'].includes(order.orderStatus) && (
            <Button
              variant="primary"
              size="sm"
              isLoading={updating}
              onClick={() => handleStageAction('shipped', 'Dispatched with Sequel Armoured Logistics.')}
            >
              Ship Courier
            </Button>
          )}

          {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
            <button
              type="button"
              onClick={() => handleStageAction('delivered', 'Signed OTP handover completed with patron.')}
              className="elx-btn elx-btn-sm"
              style={{ backgroundColor: '#0E8345', color: '#FFF' }}
            >
              Deliver
            </button>
          )}

          {order.orderStatus !== 'cancelled' && (
            <Button
              variant="danger"
              size="sm"
              isLoading={updating}
              onClick={() => handleStageAction('cancelled', 'Order cancelled by administrative instruction.')}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* LEFT: Items & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Items */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px'
            }}
          >
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#101828', marginBottom: '16px' }}>
              Allocated Creations ({order.items.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {order.items.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid #F2F4F7'
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '54px',
                      height: '68px',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      backgroundColor: '#F2F4F7',
                      flexShrink: 0
                    }}
                  >
                    <Image
                      src={item.product.coverImage || item.product.images[0]}
                      alt={item.product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#101828' }}>
                      {item.product.name}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#667085' }}>
                      SKU: {item.product.sku} • Qty: {item.quantity}{' '}
                      {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                      {item.selectedVariant ? `• ${item.selectedVariant}` : ''}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                    ₹{(Number(item.unitPrice ?? 0) * Number(item.quantity ?? 0)).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#667085' }}>
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal ?? 0).toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D92D20' }}>
                  <span>Privilege Savings ({order.appliedCoupon})</span>
                  <span>-₹{Number(order.discount ?? 0).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#667085' }}>
                <span>Armoured Transport</span>
                <span>{Number(order.shippingFee ?? 0) === 0 ? 'Complimentary' : `₹${Number(order.shippingFee ?? 0).toLocaleString('en-IN')}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', color: '#101828', paddingTop: '10px', borderTop: '1px solid var(--admin-border)' }}>
                <span>Total Settlement</span>
                <span>₹{Number(order.total ?? 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Patron Info */}
          <div
            className="admin-shipping-address-card"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#101828', margin: 0 }}>
                Patron & Delivery Information
              </h2>
              <button
                type="button"
                onClick={() => {
                  if (!printAddressLabels([order])) {
                    showToast('Allow pop-ups for this site to print the address sticker.', 'error');
                  }
                }}
                className="elx-btn elx-btn-outline elx-btn-sm no-print"
                aria-label="Print delivery address sticker"
              >
                <Printer size={15} /> Print Address Sticker
              </button>
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#344054', lineHeight: 1.6 }}>
              <div><strong>Name:</strong> {order.customer.name}</div>
              <div><strong>Phone:</strong> {order.customer.phone}</div>
              <div><strong>Email:</strong> {order.customer.email}</div>
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F2F4F7' }}>
                <strong>Destination Address:</strong><br />
                {order.shippingAddress.houseBuilding}, {order.shippingAddress.street}<br />
                {order.shippingAddress.area ? `${order.shippingAddress.area}, ` : ''}{order.shippingAddress.city} — {order.shippingAddress.pinCode}<br />
                {order.shippingAddress.state}, {order.shippingAddress.country}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Timeline & Stage Logs */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--admin-border)',
            borderRadius: 'var(--radius-md)',
            padding: '24px'
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#101828', marginBottom: '20px' }}>
            Consignment Tracking Log
          </h2>

          <div className="elx-order-timeline" style={{ padding: 0 }}>
            {order.timeline.map((step) => {
              const isDone = step.completed;
              const isCurrent = step.current;

              return (
                <div
                  key={step.stage}
                  className={`timeline-step ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="timeline-marker">
                    {isDone ? <Check size={12} strokeWidth={3} /> : null}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong style={{ fontSize: '0.8125rem' }}>{step.label}</strong>
                      {step.timestamp && (
                        <span style={{ fontSize: '0.6875rem', color: '#667085' }}>{step.timestamp}</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#667085', marginTop: '3px' }}>
                      {step.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add custom note or dispatch update */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--admin-border)' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#344054', display: 'block', marginBottom: '6px' }}>
              Attach Log Note / Airway Bill
            </label>
            <textarea
              rows={2}
              value={actionNote}
              onChange={e => setActionNote(e.target.value)}
              placeholder="e.g. Assigned Armoured Escort #BVC-99120. Sealed with tamper-evident seal."
              className="elx-textarea"
              style={{ fontSize: '0.8125rem' }}
            />
            <button
              type="button"
              disabled={!actionNote.trim() || updating}
              onClick={() => handleStageAction(order.orderStatus, actionNote)}
              className="elx-btn elx-btn-secondary elx-btn-sm"
              style={{ marginTop: '8px', width: '100%' }}
            >
              Update Log Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
