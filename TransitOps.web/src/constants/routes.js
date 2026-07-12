export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  VEHICLES: "/fleet",
  DRIVERS: "/drivers",
  TRIPS: "/trips",
  MAINTENANCE: "/maintenance",
  EXPENSES: "/fuel-expenses",
  REPORTS: "/analytics",
  SETTINGS: "/settings",
  USERS: "/users",
};

export function buildRoute(route, params = {}) {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, encodeURIComponent(value)),
    route,
  );
}
