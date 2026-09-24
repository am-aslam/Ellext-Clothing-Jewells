'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gem, Sparkles, Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { wishlist } = useWishlist();
  const { totalCount, openCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/checkout')) {
    return null;
  }

  const items = [
    { label: 'Home', href: '/', icon: Home, isAction: false },
    { label: 'Jewells', href: '/jewells', icon: Gem, isAction: false },
    { label: 'Clothing', href: '/clothing', icon: Sparkles, isAction: false },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, isAction: false, badge: mounted ? wishlist.length : 0 },
    { label: 'Bag', href: '#cart', icon: ShoppingBag, isAction: true, badge: mounted ? totalCount : 0 }
  ];

  return (
    <nav className="elx-mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-nav-inner">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = !item.isAction && pathname === item.href;

          if (item.isAction) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={openCart}
                className="mobile-nav-item mobile-nav-btn"
                aria-label={`Open shopping bag with ${totalCount} items`}
              >
                <div className="mobile-nav-icon-wrap">
                  <Icon size={20} strokeWidth={1.5} />
                  {item.badge !== undefined && item.badge > 0 ? (
                    <span className="mobile-badge">{item.badge}</span>
                  ) : null}
                </div>
                <span className="mobile-nav-label">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="mobile-nav-icon-wrap">
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {item.badge !== undefined && item.badge > 0 ? (
                  <span className="mobile-badge">{item.badge}</span>
                ) : null}
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
