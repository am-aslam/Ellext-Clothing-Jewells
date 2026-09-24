'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowUpDown, Eye, ArrowRight, Phone, Mail, ShoppingBag, User } from 'lucide-react';
import { api } from '@/services/api';
import { CustomerListItem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { LoadingState, EmptyState } from '@/components/ui/States';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('spent-desc');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getAdminCustomers({
          search: search.trim() || undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          sort: sortBy
        });
        setCustomers(data);
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, sortBy]);

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#FFF' }}>
            Customer Relationship Management
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '2px' }}>
            Comprehensive register of patrons, historical acquisitions, and client lifetime value.
          </p>
        </div>

        <div style={{ fontSize: '0.875rem', color: '#C9A96E', fontWeight: 600 }}>
          {customers.length} {customers.length === 1 ? 'Registered Client' : 'Registered Clients'}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
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
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or telephone..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              color: '#FFF',
              fontSize: '0.875rem',
              outline: 'none',
              minHeight: '42px'
            }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#6B7280' }} />
        </div>

        {/* Filters and Sort */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status Filter */}
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
              <option value="ALL">All Clients</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#888B96' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
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
              <option value="spent-desc">Highest Total Spend</option>
              <option value="orders-desc">Most Acquisitions</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Analyzing customer ledger and lifetime analytics..." />
      ) : customers.length === 0 ? (
        <EmptyState
          icon="search"
          title="No Customers Found"
          description="We could not find any patrons matching your current search or filter criteria."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('ALL');
            setSortBy('spent-desc');
          }}
        />
      ) : (
        <>
          {/* DESKTOP VIEW: FULL METRIC DATA TABLE (Hidden on small mobile) */}
          <div
            className="hidden md-block"
            style={{
              backgroundColor: '#0F131C',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '14px 18px', color: '#888B96', fontWeight: 600 }}>Customer</th>
                    <th style={{ padding: '14px 14px', color: '#888B96', fontWeight: 600 }}>Contact</th>
                    <th style={{ padding: '14px 12px', color: '#888B96', fontWeight: 600, textAlign: 'center' }}>Orders</th>
                    <th style={{ padding: '14px 12px', color: '#888B96', fontWeight: 600, textAlign: 'center' }}>Completed</th>
                    <th style={{ padding: '14px 12px', color: '#888B96', fontWeight: 600, textAlign: 'center' }}>Cancelled</th>
                    <th style={{ padding: '14px 12px', color: '#888B96', fontWeight: 600, textAlign: 'center' }}>Returned</th>
                    <th style={{ padding: '14px 16px', color: '#888B96', fontWeight: 600, textAlign: 'right' }}>Total Spent</th>
                    <th style={{ padding: '14px 16px', color: '#888B96', fontWeight: 600 }}>Last Order</th>
                    <th style={{ padding: '14px 14px', color: '#888B96', fontWeight: 600, textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '14px 16px', color: '#888B96', fontWeight: 600, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      {/* Customer */}
                      <td style={{ padding: '14px 18px' }}>
                        <Link
                          href={`/admin/customers/${c.id}`}
                          style={{ color: '#FFF', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(201,169,110,0.15)', color: '#C9A96E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{c.name}</span>
                        </Link>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '14px 14px', fontSize: '0.8125rem' }}>
                        <div style={{ color: '#E0E0E0' }}>{c.email}</div>
                        <div style={{ color: '#888B96', marginTop: '2px' }}>{c.phone}</div>
                      </td>

                      {/* Orders */}
                      <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 600, color: '#FFF' }}>
                        {c.totalOrders}
                      </td>

                      {/* Completed */}
                      <td style={{ padding: '14px 12px', textAlign: 'center', color: '#10B981', fontWeight: 600 }}>
                        {c.completedOrders}
                      </td>

                      {/* Cancelled */}
                      <td style={{ padding: '14px 12px', textAlign: 'center', color: '#EF4444' }}>
                        {c.cancelledOrders}
                      </td>

                      {/* Returned */}
                      <td style={{ padding: '14px 12px', textAlign: 'center', color: '#F59E0B' }}>
                        {c.returnedOrders}
                      </td>

                      {/* Total Spent */}
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#C9A96E' }}>
                        ₹{Number(c.totalSpent ?? 0).toLocaleString('en-IN')}
                      </td>

                      {/* Last Order */}
                      <td style={{ padding: '14px 16px', fontSize: '0.8125rem' }}>
                        {c.lastOrder ? (
                          <div>
                            <Link href="/admin/orders" style={{ color: '#FFF', fontWeight: 500, textDecoration: 'none' }}>
                              {c.lastOrder.orderNumber}
                            </Link>
                            <div style={{ color: '#888B96', fontSize: '0.75rem' }}>
                              {new Date(c.lastOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#6B7280' }}>No orders yet</span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                        <Badge variant={c.status === 'ACTIVE' ? 'success' : 'danger'}>
                          {c.status}
                        </Badge>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="elx-btn elx-btn-secondary elx-btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', minHeight: '34px', fontSize: '0.75rem' }}
                        >
                          <Eye size={13} /> View 360
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE VIEW: STACKED INTERACTIVE CARDS (Requirement 16) */}
          <div className="md-hidden" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {customers.map(c => (
              <div
                key={c.id}
                style={{
                  backgroundColor: '#0F131C',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                {/* Top Row: Name + Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(201,169,110,0.15)', color: '#C9A96E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700 }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <Link href={`/admin/customers/${c.id}`} style={{ fontWeight: 600, color: '#FFF', fontSize: '1rem', textDecoration: 'none' }}>
                        {c.name}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: '#888B96', marginTop: '2px' }}>
                        Joined {new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <Badge variant={c.status === 'ACTIVE' ? 'success' : 'danger'}>
                    {c.status}
                  </Badge>
                </div>

                {/* Contact Strip */}
                <div style={{ fontSize: '0.8125rem', color: '#9CA3AF', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={13} color="#6B7280" /> {c.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={13} color="#6B7280" /> {c.phone}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    padding: '12px',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#888B96', display: 'block', textTransform: 'uppercase' }}>Orders</span>
                    <strong style={{ fontSize: '1rem', color: '#FFF' }}>{c.totalOrders}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#10B981', display: 'block', textTransform: 'uppercase' }}>Delivered</span>
                    <strong style={{ fontSize: '1rem', color: '#10B981' }}>{c.completedOrders}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#EF4444', display: 'block', textTransform: 'uppercase' }}>Cancelled</span>
                    <strong style={{ fontSize: '1rem', color: '#EF4444' }}>{c.cancelledOrders}</strong>
                  </div>
                </div>

                {/* Spend & Last Order */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#888B96', textTransform: 'uppercase', display: 'block' }}>Total Lifetime Spend</span>
                    <strong style={{ fontSize: '1.125rem', color: '#C9A96E' }}>₹{Number(c.totalSpent ?? 0).toLocaleString('en-IN')}</strong>
                  </div>

                  <Link
                    href={`/admin/customers/${c.id}`}
                    className="elx-btn elx-btn-primary elx-btn-sm"
                    style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 16px' }}
                  >
                    Customer 360 <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
