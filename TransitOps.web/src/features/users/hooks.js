import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "./api";
import { useToast } from "@/hooks";
import { STALE_TIME } from "@/constants/app";

export function useUsers(params = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => usersApi.getAll(params),
    staleTime: STALE_TIME.DEFAULT,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully.");
    },
    onError: (err) => toast.error(err.message || "Could not create user."),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, payload }) => usersApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully.");
    },
    onError: (err) => toast.error(err.message || "Could not update user."),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully.");
    },
    onError: (err) => toast.error(err.message || "Could not delete user."),
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: usersApi.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deactivated.");
    },
    onError: (err) => toast.error(err.message || "Could not deactivate user."),
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: usersApi.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User activated.");
    },
    onError: (err) => toast.error(err.message || "Could not activate user."),
  });
}

export function useChangePassword() {
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, payload }) => usersApi.changePassword(id, payload),
    onSuccess: () => toast.success("Password updated successfully."),
    onError: (err) => toast.error(err.message || "Could not change password."),
  });
}

export function useImportUsers() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: usersApi.importUsers,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`Import successful: ${data.importedCount} users added.`);
    },
    onError: (err) => toast.error(err.message || "Could not import users."),
  });
}
