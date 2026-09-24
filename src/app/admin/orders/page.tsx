'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowRight, Eye, RefreshCw, Printer } from 'lucide-react';
import { Order, OrderStage } from '@/types';
import { api } from '@/services/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { LoadingState } from '@/components/ui/States';
import { printAddressLabels } from '@/utils/printAddressLabels';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { showToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleQuickStatus = async (orderId: string, nextStage: OrderStage) => {
    try {
      const updated = await api.updateOrderStatus(orderId, nextStage);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      showToast(`Order status advanced to ${nextStage.toUpperCase()}.`, 'success');
    } catch {
      showToast('Failed to advance order status.', 'error');
    }
  };

  const handlePrintConfirmedAddresses = () => {
    const confirmedOrders = orders.filter(order => order.orderStatus === 'confirmed');
    if (!confirmedOrders.length) {
      showToast('There are no confirmed orders to print.', 'info');
      return;
    }
    if (!printAddressLabels(confirmedOrders)) {
      showToast('Allow pop-ups for this site to print the address stickers.', 'error');
    }
  };

  const filtered = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#101828' }}>
            Orders & Armoured Dispatch
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#667085', marginTop: '2px' }}>
            Fulfillment pipeline, security escorts, and customer handover tracking.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" onClick={handlePrintConfirmedAddresses}>
            <Printer size={14} /> Print Confirmed Addresses
          </Button>
          <Button variant="secondary" size="sm" onClick={loadOrders}>
            <RefreshCw size={14} /> Refresh Orders
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          backgroundColor: '#FFFFFF',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--admin-border)'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888'
            }}
          />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Order #, customer name, city..."
            className="elx-input"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.8125rem' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="elx-select"
          style={{ width: '180px', height: '38px', fontSize: '0.8125rem', padding: '0 10px' }}
        >
          <option value="all">All Stages</option>
          <option value="placed">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Loading order fulfillment ledger..." />
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Patron / Destination</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Fulfillment Stage</th>
                <th>Quick Advance</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ord => (
                <tr key={ord.id}>
                  <td>
                    <strong>#{ord.orderNumber}</strong>
                    <div style={{ fontSize: '0.6875rem', color: '#667085' }}>
                      {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: '#101828' }}>{ord.customer.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#667085' }}>
                      {ord.shippingAddress.city}, {ord.shippingAddress.pinCode}
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.75rem', color: '#667085' }}>
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </td>

                  <td>
                    <strong style={{ fontSize: '0.875rem' }}>
                      ₹{Number(ord.total ?? 0).toLocaleString('en-IN')}
                    </strong>
                  </td>

                  <td>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: ord.paymentStatus === 'paid' ? '#0E8345' : '#B54708',
                        textTransform: 'uppercase'
                      }}
                    >
                      {ord.paymentStatus} ({ord.paymentMethod})
                    </span>
                  </td>

                  <td>
                    <Badge
                      variant={
                        ord.orderStatus === 'delivered'
                          ? 'success'
                          : ord.orderStatus === 'shipped'
                          ? 'gold'
                          : ord.orderStatus === 'cancelled'
                          ? 'danger'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {ord.orderStatus.replace(/_/g, ' ')}
                    </Badge>
                  </td>

                  <td>
                    {ord.orderStatus === 'placed' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatus(ord.id, 'confirmed')}
                        className="elx-btn elx-btn-secondary elx-btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.6875rem' }}
                      >
                        Confirm Atelier
                      </button>
                    )}
                    {ord.orderStatus === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatus(ord.id, 'packed')}
                        className="elx-btn elx-btn-secondary elx-btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.6875rem' }}
                      >
                        Mark Packed
                      </button>
                    )}
                    {ord.orderStatus === 'packed' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatus(ord.id, 'shipped')}
                        className="elx-btn elx-btn-primary elx-btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.6875rem' }}
                      >
                        Dispatch Courier
                      </button>
                    )}
                    {ord.orderStatus === 'shipped' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatus(ord.id, 'out_for_delivery')}
                        className="elx-btn elx-btn-secondary elx-btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.6875rem' }}
                      >
                        Out for Delivery
                      </button>
                    )}
                    {ord.orderStatus === 'out_for_delivery' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatus(ord.id, 'delivered')}
                        className="elx-btn elx-btn-primary elx-btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.6875rem', backgroundColor: '#0E8345' }}
                      >
                        Mark Delivered
                      </button>
                    )}
                    {ord.orderStatus === 'delivered' && (
                      <span style={{ fontSize: '0.75rem', color: '#0E8345', fontWeight: 600 }}>
                        Completed
                      </span>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="elx-btn elx-btn-secondary elx-btn-sm"
                      style={{ padding: '6px 12px' }}
                    >
                      <Eye size={13} /> Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#667085' }}>
              No orders found matching criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
