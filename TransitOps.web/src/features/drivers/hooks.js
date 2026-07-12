import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { driversApi } from "./api";
import { useToast } from "@/hooks";
import { STALE_TIME } from "@/constants/app";

export function useDrivers(params = {}) {
  return useQuery({
    queryKey: ["drivers", params],
    queryFn: () => driversApi.getAll(params),
    staleTime: STALE_TIME.DEFAULT,
  });
}

export function useDispatchableDrivers(enabled = true) {
  return useQuery({
    queryKey: ["drivers", "dispatchable"],
    queryFn: driversApi.getDispatchable,
    staleTime: STALE_TIME.SHORT,
    enabled,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: driversApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver added.");
    },
    onError: (err) => toast.error(err.message || "Could not add the driver."),
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, payload }) => driversApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver updated.");
    },
    onError: (err) =>
      toast.error(err.message || "Could not update the driver."),
  });
}

export function useSuspendDriver() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: driversApi.suspend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      toast.success("Driver suspended.");
    },
    onError: (err) =>
      toast.error(err.message || "Could not suspend driver."),
  });
}

export function useReinstateDriver() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: driversApi.reinstate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      toast.success("Driver reinstated.");
    },
    onError: (err) =>
      toast.error(err.message || "Could not reinstate driver."),
  });
}
