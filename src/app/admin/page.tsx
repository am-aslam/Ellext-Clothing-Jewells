'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Boxes,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Eye
} from 'lucide-react';
import { AdminMetrics, Order, CustomerListItem } from '@/types';
import { api } from '@/services/api';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/States';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<CustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, orders, customers] = await Promise.all([
          api.getAdminMetrics(),
          api.getOrders(),
          api.getAdminCustomers()
        ]);
        setMetrics(m);
        setRecentOrders(orders.slice(0, 6));
        setRecentCustomers(customers.slice(0, 6));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Connecting to operational ledger..." />;
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#FFF' }}>
            Operational Dashboard
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '2px' }}>
            Real-time fulfillment, inventory thresholds, customers, and atelier transactions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/admin/inventory" className="elx-btn elx-btn-secondary elx-btn-sm" style={{ minHeight: '40px' }}>
            Quick Stock Editor
          </Link>
          <Link href="/admin/products/new" className="elx-btn elx-btn-primary elx-btn-sm" id="dashboard-add-product-btn" style={{ minHeight: '40px' }}>
            <PlusCircle size={14} /> Add Product
          </Link>
        </div>
      </div>

      {/* METRICS GRID: 5 Core Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        {/* Today's Sales */}
        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Today&apos;s Sales
          </span>
          <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#C9A96E', margin: '8px 0 4px' }}>
            ₹{Number(metrics?.todaySales ?? 0).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} /> Active acquisitions
          </div>
        </div>

        {/* Orders */}
        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Orders
          </span>
          <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#FFF', margin: '8px 0 4px' }}>
            {metrics?.ordersCount || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>All lifetime client purchases</span>
        </div>

        {/* Pending Orders */}
        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Pending Orders
          </span>
          <div style={{ fontSize: '1.625rem', fontWeight: 700, color: (metrics?.pendingOrdersCount || 0) > 0 ? '#F59E0B' : '#FFF', margin: '8px 0 4px' }}>
            {metrics?.pendingOrdersCount || 0}
          </div>
          <Link href="/admin/orders" style={{ fontSize: '0.75rem', color: '#C9A96E', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Process queue <ArrowRight size={12} />
          </Link>
        </div>

        {/* Low Stock */}
        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Low Stock Alerts
          </span>
          <div style={{ fontSize: '1.625rem', fontWeight: 700, color: (metrics?.lowStockCount || 0) > 0 ? '#EF4444' : '#FFF', margin: '8px 0 4px' }}>
            {metrics?.lowStockCount || 0}
          </div>
          <Link href="/admin/inventory" style={{ fontSize: '0.75rem', color: '#EF4444', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Restock inventory <AlertTriangle size={12} />
          </Link>
        </div>

        {/* Customers */}
        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Registered Clients
          </span>
          <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#FFF', margin: '8px 0 4px' }}>
            {metrics?.customersCount || recentCustomers.length}
          </div>
          <Link href="/admin/customers" style={{ fontSize: '0.75rem', color: '#C9A96E', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Open CRM <Users size={12} />
          </Link>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: RECENT ORDERS & RECENT CUSTOMERS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Recent Orders Card */}
        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#FFF' }}>Recent Orders</h2>
              <span style={{ fontSize: '0.75rem', color: '#888B96' }}>Latest atelier acquisitions</span>
            </div>
            <Link href="/admin/orders" style={{ fontSize: '0.8125rem', color: '#C9A96E', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentOrders.map(order => (
              <div
                key={order.id}
                style={{
                  padding: '14px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#FFF', fontSize: '0.875rem' }}>{order.orderNumber}</span>
                    <Badge variant={order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'cancelled' ? 'neutral' : 'warning'}>
                      {order.orderStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#888B96', marginTop: '4px' }}>
                    {order.customer.name} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#C9A96E', fontSize: '0.9375rem' }}>
                    ₹{Number(order.total ?? 0).toLocaleString('en-IN')}
                  </div>
                  <Link
                    href={`/admin/orders`}
                    style={{ fontSize: '0.75rem', color: '#9CA3AF', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}
                  >
                    Details <Eye size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Customers Card */}
        <div style={{ backgroundColor: '#0F131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#FFF' }}>Recent Customers</h2>
              <span style={{ fontSize: '0.75rem', color: '#888B96' }}>Clients in the Maison register</span>
            </div>
            <Link href="/admin/customers" style={{ fontSize: '0.8125rem', color: '#C9A96E', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentCustomers.map(customer => (
              <div
                key={customer.id}
                style={{
                  padding: '14px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#FFF', fontSize: '0.875rem' }}>{customer.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888B96', marginTop: '3px' }}>
                    {customer.email} • {customer.phone}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8125rem', color: '#FFF', fontWeight: 600 }}>
                    {customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}
                  </div>
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    style={{ fontSize: '0.75rem', color: '#C9A96E', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}
                  >
                    View 360 <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
