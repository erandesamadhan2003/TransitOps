/**
 * permission.service.js
 *
 * RBAC helper. Extend this as backend roles/permissions are finalized.
 *
 * Usage:
 *   import { permissionService } from '@/services/permission.service'
 *   permissionService.hasRole('admin', user)
 */

export const permissionService = {
  /**
   * True if the user has at least one of the given roles.
   * @param {string | string[]} roles
   * @param {{ role: string } | null} user
   * @returns {boolean}
   */
  hasRole(roles, user) {
    if (!user?.role) return false
    const list = Array.isArray(roles) ? roles : [roles]
    return list.includes(user.role)
  },

  /**
   * Generic permission check.
   * Extend this with a real permission map once backend roles are confirmed.
   *
   * @param {string} _resource - e.g. 'vehicles'
   * @param {string} _action   - e.g. 'delete'
   * @param {{ role: string } | null} user
   * @returns {boolean}
   */
  can(_resource, _action, user) {
    // Placeholder — wire up a real permission map once roles are confirmed
    return Boolean(user?.role)
  },
}
