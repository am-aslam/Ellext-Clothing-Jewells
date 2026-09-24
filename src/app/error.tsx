'use client';

import { useEffect } from 'react';

export default function RouteError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the diagnostic in the browser console; never expose internals in the UI.
    console.error('Ellext route error', error);
  }, [error]);

  return (
    <section className="elx-container" role="alert" style={{ minHeight: '50vh', display: 'grid', placeItems: 'center', paddingBlock: 64 }}>
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        <p className="section-sub-label">ELLEXT</p>
        <h1 className="section-main-title font-serif">This page needs a moment</h1>
        <p style={{ color: 'var(--text-muted, #667085)', lineHeight: 1.7, marginBlock: 16 }}>
          We couldn’t load this page just now. Your account and order data have not been changed.
        </p>
        <button className="elx-btn elx-btn-primary" onClick={reset} type="button">
          TRY AGAIN
        </button>
      </div>
    </section>
  );
}
