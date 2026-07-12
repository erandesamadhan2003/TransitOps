/**
 * auth.service.js
 *
 * Stateful auth helpers: token storage, session management.
 * Used by interceptors.js (request attachment) and features/auth (login/logout).
 */
import { storageService } from './storage.service'

const TOKEN_KEY = 'auth_token'
const USER_KEY  = 'auth_user'

export const authService = {
  /**
   * Persist token after successful login.
   * @param {string} token
   */
  setToken(token) {
    storageService.set(TOKEN_KEY, token)
  },

  /**
   * Retrieve the stored access token (or null if not logged in).
   * @returns {string | null}
   */
  getToken() {
    return storageService.get(TOKEN_KEY)
  },

  /**
   * Persist the authenticated user object.
   * @param {Record<string, unknown>} user
   */
  setUser(user) {
    storageService.set(USER_KEY, user)
  },

  /**
   * Retrieve the persisted user object.
   * @returns {Record<string, unknown> | null}
   */
  getUser() {
    return storageService.get(USER_KEY)
  },

  /**
   * True if a token exists in storage.
   * @returns {boolean}
   */
  isAuthenticated() {
    return Boolean(authService.getToken())
  },

  /**
   * Clear token + user — call on logout or 401.
   */
  clearSession() {
    storageService.remove(TOKEN_KEY)
    storageService.remove(USER_KEY)
  },
}
