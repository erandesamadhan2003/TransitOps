import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { RequirePermission } from "./RequirePermission";
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
            {/* Dashboard & Settings: no module restriction (all authenticated roles) */}
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />

            {/* Fleet — Safety Officer has fleet:none → redirected to /dashboard */}
            <Route
              path={ROUTES.VEHICLES}
              element={
                <RequirePermission module="fleet">
                  <VehiclesPage />
                </RequirePermission>
              }
            />

            {/* Maintenance lives under the "fleet" module in the RBAC matrix */}
            <Route
              path={ROUTES.MAINTENANCE}
              element={
                <RequirePermission module="fleet">
                  <MaintenancePage />
                </RequirePermission>
              }
            />

            {/* Drivers — Dispatcher & Financial Analyst have drivers:none */}
            <Route
              path={ROUTES.DRIVERS}
              element={
                <RequirePermission module="drivers">
                  <DriversPage />
                </RequirePermission>
              }
            />

            {/* Trips — Fleet Manager & Financial Analyst have trips:none */}
            <Route
              path={ROUTES.TRIPS}
              element={
                <RequirePermission module="trips">
                  <TripsPage />
                </RequirePermission>
              }
            />

            {/* Fuel & Expenses — Dispatcher & Safety Officer have fuelExpenses:none */}
            <Route
              path={ROUTES.EXPENSES}
              element={
                <RequirePermission module="fuelExpenses">
                  <ExpensesPage />
                </RequirePermission>
              }
            />

            {/* Analytics — Dispatcher & Safety Officer have analytics:none */}
            <Route
              path={ROUTES.REPORTS}
              element={
                <RequirePermission module="analytics">
                  <ReportsPage />
                </RequirePermission>
              }
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
