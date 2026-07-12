/**
 * Axios interceptors — registered once at app startup.
 *
 * Attach this to the shared axios instance by importing and calling
 * registerInterceptors(api) from main.jsx (before rendering).
 */
import { authService } from '@/services/auth.service'

/**
 * @param {import('axios').AxiosInstance} axiosInstance
 */
export function registerInterceptors(axiosInstance) {
  // ── Request: attach access token ──────────────────────────────────────────
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = authService.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // ── Response: handle 401 globally ─────────────────────────────────────────
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        authService.clearSession()
        // Redirect to login — avoids importing React Router here
        window.location.href = '/login'
      }
      return Promise.reject(error)
    },
  )
}
