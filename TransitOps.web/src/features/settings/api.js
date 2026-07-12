// Settings are purely local — no backend endpoint exists for this.
// We persist to localStorage to survive page refreshes without any API call.

const SETTINGS_KEY = "transitops_settings";

const DEFAULTS = {
  depotName: "City Transit Depot",
  currency: "INR",
  distanceUnit: "Kilometers",
};

export const settingsApi = {
  getGeneral: () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return Promise.resolve(stored ? JSON.parse(stored) : { ...DEFAULTS });
    } catch {
      return Promise.resolve({ ...DEFAULTS });
    }
  },

  updateGeneral: (payload) => {
    try {
      const merged = { ...DEFAULTS, ...payload };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      return Promise.resolve(merged);
    } catch {
      return Promise.reject(new Error("Could not save settings."));
    }
  },
};
