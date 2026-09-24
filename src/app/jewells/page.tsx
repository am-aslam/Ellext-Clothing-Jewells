import Link from 'next/link';
import { Sparkles, ChevronRight, ArrowRight, Gem, ShieldCheck, Award } from 'lucide-react';
import { api } from '@/services/api';
import { ProductCard } from '@/components/customer/ProductCard';

export const metadata = {
  title: 'Fine Jewells & Royal Polki | Ellext',
  description: 'Handcrafted Polki chokers, uncut diamonds, Basra seed pearls, Zambian emeralds, and 18K temple gold cuffs by Ellext.'
};

// Product data belongs to the live API and must not be fetched during static build.
export const dynamic = 'force-dynamic';

const JEWELLERY_FILTERS = [
  { label: 'All Jewells', href: '/jewells' },
  { label: 'Polki & Chokers', href: '/shop?category=jewells&q=choker' },
  { label: 'Earrings & Drops', href: '/shop?category=jewells&q=earrings' },
  { label: 'Royal Rings', href: '/shop?category=jewells&q=ring' },
  { label: 'Necklaces & Pendants', href: '/shop?category=jewells&q=necklace' },
  { label: 'Bangles & Cuffs', href: '/shop?category=jewells&q=cuff' },
  { label: 'Bridal Heritage', href: '/collections' },
];

export default async function JewellsPage() {
  let products = [] as Awaited<ReturnType<typeof api.getProducts>>;
  let catalogUnavailable = false;
  try {
    products = await api.getProducts({ category: 'jewells' });
  } catch (error) {
    catalogUnavailable = true;
    console.error('[Jewells] Catalogue could not be loaded.', error);
  }

  return (
    <div className="jewells-page-wrapper">
      {/* Refined Editorial Header (Warm Luxury Cream & Antique Gold) */}
      <section className="category-editorial-hero" id="jewells-hero">
        <div className="elx-container">
          <nav className="category-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={12} />
            <span className="breadcrumb-current">Jewells</span>
          </nav>

          <div className="category-hero-center">
            <div className="category-hero-eyebrow">
              <Sparkles size={13} className="category-eyebrow-icon" />
              <span>Haute Joaillerie & Royal Polki</span>
            </div>

            <h1 className="category-hero-title font-serif">Heirloom Jewells</h1>

            <p className="category-hero-description">
              Centuries of ancestral jewellery mastery. Handcrafted uncut Polki diamonds, deep Zambian emerald beads, luminous South Sea seed pearls, and 18K hallmarked gold vermeil crafted by generational master goldsmiths.
            </p>

            {/* Luxury Assurance Badges */}
            <div className="category-hero-perks">
              <div className="category-perk-item">
                <Gem size={14} />
                <span>Certified Natural Polki & Gemstones</span>
              </div>
              <div className="category-perk-item">
                <Award size={14} />
                <span>18K Hallmarked Gold Vermeil</span>
              </div>
              <div className="category-perk-item">
                <ShieldCheck size={14} />
                <span>Kerala ₹60 / Outside Kerala ₹90 Delivery</span>
              </div>
            </div>

            {/* Quick Filter Navigation Pills */}
            <div className="category-hero-pills" role="navigation" aria-label="Jewellery Sub-categories">
              {JEWELLERY_FILTERS.map((pill, idx) => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className={`category-pill-btn ${idx === 0 ? 'active' : ''}`}
                >
                  {pill.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section className="elx-section category-catalog-section">
        <div className="elx-container">
          <div className="category-catalog-bar">
            <div>
              <span className="section-sub-label">Master Goldsmithing</span>
              <h2 className="section-main-title font-serif">
                All Jewells <span className="category-count-badge">{catalogUnavailable ? '(temporarily unavailable)' : `(${products.length})`}</span>
              </h2>
            </div>
            <Link href="/shop?category=jewells" className="category-explore-link">
              Filter by gemstone & material <ArrowRight size={15} />
            </Link>
          </div>

          {catalogUnavailable ? (
            <p role="status" style={{ padding: '28px 0', color: 'var(--text-muted, #667085)' }}>
              We couldn’t load the jewellery catalogue. Please refresh this page to try again.
            </p>
          ) : products.length === 0 ? (
            <p style={{ padding: '28px 0', color: 'var(--text-muted, #667085)' }}>No jewellery products are available yet.</p>
          ) : (
            <div className="editorial-product-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
