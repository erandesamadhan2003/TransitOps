/**
 * app.js
 *
 * App-wide enumerations and configuration.
 * Add to these as the backend schema is confirmed.
 */

// ── Roles ─────────────────────────────────────────────────────────────────────
// Update to match your backend's role names exactly.
export const ROLES = {
  ADMIN:         'admin',
  FLEET_MANAGER: 'fleet_manager',
  DRIVER:        'driver',
}

// ── Query Stale Times (ms) ────────────────────────────────────────────────────
export const STALE = {
  SHORT:  1000 * 60,      // 1 min  — frequently-changing data
  MEDIUM: 1000 * 60 * 5,  // 5 min  — standard
  LONG:   1000 * 60 * 30, // 30 min — rarely changes
}

// ── Add domain-specific enums below as you build features ─────────────────────
// Example:
// export const VEHICLE_STATUS = { ACTIVE: 'active', ... }
// export const TRIP_STATUS    = { SCHEDULED: 'scheduled', ... }
