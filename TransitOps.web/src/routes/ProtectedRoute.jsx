import { Navigate, Outlet } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { AppLayout } from "@/components/layout";

export function ProtectedRoute() {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
