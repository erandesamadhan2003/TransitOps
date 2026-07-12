import { storageService } from "./storage.service";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const authService = {
  setToken(token) {
    storageService.set(TOKEN_KEY, token);
  },

  getToken() {
    return storageService.get(TOKEN_KEY);
  },

  setUser(user) {
    storageService.set(USER_KEY, user);
  },

  getUser() {
    return storageService.get(USER_KEY);
  },

  isAuthenticated() {
    return Boolean(authService.getToken());
  },

  setSession({ token, user }) {
    authService.setToken(token);
    authService.setUser(user);
  },

  clearSession() {
    storageService.remove(TOKEN_KEY);
    storageService.remove(USER_KEY);
  },
};
