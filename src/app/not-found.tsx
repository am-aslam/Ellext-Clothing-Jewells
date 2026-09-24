import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="elx-container" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', paddingBlock: 72 }}>
      <div style={{ maxWidth: 620, textAlign: 'center' }}>
        <p className="section-sub-label">404 · PAGE NOT FOUND</p>
        <h1 className="section-main-title font-serif">This page could not be found</h1>
        <p style={{ color: 'var(--text-muted, #667085)', lineHeight: 1.7, marginBlock: 16 }}>
          The link may be outdated or the page may have moved.
        </p>
        <Link href="/" className="elx-btn elx-btn-primary">RETURN TO ELLEXT</Link>
      </div>
    </section>
  );
}
