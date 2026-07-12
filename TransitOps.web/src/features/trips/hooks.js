import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tripsApi } from "./api";
import { useToast } from "@/hooks";
import { STALE_TIME } from "@/constants/app";

export function useTrips(params = {}) {
  return useQuery({
    queryKey: ["trips", params],
    queryFn: () => tripsApi.getAll(params),
    staleTime: STALE_TIME.DEFAULT,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: tripsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trip created as draft.");
    },
    onError: (err) => toast.error(err.message || "Could not create trip."),
  });
}

export function useDispatchTrip() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: tripsApi.dispatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      toast.success("Trip dispatched!");
    },
    onError: (err) => toast.error(err.message || "Could not dispatch trip."),
  });
}

export function useCompleteTrip() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, payload }) => tripsApi.complete(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      toast.success("Trip marked as completed.");
    },
    onError: (err) => toast.error(err.message || "Could not complete trip."),
  });
}

export function useCancelTrip() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: tripsApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      toast.success("Trip cancelled.");
    },
    onError: (err) => toast.error(err.message || "Could not cancel trip."),
  });
}
