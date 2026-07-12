import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "./api";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks";

/**
 * @param {object} [options]
 * @param {function} [options.onAccountLocked] - called with `retryAfterSeconds`
 *   when the backend signals a locked account (HTTP 423 or a specific message).
 */
export function useLogin({ onAccountLocked } = {}) {
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ token, user }) => {
      const mappedUser = {
        ...user,
        name: user.fullName,
        role: user.roleName,
      };
      authService.setSession({ token, user: mappedUser });
      navigate(ROUTES.DASHBOARD, { replace: true });
    },
    onError: (err) => {
      // Detect account-locked response: HTTP 423 or message contains "locked"
      const isLocked =
        err?.status === 423 ||
        err?.response?.status === 423 ||
        /locked/i.test(err?.message ?? "");

      if (isLocked && typeof onAccountLocked === "function") {
        // Backend may send retry-after in seconds via response data
        const retryAfter =
          err?.response?.data?.retryAfter ??
          err?.response?.data?.retryAfterSeconds ??
          300; // default 5 min if not provided
        onAccountLocked(retryAfter);
      } else {
        toast.error(err.message || "Invalid email or password.");
      }
    },
  });
}
