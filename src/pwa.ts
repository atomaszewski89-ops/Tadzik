/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const installListeners: Array<(canInstall: boolean) => void> = [];

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.info('Tadzik PWA Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.info('Service Worker registration skipped or failed:', err);
        });
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      installListeners.forEach((listener) => listener(true));
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      installListeners.forEach((listener) => listener(false));
      console.info('Tadzik app successfully installed on device!');
    });
  }
}

export function subscribeToInstallPrompt(callback: (canInstall: boolean) => void) {
  installListeners.push(callback);
  callback(deferredPrompt !== null);
  return () => {
    const idx = installListeners.indexOf(callback);
    if (idx !== -1) installListeners.splice(idx, 1);
  };
}

export async function triggerNativeInstall(): Promise<'accepted' | 'dismissed' | 'unsupported'> {
  if (!deferredPrompt) {
    return 'unsupported';
  }
  try {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installListeners.forEach((l) => l(false));
    return choice.outcome;
  } catch (err) {
    console.error('Install prompt error:', err);
    return 'unsupported';
  }
}

export function isStandaloneApp(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function detectDeviceOS(): 'ios' | 'android' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = window.navigator.userAgent || window.navigator.vendor || (window as unknown as { opera?: string }).opera || '';

  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 'ios';
  }
  if (/android/i.test(ua)) {
    return 'android';
  }
  return 'desktop';
}
