'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Offer } from '@/types';
import { api } from '@/services/api';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, options?: { variantLabel?: string; size?: string; colour?: string; material?: string }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedCoupon: string | null;
  appliedOffer: Offer | null;
  couponMessage: string | null;
  isApplyingCoupon: boolean;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  totalCount: number;
}

export function calculateShippingFee(state: string | undefined, items: CartItem[]): number {
  if (!items.length || items.every(item => item.product.freeShipping)) return 0;
  const normalized = String(state ?? '').trim().toLowerCase();
  if (!normalized) return 0;
  return normalized === 'kerala' || normalized === 'kl' || normalized.includes('kerala') ? 60 : 90;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'ellext_cart_items';
const COUPON_KEY = 'ellext_applied_coupon';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const savedCoupon = localStorage.getItem(COUPON_KEY);
      if (savedCoupon) {
        setAppliedCoupon(savedCoupon);
      }
    } catch (e) {
      console.error(e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, mounted]);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Re-verify coupon whenever subtotal changes
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      api.validateCoupon(appliedCoupon, subtotal).then(res => {
        if (res.valid) {
          setCouponDiscount(res.discountAmount);
          setAppliedOffer(res.offer || null);
          setCouponMessage(res.message);
        } else {
          setCouponDiscount(0);
          setAppliedOffer(null);
          setCouponMessage(res.message);
        }
      });
    } else {
      setCouponDiscount(0);
      setAppliedOffer(null);
      setCouponMessage(null);
    }
  }, [subtotal, appliedCoupon]);

  // The exact rate is calculated at checkout from the delivery address. The cart
  // has no address yet, so it must not display a guessed shipping charge.
  const shippingFee = 0;
  const discount = couponDiscount;
  const total = Math.max(0, subtotal - discount + shippingFee);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (
    product: Product,
    quantity = 1,
    options?: { variantLabel?: string; size?: string; colour?: string; material?: string }
  ) => {
    // Generate a unique ID for combination of product + options
    const variantKey = [
      product.id,
      options?.variantLabel || '',
      options?.size || '',
      options?.colour || '',
      options?.material || ''
    ].filter(Boolean).join('-');

    setItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === variantKey);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: variantKey,
            productId: product.id,
            product,
            selectedVariant: options?.variantLabel,
            selectedSize: options?.size,
            selectedColour: options?.colour,
            selectedMaterial: options?.material,
            quantity,
            unitPrice: product.sellingPrice
          }
        ];
      }
    });

    showToast(`Added "${product.name}" to your bag.`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    showToast('Item removed from your bag.', 'info');
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setAppliedOffer(null);
    setCouponDiscount(0);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COUPON_KEY);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!code || !code.trim()) {
      setCouponMessage('Please enter a privilege code.');
      return false;
    }
    setIsApplyingCoupon(true);
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid) {
        setAppliedCoupon(code.toUpperCase().trim());
        setAppliedOffer(res.offer || null);
        setCouponDiscount(res.discountAmount);
        setCouponMessage(res.message);
        localStorage.setItem(COUPON_KEY, code.toUpperCase().trim());
        showToast(res.message, 'success');
        return true;
      } else {
        setCouponMessage(res.message);
        showToast(res.message, 'error');
        return false;
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setAppliedOffer(null);
    setCouponDiscount(0);
    setCouponMessage(null);
    localStorage.removeItem(COUPON_KEY);
    showToast('Privilege code removed.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        subtotal,
        discount,
        shippingFee,
        total,
        appliedCoupon,
        appliedOffer,
        couponMessage,
        isApplyingCoupon,
        applyCoupon,
        removeCoupon,
        totalCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
