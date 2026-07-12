export const ROLES = {
  ADMIN: "Admin",
  FLEET_MANAGER: "Fleet Manager",
  DISPATCHER: "Dispatcher",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.FLEET_MANAGER]: "Fleet Manager",
  [ROLES.DISPATCHER]: "Dispatcher",
  [ROLES.SAFETY_OFFICER]: "Safety Officer",
  [ROLES.FINANCIAL_ANALYST]: "Financial Analyst",
};

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const VEHICLE_STATUS = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired",
};

export const VEHICLE_STATUS_LABELS = {
  [VEHICLE_STATUS.AVAILABLE]: "Available",
  [VEHICLE_STATUS.ON_TRIP]: "On Trip",
  [VEHICLE_STATUS.IN_SHOP]: "In Shop",
  [VEHICLE_STATUS.RETIRED]: "Retired",
};

export const VEHICLE_TYPES = [
  "Van",
  "Truck",
  "Mini Truck",
  "Trailer",
  "Pickup",
];

export const DRIVER_STATUS = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended",
};

export const DRIVER_STATUS_LABELS = {
  [DRIVER_STATUS.AVAILABLE]: "Available",
  [DRIVER_STATUS.ON_TRIP]: "On Trip",
  [DRIVER_STATUS.OFF_DUTY]: "Off Duty",
  [DRIVER_STATUS.SUSPENDED]: "Suspended",
};

export const LICENSE_CATEGORIES = ["LMV", "HMV", "MCWG", "Transport"];

export const TRIP_STATUS = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const TRIP_STATUS_LABELS = {
  [TRIP_STATUS.DRAFT]: "Draft",
  [TRIP_STATUS.DISPATCHED]: "Dispatched",
  [TRIP_STATUS.COMPLETED]: "Completed",
  [TRIP_STATUS.CANCELLED]: "Cancelled",
};

export const MAINTENANCE_STATUS = {
  OPEN: "Open",
  CLOSED: "Closed",
};

export const MAINTENANCE_STATUS_LABELS = {
  [MAINTENANCE_STATUS.OPEN]: "Open",
  [MAINTENANCE_STATUS.CLOSED]: "Closed",
};

export const EXPENSE_CATEGORIES = [
  "Maintenance",
  "Toll",
  "Parking",
  "Other",
];

export const REGIONS = [
  "Gandhinagar",
  "Ahmedabad",
  "Vatva",
  "Sanand",
  "Mansa",
  "Kalol",
];

export const SERVICE_TYPES = [
  "Oil Change",
  "Tyre Replace",
  "Engine Repair",
  "Brake Service",
  "AC Service",
  "Battery Replace",
  "Inspection",
  "Other",
];

export const STALE_TIME = {
  SHORT: 30 * 1000, // 30s — fast-changing data (dashboard KPIs)
  DEFAULT: 2 * 60 * 1000, // 2 min — standard
  LONG: 10 * 60 * 1000, // 10 min — rarely changes (reference data)
};

export const CURRENCY = "INR";
