import Image from 'next/image';
import Link from 'next/link';
import { Gem, Shield, Award, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'The Maison & Heritage',
  description: 'Learn about Ellext Clothing & Jewells, a proud house under Ellext Group dedicated to artisanal craftsmanship and contemporary royal design.'
};

export default function AboutPage() {
  return (
    <div className="about-page-wrapper">
      {/* Editorial Hero */}
      <section className="category-hero-section">
        <div className="category-hero-media">
          <Image
            src="/assets/editorial/story.jpg"
            alt="Ellext Maison Heritage"
            fill
            priority
            sizes="100vw"
            className="category-hero-img"
          />
          <div className="category-hero-overlay" />
        </div>
        <div className="elx-container category-hero-content">
          <span className="hero-eyebrow">The Maison & Heritage</span>
          <h1 className="hero-headline font-serif">A House of Craft</h1>
          <p className="hero-subtext">
            Under the patronage of Ellext Group, crafting timeless fine jewellery and sartorial tailoring for patrons of distinction.
          </p>
        </div>
      </section>

      <section className="elx-section">
        <div className="elx-container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-sub-label">Our Philosophy</span>
            <h2 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 400, marginTop: '8px', lineHeight: 1.3 }}>
              &ldquo;True luxury is born at the intersection of ancestral handcraft and modern restraint.&rdquo;
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '1.0625rem', marginTop: '20px', lineHeight: 1.8 }}>
              Ellext was conceived to bridge two venerable artistic traditions: the historic goldsmithing ateliers of Rajasthan and the architectural purity of modern Italian tailoring. Every creation that bears the Ellext seal is conceived not for a single season, but to be passed down as an heirloom.
            </p>
          </div>

          {/* Pillars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '32px',
              margin: '64px 0'
            }}
          >
            <div style={{ padding: '32px 24px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)' }}>
              <Gem size={28} color="var(--color-gold-dark)" style={{ marginBottom: '16px' }} />
              <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Uncut Polki & Rare Gems</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                Directly sourced conflict-free diamonds, Zambian emeralds, and untreated rubies certified by leading gemological institutes.
              </p>
            </div>

            <div style={{ padding: '32px 24px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)' }}>
              <Award size={28} color="var(--color-gold-dark)" style={{ marginBottom: '16px' }} />
              <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Ancestral Hand-Setting</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                Each piece requires 80 to 200 hours of artisanal repoussé, enamelling, and setting by hereditary master jewelers.
              </p>
            </div>

            <div style={{ padding: '32px 24px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xs)' }}>
              <Shield size={28} color="var(--color-gold-dark)" style={{ marginBottom: '16px' }} />
              <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>BIS Hallmarked Gold</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                Complete legal purity certification with laser-etched HUID hallmarking and transparent regional delivery pricing.
              </p>
            </div>
          </div>

          {/* Ellext Group Heritage */}
          <div style={{ backgroundColor: 'var(--color-bg)', padding: '40px 32px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border)', marginTop: '48px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 600 }}>
              Corporate Patronage
            </span>
            <h3 className="font-serif" style={{ fontSize: '1.75rem', margin: '8px 0 12px' }}>
              An Ellext Group Company
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-charcoal)', maxWidth: '640px', margin: '0 auto 24px', lineHeight: 1.7 }}>
              Ellext Clothing & Jewells represents the luxury fashion and fine joaillerie division of Ellext Group, upholding the highest global benchmarks in ethics, artisanal welfare, and material excellence.
            </p>
            <Link href="/contact" className="elx-btn elx-btn-primary elx-btn-md">
              Schedule Private Atelier Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
