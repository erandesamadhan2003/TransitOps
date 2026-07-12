const STORAGE_PREFIX = "transitops:";

function prefixed(key) {
  return `${STORAGE_PREFIX}${key}`;
}

export const storageService = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(prefixed(key));
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(prefixed(key), JSON.stringify(value));
    } catch {}
  },

  remove(key) {
    localStorage.removeItem(prefixed(key));
  },

  clear() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(STORAGE_PREFIX)) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  },
};
