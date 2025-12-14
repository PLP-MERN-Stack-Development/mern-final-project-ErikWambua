// Service Worker registration for Progressive Web App (PWA)
// This enables offline functionality and faster loading

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost
        navigator.serviceWorker.ready.then(() => {
          console.log(
            '🔧 This web app is being served cache-first by a service worker. ' +
              'To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        // Service worker is waiting to activate, reload the page
        window.location.reload();
      }
    });

    // Listen for controller change (new service worker activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 New service worker activated');
      if (config && config.onControllerChange) {
        config.onControllerChange();
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('✅ Service Worker registered:', registration.scope);

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                '🆕 New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }

              // Show update notification
              showUpdateNotification(registration);
            } else {
              // At this point, everything has been precached.
              console.log('✅ Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('❌ Error during service worker registration:', error);
      if (config && config.onError) {
        config.onError(error);
      }
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        console.log('❌ Service worker not found. Reloading page.');
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        '📡 No internet connection found. App is running in offline mode.'
      );
      if (config && config.onOffline) {
        config.onOffline();
      }
    });
}

function showUpdateNotification(registration) {
  // Create a custom notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1E40AF;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 350px;
    animation: slideIn 0.3s ease-out;
  `;

  notification.innerHTML = `
    <div style="flex: 1;">
      <div style="font-weight: 600; margin-bottom: 4px;">Update Available</div>
      <div style="font-size: 14px; opacity: 0.9;">A new version is ready. Refresh to update.</div>
    </div>
    <button id="sw-update-btn" style="
      background: white;
      color: #1E40AF;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    ">Refresh</button>
    <button id="sw-dismiss-btn" style="
      background: transparent;
      color: white;
      border: none;
      padding: 8px;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
    ">&times;</button>
  `;

  document.body.appendChild(notification);

  // Handle refresh button
  document.getElementById('sw-update-btn').addEventListener('click', () => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  });

  // Handle dismiss button
  document.getElementById('sw-dismiss-btn').addEventListener('click', () => {
    notification.remove();
  });

  // Add slideIn animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('🔓 Service Worker unregistered');
      })
      .catch((error) => {
        console.error('❌ Error unregistering service worker:', error.message);
      });
  }
}

// Export helper to check if app is running as PWA
export function isPWA() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

// Export helper to prompt PWA install
export function promptPWAInstall() {
  // This will be set by beforeinstallprompt event listener in the app
  return window.deferredPrompt;
}