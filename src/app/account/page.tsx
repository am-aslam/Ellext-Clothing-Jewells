'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, MapPin, Heart, User as UserIcon, Clock, ArrowRight, LogOut, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { api } from '@/services/api';
import { Order, Address } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/States';

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, customerToken, logoutCustomer, isLoading: authLoading } = useAuth();
  const { wishlist } = useWishlist();

  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!customerToken && !user) {
        setLoading(false);
        return;
      }
      try {
        const [oList, aList] = await Promise.all([
          api.getOrders(),
          api.getAddresses()
        ]);
        setOrders(oList);
        setAddresses(aList);
      } catch (err) {
        console.error('Failed to load account data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [customerToken, user]);

  if (authLoading || loading) {
    return <LoadingState message="Retrieving your client salon portfolio..." />;
  }

  // If visitor is not authenticated, show welcoming login prompt
  if (!user && !customerToken) {
    return (
      <div className="account-page-wrapper" style={{ padding: '80px 24px 120px', textAlign: 'center' }}>
        <div className="elx-container" style={{ maxWidth: '540px', margin: '0 auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <UserIcon size={28} color="#C9A96E" />
          </div>
          <span className="section-sub-label">Private Client Salon</span>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 400, marginTop: '8px', marginBottom: '12px' }}>
            Client Authentication Required
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Please sign in to access your bespoke orders, tracked dispatches, address book, and reserved jewelry repertoire.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" className="elx-btn elx-btn-primary" style={{ minWidth: '160px', minHeight: '46px' }}>
              Sign In
            </Link>
            <Link href="/register" className="elx-btn elx-btn-secondary" style={{ minWidth: '160px', minHeight: '46px' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const recentOrder = orders[0];
  const customerName = user?.name || 'Valued Patron';
  const customerEmail = user?.email || '';

  return (
    <div className="account-page-wrapper" style={{ padding: '48px 24px 100px' }}>
      <div className="elx-container">
        {/* Header with Patron Identity and Sign Out */}
        <div style={{ marginBottom: '36px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="section-sub-label">Private Client Salon</span>
            <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 400 }}>
              Patron Account
            </h1>
            <p style={{ color: 'var(--color-muted)', marginTop: '6px' }}>
              Welcome, <strong style={{ color: 'var(--color-noir)' }}>{customerName}</strong> • {customerEmail}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/account/profile" className="elx-btn elx-btn-outline elx-btn-sm" style={{ minHeight: '40px' }}>
              <UserIcon size={14} /> Profile
            </Link>
            <button
              onClick={() => {
                logoutCustomer();
                router.push('/');
              }}
              className="elx-btn elx-btn-secondary elx-btn-sm"
              style={{ minHeight: '40px', color: '#EF4444' }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Metrics Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '36px'
          }}
        >
          <div style={{ backgroundColor: '#FFF', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Acquisitions
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-noir)', margin: '8px 0 2px' }}>
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </div>
            <Link href="/account/orders" style={{ fontSize: '0.75rem', color: '#C9A96E', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              View full ledger <ArrowRight size={11} />
            </Link>
          </div>

          <div style={{ backgroundColor: '#FFF', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Reserved Pieces
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-noir)', margin: '8px 0 2px' }}>
              {wishlist.length} {wishlist.length === 1 ? 'Creation' : 'Creations'}
            </div>
            <Link href="/account/wishlist" style={{ fontSize: '0.75rem', color: '#C9A96E', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              Open wishlist <ArrowRight size={11} />
            </Link>
          </div>

          <div style={{ backgroundColor: '#FFF', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Saved Residences
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-noir)', margin: '8px 0 2px' }}>
              {addresses.length} {addresses.length === 1 ? 'Address' : 'Addresses'}
            </div>
            <Link href="/account/addresses" style={{ fontSize: '0.75rem', color: '#C9A96E', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              Manage addresses <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        {/* Recent Order Highlight */}
        {recentOrder && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '36px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C9A96E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Most Recent Acquisition
                </span>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '2px 0 0' }}>
                  {recentOrder.orderNumber}
                </h3>
              </div>
              <Badge variant={recentOrder.orderStatus === 'delivered' ? 'success' : 'warning'}>
                {recentOrder.orderStatus.toUpperCase()}
              </Badge>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
                Placed on {new Date(recentOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {recentOrder.items.length} {recentOrder.items.length === 1 ? 'item' : 'items'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-noir)' }}>
                  ₹{recentOrder.total.toLocaleString('en-IN')}
                </span>
                <Link
                  href={`/account/orders/${recentOrder.id}`}
                  className="elx-btn elx-btn-primary elx-btn-sm"
                  style={{ minHeight: '38px' }}
                >
                  Track & Inspect <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Account Sections Navigation Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {/* Orders */}
          <Link
            href="/account/orders"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '28px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Package size={20} color="var(--color-noir)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
                Order History & Tracking
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                Track active dispatches and view historical receipts and timelines.
              </p>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C9A96E', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
                View All Orders <ArrowRight size={13} />
              </span>
            </div>
          </Link>

          {/* Addresses */}
          <Link
            href="/account/addresses"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '28px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={20} color="var(--color-noir)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
                Saved Residences
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                Manage delivery addresses and regional shipping rates.
              </p>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C9A96E', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
                Manage Residences <ArrowRight size={13} />
              </span>
            </div>
          </Link>

          {/* Wishlist */}
          <Link
            href="/account/wishlist"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '28px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={20} color="var(--color-noir)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
                Private Wishlist ({wishlist.length})
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                Review pieces curated for your personal bridal and couture repertoire.
              </p>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C9A96E', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
                View Wishlist <ArrowRight size={13} />
              </span>
            </div>
          </Link>

          {/* Profile Details */}
          <Link
            href="/account/profile"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '28px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserIcon size={20} color="var(--color-noir)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
                Profile & Security
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                Update personal contact details and password credentials.
              </p>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C9A96E', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
                Edit Profile <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
