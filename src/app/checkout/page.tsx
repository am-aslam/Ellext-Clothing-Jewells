'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, QrCode, Building, Truck, CheckCircle2, Lock, Tag, X } from 'lucide-react';
import { calculateShippingFee, useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Address } from '@/types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    discount,
    appliedCoupon,
    clearCart,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon,
    couponMessage
  } = useCart();
  const { showToast } = useToast();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');

  // Address Fields
  const [formData, setFormData] = useState<Address>({
    fullName: '',
    phone: '',
    email: '',
    houseBuilding: '',
    street: '',
    area: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    landmark: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card Inputs (Simulated real form)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI Input
  const [upiId, setUpiId] = useState('');

  const shippingFee = calculateShippingFee(formData.state, items);
  const checkoutTotal = Math.max(0, subtotal - discount + shippingFee);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const list = await api.getAddresses();
        setSavedAddresses(list);
        if (list.length > 0) {
          setSelectedAddressId(list[0].id || 'new');
          setFormData(list[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadAddresses();
  }, []);

  const handleSelectSavedAddress = (id: string) => {
    setSelectedAddressId(id);
    if (id === 'new') {
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        houseBuilding: '',
        street: '',
        area: '',
        city: '',
        state: 'Maharashtra',
        pinCode: '',
        landmark: '',
        country: 'India'
      });
    } else {
      const match = savedAddresses.find(a => a.id === id);
      if (match) setFormData(match);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.email || !formData.houseBuilding || !formData.pinCode) {
      showToast('Please fulfill all mandatory shipping address requirements.', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Your shopping bag is empty.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Checkout requires a backend-owned address record. Save newly entered
      // addresses first; never send a missing/fake address ID to the order API.
      let checkoutAddress = formData;
      if (selectedAddressId === 'new' || !formData.id) {
        checkoutAddress = await api.saveAddress({
          ...formData,
          isDefault: savedAddresses.length === 0
        });
        if (!checkoutAddress.id) {
          throw new Error('Could not save your delivery address. Please check the address and try again.');
        }
      }

      // Authoritative order placement through API service layer
      const createdOrder = await api.createOrder({
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: checkoutAddress,
        items,
        subtotal,
        discount,
        shippingFee,
        total: checkoutTotal,
        appliedCoupon: appliedCoupon || undefined,
        paymentMethod
      });

      const orderLookupId = createdOrder.id || createdOrder.orderNumber;
      if (!orderLookupId) {
        throw new Error('Your order was placed, but its confirmation reference could not be loaded. Please check My Orders.');
      }
      // Clear bag and route to order confirmation
      clearCart();
      showToast('Your order has been confirmed by the atelier.', 'success');
      router.push(`/checkout/success?orderId=${encodeURIComponent(orderLookupId)}&orderNumber=${encodeURIComponent(createdOrder.orderNumber)}`);
    } catch (err) {
      showToast(
        err instanceof Error && err.message
          ? err.message
          : 'Unable to complete checkout at this time. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="elx-container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '16px' }}>Checkout</h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: '32px' }}>
          Your bag is currently empty. Please select creations before checking out.
        </p>
        <Button variant="primary" onClick={() => router.push('/shop')}>
          Return to Boutique
        </Button>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="elx-container">
        <div style={{ marginBottom: '32px' }}>
          <span className="section-sub-label">Secure Acquisition</span>
          <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 400 }}>
            Checkout & Handover
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="checkout-grid">
            {/* LEFT: Checkout Form Steps */}
            <div className="checkout-form-steps">
              {/* Step 1: Customer Information */}
              <div className="checkout-step-box">
                <h2 className="checkout-step-title">
                  <span className="checkout-step-badge">1</span>
                  Patron Information
                </h2>

                <div className="form-2col">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Princess Ananya Singhania"
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98200 00000"
                    hint="For OTP delivery verification"
                  />
                </div>
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@domain.com"
                  hint="Order confirmation and gemological certificate will be sent here"
                />
              </div>

              {/* Step 2: Shipping Destination */}
              <div className="checkout-step-box">
                <h2 className="checkout-step-title">
                  <span className="checkout-step-badge">2</span>
                  Delivery Address
                </h2>

                {savedAddresses.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <label className="elx-label">Saved Residences & Salons</label>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {savedAddresses.map(addr => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleSelectSavedAddress(addr.id || '')}
                          className={`variant-pill ${selectedAddressId === addr.id ? 'active' : ''}`}
                        >
                          {addr.label || addr.city}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleSelectSavedAddress('new')}
                        className={`variant-pill ${selectedAddressId === 'new' ? 'active' : ''}`}
                      >
                        + Enter New Address
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-2col">
                  <Input
                    label="Flat / House / Suite"
                    name="houseBuilding"
                    value={formData.houseBuilding}
                    onChange={handleChange}
                    required
                    placeholder="Penthouse 14A, Regency"
                  />
                  <Input
                    label="Street / Avenue"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    placeholder="Altamount Road"
                  />
                </div>

                <div className="form-2col">
                  <Input
                    label="Locality / Area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    placeholder="Cumballa Hill"
                  />
                  <Input
                    label="Landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Opposite Palace Gate"
                  />
                </div>

                <div className="form-2col">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Mumbai"
                  />
                  <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="Maharashtra"
                  />
                </div>

                <div className="form-2col">
                  <Input
                    label="PIN Code"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    required
                    placeholder="400026"
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>

              {/* Step 3: Delivery Method */}
              <div className="checkout-step-box">
                <h2 className="checkout-step-title">
                  <span className="checkout-step-badge">3</span>
                  Delivery Logistics
                </h2>

                <div className="payment-method-selector">
                  <div
                    className="payment-card active"
                  >
                    <div className="payment-card-left">
                      <Truck size={20} color="var(--color-charcoal)" />
                      <div>
                        <strong>Standard delivery</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                          Estimated delivery in 3–5 business days. Kerala ₹60; outside Kerala ₹90.
                        </p>
                      </div>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                      {shippingFee === 0 ? 'Free shipping' : `₹${shippingFee.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div className="checkout-step-box">
                <h2 className="checkout-step-title">
                  <span className="checkout-step-badge">4</span>
                  Payment Gateway
                </h2>

                <div className="payment-method-selector">
                  <div
                    className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="payment-card-left">
                      <CreditCard size={20} />
                      <div>
                        <strong>Credit / Debit Card</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                          Visa, MasterCard, American Express, RuPay
                        </p>
                      </div>
                    </div>
                    {paymentMethod === 'card' && <CheckCircle2 size={18} color="var(--color-gold-dark)" />}
                  </div>

                  {paymentMethod === 'card' && (
                    <div style={{ padding: '16px 20px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-xs)', marginTop: '8px' }}>
                      <Input
                        label="Card Number"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• ••••"
                        required
                      />
                      <div className="form-2col">
                        <Input
                          label="Valid Thru"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM / YY"
                          required
                        />
                        <Input
                          label="CVV / CVC"
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          placeholder="•••"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div
                    className={`payment-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <div className="payment-card-left">
                      <QrCode size={20} />
                      <div>
                        <strong>UPI / QR Code</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                          Instant payment via Google Pay, PhonePe, Paytm, BHIM
                        </p>
                      </div>
                    </div>
                    {paymentMethod === 'upi' && <CheckCircle2 size={18} color="var(--color-gold-dark)" />}
                  </div>

                  {paymentMethod === 'upi' && (
                    <div style={{ padding: '16px 20px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-xs)', marginTop: '8px' }}>
                      <Input
                        label="Enter UPI ID / VPA"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        hint="A payment request will be triggered on your UPI app"
                      />
                    </div>
                  )}

                  <div
                    className={`payment-card ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <div className="payment-card-left">
                      <Building size={20} />
                      <div>
                        <strong>Net Banking</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                          HDFC, ICICI, SBI, Axis, Kotak and 45+ premier Indian banks
                        </p>
                      </div>
                    </div>
                    {paymentMethod === 'netbanking' && <CheckCircle2 size={18} color="var(--color-gold-dark)" />}
                  </div>

                  <div
                    className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="payment-card-left">
                      <ShieldCheck size={20} />
                      <div>
                        <strong>Atelier Verification on Delivery</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                          Inspect the hallmarked piece before card or cash handover
                        </p>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle2 size={18} color="var(--color-gold-dark)" />}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="checkout-summary-column">
              <div className="checkout-order-summary-box">
                <h2 className="checkout-step-title" style={{ fontSize: '1.25rem' }}>
                  Acquisition Summary ({items.length})
                </h2>

                <div className="summary-items-scroll">
                  {items.map(item => (
                    <div key={item.id} className="summary-item-row">
                      <div className="summary-item-thumb">
                        <Image
                          src={item.product.coverImage || item.product.images[0]}
                          alt={item.product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="summary-item-info">
                        <div className="summary-item-title">{item.product.name}</div>
                        <div className="summary-item-qty">
                          Qty: {item.quantity} {item.selectedSize ? `• Size ${item.selectedSize}` : ''}
                        </div>
                        <div className="summary-item-price">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Privilege Code / Coupon Input */}
                <div className="cart-coupon-block" style={{ marginTop: '18px', marginBottom: '18px' }}>
                  {appliedCoupon ? (
                    <div className="applied-coupon-pill">
                      <div className="coupon-pill-info">
                        <Tag size={14} />
                        <span className="coupon-pill-code">{appliedCoupon}</span>
                        <span className="coupon-pill-saving">
                          (-₹{discount.toLocaleString('en-IN')})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="coupon-remove-btn"
                        aria-label="Remove privilege code"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="coupon-input-form">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={e => setCouponCodeInput(e.target.value)}
                        placeholder="Privilege code (e.g. ELLEXT10)"
                        className="coupon-input"
                        id="checkout-coupon-input"
                      />
                      <button
                        type="button"
                        disabled={isApplyingCoupon || !couponCodeInput.trim()}
                        onClick={async () => {
                          const success = await applyCoupon(couponCodeInput);
                          if (success) setCouponCodeInput('');
                        }}
                        className="coupon-submit-btn"
                        id="checkout-apply-coupon-button"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}
                  {couponMessage && !appliedCoupon && (
                    <p className="coupon-feedback-msg" style={{ marginTop: '6px', fontSize: '0.75rem', color: '#B91C1C' }}>
                      {couponMessage}
                    </p>
                  )}
                </div>

                <div className="cart-summary-lines">
                  <div className="summary-line">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="summary-line line-discount">
                      <span>Privilege Code ({appliedCoupon})</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="summary-line">
                    <span>Delivery shipping</span>
                    <span>
                      {shippingFee === 0 ? 'Free shipping' : `₹${shippingFee.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="summary-line line-total">
                    <span>Grand Total</span>
                    <span>
                      ₹{checkoutTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isSubmitting}
                    id="checkout-confirm-order-button"
                  >
                    <Lock size={15} /> Confirm & Place Order
                  </Button>
                </div>

                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-muted)', letterSpacing: '0.04em' }}>
                    By confirming, you agree to Ellext terms of acquisition and hallmarking warranty.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
