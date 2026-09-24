'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Product } from '@/types';
import { api } from '@/services/api';
import { ProductCard } from '@/components/customer/ProductCard';
import { EmptyState, LoadingState } from '@/components/ui/States';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('search') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function performSearch(q: string) {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const found = await api.getProducts({ search: q.trim() });
        setResults(found);
      } finally {
        setLoading(false);
      }
    }

    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const found = await api.getProducts({ search: query.trim() });
      setResults(found);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page-wrapper">
      <div className="elx-container" style={{ padding: '60px 24px 100px' }}>
        <div className="shop-page-header">
          <span className="section-sub-label">Boutique Search</span>
          <h1 className="shop-page-title font-serif">Search Catalogue</h1>
          <p className="shop-page-desc">
            Find fine jewels, bridal sets, pure silk blazers, and artisanal sarees.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            style={{
              maxWidth: '560px',
              margin: '32px auto 0',
              display: 'flex',
              gap: '8px'
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}
              />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by gem, style, garment, or collection..."
                className="elx-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>
            <button type="submit" className="elx-btn elx-btn-primary elx-btn-md">
              Search
            </button>
          </form>
        </div>

        <div style={{ marginTop: '48px' }}>
          {loading ? (
            <LoadingState message="Searching the boutique..." />
          ) : results.length > 0 ? (
            <div>
              <div style={{ marginBottom: '24px', fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                Found {results.length} creations for &ldquo;{query}&rdquo;
              </div>
              <div className="editorial-product-grid">
                {results.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          ) : query.trim() ? (
            <EmptyState
              icon="search"
              title="No pieces found"
              description={`We could not find any creations matching "${query}".`}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading search..." />}>
      <SearchPageContent />
    </Suspense>
  );
}
