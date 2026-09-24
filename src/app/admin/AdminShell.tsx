'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  ShoppingBag,
  Boxes,
  Layers,
  Percent,
  Tag,
  BarChart3,
  Settings,
  PlusCircle,
  Menu,
  X,
  LogOut,
  Store
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, adminToken, logoutAdmin, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Exclude auth screen from admin layout wrapper
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/register';

  // Guard admin routes
  useEffect(() => {
    if (!isLoading && !isLoginPage && !adminToken) {
      router.replace('/admin/login');
    }
  }, [isLoading, isLoginPage, adminToken, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading || !adminToken) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#07090E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A96E' }}>
        Verifying Atelier Authorization...
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ClipboardList },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Collections', href: '/admin/collections', icon: Layers },
    { label: 'Offers', href: '/admin/offers', icon: Percent },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Team & Access', href: '/admin/team', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0B0E14' }}>
      {/* Desktop Admin Sidebar */}
      <aside
        className="admin-sidebar admin-desktop-sidebar"
        aria-label="Admin Operations Sidebar"
        style={{
          width: '260px',
          backgroundColor: '#0F131C',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}
      >
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <Logo variant="admin" priority />
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(201,169,110,0.15)',
                color: '#C9A96E',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              Admin
            </span>
          </Link>
          <div style={{ fontSize: '0.6875rem', color: '#888B96', marginTop: '6px' }}>
            Atelier Management System
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FFF' : '#9CA3AF',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  textDecoration: 'none',
                  minHeight: '44px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={17} style={{ color: isActive ? '#C9A96E' : '#6B7280' }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.8125rem',
              color: '#9CA3AF',
              textDecoration: 'none',
              padding: '6px 0'
            }}
          >
            <Store size={15} />
            <span>Open Customer Storefront</span>
          </Link>

          <button
            onClick={() => {
              logoutAdmin();
              router.push('/admin/login');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.8125rem',
              color: '#EF4444',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              textAlign: 'left'
            }}
          >
            <LogOut size={15} />
            <span>Sign Out ({admin?.name?.split(' ')[0] || 'Admin'})</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Stage */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top Header */}
        <header
          className="admin-shell-header"
          style={{
            height: '64px',
            backgroundColor: '#0F131C',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            position: 'sticky',
            top: 0,
            zIndex: 40
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg-hidden"
              style={{
                background: 'none',
                border: 'none',
                color: '#FFF',
                cursor: 'pointer',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Open mobile admin menu"
            >
              <Menu size={22} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#FFF' }}>Operations Console</span>
              <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                Live
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link
              href="/admin/products/new"
              className="elx-btn elx-btn-primary elx-btn-sm admin-new-product"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minHeight: '40px',
                fontSize: '0.8125rem',
                fontWeight: 600
              }}
            >
              <PlusCircle size={14} /> New Product
            </Link>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(201,169,110,0.2)',
                color: '#C9A96E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8125rem',
                fontWeight: 600
              }}
            >
              {admin?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 1000,
              backdropFilter: 'blur(4px)',
              display: 'flex'
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '80%',
                maxWidth: '300px',
                height: '100%',
                backgroundColor: '#0F131C',
                color: '#FFF',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px 16px',
                borderRight: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Logo variant="admin" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFF',
                    minWidth: '44px',
                    minHeight: '44px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#FFF' : '#9CA3AF',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                        textDecoration: 'none',
                        minHeight: '44px'
                      }}
                    >
                      <Icon size={18} style={{ color: isActive ? '#C9A96E' : '#6B7280' }} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logoutAdmin();
                    router.push('/admin/login');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#EF4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    minHeight: '44px',
                    width: '100%'
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="admin-main-content" style={{ flex: 1, padding: '24px', backgroundColor: '#0B0E14', color: '#F3F4F6' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
