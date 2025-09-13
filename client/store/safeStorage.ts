import { createJSONStorage } from 'zustand/middleware';

// Gracefully handle environments where localStorage is unavailable or blocked
function getSafeStorage(): Storage {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const k = '__zk_safe__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return window.localStorage;
    }
  } catch {
    // fallthrough to memory storage
  }
  // Minimal in-memory storage polyfill
  const mem = new Map<string, string>();
  return {
    getItem: (key: string) => (mem.has(key) ? mem.get(key)! : null),
    setItem: (key: string, value: string) => {
      mem.set(key, value);
    },
    removeItem: (key: string) => {
      mem.delete(key);
    },
    clear: () => mem.clear(),
    key: (index: number) => Array.from(mem.keys())[index] ?? null,
    get length() {
      return mem.size;
    },
  } as Storage;
}

export const createSafeJSONStorage = () => createJSONStorage(() => getSafeStorage());