'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Product } from '@/types';
import { api } from '@/services/api';
import { ProductCard } from '@/components/customer/ProductCard';
import { EmptyState, LoadingState } from '@/components/ui/States';
import { Drawer } from '@/components/ui/Modal';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') || 'all';
  const initialCollection = searchParams?.get('collection') || 'all';
  const initialFilter = searchParams?.get('filter') || '';
  const initialSearch = searchParams?.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getProducts({
          newArrival: initialFilter === 'new',
          search: initialSearch
        });
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [initialFilter, initialSearch]);

  // Synchronize filter states when URL search parameters change
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialCollection) {
      setSelectedCollection(initialCollection);
    }
  }, [initialCollection]);

  const collections = useMemo(() => {
    const set = new Set(products.map(p => p.collection).filter(Boolean));
    return Array.from(set);
  }, [products]);

  // Filter and sort products client-side
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory && selectedCategory !== 'all') {
      const cat = selectedCategory.toLowerCase().trim();
      result = result.filter(p => p.category?.toLowerCase() === cat);
    }

    if (selectedCollection && selectedCollection !== 'all') {
      const targetCol = selectedCollection.toLowerCase().trim();
      const targetSlug = targetCol.replace(/[^a-z0-9]+/g, '-');
      result = result.filter(p => {
        const pCol = (p.collection || '').toLowerCase().trim();
        const pColSlug = pCol.replace(/[^a-z0-9]+/g, '-');
        return pCol === targetCol || pColSlug === targetSlug;
      });
    }

    if (onlyInStock) {
      result = result.filter(p => p.stock > 0);
    }

    if (selectedPriceRange !== 'all') {
      switch (selectedPriceRange) {
        case 'under-25k':
          result = result.filter(p => p.sellingPrice < 25000);
          break;
        case '25k-50k':
          result = result.filter(p => p.sellingPrice >= 25000 && p.sellingPrice <= 50000);
          break;
        case 'above-50k':
          result = result.filter(p => p.sellingPrice > 50000);
          break;
      }
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, selectedCollection, selectedPriceRange, onlyInStock, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSelectedPriceRange('all');
    setOnlyInStock(false);
    setSortBy('featured');
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/shop');
    }
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedCollection !== 'all' ||
    selectedPriceRange !== 'all' ||
    onlyInStock;

  return (
    <div className="shop-page-wrapper">
      <div className="elx-container">
        {/* Page Editorial Header */}
        <div className="shop-page-header">
          <span className="section-sub-label">The Complete Catalogue</span>
          <h1 className="shop-page-title font-serif">Ellext Creations</h1>
          <p className="shop-page-desc">
            Explore our contemporary repertoire of couture apparel and hand-set royal jewels.
          </p>
        </div>

        {/* Toolbar: Filter Trigger & Sorting */}
        <div className="shop-toolbar">
          <div className="shop-item-counter">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
          </div>

          <div className="shop-toolbar-actions">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="elx-btn elx-btn-secondary elx-btn-sm lg-hidden"
              aria-label="Filter creations"
            >
              <SlidersHorizontal size={14} /> Filters
              {hasActiveFilters && <span className="active-dot" />}
            </button>

            {/* Sort Select */}
            <div className="sort-wrapper">
              <label htmlFor="shop-sort" className="sr-only">Sort by</label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="elx-select"
                style={{ padding: '8px 12px', fontSize: '0.8125rem' }}
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="popular">Most Coveted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shop Layout: Sidebar + Product Grid */}
        <div className="shop-layout">
          {/* Desktop Sidebar Filters */}
          <aside className="shop-sidebar" aria-label="Product Filters">
            {hasActiveFilters && (
              <div style={{ marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="elx-btn elx-btn-outline elx-btn-sm"
                  style={{ width: '100%' }}
                >
                  <X size={13} /> Reset All Filters
                </button>
              </div>
            )}

            {/* Category Filter */}
            <div className="filter-block">
              <h3 className="filter-title">Category</h3>
              <ul className="filter-options-list">
                {[
                  { value: 'all', label: 'All Collections' },
                  { value: 'clothing', label: 'Couture Clothing' },
                  { value: 'jewells', label: 'Fine Jewells' }
                ].map(opt => (
                  <li key={opt.value}>
                    <label className="filter-option-label">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === opt.value}
                        onChange={() => setSelectedCategory(opt.value)}
                        className="filter-checkbox"
                      />
                      <span>{opt.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collection Filter */}
            <div className="filter-block">
              <h3 className="filter-title">Collection Edit</h3>
              <ul className="filter-options-list">
                <li key="all">
                  <label className="filter-option-label">
                    <input
                      type="radio"
                      name="collection"
                      checked={selectedCollection === 'all'}
                      onChange={() => setSelectedCollection('all')}
                      className="filter-checkbox"
                    />
                    <span>All Edits</span>
                  </label>
                </li>
                {collections.map(col => (
                  <li key={col}>
                    <label className="filter-option-label">
                      <input
                        type="radio"
                        name="collection"
                        checked={selectedCollection === col}
                        onChange={() => setSelectedCollection(col)}
                        className="filter-checkbox"
                      />
                      <span>{col}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range Filter */}
            <div className="filter-block">
              <h3 className="filter-title">Acquisition Value</h3>
              <ul className="filter-options-list">
                {[
                  { value: 'all', label: 'All Values' },
                  { value: 'under-25k', label: 'Under ₹25,000' },
                  { value: '25k-50k', label: '₹25,000 — ₹50,000' },
                  { value: 'above-50k', label: 'Above ₹50,000' }
                ].map(opt => (
                  <li key={opt.value}>
                    <label className="filter-option-label">
                      <input
                        type="radio"
                        name="price-range"
                        checked={selectedPriceRange === opt.value}
                        onChange={() => setSelectedPriceRange(opt.value)}
                        className="filter-checkbox"
                      />
                      <span>{opt.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <div className="filter-block">
              <h3 className="filter-title">Availability</h3>
              <label className="filter-option-label">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={e => setOnlyInStock(e.target.checked)}
                  className="filter-checkbox"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="shop-main-pane">
            {loading ? (
              <LoadingState message="Curating pieces from atelier..." />
            ) : filteredProducts.length > 0 ? (
              <div className="editorial-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="search"
                title="No pieces found"
                description="We could not find any creations matching your selected filters."
                actionText="Reset Filters"
                onAction={resetFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Refine Collection"
        placement="left"
      >
        <div style={{ padding: '8px 0' }}>
          {/* Category Filter */}
          <div className="filter-block">
            <h3 className="filter-title">Category</h3>
            <ul className="filter-options-list">
              {[
                { value: 'all', label: 'All Collections' },
                { value: 'clothing', label: 'Couture Clothing' },
                { value: 'jewells', label: 'Fine Jewells' }
              ].map(opt => (
                <li key={opt.value}>
                  <label className="filter-option-label">
                    <input
                      type="radio"
                      name="m-category"
                      checked={selectedCategory === opt.value}
                      onChange={() => setSelectedCategory(opt.value)}
                      className="filter-checkbox"
                    />
                    <span>{opt.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Collection Filter */}
          <div className="filter-block">
            <h3 className="filter-title">Collection Edit</h3>
            <ul className="filter-options-list">
              <li key="all">
                <label className="filter-option-label">
                  <input
                    type="radio"
                    name="m-collection"
                    checked={selectedCollection === 'all'}
                    onChange={() => setSelectedCollection('all')}
                    className="filter-checkbox"
                  />
                  <span>All Edits</span>
                </label>
              </li>
              {collections.map(col => (
                <li key={col}>
                  <label className="filter-option-label">
                    <input
                      type="radio"
                      name="m-collection"
                      checked={selectedCollection === col}
                      onChange={() => setSelectedCollection(col)}
                      className="filter-checkbox"
                    />
                    <span>{col}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div className="filter-block">
            <h3 className="filter-title">Acquisition Value</h3>
            <ul className="filter-options-list">
              {[
                { value: 'all', label: 'All Values' },
                { value: 'under-25k', label: 'Under ₹25,000' },
                { value: '25k-50k', label: '₹25,000 — ₹50,000' },
                { value: 'above-50k', label: 'Above ₹50,000' }
              ].map(opt => (
                <li key={opt.value}>
                  <label className="filter-option-label">
                    <input
                      type="radio"
                      name="m-price-range"
                      checked={selectedPriceRange === opt.value}
                      onChange={() => setSelectedPriceRange(opt.value)}
                      className="filter-checkbox"
                    />
                    <span>{opt.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={resetFilters}
              className="elx-btn elx-btn-secondary elx-btn-md"
              style={{ flex: 1 }}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="elx-btn elx-btn-primary elx-btn-md"
              style={{ flex: 1 }}
            >
              Apply ({filteredProducts.length})
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading boutique..." />}>
      <ShopContent />
    </Suspense>
  );
}
