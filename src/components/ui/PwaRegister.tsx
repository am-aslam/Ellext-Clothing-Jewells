'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Avoid stale service-worker assets while developing on localhost.
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => void registration.unregister());
        });
        caches.keys().then(keys => {
          keys.filter(key => key.startsWith('ellext-static-')).forEach(key => void caches.delete(key));
        });
        return;
      }

      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .then(reg => {
          console.log('[PWA] Service worker active with scope:', reg.scope);
          void reg.update();
        })
        .catch(err => {
          console.warn('[PWA] Service worker registration notice:', err);
        });
    }
  }, []);

  return null;
}
