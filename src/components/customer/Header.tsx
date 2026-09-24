'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X, Gem, Sparkles, ChevronRight, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { SearchOverlay } from './SearchOverlay';
import { Logo } from '@/components/ui/Logo';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalCount, openCart } = useCart();
  const { wishlist } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile drawer is open to prevent unwanted scrolling
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // If in admin route, the customer header does not render
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Clothing', href: '/clothing' },
    { label: 'Jewells', href: '/jewells' },
    { label: 'Collections', href: '/collections' },
    { label: 'Offers', href: '/offers' }
  ];

  const mobileCategoryPills = [
    { label: 'Jewells', href: '/jewells', icon: Gem },
    { label: 'Clothing', href: '/clothing', icon: Sparkles },
    { label: 'Collections', href: '/collections', icon: null },
    { label: 'Offers', href: '/offers', icon: Tag },
    { label: 'New Arrivals', href: '/shop?filter=new', icon: null },
  ];

  return (
    <>
      <header className="elx-header">
        {/* Top subtle privilege announcement */}
        <div className="elx-announcement-bar">
          <div className="elx-container announcement-content">
            <span className="announcement-desktop-text">
              THE AUTUMN / WINTER EDIT — DELIVERY ₹60 IN KERALA / ₹90 OUTSIDE KERALA
            </span>
            <span className="announcement-mobile-text">
              DELIVERY ₹60 IN KERALA / ₹90 OUTSIDE KERALA
            </span>
          </div>
        </div>

        <div className="elx-header-main">
          <div className="elx-container header-inner">
            {/* Left: Desktop Nav or Mobile Hamburger Trigger */}
            <nav className="header-nav" aria-label="Main Navigation">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="mobile-menu-trigger"
                aria-label="Open navigation menu"
                id="mobile-menu-button"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>

              <ul className="desktop-nav-list">
                {navLinks.map(link => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`desktop-nav-link ${isActive ? 'active' : ''}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Center: Brand Official Logo (Transparent, single instance) */}
            <div className="header-center">
              <Link href="/" className="brand-logo-link" aria-label="ELLEXT Home">
                <Logo variant="header" colorMode="dark" priority />
              </Link>
            </div>

            {/* Right: Clean Utility Icons */}
            <div className="header-right">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="header-util-btn util-search-btn"
                aria-label="Open search drawer"
                id="search-button"
              >
                <Search size={19} strokeWidth={1.5} />
                <span className="util-text">Search</span>
              </button>

              <Link
                href="/wishlist"
                className="header-util-btn util-wishlist-btn"
                aria-label={`Wishlist with ${wishlist.length} items`}
                id="wishlist-button"
              >
                <div className="util-badge-wrapper">
                  <Heart size={19} strokeWidth={1.5} />
                  {mounted && wishlist.length > 0 && (
                    <span className="header-badge">{wishlist.length}</span>
                  )}
                </div>
                <span className="util-text">Wishlist</span>
              </Link>

              <Link
                href="/account"
                className="header-util-btn util-account-btn"
                aria-label="Customer Account"
                id="account-button"
              >
                <User size={19} strokeWidth={1.5} />
                <span className="util-text">Account</span>
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="header-util-btn util-cart-btn"
                aria-label={`Shopping bag with ${totalCount} items`}
                id="cart-button"
              >
                <div className="util-badge-wrapper">
                  <ShoppingBag size={19} strokeWidth={1.5} />
                  {mounted && totalCount > 0 && (
                    <span className="header-badge">{totalCount}</span>
                  )}
                </div>
                <span className="util-text">Bag</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Fast-Access Category Strip (Visible strictly on mobile <1024px) */}
        <div className="header-mobile-strip" aria-label="Quick Category Access">
          <div className="header-mobile-strip-inner">
            {mobileCategoryPills.map(pill => {
              const isActive = pathname === pill.href;
              const Icon = pill.icon;
              return (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className={`mobile-strip-pill ${isActive ? 'active' : ''}`}
                >
                  {Icon && <Icon size={12} className="mobile-strip-icon" />}
                  <span>{pill.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Luxury Brand Drawer Menu (Warm Ivory & Antique Gold) */}
      {isMobileMenuOpen && (
        <div
          className="elx-mobile-drawer-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="elx-mobile-drawer"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="drawer-header">
              <Logo variant="header" colorMode="dark" />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="drawer-close-btn"
              >
                <X size={22} />
              </button>
            </div>

            {/* Quick Search Action */}
            <div className="drawer-search-wrap">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="drawer-search-btn"
              >
                <Search size={16} />
                <span>Search Atelier &amp; Catalog</span>
              </button>
            </div>

            {/* Curated Navigation Sections */}
            <div className="drawer-body">
              <div className="drawer-section">
                <span className="drawer-section-title">THE MAISON</span>
                <nav className="drawer-nav">
                  {navLinks.map(link => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`drawer-link ${isActive ? 'active' : ''}`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight size={14} className="drawer-chevron" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="drawer-section">
                <span className="drawer-section-title">CATEGORIES</span>
                <nav className="drawer-nav">
                  <Link
                    href="/jewells"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="drawer-link"
                  >
                    <span className="drawer-link-icon-text">
                      <Gem size={15} /> Fine Jewells &amp; Polki
                    </span>
                    <ChevronRight size={14} className="drawer-chevron" />
                  </Link>
                  <Link
                    href="/clothing"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="drawer-link"
                  >
                    <span className="drawer-link-icon-text">
                      <Sparkles size={15} /> Couture Clothing &amp; Sarees
                    </span>
                    <ChevronRight size={14} className="drawer-chevron" />
                  </Link>
                  <Link
                    href="/collections"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="drawer-link"
                  >
                    <span>Curated Collections</span>
                    <ChevronRight size={14} className="drawer-chevron" />
                  </Link>
                  <Link
                    href="/offers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="drawer-link"
                  >
                    <span className="drawer-link-icon-text">
                      <Tag size={15} /> Privilege Offers &amp; Vouchers
                    </span>
                    <ChevronRight size={14} className="drawer-chevron" />
                  </Link>
                </nav>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="drawer-footer">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="drawer-client-link"
              >
                <User size={16} />
                <span>Client Account &amp; Orders</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="drawer-client-link"
              >
                <Heart size={16} />
                <span>Saved Wishlist ({mounted ? wishlist.length : 0})</span>
              </Link>
              <p className="drawer-currency-note">Prices displayed in Indian Rupee (₹ INR)</p>
            </div>
          </div>
        </div>
      )}

      {/* Global Instant Search Drawer */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
