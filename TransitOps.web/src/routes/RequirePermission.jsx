import { Navigate } from "react-router-dom";
import { permissionService } from "@/services/permission.service";
import { ROUTES } from "@/constants/routes";

/**
 * Wraps a single route element and checks if the current user has at least
 * "view" access to `module`. If not, redirects to /dashboard.
 *
 * Usage in AppRouter:
 *   <Route path={ROUTES.DRIVERS}
 *     element={<RequirePermission module="drivers"><DriversPage /></RequirePermission>}
 *   />
 */
export function RequirePermission({ module, children }) {
  // module === null means "no restriction" (Dashboard, Settings)
  if (module !== null && !permissionService.can(module, "view")) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return children;
}
