// src/mocks/browser.tsx
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create MSW worker with your request handlers
export const worker = setupWorker(...handlers);

// Initialize MSW only in development mode
export async function initMocks() {
  if (import.meta.env.DEV) {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js', // must exist in "public/"
        },
      });
      console.log('✅ MSW started in development mode');
    } catch (err) {
      console.error('❌ MSW failed to start', err);
    }
  }
}
