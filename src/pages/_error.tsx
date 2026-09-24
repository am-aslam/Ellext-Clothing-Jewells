import type { NextPageContext } from 'next';

type ErrorPageProps = { statusCode: number };

/** Explicit Pages Router fallback so Next can render errors while App Router assets rebuild. */
export default function EllextErrorPage({ statusCode }: ErrorPageProps) {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#fff9ed', color: '#102033', fontFamily: 'Arial, sans-serif' }}>
      <section style={{ width: 'min(100%, 560px)', textAlign: 'center', padding: '48px 28px', border: '1px solid #e6ddca', background: '#fff' }}>
        <p style={{ margin: '0 0 12px', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: '#8a7040' }}>ELLEXT</p>
        <h1 style={{ margin: '0 0 12px', fontSize: 30, fontWeight: 500 }}>{statusCode === 404 ? 'Page not found' : 'Something went wrong'}</h1>
        <p style={{ margin: '0 0 24px', color: '#697586', lineHeight: 1.6 }}>
          {statusCode === 404 ? 'The page may have moved or is no longer available.' : 'Please try again. Your account and order data have not been changed.'}
        </p>
        <a href="/" style={{ display: 'inline-block', padding: '13px 22px', background: '#102033', color: '#fff', textDecoration: 'none', letterSpacing: '.06em' }}>RETURN TO ELLEXT</a>
      </section>
    </main>
  );
}

EllextErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => ({
  statusCode: res?.statusCode ?? err?.statusCode ?? 500
});
