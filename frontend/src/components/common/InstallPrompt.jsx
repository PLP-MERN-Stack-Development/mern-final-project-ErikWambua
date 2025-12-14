import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a delay (3 seconds)
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-nairobi-blue p-5">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-nairobi-blue to-blue-700 text-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
              Install MatPulse254
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {isIOS
                ? 'Add to Home Screen for a better experience'
                : 'Install our app for quick access and offline features'}
            </p>

            {isIOS ? (
              // iOS Instructions
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-bold">1.</span>
                  <p>Tap the Share button in Safari</p>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-bold">2.</span>
                  <p>Scroll and tap "Add to Home Screen"</p>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-bold">3.</span>
                  <p>Tap "Add" to confirm</p>
                </div>
              </div>
            ) : (
              // Android/Desktop Install Button
              <button
                onClick={handleInstallClick}
                className="w-full py-3 bg-gradient-to-r from-nairobi-blue to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                Install Now
              </button>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">⚡ Fast</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">📱 Native</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">🔒 Secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
