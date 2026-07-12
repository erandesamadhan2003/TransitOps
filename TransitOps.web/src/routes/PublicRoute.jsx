import { Navigate, Outlet } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";

export function PublicRoute() {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
