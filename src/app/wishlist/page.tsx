'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/customer/ProductCard';
import { EmptyState } from '@/components/ui/States';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-page-wrapper">
      <div className="elx-container" style={{ padding: '60px 24px 100px' }}>
        <div className="shop-page-header">
          <span className="section-sub-label">Private Curation</span>
          <h1 className="shop-page-title font-serif">Saved Creations</h1>
          <p className="shop-page-desc">
            Your personal salon of covetable fine jewels and tailored garments.
          </p>
        </div>

        {wishlist.length > 0 ? (
          <div>
            <div style={{ marginBottom: '24px', fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
              {wishlist.length} {wishlist.length === 1 ? 'creation' : 'creations'} saved
            </div>
            <div className="editorial-product-grid">
              {wishlist.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon="heart"
            title="Nothing saved yet."
            description="Explore our atelier collections to curate your personal wishlist."
            actionText="Explore Boutique"
            onAction={() => window.location.href = '/shop'}
          />
        )}
      </div>
    </div>
  );
}
