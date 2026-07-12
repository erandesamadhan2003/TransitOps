import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { ROUTES } from "@/constants/routes";
import { Loader } from "@/components/common";
import NotFoundPage from "@/pages/NotFoundPage";
import LandingPage from "@/pages/LandingPage";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage"),
);
const VehiclesPage = lazy(
  () => import("@/features/vehicles/pages/VehiclesPage"),
);
const DriversPage = lazy(() => import("@/features/drivers/pages/DriversPage"));
const TripsPage = lazy(() => import("@/features/trips/pages/TripsPage"));
const MaintenancePage = lazy(
  () => import("@/features/maintenance/pages/MaintenancePage"),
);
const ExpensesPage = lazy(
  () => import("@/features/expenses/pages/ExpensesPage"),
);
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));
const SettingsPage = lazy(
  () => import("@/features/settings/pages/SettingsPage"),
);

function PageFallback() {
  return <Loader fullHeight label="Loading page…" />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route index element={<LandingPage />} />

          <Route element={<PublicRoute />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.VEHICLES} element={<VehiclesPage />} />
            <Route path={ROUTES.DRIVERS} element={<DriversPage />} />
            <Route path={ROUTES.TRIPS} element={<TripsPage />} />
            <Route path={ROUTES.MAINTENANCE} element={<MaintenancePage />} />
            <Route path={ROUTES.EXPENSES} element={<ExpensesPage />} />
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
