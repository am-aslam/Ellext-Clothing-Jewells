'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

type AdminInstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const DISMISSED_KEY = 'ellext_admin_pwa_dismissed_v2';

export function AdminInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<AdminInstallEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isInstalled || window.localStorage.getItem(DISMISSED_KEY) === 'true') return;

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as AdminInstallEvent);
    };
    const handleInstalled = () => setVisible(false);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    const timer = window.setTimeout(() => setVisible(true), 2500);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
    setShowHelp(false);
  };

  const install = async () => {
    if (!installEvent) {
      setShowHelp(true);
      return;
    }
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    if (choice.outcome === 'accepted') setVisible(false);
  };

  return (
    <>
      {visible && (
        <aside className="admin-install-prompt" aria-label="Install Ellext Admin">
          <div className="admin-install-copy">
            <span className="admin-install-icon" aria-hidden="true"><Download size={18} /></span>
            <div>
              <strong>Install Ellext Admin</strong>
              <p>Add a shortcut that opens directly to the admin portal.</p>
            </div>
          </div>
          <div className="admin-install-actions">
            <button type="button" className="admin-install-button" onClick={() => void install()}>Add shortcut</button>
            <button type="button" className="admin-install-dismiss" onClick={dismiss} aria-label="Dismiss install suggestion"><X size={18} /></button>
          </div>
        </aside>
      )}
      {showHelp && (
        <div className="admin-install-backdrop" role="presentation" onClick={() => setShowHelp(false)}>
          <section className="admin-install-help" role="dialog" aria-modal="true" aria-labelledby="admin-install-title" onClick={event => event.stopPropagation()}>
            <button type="button" className="admin-install-help-close" onClick={() => setShowHelp(false)} aria-label="Close installation instructions"><X size={18} /></button>
            <h2 id="admin-install-title">Install Ellext Admin</h2>
            <p>On Android, open your browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>. On iPhone Safari, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</p>
            <button type="button" className="admin-install-button" onClick={dismiss}>Got it</button>
          </section>
        </div>
      )}
    </>
  );
}
