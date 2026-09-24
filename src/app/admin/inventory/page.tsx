'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Save, AlertTriangle, Check, RefreshCw, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { api } from '@/services/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { LoadingState } from '@/components/ui/States';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockEdits, setStockEdits] = useState<{ [sku: string]: number }>({});
  const [savingSku, setSavingSku] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = (await api.getAllProductsForAdmin()).filter(product => product.status !== 'archived');
      setProducts(data);
      const initialMap: { [sku: string]: number } = {};
      data.forEach(p => {
        initialMap[p.sku] = p.stock;
      });
      setStockEdits(initialMap);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockChange = (sku: string, value: number) => {
    setStockEdits(prev => ({ ...prev, [sku]: Math.max(0, value) }));
  };

  const handleQuickSave = async (sku: string) => {
    const newStock = stockEdits[sku];
    if (newStock === undefined) return;
    setSavingSku(sku);
    try {
      await api.updateInventory(sku, newStock);
      setProducts(prev =>
        prev.map(p => (p.sku === sku ? { ...p, stock: newStock } : p))
      );
      showToast(`Stock for SKU ${sku} updated to ${newStock} units.`, 'success');
    } catch {
      showToast('Failed to update stock.', 'error');
    } finally {
      setSavingSku(null);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      for (const p of products) {
        const currentEdit = stockEdits[p.sku];
        if (currentEdit !== undefined && currentEdit !== p.stock) {
          await api.updateInventory(p.sku, currentEdit);
        }
      }
      showToast('All modified inventory counts saved successfully!', 'success');
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesLowStock = onlyLowStock ? p.stock <= p.lowStockThreshold : true;
    return matchesSearch && matchesLowStock;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#101828' }}>
            Fast Inventory Control
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#667085', marginTop: '2px' }}>
            Direct inline stock adjustments. Click numbers to edit and press enter or save.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" size="sm" onClick={loadData}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleSaveAll} id="btn-save-all-inventory">
            <Save size={14} /> Save All Changes
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
          alignItems: 'center',
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
            placeholder="Search piece by name or SKU..."
            className="elx-input"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.8125rem' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={onlyLowStock}
            onChange={e => setOnlyLowStock(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          <span style={{ color: '#B42318', fontWeight: 600 }}>Show Low Stock Alerts Only</span>
        </label>
      </div>

      {/* Main Table */}
      {loading ? (
        <LoadingState message="Loading inventory matrix..." />
      ) : (
        <>
          <div className="admin-table-container desktop-only">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Image</th>
                  <th>Creation Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Threshold</th>
                  <th style={{ width: '180px' }}>Live Stock Count</th>
                  <th>Alert Status</th>
                  <th style={{ textAlign: 'right' }}>Quick Save</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const currentVal = stockEdits[p.sku] ?? p.stock;
                  const isModified = currentVal !== p.stock;
                  const isLow = currentVal <= p.lowStockThreshold;

                  return (
                    <tr key={p.id} style={{ backgroundColor: isModified ? '#FEFBF6' : undefined }}>
                      <td>
                        <div
                          style={{
                            position: 'relative',
                            width: '40px',
                            height: '50px',
                            borderRadius: 'var(--radius-xs)',
                            overflow: 'hidden',
                            backgroundColor: '#F2F4F7'
                          }}
                        >
                          <Image
                            src={p.coverImage || p.images[0]}
                            alt={p.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </td>

                      <td>
                        <strong style={{ fontSize: '0.875rem', color: '#101828' }}>{p.name}</strong>
                        <span style={{ fontSize: '0.6875rem', color: '#667085', display: 'block' }}>
                          {p.collection}
                        </span>
                      </td>

                      <td>
                        <code style={{ fontSize: '0.75rem', backgroundColor: '#F2F4F7', padding: '2px 6px', borderRadius: '3px' }}>
                          {p.sku}
                        </code>
                      </td>

                      <td>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.6875rem', color: '#667085' }}>
                          {p.category}
                        </span>
                      </td>

                      <td style={{ color: '#667085', fontSize: '0.8125rem' }}>
                        ≤ {p.lowStockThreshold} units
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="number"
                            value={currentVal}
                            onChange={e => handleStockChange(p.sku, parseInt(e.target.value) || 0)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleQuickSave(p.sku);
                            }}
                            className="inline-stock-input"
                            style={{
                              borderColor: isModified ? '#C5A880' : isLow ? '#FDA29B' : undefined,
                              backgroundColor: isModified ? '#FFFDF5' : undefined
                            }}
                          />
                          <span style={{ fontSize: '0.75rem', color: '#667085' }}>units</span>
                        </div>
                      </td>

                      <td>
                        {isLow ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#B42318', fontSize: '0.75rem', fontWeight: 600 }}>
                            <AlertTriangle size={14} /> LOW STOCK ({currentVal})
                          </span>
                        ) : (
                          <span style={{ color: '#0E8345', fontSize: '0.75rem', fontWeight: 500 }}>
                            Healthy
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleQuickSave(p.sku)}
                          disabled={!isModified || savingSku === p.sku}
                          className="elx-btn elx-btn-sm"
                          style={{
                            backgroundColor: isModified ? '#101828' : '#F2F4F7',
                            color: isModified ? '#FFFFFF' : '#888',
                            padding: '6px 12px'
                          }}
                        >
                          {savingSku === p.sku ? (
                            'Saving...'
                          ) : isModified ? (
                            <>
                              <Save size={13} /> Update
                            </>
                          ) : (
                            'Saved'
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE RESPONSIVE CARDS (Touch target >= 44px) */}
          <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(p => {
              const currentVal = stockEdits[p.sku] ?? p.stock;
              const isModified = currentVal !== p.stock;
              const isLow = currentVal <= p.lowStockThreshold;

              return (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: isModified ? '1.5px solid #C5A880' : '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '56px',
                        height: '70px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#F2F4F7',
                        flexShrink: 0
                      }}
                    >
                      <Image
                        src={p.coverImage || p.images[0]}
                        alt={p.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#101828', lineHeight: 1.3 }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#667085', marginTop: '2px' }}>
                        {p.collection} • <code style={{ backgroundColor: '#F2F4F7', padding: '1px 5px', borderRadius: '3px' }}>{p.sku}</code>
                      </div>
                      <div style={{ marginTop: '6px' }}>
                        {isLow ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#B42318', fontSize: '0.75rem', fontWeight: 600 }}>
                            <AlertTriangle size={13} /> Low Stock (Threshold ≤ {p.lowStockThreshold})
                          </span>
                        ) : (
                          <span style={{ color: '#0E8345', fontSize: '0.75rem', fontWeight: 500 }}>
                            Stock Healthy (Threshold ≤ {p.lowStockThreshold})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock Stepper & Quick Save with 44px touch targets */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #F3F4F6',
                      paddingTop: '12px',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleStockChange(p.sku, Math.max(0, currentVal - 1))}
                        style={{
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#F3F4F6',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: '#101828'
                        }}
                        aria-label="Decrease stock count"
                      >
                        <Minus size={18} />
                      </button>

                      <input
                        type="number"
                        value={currentVal}
                        onChange={e => handleStockChange(p.sku, parseInt(e.target.value) || 0)}
                        style={{
                          width: '70px',
                          height: '44px',
                          textAlign: 'center',
                          fontSize: '1rem',
                          fontWeight: 600,
                          borderRadius: '6px',
                          border: isModified ? '2px solid #C5A880' : '1px solid #D0D5DD',
                          backgroundColor: isModified ? '#FFFDF5' : '#FFF'
                        }}
                        aria-label="Stock count"
                      />

                      <button
                        type="button"
                        onClick={() => handleStockChange(p.sku, currentVal + 1)}
                        style={{
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#F3F4F6',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: '#101828'
                        }}
                        aria-label="Increase stock count"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickSave(p.sku)}
                      disabled={!isModified || savingSku === p.sku}
                      style={{
                        minHeight: '44px',
                        padding: '0 20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        backgroundColor: isModified ? '#101828' : '#F3F4F6',
                        color: isModified ? '#FFFFFF' : '#9CA3AF',
                        border: 'none',
                        cursor: isModified ? 'pointer' : 'default',
                        flex: '1',
                        minWidth: '120px'
                      }}
                    >
                      {savingSku === p.sku ? (
                        'Saving...'
                      ) : isModified ? (
                        <>
                          <Save size={15} /> Save
                        </>
                      ) : (
                        'Synced'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
