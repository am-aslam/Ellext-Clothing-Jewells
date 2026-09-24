'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Heart, ArrowRight, ShieldCheck, Tag, X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    couponMessage,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon
  } = useCart();

  const { isInWishlist, toggleWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = await applyCoupon(couponInput);
    if (ok) setCouponInput('');
  };

  const handleMoveToWishlist = (item: (typeof items)[0]) => {
    if (!isInWishlist(item.productId)) {
      toggleWishlist(item.product);
    }
    removeFromCart(item.id);
  };

  if (items.length === 0) {
    return (
      <div className="elx-container" style={{ padding: '80px 24px 120px' }}>
        <EmptyState
          icon="bag"
          title="Your shopping bag is empty."
          description="Explore our haute couture garments and ancestral royal jewels."
          actionText="Discover Collection"
          onAction={() => router.push('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="elx-container" style={{ padding: '48px 24px 100px' }}>
        <div style={{ marginBottom: '36px' }}>
          <span className="section-sub-label">Your Selections</span>
          <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 400 }}>
            Shopping Bag ({items.length})
          </h1>
        </div>

        <div className="checkout-grid">
          {/* LEFT: Items List */}
          <div className="cart-items-main">
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '24px',
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '16px'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '110px',
                    height: '140px',
                    borderRadius: 'var(--radius-xs)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-bg-subtle)',
                    flexShrink: 0
                  }}
                >
                  <Image
                    src={item.product.coverImage || item.product.images[0]}
                    alt={item.product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="card-collection" style={{ fontSize: '0.6875rem' }}>
                        {item.product.collection}
                      </span>
                      <h3 className="font-serif" style={{ fontSize: '1.25rem', marginTop: '2px' }}>
                        <Link href={`/product/${item.product.slug}`}>{item.product.name}</Link>
                      </h3>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                        {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                        {item.selectedColour && <span>• Colour: <strong>{item.selectedColour}</strong></span>}
                        {item.selectedVariant && !item.selectedSize && <span>Variant: <strong>{item.selectedVariant}</strong></span>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      style={{ color: 'var(--color-muted)' }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <div className="cart-qty-selector">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.quantity > 1 && (
                        <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                          ₹{item.unitPrice.toLocaleString('en-IN')} each
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => handleMoveToWishlist(item)}
                      className="cart-item-wishlist-link"
                    >
                      <Heart size={13} /> Save to wishlist for later
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Order Summary & Coupon */}
          <div className="checkout-summary-column">
            <div className="checkout-order-summary-box">
              <h2 className="checkout-step-title">Order Summary</h2>

              {/* Privilege code application */}
              <div className="cart-coupon-block">
                {appliedCoupon ? (
                  <div className="applied-coupon-pill">
                    <div className="coupon-pill-info">
                      <Tag size={14} />
                      <span className="coupon-pill-code">{appliedCoupon}</span>
                      <span className="coupon-pill-saving">
                        (-₹{discount.toLocaleString('en-IN')})
                      </span>
                    </div>
                    <button onClick={removeCoupon} className="coupon-remove-btn" aria-label="Remove coupon">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="coupon-input-form">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      placeholder="Privilege Code (e.g. ELLEXT10)"
                      className="coupon-input"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="coupon-submit-btn"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMessage && !appliedCoupon && (
                  <p className="coupon-feedback-msg">{couponMessage}</p>
                )}
              </div>

              {/* Lines */}
              <div className="cart-summary-lines" style={{ marginTop: '24px' }}>
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-line line-discount">
                    <span>Privilege Savings</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>Delivery shipping</span>
                  <span>{shippingFee === 0 ? 'Calculated at checkout' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="summary-line line-total">
                  <span>Estimated Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/checkout')}
                  id="cart-proceed-checkout-btn"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </Button>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-muted)', fontSize: '0.75rem' }}>
                <ShieldCheck size={16} color="var(--color-gold-dark)" />
                <span>Encrypted 256-bit secure transaction guarantee.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
