'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  Copy,
  EyeOff,
  Eye,
  Trash2,
  Edit,
  Check,
  AlertCircle,
  Truck,
  ImagePlus
} from 'lucide-react';
import { Product } from '@/types';
import { api } from '@/services/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { ErrorState, LoadingState } from '@/components/ui/States';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [imageUploadProductId, setImageUploadProductId] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const loadProducts = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.getAllProductsForAdmin();
      setProducts(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDuplicate = async (product: Product) => {
    try {
      const copy = {
        ...product,
        name: `${product.name} (Copy)`,
        slug: `${product.slug}-copy-${Date.now().toString().slice(-4)}`,
        sku: `${product.sku}-CPY`,
        status: 'draft' as const
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, updatedAt, ...createData } = copy;
      await api.createProduct(createData);
      showToast(`Duplicated "${product.name}" as draft.`, 'success');
      loadProducts();
    } catch {
      showToast('Failed to duplicate product.', 'error');
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.status === 'active' ? 'draft' : 'active';
    try {
      await api.updateProduct(product.id, { status: nextStatus });
      showToast(`Product "${product.name}" marked as ${nextStatus}.`, 'info');
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, status: nextStatus } : p))
      );
    } catch {
      showToast('Failed to change product visibility.', 'error');
    }
  };

  const handleToggleFreeShipping = async (product: Product) => {
    const nextFreeShipping = !product.freeShipping;
    try {
      await api.updateProduct(product.id, { freeShipping: nextFreeShipping });
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, freeShipping: nextFreeShipping } : p))
      );
      showToast(
        nextFreeShipping
          ? `Free shipping enabled for ${product.name}.`
          : `Regional shipping enabled for ${product.name}.`,
        'success'
      );
    } catch {
      showToast('Failed to update the shipping setting.', 'error');
    }
  };

  const handleReplaceImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    const product = products.find(item => item.id === imageUploadProductId);
    if (!file || !product) return;
    setImageUploading(true);
    try {
      const uploaded = await api.uploadProductImage(file);
      await api.addProductImage(product.id, {
        url: uploaded.url,
        storageKey: uploaded.storageKey,
        sortOrder: 0,
        isCover: true
      });
      showToast(`Cover photo updated for ${product.name}.`, 'success');
      await loadProducts();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not replace the product photo.', 'error');
    } finally {
      setImageUploading(false);
      setImageUploadProductId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove "${name}" from the catalogue? It will be archived and hidden, while existing order history is preserved.`)) {
      try {
        await api.deleteProduct(id);
        showToast(`Product "${name}" archived and removed from the catalogue.`, 'info');
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Failed to archive product.', 'error');
      }
    }
  };

  const handleSaveStock = async (product: Product) => {
    if (!Number.isInteger(stockInput) || stockInput < 0) {
      showToast('Stock must be a non-negative whole number.', 'error');
      return;
    }
    try {
      await api.updateInventory(product.sku, stockInput);
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, stock: stockInput } : p))
      );
      setEditingStockId(null);
      showToast(`Updated stock for ${product.name} to ${stockInput}.`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update stock.', 'error');
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.collection.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all'
      ? p.status !== 'archived'
      : p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#101828' }}>
            Product Catalogue
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#667085', marginTop: '2px' }}>
            Manage active storefront listings, pricing, and rapid inventory.
          </p>
        </div>

        <Link href="/admin/products/new" className="elx-btn elx-btn-primary elx-btn-sm" id="btn-add-product-list">
          <PlusCircle size={15} /> Add New Product
        </Link>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleReplaceImage}
        style={{ display: 'none' }}
        aria-label="Upload replacement product photo"
      />

      {/* Filter & Search Bar */}
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
            placeholder="Search by product name, SKU, collection..."
            className="elx-input"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.8125rem' }}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="elx-select"
          style={{ width: '160px', height: '38px', fontSize: '0.8125rem', padding: '0 10px' }}
        >
          <option value="all">All Categories</option>
          <option value="jewells">Fine Jewells</option>
          <option value="clothing">Couture Clothing</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="elx-select"
          style={{ width: '140px', height: '38px', fontSize: '0.8125rem', padding: '0 10px' }}
        >
          <option value="all">Active &amp; Draft</option>
          <option value="active">Active Only</option>
          <option value="draft">Draft Only</option>
          <option value="archived">Archived Only</option>
        </select>
      </div>

      {/* Main Table */}
      {loading ? (
        <LoadingState message="Loading catalog entries..." />
      ) : loadError ? (
        <ErrorState
          title="Could not load products"
          message={loadError === 'Invalid authentication token.'
            ? 'Your admin session has expired. Sign in again to continue.'
            : loadError}
          onRetry={loadProducts}
        />
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Image</th>
                <th>Product & Collection</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => {
                const isEditing = editingStockId === product.id;
                const isLow = product.stock <= product.lowStockThreshold;

                return (
                  <tr key={product.id}>
                    <td>
                      <div
                        style={{
                          position: 'relative',
                          width: '44px',
                          height: '56px',
                          borderRadius: 'var(--radius-xs)',
                          overflow: 'hidden',
                          backgroundColor: '#F2F4F7'
                        }}
                      >
                        <Image
                          src={product.coverImage || product.images[0] || '/assets/editorial/the-edit.jpg'}
                          alt={product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </td>

                    <td>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: '#101828' }}>{product.name}</strong>
                        <div style={{ fontSize: '0.6875rem', color: '#667085', marginTop: '2px' }}>
                          {product.collection} •{' '}
                          <span style={{ textTransform: 'uppercase' }}>{product.category}</span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.6875rem',
                            color: product.freeShipping ? '#0E8345' : '#667085',
                            marginTop: '5px',
                            fontWeight: 600
                          }}
                        >
                          {product.freeShipping ? 'Free shipping' : 'Kerala ₹60 · Outside Kerala ₹90'}
                        </div>
                      </div>
                    </td>

                    <td>
                      <code style={{ fontSize: '0.75rem', backgroundColor: '#F2F4F7', padding: '2px 6px', borderRadius: '3px' }}>
                        {product.sku}
                      </code>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>
                        ₹{Number(product.sellingPrice ?? 0).toLocaleString('en-IN')}
                      </div>
                      {product.originalPrice > product.sellingPrice && (
                        <span style={{ fontSize: '0.6875rem', color: '#667085', textDecoration: 'line-through' }}>
                          ₹{Number(product.originalPrice ?? 0).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={stockInput}
                            onChange={e => setStockInput(e.target.value === '' ? 0 : Number(e.target.value))}
                            className="inline-stock-input"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveStock(product)}
                            style={{ color: '#0E8345' }}
                            title="Save"
                          >
                            <Check size={16} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingStockId(product.id);
                            setStockInput(product.stock);
                          }}
                          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          title="Click to quickly edit stock"
                        >
                          <span style={{ fontWeight: 600, color: isLow ? '#B42318' : '#101828' }}>
                            {product.stock}
                          </span>
                          {isLow && (
                            <span style={{ fontSize: '0.625rem', color: '#B42318', fontWeight: 600 }}>
                              LOW
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td>
                      <Badge
                        variant={product.status === 'active' ? 'success' : 'neutral'}
                        size="sm"
                      >
                        {product.status}
                      </Badge>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.75rem', color: '#667085' }}>
                        {new Date(product.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          title="View on Customer Storefront"
                          style={{ color: '#667085' }}
                        >
                          <Eye size={15} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(product)}
                          title={product.status === 'active' ? 'Hide from boutique' : 'Publish to boutique'}
                          style={{ color: '#667085' }}
                        >
                          <EyeOff size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleFreeShipping(product)}
                          title={product.freeShipping ? 'Charge regional delivery' : 'Enable free shipping'}
                          style={{ color: product.freeShipping ? '#0E8345' : '#667085' }}
                        >
                          <Truck size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setImageUploadProductId(product.id);
                            imageInputRef.current?.click();
                          }}
                          disabled={imageUploading}
                          title="Replace cover photo"
                          aria-label={`Replace cover photo for ${product.name}`}
                          style={{ color: '#667085', opacity: imageUploading ? 0.5 : 1 }}
                        >
                          <ImagePlus size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicate(product)}
                          title="Duplicate creation"
                          style={{ color: '#667085' }}
                        >
                          <Copy size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product.id, product.name)}
                          title="Delete permanently"
                          style={{ color: '#D92D20' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#667085' }}>
              No products found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
