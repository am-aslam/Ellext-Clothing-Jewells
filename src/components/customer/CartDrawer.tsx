'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, Heart, ArrowRight, Truck, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/Button';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    appliedOffer,
    couponMessage,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon
  } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

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

  const handleProceedCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="elx-drawer-backdrop" onClick={closeCart} role="dialog" aria-modal="true">
      <aside
        className="elx-cart-drawer"
        onClick={e => e.stopPropagation()}
        aria-label="Shopping Bag"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-wrap">
            <h2 className="cart-drawer-title">Your Bag</h2>
            <span className="cart-item-count">
              ({items.length} {items.length === 1 ? 'creation' : 'creations'})
            </span>
          </div>
          <button
            onClick={closeCart}
            className="cart-drawer-close"
            aria-label="Close bag drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="cart-shipping-meter">
          <p className="shipping-progress-text"><Truck size={15} /> Shipping is calculated from your delivery address: ₹60 in Kerala or ₹90 outside Kerala.</p>
        </div>

        {/* Item List or Empty State */}
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <div className="cart-empty-view">
              <p className="cart-empty-title">Your bag is empty.</p>
              <p className="cart-empty-subtitle">
                Explore our signature jewels and handcrafted apparel collections.
              </p>
              <Link href="/shop" onClick={closeCart} className="elx-btn elx-btn-primary elx-btn-md">
                Discover Collection
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map(item => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-thumb">
                    <Image
                      src={item.product.coverImage || item.product.images[0]}
                      alt={item.product.name}
                      width={84}
                      height={108}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="cart-item-title"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cart-item-remove"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="cart-item-meta">
                      {item.selectedSize && (
                        <span className="meta-tag">Size: {item.selectedSize}</span>
                      )}
                      {item.selectedColour && (
                        <span className="meta-tag">{item.selectedColour}</span>
                      )}
                      {item.selectedVariant && !item.selectedSize && (
                        <span className="meta-tag">{item.selectedVariant}</span>
                      )}
                    </div>

                    <div className="cart-item-bottom">
                      {/* Quantity Selector */}
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

                      {/* Line Price */}
                      <div className="cart-item-pricing">
                        <span className="cart-price">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Move to Wishlist shortcut */}
                    <button
                      type="button"
                      onClick={() => handleMoveToWishlist(item)}
                      className="cart-item-wishlist-link"
                    >
                      <Heart size={13} /> Save to wishlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Privilege Code Input */}
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
                    placeholder="Enter privilege code (e.g. ELLEXT10)"
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

            {/* Financial Breakdown */}
            <div className="cart-summary-lines">
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
                <span className="total-label">Estimated Total</span>
                <span className="total-amount">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="cart-footer-actions">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleProceedCheckout}
                className="checkout-proceed-btn"
                id="drawer-checkout-button"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </Button>

              <div className="cart-footer-links">
                <Link href="/cart" onClick={closeCart} className="view-bag-link">
                  View full shopping bag
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
