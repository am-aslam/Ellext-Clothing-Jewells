'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, Check, ArrowLeft, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { Order } from '@/types';
import { api } from '@/services/api';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/States';

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const found = await api.getOrderById(id);
        setOrder(found);
        if (!found) setLoadError('We could not find that order in your account. Check My Orders for your latest purchases.');
      } catch (error) {
        console.error('Could not load order details.', error);
        setLoadError('Order details could not be loaded. Please return to My Orders and try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="elx-container" style={{ padding: '100px 24px' }}>
        <LoadingState message="Retrieving tracking log from armoured carrier..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="elx-container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '16px' }}>Order Not Found</h1>
        {loadError && <p role="status" style={{ color: 'var(--color-muted)', marginBottom: '20px' }}>{loadError}</p>}
        <Link href="/account/orders" className="elx-btn elx-btn-primary elx-btn-md">
          <ArrowLeft size={14} /> Back to Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="order-tracking-wrapper">
      <div className="elx-container order-tracking-container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/account/orders"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--color-muted)' }}
          >
            <ArrowLeft size={14} /> Back to Order History
          </Link>
        </div>

        {/* Header */}
        <div className="order-tracking-header">
          <div className="order-tracking-heading">
            <span className="section-sub-label">Consignment Tracking</span>
            <h1 className="font-serif order-tracking-number">
              Order #{order.orderNumber}
            </h1>
            <span className="order-tracking-date">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="order-tracking-status">
            <span className="order-tracking-status-label">
              Current Status
            </span>
            <span className="order-tracking-status-value">
              {order.orderStatus.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* 6-STAGE TIMELINE TRACKER */}
        <div className="order-tracking-card order-tracking-timeline-card">
          <h2 className="font-serif" style={{ fontSize: '1.375rem', marginBottom: '28px' }}>
            Shipment Milestone Timeline
          </h2>

          <div className="shipment-tracker" aria-label="Shipment progress">
            <div className="shipment-progress" style={{ '--shipment-count': order.timeline.length } as React.CSSProperties}>
              {order.timeline.map((step, index) => (
                <div key={step.stage} className={`shipment-progress-step ${step.completed ? 'is-complete' : ''} ${step.current ? 'is-current' : ''}`}>
                  {index > 0 && <span className={`shipment-progress-connector ${step.completed ? 'is-complete' : ''}`} aria-hidden="true" />}
                  <span className="shipment-progress-marker">{step.completed ? <Check size={13} strokeWidth={3} /> : index + 1}</span>
                  <span className="shipment-progress-label">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="shipment-updates">
              {order.timeline.filter(step => step.completed || step.current).slice().reverse().map(step => (
                <article className={`shipment-update ${step.current ? 'is-current' : ''}`} key={step.stage}>
                  <span className="shipment-update-icon">{step.completed ? <Check size={15} /> : <Clock size={15} />}</span>
                  <div className="shipment-update-copy">
                    <div className="shipment-update-heading">
                      <strong>{step.label}{step.current ? ' · Latest update' : ''}</strong>
                      {step.timestamp && <time dateTime={step.timestamp}>{new Date(step.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</time>}
                    </div>
                    <p>{step.note}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="shipment-tracking-footnote">Tracking updates are shown when Ellext records a new order milestone. Courier scan events appear once the parcel is handed to a delivery partner.</p>
          </div>
        </div>

        {/* Order Details: 2 Column Grid */}
        <div className="order-tracking-info-grid">
          {/* Destination */}
          <div className="order-tracking-card order-tracking-info-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-dark)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '12px' }}>
              <MapPin size={15} /> Handover Destination
            </div>
            <h3 className="order-tracking-customer-name">{order.customer.name}</h3>
            <p className="order-tracking-address">
              {order.shippingAddress.houseBuilding}, {order.shippingAddress.street}<br />
              {order.shippingAddress.area ? `${order.shippingAddress.area}, ` : ''}
              {order.shippingAddress.city} — {order.shippingAddress.pinCode}<br />
              {order.shippingAddress.state}, {order.shippingAddress.country}
            </p>
            <p className="order-tracking-contact">
              Contact: {order.customer.phone}
            </p>
          </div>

          {/* Payment & Security */}
          <div className="order-tracking-card order-tracking-info-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-dark)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '12px' }}>
              <ShieldCheck size={15} /> Acquisition Settlement
            </div>
            <p className="order-tracking-payment-line">
              <strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}
            </p>
            <p className="order-tracking-payment-line">
              <strong>Settlement Status:</strong>{' '}
              <span style={{ color: order.paymentStatus === 'paid' ? '#0E8345' : '#B54708', fontWeight: 600 }}>
                {order.paymentStatus.toUpperCase()}
              </span>
            </p>
            <p className="order-tracking-security-note">
              Certificate of Authenticity & BIS 916 Hallmark documentation enclosed with packaging.
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="order-tracking-card order-tracking-items-card">
          <h2 className="font-serif" style={{ fontSize: '1.375rem', marginBottom: '20px' }}>
            Allocated Creations ({order.items.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {order.items.map(item => (
              <div key={item.id} className="order-tracking-item">
                <div className="order-tracking-item-thumb">
                  {item.product?.coverImage || item.product?.images?.[0]
                    ? <Image src={item.product.coverImage || item.product.images[0]} alt={item.product?.name || 'Ordered product'} fill style={{ objectFit: 'cover' }} />
                    : <Package size={24} aria-label="Product image unavailable" style={{ position: 'absolute', inset: 0, margin: 'auto', color: 'var(--color-muted)' }} />}
                </div>

                <div className="order-tracking-item-copy">
                  <h4 className="font-serif order-tracking-item-name">
                    <Link href={`/product/${item.product.slug}`}>{item.product.name}</Link>
                  </h4>
                  <div className="order-tracking-item-meta">
                    Qty: {item.quantity} {item.selectedSize ? `• Size ${item.selectedSize}` : ''} {item.selectedVariant ? `• ${item.selectedVariant}` : ''}
                  </div>
                </div>

                <div className="order-tracking-item-price">
                  ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', maxWidth: '320px', marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-ruby)' }}>
                <span>Privilege Savings</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span>Insured Courier</span>
              <span>{order.shippingFee === 0 ? 'Complimentary' : `₹${order.shippingFee.toLocaleString('en-IN')}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700, paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
              <span>Total Settlement</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
