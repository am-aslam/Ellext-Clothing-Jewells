'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { Order } from '@/types';
import { api } from '@/services/api';
import { Badge } from '@/components/ui/Badge';
import { LoadingState, EmptyState } from '@/components/ui/States';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'shipped':
        return <Badge variant="gold">In Transit</Badge>;
      case 'packed':
        return <Badge variant="neutral">Curated & Sealed</Badge>;
      case 'confirmed':
        return <Badge variant="outline">Confirmed</Badge>;
      case 'placed':
        return <Badge variant="outline">Placed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="account-orders-wrapper" style={{ padding: '48px 24px 100px' }}>
      <div className="elx-container">
        <div className="pdp-breadcrumbs" style={{ marginBottom: '24px' }}>
          <Link href="/account">Account</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-noir)' }}>Order History</span>
        </div>

        <div style={{ marginBottom: '36px' }}>
          <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 400 }}>
            Order History ({orders.length})
          </h1>
          <p style={{ color: 'var(--color-muted)', marginTop: '4px' }}>
            Inspect shipment progress, airway bills, and invoice details.
          </p>
        </div>

        {loading ? (
          <LoadingState message="Retrieving order ledger..." />
        ) : orders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '24px 28px'
                }}
              >
                {/* Header Row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--color-border-light)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                      Order #{order.orderNumber}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getStatusBadge(order.orderStatus)}
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {order.items.map(it => (
                    <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          position: 'relative',
                          width: '56px',
                          height: '70px',
                          borderRadius: 'var(--radius-xs)',
                          overflow: 'hidden',
                          backgroundColor: 'var(--color-bg-subtle)',
                          flexShrink: 0
                        }}
                      >
                        <Image
                          src={it.product?.coverImage || it.product?.images?.[0] || '/assets/editorial/the-edit.jpg'}
                          alt={it.product?.name || 'Creation'}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 className="font-serif" style={{ fontSize: '1.0625rem' }}>
                          {it.product.name}
                        </h4>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                          Qty: {it.quantity} {it.selectedSize ? `• Size: ${it.selectedSize}` : ''} {it.selectedVariant ? `• ${it.selectedVariant}` : ''}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Action */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-border-light)'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    Expected arrival: <strong>{order.expectedDelivery}</strong>
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="elx-btn elx-btn-primary elx-btn-sm"
                  >
                    Track Shipment Timeline <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="bag"
            title="No orders placed yet"
            description="When you acquire pieces from Ellext, your orders will appear here."
            actionText="Discover Collection"
            onAction={() => window.location.href = '/shop'}
          />
        )}
      </div>
    </div>
  );
}
