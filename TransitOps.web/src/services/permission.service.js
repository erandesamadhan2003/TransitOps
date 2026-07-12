import { ROLES } from "@/constants/app";
import { authService } from "./auth.service";

const PERMISSION_MATRIX = {
  [ROLES.FLEET_MANAGER]: {
    fleet: "edit",
    drivers: "edit",
    trips: "none",
    fuelExpenses: "none",
    analytics: "edit",
  },
  [ROLES.DISPATCHER]: {
    fleet: "view",
    drivers: "none",
    trips: "edit",
    fuelExpenses: "none",
    analytics: "none",
  },
  [ROLES.SAFETY_OFFICER]: {
    fleet: "none",
    drivers: "edit",
    trips: "view",
    fuelExpenses: "none",
    analytics: "none",
  },
  [ROLES.FINANCIAL_ANALYST]: {
    fleet: "view",
    drivers: "none",
    trips: "none",
    fuelExpenses: "edit",
    analytics: "edit",
  },
};

export const permissionService = {
  hasRole(...roles) {
    const user = authService.getUser();
    if (!user?.role) return false;
    return roles.includes(user.role);
  },

  levelFor(module) {
    const user = authService.getUser();
    if (!user?.role) return "none";
    return PERMISSION_MATRIX[user.role]?.[module] ?? "none";
  },

  can(module, action = "view") {
    const level = this.levelFor(module);
    if (level === "none") return false;
    if (action === "view") return level === "view" || level === "edit";
    return level === "edit";
  },

  matrix() {
    return PERMISSION_MATRIX;
  },
};
