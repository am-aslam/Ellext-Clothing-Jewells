'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell, BellOff, LoaderCircle } from 'lucide-react';
import { api } from '@/services/api';

type PushState = 'loading' | 'unavailable' | 'unconfigured' | 'off' | 'on' | 'denied' | 'error';

function applicationServerKey(value: string): Uint8Array {
  const padded = value.padEnd(value.length + ((4 - value.length % 4) % 4), '=');
  const binary = window.atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

export function AdminOrderNotifications() {
  const [state, setState] = useState<PushState>('loading');
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setState('unavailable');
      return;
    }

    try {
      if (!(await navigator.serviceWorker.getRegistration('/'))) {
        setState('unavailable');
        return;
      }
      const config = await api.getAdminPushConfig();
      setPublicKey(config.publicKey);
      if (!config.enabled || !config.publicKey) {
        setState('unconfigured');
        return;
      }
      if (Notification.permission === 'denied') {
        setState('denied');
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await api.saveAdminPushSubscription(subscription.toJSON());
        setState('on');
      } else {
        setState('off');
      }
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const enable = async () => {
    if (!publicKey) return;
    setBusy(true);
    setMessage('');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'denied' : 'off');
        setMessage(permission === 'denied' ? 'Allow notifications for this installed app in your browser settings to receive order alerts.' : 'Notification permission was not granted.');
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey(publicKey) as BufferSource
      });
      await api.saveAdminPushSubscription(subscription.toJSON());
      setState('on');
      setMessage('Order alerts are enabled on this device.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not enable order alerts. Please try again.');
      setState('error');
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    setMessage('');
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await api.deleteAdminPushSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setState('off');
      setMessage('Order alerts are turned off on this device.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not turn off order alerts.');
      setState('error');
    } finally {
      setBusy(false);
    }
  };

  if (state === 'loading') return null;

  const action = state === 'on' ? disable : state === 'error' && !publicKey ? refresh : enable;
  const label = busy ? 'Working…' : state === 'on' ? 'Turn alerts off' : state === 'error' && !publicKey ? 'Retry connection' : 'Enable order alerts';
  const disabled = busy || ['unavailable', 'unconfigured', 'denied'].includes(state);

  return (
    <section className="admin-push-card" aria-label="New order notification settings">
      <div className="admin-push-copy">
        <span className="admin-push-icon" aria-hidden="true">
          {state === 'on' ? <Bell size={18} /> : <BellOff size={18} />}
        </span>
        <div>
          <strong>New order alerts</strong>
          <p>
            {state === 'on' ? 'This device will notify you with order details.' :
              state === 'unconfigured' ? 'Push alerts need backend VAPID keys and the database migration.' :
              state === 'unavailable' ? 'Install/open the admin app in a browser that supports push notifications.' :
              state === 'denied' ? 'Notifications are blocked in this browser’s settings.' :
              state === 'error' && !message ? 'Could not check notification settings.' :
              'Get the order number, customer, items, total and payment method.'}
          </p>
          {message && <p className="admin-push-message" role="status">{message}</p>}
        </div>
      </div>
      {state !== 'unavailable' && state !== 'unconfigured' && state !== 'denied' && (
        <button type="button" className="admin-push-button" onClick={action} disabled={disabled}>
          {busy ? <LoaderCircle className="admin-push-spinner" size={16} /> : null}
          {label}
        </button>
      )}
    </section>
  );
}
