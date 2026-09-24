import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Shield, Gem } from 'lucide-react';
import { api } from '@/services/api';
import { ProductCard } from '@/components/customer/ProductCard';

export const revalidate = 0; // Dynamic server rendering for fresh catalog

export default async function HomePage() {
  const [newArrivals, featuredJewells, featuredClothing, activeOffers] = await Promise.all([
    api.getProducts({ newArrival: true }),
    api.getProducts({ category: 'jewells', featured: true }),
    api.getProducts({ category: 'clothing', featured: true }),
    api.getOffers(true)
  ]);

  return (
    <div className="homepage-wrapper">
      {/* 1. HERO CAMPAIGN */}
      <section className="hero-campaign-section" aria-label="Campaign Hero">
        <div className="hero-media-wrapper">
          <Image
            src="/assets/editorial/hero-campaign.jpg"
            alt="The New Ellext Edit Campaign"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            className="hero-media-img"
          />
          <div className="hero-overlay" />
        </div>

        <div className="elx-container hero-content-container">
          <div className="hero-content">
            <span className="hero-eyebrow">Autumn / Winter Haute Couture &amp; Fine Jewels</span>
            <h1 className="hero-headline">THE NEW ELLEXT EDIT</h1>
            <p className="hero-subtext">
              An intimate dialogue between architectural tailoring and ancestral goldsmithing.
              Designed for life&apos;s most memorable ceremonies.
            </p>
            <div className="hero-actions">
              <Link href="/shop" className="elx-btn hero-btn-primary elx-btn-lg" id="hero-explore-btn">
                Explore Collection
              </Link>
              <Link href="/jewells" className="elx-btn hero-btn-secondary elx-btn-lg" id="hero-jewells-btn">
                Shop Jewells
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACTIVE OFFERS BANNER (Rendered only when active offers exist) */}
      {activeOffers.length > 0 && (
        <section className="offers-highlight-bar" aria-label="Active Privileges">
          <div className="elx-container">
            <div className="offers-highlight-inner">
              <div className="offers-highlight-badge">
                <Sparkles size={15} /> Privilege Voucher
              </div>
              <p className="offers-highlight-text">
                <strong>{activeOffers[0].code}</strong> — {activeOffers[0].title}: {activeOffers[0].description}
              </p>
              <Link href="/offers" className="offers-highlight-cta">
                View All Privileges <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. NEW ARRIVALS DYNAMIC GRID */}
      <section className="elx-section new-arrivals-section">
        <div className="elx-container">
          <div className="section-header-editorial">
            <div>
              <span className="section-sub-label">Just Unveiled</span>
              <h2 className="section-main-title font-serif">New Arrivals</h2>
            </div>
            <Link href="/shop?filter=new" className="section-header-link">
              View All Creations <ArrowRight size={15} />
            </Link>
          </div>

          <div className="editorial-product-grid">
            {newArrivals.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY (Large visual statement tiles) */}
      <section className="elx-section category-statement-section">
        <div className="elx-container">
          <div className="category-statement-grid">
            {/* Clothing Category Tile */}
            <Link href="/clothing" className="category-tile" id="tile-clothing">
              <div className="category-tile-media">
                <Image
                  src="/assets/editorial/clothing-banner.jpg"
                  alt="Ellext Clothing Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="category-tile-img"
                />
                <div className="category-tile-overlay" />
              </div>
              <div className="category-tile-content">
                <span className="category-tile-eyebrow">Couture & Tailoring</span>
                <h2 className="category-tile-title font-serif">CLOTHING</h2>
                <span className="category-tile-cta">
                  Explore Apparel <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            {/* Jewells Category Tile */}
            <Link href="/jewells" className="category-tile" id="tile-jewells">
              <div className="category-tile-media">
                <Image
                  src="/assets/products/jewels/jewel-01.jpeg"
                  alt="Ellext Jewells Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="category-tile-img"
                />
                <div className="category-tile-overlay" />
              </div>
              <div className="category-tile-content">
                <span className="category-tile-eyebrow">High Jewellery & Polki</span>
                <h2 className="category-tile-title font-serif">JEWELLS</h2>
                <span className="category-tile-cta">
                  Discover Jewels <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL CAMPAIGN: THE ELLEXT EDIT */}
      <section className="elx-section the-edit-section">
        <div className="elx-container">
          <div className="the-edit-card">
            <div className="the-edit-media">
              <Image
                src="/assets/editorial/the-edit.jpg"
                alt="The Ellext Edit"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="the-edit-img"
              />
            </div>
            <div className="the-edit-info">
              <span className="the-edit-eyebrow">Special Curated Release</span>
              <h2 className="the-edit-heading font-serif">THE ELLEXT EDIT</h2>
              <p className="the-edit-desc">
                Curated by our creative atelier, this capsule pairs bespoke pure silk draping with
                uncut diamond jewellery — embodying the modern royal aesthetic.
              </p>
              <div className="the-edit-actions">
                <Link href="/collections" className="elx-btn elx-btn-primary elx-btn-md">
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED JEWELLS (Horizontal presentation) */}
      <section className="elx-section featured-jewells-section">
        <div className="elx-container">
          <div className="section-header-editorial">
            <div>
              <span className="section-sub-label">Master Goldsmithing</span>
              <h2 className="section-main-title font-serif">Featured Jewells</h2>
            </div>
            <Link href="/jewells" className="section-header-link">
              View All Jewels <ArrowRight size={15} />
            </Link>
          </div>

          <div className="horizontal-jewells-scroll">
            {featuredJewells.map(product => (
              <div key={product.id} className="horizontal-scroll-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FEATURED CLOTHING (Editorial layout) */}
      <section className="elx-section featured-clothing-section">
        <div className="elx-container">
          <div className="section-header-editorial">
            <div>
              <span className="section-sub-label">Sartorial Precision</span>
              <h2 className="section-main-title font-serif">Featured Clothing</h2>
            </div>
            <Link href="/clothing" className="section-header-link">
              View All Garments <ArrowRight size={15} />
            </Link>
          </div>

          <div className="editorial-product-grid">
            {featuredClothing.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. BRAND STORY (Editorial vignette) */}
      <section className="elx-section brand-story-section">
        <div className="elx-container">
          <div className="brand-story-grid">
            <div className="brand-story-text-column">
              <span className="story-eyebrow">The Maison</span>
              <h2 className="story-headline font-serif">
                A legacy of uncompromising craftsmanship under Ellext Group.
              </h2>
              <p className="story-paragraph">
                Born from a reverence for India&apos;s royal heritage and European modernist restraint,
                Ellext creates timeless heirlooms. Each jewel is individually examined, hallmarked,
                and handset by generational craftsmen in Jaipur and Mumbai.
              </p>
              <div className="story-pillars">
                <div className="pillar-item">
                  <Gem size={20} className="pillar-icon" />
                  <div>
                    <h3 className="pillar-title">Certified Gemstones</h3>
                    <p className="pillar-sub">Natural Zambian emeralds, Burmese rubies & uncut polki diamonds.</p>
                  </div>
                </div>
                <div className="pillar-item">
                  <Shield size={20} className="pillar-icon" />
                  <div>
                    <h3 className="pillar-title">Insured Armoured Handover</h3>
                    <p className="pillar-sub">Direct delivery via specialized vault couriers across India and worldwide.</p>
                  </div>
                </div>
              </div>
              <div className="story-action">
                <Link href="/about" className="elx-btn elx-btn-outline elx-btn-md">
                  Discover Our Heritage
                </Link>
              </div>
            </div>

            <div className="brand-story-visual-column">
              <div className="story-image-wrap">
                <Image
                  src="/assets/editorial/story.jpg"
                  alt="Ellext Artisan Craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="story-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
