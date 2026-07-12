export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },

  DASHBOARD: {
    KPIS: "/dashboard/kpis",
    CHARTS: "/dashboard/charts",
    ANALYTICS: "/dashboard/analytics",
  },

  VEHICLES: {
    LIST: "/vehicles",
    DETAIL: (id) => `/vehicles/${id}`,
    CREATE: "/vehicles",
    UPDATE: (id) => `/vehicles/${id}`,
    RETIRE: (id) => `/vehicles/${id}/retire`,
  },

  DRIVERS: {
    LIST: "/drivers",
    DETAIL: (id) => `/drivers/${id}`,
    CREATE: "/drivers",
    UPDATE: (id) => `/drivers/${id}`,
    SAFETY_SCORE: (id) => `/drivers/${id}/safety-score`,
    SUSPEND: (id) => `/drivers/${id}/suspend`,
    REINSTATE: (id) => `/drivers/${id}/reinstate`,
  },

  TRIPS: {
    LIST: "/trips",
    DETAIL: (id) => `/trips/${id}`,
    CREATE: "/trips",
    DISPATCH: (id) => `/trips/${id}/dispatch`,
    COMPLETE: (id) => `/trips/${id}/complete`,
    CANCEL: (id) => `/trips/${id}/cancel`,
  },

  MAINTENANCE: {
    LIST: "/maintenance",
    DETAIL: (id) => `/maintenance/${id}`,
    CREATE: "/maintenance",
    CLOSE: (id) => `/maintenance/${id}/close`,
  },

  FUEL_LOGS: {
    LIST: "/fuel-logs",
    DETAIL: (id) => `/fuel-logs/${id}`,
    CREATE: "/fuel-logs",
    DELETE: (id) => `/fuel-logs/${id}`,
  },

  EXPENSES: {
    LIST: "/expenses",
    DETAIL: (id) => `/expenses/${id}`,
    CREATE: "/expenses",
    DELETE: (id) => `/expenses/${id}`,
  },

  USERS: {
    LIST: "/users",
    DETAIL: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    CHANGE_PASSWORD: (id) => `/users/${id}/password`,
    DEACTIVATE: (id) => `/users/${id}/deactivate`,
    ACTIVATE: (id) => `/users/${id}/activate`,
  },
};
