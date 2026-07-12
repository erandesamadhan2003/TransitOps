import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "./api";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks";

export function useLogin() {
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
      toast.error(err.message || "Invalid email or password.");
    },
  });
}
