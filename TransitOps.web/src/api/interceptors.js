import api from "./axios";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = new Error(error.response?.data?.message || error.message);
    
    if (error.response?.data?.errors?.length) {
      customError.message = error.response.data.errors.map(e => e.msg).join(', ');
    }

    if (error.response?.status === 401) {
      authService.clearSession();
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.href = ROUTES.LOGIN;
      }
    }
    return Promise.reject(customError);
  },
);

export default api;
