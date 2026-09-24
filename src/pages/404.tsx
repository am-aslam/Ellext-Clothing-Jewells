export default function NotFoundPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#fff9ed', color: '#102033', fontFamily: 'Arial, sans-serif' }}>
      <section style={{ width: 'min(100%, 560px)', textAlign: 'center', padding: '48px 28px', border: '1px solid #e6ddca', background: '#fff' }}>
        <p style={{ margin: '0 0 12px', fontSize: 12, letterSpacing: '.18em', color: '#8a7040' }}>ELLEXT</p>
        <h1 style={{ margin: '0 0 12px', fontSize: 30, fontWeight: 500 }}>Page not found</h1>
        <p style={{ margin: '0 0 24px', color: '#697586', lineHeight: 1.6 }}>The link may be outdated or the page may have moved.</p>
        <a href="/" style={{ display: 'inline-block', padding: '13px 22px', background: '#102033', color: '#fff', textDecoration: 'none', letterSpacing: '.06em' }}>RETURN TO ELLEXT</a>
      </section>
    </main>
  );
}
