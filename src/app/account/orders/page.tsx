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
    <div className="account-orders-wrapper account-orders-page">
      <div className="elx-container">
        <div className="pdp-breadcrumbs account-orders-breadcrumbs">
          <Link href="/account">Account</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-noir)' }}>Order History</span>
        </div>

        <div className="account-orders-heading">
          <h1 className="font-serif">
            Order History ({orders.length})
          </h1>
          <p>
            Inspect shipment progress, airway bills, and invoice details.
          </p>
        </div>

        {loading ? (
          <LoadingState message="Retrieving order ledger..." />
        ) : orders.length > 0 ? (
          <div className="account-order-list">
            {orders.map(order => (
              <div
                key={order.id}
                className="account-order-card"
              >
                {/* Header Row */}
                <div className="account-order-header">
                  <div className="account-order-identity">
                    <span className="account-order-number">
                      Order #{order.orderNumber}
                    </span>
                    <span className="account-order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="account-order-summary">
                    {getStatusBadge(order.orderStatus)}
                    <span className="account-order-total">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="account-order-items">
                  {order.items.map(it => (
                    <div key={it.id} className="account-order-item">
                      <div className="account-order-item-image">
                        <Image
                          src={it.product?.coverImage || it.product?.images?.[0] || '/assets/editorial/the-edit.jpg'}
                          alt={it.product?.name || 'Creation'}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="account-order-item-info">
                        <h4 className="font-serif account-order-item-name">
                          {it.product.name}
                        </h4>
                        <div className="account-order-item-meta">
                          Qty: {it.quantity} {it.selectedSize ? `• Size: ${it.selectedSize}` : ''} {it.selectedVariant ? `• ${it.selectedVariant}` : ''}
                        </div>
                      </div>
                      <div className="account-order-item-price">
                        ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Action */}
                <div className="account-order-footer">
                  <span className="account-order-arrival">
                    Expected arrival: <strong>{order.expectedDelivery}</strong>
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="elx-btn elx-btn-primary elx-btn-sm account-order-track"
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
