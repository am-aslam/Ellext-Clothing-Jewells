'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X } from 'lucide-react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const DISMISSED_KEY = 'ellext-install-prompt-dismissed';

export function InstallAppPrompt() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isInstalled || window.localStorage.getItem(DISMISSED_KEY) === 'true') return;

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    const timer = window.setTimeout(() => setVisible(true), 2500);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [pathname]);

  const dismiss = () => {
    window.localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
    setShowInstructions(false);
  };

  const install = async () => {
    if (!installEvent) {
      setShowInstructions(true);
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    if (choice.outcome === 'accepted') setVisible(false);
  };

  if (!visible || pathname?.startsWith('/admin')) return null;

  return (
    <aside className="pwa-install-prompt" aria-label="Install Ellext">
      <div className="pwa-install-copy">
        <span className="pwa-install-icon" aria-hidden="true"><Download size={18} /></span>
        <div>
          <strong>Add Ellext to your Home Screen</strong>
          <p>Open the store directly from your phone whenever you like.</p>
        </div>
      </div>
      <div className="pwa-install-actions">
        <button type="button" className="pwa-install-button" onClick={() => void install()}>
          Add shortcut
        </button>
        <button type="button" className="pwa-install-dismiss" onClick={dismiss} aria-label="Dismiss install suggestion">
          <X size={18} />
        </button>
      </div>
      {showInstructions && (
        <div className="pwa-install-help" role="dialog" aria-labelledby="pwa-install-help-title">
          <button type="button" className="pwa-install-help-close" onClick={() => setShowInstructions(false)} aria-label="Close installation instructions">
            <X size={18} />
          </button>
          <strong id="pwa-install-help-title">Install Ellext on your phone</strong>
          <p>Open your browser menu, then choose <b>Add to Home Screen</b> or <b>Install app</b>. On iPhone Safari, tap Share, then Add to Home Screen.</p>
          <button type="button" className="pwa-install-help-done" onClick={dismiss}>Got it</button>
        </div>
      )}
    </aside>
  );
}
