'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Plus } from 'lucide-react';
import { Product } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/Badge';

export interface ProductCardProps {
  product: Product;
  aspectRatio?: 'portrait' | 'square';
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectRatio = 'portrait',
  priority = false
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const isSaved = isInWishlist(product.id);
  const primaryImage = product.coverImage || product.images[0] || '/assets/editorial/the-edit.jpg';
  const secondaryImage = product.images[1] || primaryImage;
  const isLowStock = product.stock <= product.lowStockThreshold && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <article
      className="elx-product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`card-image-wrap aspect-${aspectRatio}`}>
        <Link href={`/product/${product.slug}`} className="card-image-link" tabIndex={-1}>
          <div className="image-container">
            {/* Primary Image */}
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              className={`product-img main-img ${isHovered && secondaryImage !== primaryImage ? 'faded' : ''}`}
            />

            {/* Secondary Hover Image */}
            {secondaryImage && secondaryImage !== primaryImage && (
              <Image
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`product-img hover-img ${isHovered ? 'visible' : ''}`}
              />
            )}
          </div>
        </Link>

        {/* Floating Badges */}
        <div className="card-badge-container">
          {product.isSale && product.discountPercent > 0 && (
            <Badge variant="sale" size="sm">
              -{product.discountPercent}%
            </Badge>
          )}
          {product.newArrival && !product.isSale && (
            <Badge variant="neutral" size="sm">
              New
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`card-wishlist-btn ${isSaved ? 'is-active' : ''}`}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart
            size={18}
            strokeWidth={1.4}
            fill={isSaved ? '#9A2A2A' : 'none'}
            color={isSaved ? '#9A2A2A' : '#111111'}
          />
        </button>

        {/* Quick Add Overlay Button */}
        <div className="card-quick-actions">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="quick-add-btn"
            aria-label={`Quick add ${product.name} to bag`}
          >
            <Plus size={15} />
            <span>{isOutOfStock ? 'Sold Out' : 'Quick Add'}</span>
          </button>
        </div>
      </div>

      {/* Product Metadata */}
      <div className="card-info">
        <span className="card-collection">{product.collection}</span>
        <h3 className="card-title">
          <Link href={`/product/${product.slug}`} className="card-title-link">
            {product.name}
          </Link>
        </h3>

        <div className="card-pricing">
          <span className="price-current">
            ₹{product.sellingPrice.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.sellingPrice && (
            <span className="price-compare">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {isLowStock && (
          <span className="card-stock-hint">
            Only {product.stock} available in atelier
          </span>
        )}
      </div>
    </article>
  );
};
