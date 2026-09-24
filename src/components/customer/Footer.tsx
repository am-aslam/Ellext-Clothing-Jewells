'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="elx-footer">
      <div className="elx-container">
        {/* Editorial Brand Statement & Minimal Newsletter */}
        <div className="footer-top-grid">
          <div className="footer-brand-column">
            <div style={{ marginBottom: '16px' }}>
              <Logo variant="footer" />
            </div>
            <p className="footer-brand-tagline">
              A house of refined tailoring and heirloom fine jewellery. Handcrafted in India for contemporary global connoisseurs.
            </p>
            <span className="footer-parent-group">A division of Ellext Group</span>
          </div>

          <div className="footer-newsletter-column">
            <h4 className="footer-newsletter-title">The Ellext Gazette</h4>
            <p className="footer-newsletter-sub">
              Receive private salon invitations, preview access to rare gems, and seasonal couture releases.
            </p>

            {subscribed ? (
              <div className="newsletter-success">
                <Check size={16} />
                <span>You have been added to our private register.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your preferred email address"
                  required
                  className="newsletter-input"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="newsletter-submit-btn"
                  aria-label="Subscribe to Ellext newsletter"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="footer-links-grid">
          <div className="footer-col">
            <h5 className="footer-col-title">Collections</h5>
            <ul className="footer-link-list">
              <li><Link href="/jewells">High Jewellery</Link></li>
              <li><Link href="/clothing">Couture & Tailoring</Link></li>
              <li><Link href="/shop?collection=Royal+Heritage">Royal Heritage Edit</Link></li>
              <li><Link href="/shop?collection=Atelier+Modernist">Atelier Modernist</Link></li>
              <li><Link href="/shop?collection=Nocturne+Evening">Nocturne Evening</Link></li>
              <li><Link href="/offers">Privilege Vouchers</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5 className="footer-col-title">The Maison</h5>
            <ul className="footer-link-list">
              <li><Link href="/about">About Ellext</Link></li>
              <li><Link href="/about#craftsmanship">Artisanal Heritage</Link></li>
              <li><Link href="/about#sustainability">Ethical Sourcing</Link></li>
              <li><Link href="/contact">Private Atelier Bookings</Link></li>
              <li><Link href="/contact">Press & Media</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5 className="footer-col-title">Client Care</h5>
            <ul className="footer-link-list">
              <li><Link href="/contact">Concierge Support</Link></li>
              <li><Link href="/account/orders">Track Shipment</Link></li>
              <li><Link href="/about#shipping">Kerala ₹60 / Outside Kerala ₹90 Delivery</Link></li>
              <li><Link href="/about#returns">Returns & Exchanges</Link></li>
              <li><Link href="/about#authenticity">Gemological Certification</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5 className="footer-col-title">Salons & Legal</h5>
            <ul className="footer-link-list">
              <li><span className="footer-text-muted">Mumbai • New Delhi • Jaipur</span></li>
              <li><Link href="/about#privacy">Privacy Policy</Link></li>
              <li><Link href="/about#terms">Terms of Acquisition</Link></li>
              <li><Link href="/contact">Bespoke Concierge</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {currentYear ?? ''} ELLEXT CLOTHING & JEWELLS. All rights reserved. Ellext Group.
          </p>
          <div className="footer-legal-tags">
            <span>BIS Hallmarked Gold</span>
            <span>•</span>
            <span>Conflict-Free Certification</span>
            <span>•</span>
            <span>Secure 256-Bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
