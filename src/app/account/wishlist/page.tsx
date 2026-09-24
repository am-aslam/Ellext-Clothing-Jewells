'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { EmptyState } from '@/components/ui/States';

export default function AccountWishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToBag = (product: any) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    showToast(`${product.name} moved to your shopping bag.`, 'success');
    openCart();
  };

  return (
    <div className="account-page-wrapper" style={{ padding: '48px 24px 100px' }}>
      <div className="elx-container">
        <Link
          href="/account"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8125rem',
            color: 'var(--color-muted)',
            textDecoration: 'none',
            marginBottom: '28px'
          }}
        >
          <ArrowLeft size={14} /> Back to Patron Dashboard
        </Link>

        <div style={{ marginBottom: '36px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="section-sub-label">Curated Repertoire</span>
            <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 400 }}>
              Private Wishlist ({wishlist.length})
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
              Creations reserved for upcoming ceremonies, seasonal galas, and private acquisitions.
            </p>
          </div>

          <Link href="/shop" className="elx-btn elx-btn-secondary elx-btn-sm" style={{ minHeight: '38px' }}>
            Explore Catalogue
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState
            icon="heart"
            title="Your Wishlist is Empty"
            description="You have not yet marked any creations for your personal repertoire."
            actionText="Discover High Jewellery & Couture"
            onAction={() => window.location.assign('/shop')}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            {wishlist.map(product => (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Link href={`/product/${product.slug}`} style={{ position: 'relative', width: '100%', height: '320px', display: 'block', backgroundColor: '#F8F8F8' }}>
                  <Image
                    src={product.coverImage || product.images[0] || '/assets/editorial/the-edit.jpg'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </Link>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.6875rem', color: '#C9A96E', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    {product.collection || product.category}
                  </span>
                  <Link
                    href={`/product/${product.slug}`}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'var(--color-noir)',
                      textDecoration: 'none',
                      margin: '4px 0 8px',
                      lineHeight: 1.4
                    }}
                  >
                    {product.name}
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-noir)' }}>
                      ₹{product.sellingPrice.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.sellingPrice && (
                      <span style={{ fontSize: '0.8125rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleMoveToBag(product)}
                      className="elx-btn elx-btn-primary"
                      style={{ flex: 1, minHeight: '44px', fontSize: '0.8125rem' }}
                    >
                      <ShoppingBag size={14} /> Move to Bag
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label="Remove from wishlist"
                      style={{
                        width: '44px',
                        height: '44px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        backgroundColor: '#FFF',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
