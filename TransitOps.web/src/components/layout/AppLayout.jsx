import { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route as RouteIcon,
  Wrench,
  Fuel,
  BarChart3,
  Settings as SettingsIcon,
  UserCog,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Navbar, DesktopThemeToggle } from "./Navbar";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/auth.service";
import { permissionService } from "@/services/permission.service";
import { useTheme } from "@/hooks";

const ICON_SIZE = 18;

const NAV_DEFINITIONS = [
  {
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: <LayoutDashboard size={ICON_SIZE} />,
    module: null,
  },
  {
    label: "Fleet",
    path: ROUTES.VEHICLES,
    icon: <Truck size={ICON_SIZE} />,
    module: "fleet",
  },
  {
    label: "Drivers",
    path: ROUTES.DRIVERS,
    icon: <Users size={ICON_SIZE} />,
    module: "drivers",
  },
  {
    label: "Trips",
    path: ROUTES.TRIPS,
    icon: <RouteIcon size={ICON_SIZE} />,
    module: "trips",
  },
  {
    label: "Maintenance",
    path: ROUTES.MAINTENANCE,
    icon: <Wrench size={ICON_SIZE} />,
    module: "fleet",
  },
  {
    label: "Fuel & Expenses",
    path: ROUTES.EXPENSES,
    icon: <Fuel size={ICON_SIZE} />,
    module: "fuelExpenses",
  },
  {
    label: "Analytics",
    path: ROUTES.REPORTS,
    icon: <BarChart3 size={ICON_SIZE} />,
    module: "analytics",
  },
  {
    label: "Settings",
    path: ROUTES.SETTINGS,
    icon: <SettingsIcon size={ICON_SIZE} />,
    module: null,
  },
  {
    label: "Users",
    path: ROUTES.USERS,
    icon: <UserCog size={ICON_SIZE} />,
    module: null,
    adminOnly: true,
  },
];

export function AppLayout() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const { isDark, toggle: toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = useMemo(
    () =>
      NAV_DEFINITIONS.filter(
        (item) => {
          if (item.adminOnly && user?.roleName !== "Admin") return false;
          return item.module === null || permissionService.can(item.module, "view");
        }
      ),
    [user?.roleName],
  );

  function handleLogout() {
    authService.clearSession();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <div className="relative z-[1] min-h-screen md:pl-20">
      <Sidebar
        nav={nav}
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <DesktopThemeToggle isDark={isDark} onToggle={toggleTheme} />
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <Navbar
          nav={nav}
          user={user}
          onLogout={handleLogout}
          onMenuClick={() => setMobileOpen(true)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
        <main className="pb-10 pt-20 md:pt-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
