'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Ellext application error', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#fff9ed', color: '#102033', fontFamily: 'Arial, sans-serif' }}>
        <main role="alert" style={{ width: 'min(100%, 560px)', textAlign: 'center', padding: '48px 28px', border: '1px solid #e6ddca', background: '#fff' }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, letterSpacing: '.18em', color: '#8a7040' }}>ELLEXT</p>
          <h1 style={{ margin: '0 0 12px', fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 500 }}>Something went wrong</h1>
          <p style={{ color: '#697586', lineHeight: 1.6 }}>Please try again. Your account and order data have not been changed.</p>
          <button onClick={reset} type="button" style={{ marginTop: 18, padding: '13px 22px', border: 0, background: '#102033', color: '#fff', cursor: 'pointer', letterSpacing: '.06em' }}>
            TRY AGAIN
          </button>
        </main>
      </body>
    </html>
  );
}
