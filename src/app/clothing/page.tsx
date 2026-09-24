import Link from 'next/link';
import { Sparkles, ChevronRight, ArrowRight, Scissors, ShieldCheck, Award } from 'lucide-react';
import { api } from '@/services/api';
import { ProductCard } from '@/components/customer/ProductCard';

export const metadata = {
  title: 'Couture Clothing & Fine Tailoring | Ellext',
  description: 'Explore handcrafted double-breasted blazers, mulberry silk evening gowns, Banarasi tissue sarees, and resort linen suits.'
};

// Product data belongs to the live API and must not be fetched during static build.
export const dynamic = 'force-dynamic';

const CLOTHING_FILTERS = [
  { label: 'All Garments', href: '/clothing' },
  { label: 'Silk Sarees & Zari', href: '/shop?category=clothing&q=saree' },
  { label: 'Evening Gowns', href: '/shop?category=clothing&q=gown' },
  { label: 'Tailored Blazers', href: '/shop?category=clothing&q=blazer' },
  { label: 'Resort & Linen', href: '/shop?category=clothing&q=linen' },
  { label: 'The Edit', href: '/collections' },
];

export default async function ClothingPage() {
  let products = [] as Awaited<ReturnType<typeof api.getProducts>>;
  let catalogUnavailable = false;
  try {
    products = await api.getProducts({ category: 'clothing' });
  } catch (error) {
    catalogUnavailable = true;
    console.error('[Clothing] Catalogue could not be loaded.', error);
  }

  return (
    <div className="clothing-page-wrapper">
      {/* Refined Editorial Header (Warm Luxury Cream & Antique Gold) */}
      <section className="category-editorial-hero" id="clothing-hero">
        <div className="elx-container">
          <nav className="category-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={12} />
            <span className="breadcrumb-current">Clothing</span>
          </nav>

          <div className="category-hero-center">
            <div className="category-hero-eyebrow">
              <Sparkles size={13} className="category-eyebrow-icon" />
              <span>Haute Couture & Sartorial Repertoire</span>
            </div>

            <h1 className="category-hero-title font-serif">Couture Clothing</h1>

            <p className="category-hero-description">
              Architectural tailoring cut from Italian wool crepe, liquid mulberry silk charmeuse, and Varanasi handwoven tissue zari. Timeless silhouettes designed for modern ceremonial and red-carpet occasions.
            </p>

            {/* Luxury Assurance Badges */}
            <div className="category-hero-perks">
              <div className="category-perk-item">
                <Scissors size={14} />
                <span>Pure Mulberry Silk & Handwoven Zari</span>
              </div>
              <div className="category-perk-item">
                <Award size={14} />
                <span>Bespoke Made-to-Measure Available</span>
              </div>
              <div className="category-perk-item">
                <ShieldCheck size={14} />
                <span>Kerala ₹60 / Outside Kerala ₹90 Delivery</span>
              </div>
            </div>

            {/* Quick Filter Navigation Pills */}
            <div className="category-hero-pills" role="navigation" aria-label="Clothing Sub-categories">
              {CLOTHING_FILTERS.map((pill, idx) => (
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
              <span className="section-sub-label">Sartorial Repertoire</span>
              <h2 className="section-main-title font-serif">
                All Garments <span className="category-count-badge">{catalogUnavailable ? '(temporarily unavailable)' : `(${products.length})`}</span>
              </h2>
            </div>
            <Link href="/shop?category=clothing" className="category-explore-link">
              Filter by size & silhouette <ArrowRight size={15} />
            </Link>
          </div>

          {catalogUnavailable ? (
            <p role="status" style={{ padding: '28px 0', color: 'var(--text-muted, #667085)' }}>
              We couldn’t load the clothing catalogue. Please refresh this page to try again.
            </p>
          ) : products.length === 0 ? (
            <p style={{ padding: '28px 0', color: 'var(--text-muted, #667085)' }}>No clothing products are available yet.</p>
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
