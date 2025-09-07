import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW with all handlers
export const worker = setupWorker(...handlers);

// Initialize MSW in development mode
export const initMocks = async () => {
  if (import.meta.env.DEV) {
    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js'
      }
    });
  }
};
