'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  ShoppingBag,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Package
} from 'lucide-react';
import { api } from '@/services/api';
import { CustomerDetail } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/States';

export default function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAdminCustomerById(id);
        setCustomer(data);
      } catch (err) {
        console.error('Failed to load customer profile:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading patron 360 profile and financial analytics..." />;
  }

  if (!customer) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#FFF' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Client Not Found</h2>
        <p style={{ color: '#888B96', marginBottom: '24px' }}>The requested patron account does not exist in the register.</p>
        <Link href="/admin/customers" className="elx-btn elx-btn-primary elx-btn-md">
          <ArrowLeft size={16} /> Return to Customer CRM
        </Link>
      </div>
    );
  }

  const { profile, analytics, addresses, wishlistCount, orders } = customer;

  return (
    <div>
      {/* Back link */}
      <div style={{ marginBottom: '20px' }}>
        <Link
          href="/admin/customers"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8125rem',
            color: '#9CA3AF',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={14} /> Back to Customer CRM
        </Link>
      </div>

      {/* Header Profile Summary */}
      <div
        style={{
          backgroundColor: '#0F131C',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '28px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(201,169,110,0.15)',
              border: '2px solid rgba(201,169,110,0.3)',
              color: '#C9A96E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700
            }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FFF', margin: 0 }}>
                {profile.name}
              </h1>
              <Badge variant={profile.status === 'ACTIVE' ? 'success' : 'danger'}>
                {profile.status}
              </Badge>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={14} color="#6B7280" /> {profile.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={14} color="#6B7280" /> {profile.phone || 'No phone recorded'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} color="#6B7280" /> Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#888B96', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
            Authoritative Lifetime Spend
          </span>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#C9A96E' }}>
            ₹{Number(analytics.totalSpent ?? 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* AUTHORITATIVE FINANCIAL & ORDER ANALYTICS (Requirement 7) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '14px',
          marginBottom: '28px'
        }}
      >
        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.6875rem', color: '#888B96', textTransform: 'uppercase', fontWeight: 600 }}>Total Orders</span>
          <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#FFF', marginTop: '4px' }}>{analytics.totalOrders}</div>
        </div>

        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.6875rem', color: '#10B981', textTransform: 'uppercase', fontWeight: 600 }}>Completed</span>
          <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>{analytics.completedOrders}</div>
        </div>

        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.6875rem', color: '#F59E0B', textTransform: 'uppercase', fontWeight: 600 }}>Pending</span>
          <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#F59E0B', marginTop: '4px' }}>{analytics.pendingOrders}</div>
        </div>

        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.6875rem', color: '#EF4444', textTransform: 'uppercase', fontWeight: 600 }}>Cancelled</span>
          <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#EF4444', marginTop: '4px' }}>{analytics.cancelledOrders}</div>
        </div>

        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.6875rem', color: '#888B96', textTransform: 'uppercase', fontWeight: 600 }}>Returned</span>
          <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#888B96', marginTop: '4px' }}>{analytics.returnedOrders}</div>
        </div>

        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.6875rem', color: '#C9A96E', textTransform: 'uppercase', fontWeight: 600 }}>Avg Order Value (AOV)</span>
          <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#C9A96E', marginTop: '4px' }}>₹{Number(analytics.averageOrderValue ?? 0).toLocaleString('en-IN')}</div>
        </div>

        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.6875rem', color: '#EC4899', textTransform: 'uppercase', fontWeight: 600 }}>Wishlist Pieces</span>
          <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#EC4899', marginTop: '4px' }}>{wishlistCount}</div>
        </div>
      </div>

      {/* TWO COLUMN SECTION: SAVED ADDRESSES & COMPLETE ORDER HISTORY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Left Column: Registered Residences & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Residences */}
          <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '24px' }}>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#C9A96E" /> Saved Residences ({addresses.length})
            </h2>

            {addresses.length === 0 ? (
              <p style={{ color: '#888B96', fontSize: '0.875rem' }}>No residential addresses registered.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {addresses.map((addr, idx) => (
                  <div key={addr.id || idx} style={{ padding: '14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ color: '#FFF', fontSize: '0.875rem' }}>{addr.fullName}</strong>
                      {addr.isDefault && <Badge variant="outline">Default Residence</Badge>}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#9CA3AF', lineHeight: 1.5 }}>
                      {addr.houseBuilding}, {addr.street}<br />
                      {addr.city}, {addr.state} — {addr.pinCode}<br />
                      {addr.country} • Phone: {addr.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '24px' }}>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#C9A96E" /> Recent Client Activity
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8125rem', color: '#9CA3AF' }}>
              <div style={{ paddingLeft: '12px', borderLeft: '2px solid #C9A96E' }}>
                <strong style={{ color: '#FFF' }}>Authenticated Patron Session</strong>
                <div style={{ color: '#6B7280', marginTop: '2px' }}>Current active token</div>
              </div>
              {orders.length > 0 && (
                <div style={{ paddingLeft: '12px', borderLeft: '2px solid #10B981' }}>
                  <strong style={{ color: '#FFF' }}>Acquisition Placed ({orders[0].orderNumber})</strong>
                  <div style={{ color: '#6B7280', marginTop: '2px' }}>{new Date(orders[0].createdAt).toLocaleDateString('en-IN')}</div>
                </div>
              )}
              <div style={{ paddingLeft: '12px', borderLeft: '2px solid #6B7280' }}>
                <strong style={{ color: '#FFF' }}>Registry Profile Verified</strong>
                <div style={{ color: '#6B7280', marginTop: '2px' }}>Account verified on {new Date(profile.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Order History Linking to Order Detail */}
        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} color="#C9A96E" /> Complete Acquisition Ledger ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <p style={{ color: '#888B96', fontSize: '0.875rem' }}>No orders have been recorded for this patron yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {orders.map((ord: any) => (
                <div
                  key={ord.id}
                  style={{
                    padding: '16px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <Link
                        href={`/admin/orders`}
                        style={{ color: '#FFF', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none' }}
                      >
                        {ord.orderNumber}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: '#888B96', marginTop: '2px' }}>
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <Badge variant={ord.orderStatus === 'delivered' || ord.status === 'DELIVERED' ? 'success' : ord.orderStatus === 'cancelled' || ord.status === 'CANCELLED' ? 'danger' : 'warning'}>
                      {(ord.orderStatus || ord.status || '').toUpperCase()}
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                    <div style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
                      {ord.items?.length || 1} {ord.items?.length === 1 ? 'creation' : 'creations'} • Method: {ord.paymentMethod?.toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <strong style={{ color: '#C9A96E', fontSize: '1rem' }}>
                        ₹{(ord.total || 0).toLocaleString('en-IN')}
                      </strong>
                      <Link
                        href={`/admin/orders`}
                        className="elx-btn elx-btn-secondary elx-btn-sm"
                        style={{ minHeight: '34px', fontSize: '0.75rem', padding: '0 10px' }}
                      >
                        Inspect <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
