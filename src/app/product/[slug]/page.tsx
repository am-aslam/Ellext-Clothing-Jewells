'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Star,
  Check,
  Clock,
  Gem
} from 'lucide-react';
import { Product } from '@/types';
import { api } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductGallery } from '@/components/customer/ProductGallery';
import { ProductCard } from '@/components/customer/ProductCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/States';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selections
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColour, setSelectedColour] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    care: false,
    shipping: false,
    authenticity: false,
    reviews: false
  });

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const item = await api.getProductBySlug(slug);
        setProduct(item);

        if (item) {
          // Initialize defaults
          if (item.clothingAttributes?.sizes?.length) {
            setSelectedSize(item.clothingAttributes.sizes[0]);
          }
          if (item.clothingAttributes?.colours?.length) {
            setSelectedColour(item.clothingAttributes.colours[0]);
          }
          if (item.jewelleryAttributes?.materials?.length) {
            setSelectedMaterial(item.jewelleryAttributes.materials[0]);
          }
          if (item.variants?.length) {
            setSelectedVariant(item.variants[0].name);
          }

          // Fetch related
          const related = await api.getProducts({ category: item.category });
          setRelatedProducts(related.filter(r => r.id !== item.id).slice(0, 4));
        }
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="elx-container" style={{ padding: '120px 24px' }}>
        <LoadingState message="Retrieving creation from atelier archive..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="elx-container" style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '16px' }}>Creation Not Found</h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: '32px' }}>
          This piece may have been acquired or is no longer available in the current archive.
        </p>
        <Link href="/shop" className="elx-btn elx-btn-primary elx-btn-md">
          Explore Boutique
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= product.lowStockThreshold && product.stock > 0;

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToBag = () => {
    addToCart(product, quantity, {
      size: selectedSize,
      colour: selectedColour,
      material: selectedMaterial,
      variantLabel: selectedVariant
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, {
      size: selectedSize,
      colour: selectedColour,
      material: selectedMaterial,
      variantLabel: selectedVariant
    });
    router.push('/checkout');
  };

  return (
    <div className="pdp-wrapper">
      <div className="elx-container">
        {/* Breadcrumb path */}
        <div className="pdp-breadcrumbs" style={{ paddingTop: '24px' }}>
          <Link href="/">Maison</Link>
          <span>/</span>
          <Link href={`/${product.category}`}>
            {product.category === 'jewells' ? 'Jewells' : 'Clothing'}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-noir)' }}>{product.name}</span>
        </div>

        {/* Main PDP Grid */}
        <div className="pdp-grid">
          {/* LEFT: Image Gallery */}
          <div className="pdp-left-gallery">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* RIGHT: Product Information */}
          <div className="pdp-info-column">
            {/* Collection & Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="card-collection">{product.collection}</span>
              <span style={{ color: 'var(--color-border)' }}>•</span>
              <span className="card-collection">{product.category === 'jewells' ? 'Haute Joaillerie' : 'Couture Tailoring'}</span>
            </div>

            {/* Title */}
            <h1 className="pdp-title font-serif">{product.name}</h1>

            {/* Pricing & Badges */}
            <div className="pdp-pricing-row">
              <span className="pdp-price-now">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <span className="pdp-price-was">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.isSale && (
                <Badge variant="sale" size="sm">
                  Savings {product.discountPercent}%
                </Badge>
              )}
            </div>

            <div className="pdp-sku">
              SKU: {product.sku}
            </div>

            {/* Short Description */}
            <p className="pdp-short-desc">
              {product.shortDescription}
            </p>

            {/* CATEGORY SPECIFIC VARIANT CONTROLS */}
            {/* Clothing: Sizes & Colours */}
            {product.category === 'clothing' && product.clothingAttributes && (
              <div className="pdp-variant-section">
                {product.clothingAttributes.sizes?.length > 0 && (
                  <div>
                    <div className="variant-label-row">
                      <span>Select Size</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                        Size Guide
                      </span>
                    </div>
                    <div className="variant-options-grid" style={{ marginTop: '8px' }}>
                      {product.clothingAttributes.sizes.map(sz => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`variant-pill ${selectedSize === sz ? 'active' : ''}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.clothingAttributes.colours?.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <div className="variant-label-row">
                      <span>Colourway: <strong>{selectedColour}</strong></span>
                    </div>
                    <div className="variant-options-grid" style={{ marginTop: '8px' }}>
                      {product.clothingAttributes.colours.map(clr => (
                        <button
                          key={clr}
                          type="button"
                          onClick={() => setSelectedColour(clr)}
                          className={`variant-pill ${selectedColour === clr ? 'active' : ''}`}
                        >
                          {clr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  <strong>Fabric:</strong> {product.clothingAttributes.fabric}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  <strong>Fit:</strong> {product.clothingAttributes.fit}
                </div>
              </div>
            )}

            {/* Jewellery: Material & Finishes */}
            {product.category === 'jewells' && product.jewelleryAttributes && (
              <div className="pdp-variant-section">
                {product.variants && product.variants.length > 0 ? (
                  <div>
                    <div className="variant-label-row">
                      <span>Variant & Gemstone: <strong>{selectedVariant}</strong></span>
                    </div>
                    <div className="variant-options-grid" style={{ marginTop: '8px' }}>
                      {product.variants.map(v => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v.name)}
                          className={`variant-pill ${selectedVariant === v.name ? 'active' : ''}`}
                        >
                          {v.name} ({v.stock} in stock)
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  <strong>Dimensions:</strong> {product.jewelleryAttributes.dimensions}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  <strong>Precious Weight:</strong> {product.jewelleryAttributes.weight}
                </div>
              </div>
            )}

            {/* Quantity & Stock Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="cart-qty-selector">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty-number">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {isLowStock && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-ruby)', fontWeight: 600 }}>
                  <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Only {product.stock} available in atelier
                </span>
              )}
            </div>

            {/* Action Buttons: Add to Bag, Buy Now, Wishlist */}
            <div className="pdp-cta-group">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={isOutOfStock}
                onClick={handleAddToBag}
                id="pdp-add-to-bag-button"
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </Button>

              <Button
                variant="gold"
                size="lg"
                fullWidth
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                id="pdp-buy-now-button"
              >
                Buy Now
              </Button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`elx-btn elx-btn-secondary elx-btn-lg ${isSaved ? 'is-active' : ''}`}
                style={{ minWidth: '56px', padding: '18px 20px' }}
                aria-label="Save to Wishlist"
              >
                <Heart
                  size={20}
                  fill={isSaved ? '#9A2A2A' : 'none'}
                  color={isSaved ? '#9A2A2A' : 'currentColor'}
                />
              </button>
            </div>

            {/* Trust Highlights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                padding: '16px 0',
                borderTop: '1px solid var(--color-border-light)',
                borderBottom: '1px solid var(--color-border-light)'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Truck size={20} style={{ margin: '0 auto 6px', color: 'var(--color-charcoal)' }} />
                <span style={{ fontSize: '0.6875rem', letterSpacing: '0.04em', display: 'block', color: 'var(--color-charcoal)', fontWeight: 500 }}>
                  Regional Delivery
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ShieldCheck size={20} style={{ margin: '0 auto 6px', color: 'var(--color-charcoal)' }} />
                <span style={{ fontSize: '0.6875rem', letterSpacing: '0.04em', display: 'block', color: 'var(--color-charcoal)', fontWeight: 500 }}>
                  BIS Hallmarked & Certified
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <RotateCcw size={20} style={{ margin: '0 auto 6px', color: 'var(--color-charcoal)' }} />
                <span style={{ fontSize: '0.6875rem', letterSpacing: '0.04em', display: 'block', color: 'var(--color-charcoal)', fontWeight: 500 }}>
                  7-Day Atelier Exchange
                </span>
              </div>
            </div>

            {/* Accordion Panels */}
            <div className="pdp-accordion-group">
              {/* 1. Details & Description */}
              <div className="accordion-item">
                <button
                  type="button"
                  onClick={() => toggleAccordion('details')}
                  className="accordion-trigger"
                >
                  <span>Product Details & Craft</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordions.details ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </button>
                {openAccordions.details && (
                  <div className="accordion-content">
                    <p>{product.description}</p>
                    <ul style={{ marginTop: '12px', paddingLeft: '20px' }}>
                      <li>Master hand-setting by generational Indian artisans</li>
                      <li>Individually hallmarked and numbered</li>
                      <li>Presented in signature Ellext velvet keepsake box</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. Material & Care */}
              <div className="accordion-item">
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="accordion-trigger"
                >
                  <span>Material, Fabric & Care</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordions.care ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </button>
                {openAccordions.care && (
                  <div className="accordion-content">
                    {product.jewelleryAttributes && (
                      <div>
                        <p><strong>Care Instruction:</strong> {product.jewelleryAttributes.care}</p>
                        <p style={{ marginTop: '8px' }}>
                          <strong>Materials:</strong> {product.jewelleryAttributes.materials.join(', ')}
                        </p>
                      </div>
                    )}
                    {product.clothingAttributes && (
                      <div>
                        <p><strong>Composition:</strong> {product.clothingAttributes.fabric}</p>
                        <p style={{ marginTop: '8px' }}>
                          <strong>Garment Care:</strong> Specialist luxury dry cleaning only. Store on padded cedar hangers.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Delivery & Returns */}
              <div className="accordion-item">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="accordion-trigger"
                >
                  <span>Delivery & Returns</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordions.shipping ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </button>
                {openAccordions.shipping && (
                  <div className="accordion-content">
                    <p>
                      Delivery charges are calculated from the delivery address: ₹60 within Kerala and ₹90 outside Kerala.
                    </p>
                    <p style={{ marginTop: '8px' }}>
                      Delivery timeframe: 3 to 5 business days across India. Products marked free shipping have no delivery charge.
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Client Reviews */}
              <div className="accordion-item">
                <button
                  type="button"
                  onClick={() => toggleAccordion('reviews')}
                  className="accordion-trigger"
                >
                  <span>Client Testimonials ({product.reviewsCount})</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordions.reviews ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </button>
                {openAccordions.reviews && (
                  <div className="accordion-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', color: 'var(--color-gold-dark)' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={15} fill="currentColor" />
                        ))}
                      </div>
                      <span style={{ fontWeight: 600 }}>{product.rating} out of 5</span>
                      <span style={{ color: 'var(--color-muted)' }}>({product.reviewsCount} verified patrons)</span>
                    </div>
                    <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-xs)', marginBottom: '10px' }}>
                      <p style={{ fontStyle: 'italic', fontSize: '0.8125rem' }}>
                        &ldquo;The Polki detailing and finishing is second to none. Delivered in a stunning velvet box with complete gemological documentation.&rdquo;
                      </p>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--color-muted)', display: 'block', marginTop: '6px' }}>
                        — Maharani Collection Patron, Mumbai
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED CREATIONS */}
        {relatedProducts.length > 0 && (
          <section className="elx-section" style={{ borderTop: '1px solid var(--color-border)', marginTop: '48px' }}>
            <div className="section-header-editorial">
              <div>
                <span className="section-sub-label">Complete The Ensemble</span>
                <h2 className="section-main-title font-serif">Complementary Creations</h2>
              </div>
              <Link href={`/${product.category}`} className="section-header-link">
                View Collection
              </Link>
            </div>

            <div className="editorial-product-grid">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
