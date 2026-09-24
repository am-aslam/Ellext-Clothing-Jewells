import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Curated Collections & Seasonal Edits | Ellext',
  description: 'Explore signature capsules by Ellext: Royal Heritage, Atelier Modernist, Nocturne Evening, and Summer Solstice.'
};

const collectionsData = [
  {
    slug: 'royal-heritage',
    title: 'Royal Heritage',
    subtitle: 'Heirloom Polki & Varanasi Weaves',
    description: 'A grand celebration of princely courts. Featuring seven-strand Basra seed pearl necklaces, uncut Polki chokers, and pure tissue organza zari sarees.',
    image: '/assets/editorial/the-edit.jpg',
    piecesCount: '12 Creations'
  },
  {
    slug: 'atelier-modernist',
    title: 'Atelier Modernist',
    subtitle: 'Architectural Minimalist Jewellery & Tailoring',
    description: 'Clean geometry meets pure precious metals. Sculptural vermeil cuffs, tailored double-breasted wool blazers, and eternity diamond chokers.',
    image: '/assets/editorial/clothing-banner.jpg',
    piecesCount: '9 Creations'
  },
  {
    slug: 'nocturne-evening',
    title: 'Nocturne Evening',
    subtitle: 'Black-Tie Red Carpet Opulence',
    description: 'Designed for midnight gala soirees. Dramatic bias-cut silk gowns cascading with art deco chandelier crystal drops.',
    image: '/assets/editorial/hero-campaign.jpg',
    piecesCount: '8 Creations'
  },
  {
    slug: 'summer-solstice',
    title: 'Summer Solstice',
    subtitle: 'Mediterranean Flax Linen & Liquid Mesh',
    description: 'Effortless warm-weather luxury. Unstructured Belgian linen tailoring and fluid gold mesh collars designed for coastal respites.',
    image: '/assets/editorial/story.jpg',
    piecesCount: '7 Creations'
  }
];

export default function CollectionsPage() {
  return (
    <div className="collections-page-wrapper">
      <div className="elx-container" style={{ padding: '40px 16px 80px' }}>
        <div className="shop-page-header">
          <span className="section-sub-label">The Editorial Edit</span>
          <h1 className="shop-page-title font-serif">Curated Collections</h1>
          <p className="shop-page-desc">
            Explore seasonal capsules conceptualized and executed by the Ellext Atelier.
          </p>
        </div>

        <div className="collections-capsules-list">
          {collectionsData.map((col, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={col.slug}
                className={`the-edit-card ${isEven ? 'capsule-even' : 'capsule-odd'}`}
              >
                <div className="the-edit-media">
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="the-edit-img"
                  />
                </div>
                <div className="the-edit-info">
                  <span className="the-edit-eyebrow">{col.subtitle}</span>
                  <h2 className="the-edit-heading font-serif">{col.title}</h2>
                  <p className="the-edit-desc">{col.description}</p>
                  <div style={{ marginTop: '16px' }}>
                    <Link
                      href={`/shop?collection=${encodeURIComponent(col.title)}`}
                      className="elx-btn elx-btn-primary elx-btn-md"
                    >
                      Explore Capsule <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
