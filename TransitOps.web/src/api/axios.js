/**
 * Axios instance for TransitOps API.
 * Interceptors are registered in interceptors.js.
 */
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
