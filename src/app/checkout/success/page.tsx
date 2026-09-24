'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Truck, Package, ArrowRight, Home } from 'lucide-react';
import { Order } from '@/types';
import { api } from '@/services/api';
import { LoadingState } from '@/components/ui/States';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || '';
  const displayOrderNumber = searchParams?.get('orderNumber') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoadError, setOrderLoadError] = useState('');

  useEffect(() => {
    async function load() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        let found: Order | null = null;
        try {
          found = await api.getOrderById(orderId);
        } catch (error) {
          // Older confirmation links used the human-readable order number as
          // the lookup key. Keep those links working while new ones use UUIDs.
          if (!displayOrderNumber || displayOrderNumber === orderId) throw error;
          found = await api.getOrderById(displayOrderNumber);
        }
        setOrder(found);
        if (!found) setOrderLoadError('Your order was placed, but its details are not available right now. You can view it from My Orders.');
      } catch (error) {
        console.error('Could not load the placed order details.', error);
        setOrderLoadError('Your order was placed, but its details could not be loaded right now. You can view it from My Orders.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId, displayOrderNumber]);

  if (loading) {
    return <LoadingState message="Finalizing order confirmation..." />;
  }

  return (
    <div className="checkout-success-wrapper">
      <div className="elx-container checkout-success-container">
        <div className="checkout-success-card">
          {/* Confirmed Icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--color-gold-bg)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'var(--color-gold-dark)'
            }}
          >
            <CheckCircle size={36} />
          </div>

          <span className="section-sub-label">Acquisition Verified</span>
          <h1 className="font-serif checkout-success-title">
            Order Confirmed
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', maxWidth: '520px', margin: '0 auto 24px' }}>
            Thank you for acquiring from Ellext Clothing & Jewells. Your creations have been allocated to our master atelier.
          </p>

          <div className="checkout-success-order-number">
            Order Number: <span style={{ color: 'var(--color-noir)' }}>{order?.orderNumber || displayOrderNumber || 'Loading reference'}</span>
          </div>

          {orderLoadError && (
            <p role="status" style={{ color: 'var(--color-muted)', margin: '-12px auto 24px', maxWidth: '520px', fontSize: '0.875rem' }}>
              {orderLoadError}
            </p>
          )}

          {/* Delivery & Timeline Estimate */}
          <div className="checkout-success-delivery-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold-dark)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                <Truck size={15} /> Expected Arrival
              </div>
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '4px' }}>
                {order?.expectedDelivery || 'Within 3 to 5 business days'}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                Standard regional delivery
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold-dark)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                <Package size={15} /> Destination
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, marginTop: '4px' }}>
                {order
                  ? `${order.shippingAddress.houseBuilding}, ${order.shippingAddress.city}, ${order.shippingAddress.pinCode}`
                  : 'Available in your order details'}
              </p>
              {order && <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{order.customer.name} ({order.customer.phone})</span>}
            </div>
          </div>

          {/* Items Preview if available */}
          {order && order.items.length > 0 && (
            <div className="checkout-success-items">
              <h2 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '16px' }}>
                Allocated Creations ({order.items.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {order.items.map(it => (
                  <div key={it.id} className="checkout-success-item">
                    <div className="checkout-success-item-thumb">
                      <Image
                        src={it.product.coverImage || it.product.images[0]}
                        alt={it.product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="checkout-success-item-copy">
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{it.product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Qty: {it.quantity}</div>
                    </div>
                    <div className="checkout-success-item-price">
                      ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)', fontWeight: 600 }}>
                <span>Total Paid</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="checkout-success-actions">
            <Link
              href={order?.id || orderId ? `/account/orders/${order?.id || orderId}` : '/account/orders'}
              className="elx-btn elx-btn-primary elx-btn-md"
              id="success-track-order-btn"
            >
              Track Order Status <ArrowRight size={16} />
            </Link>
            <Link
              href="/shop"
              className="elx-btn elx-btn-outline elx-btn-md"
            >
              <Home size={15} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading confirmation..." />}>
      <SuccessContent />
    </Suspense>
  );
}
