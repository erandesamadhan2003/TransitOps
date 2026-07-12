import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vehiclesApi } from "./api";
import { useToast } from "@/hooks";
import { STALE_TIME } from "@/constants/app";

export function useVehicles(params = {}) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => vehiclesApi.getAll(params),
    staleTime: STALE_TIME.DEFAULT,
  });
}

export function useDispatchableVehicles(enabled = true) {
  return useQuery({
    queryKey: ["vehicles", "dispatchable"],
    queryFn: vehiclesApi.getDispatchable,
    staleTime: STALE_TIME.SHORT,
    enabled,
  });
}

export function useVehicle(id) {
  return useQuery({
    queryKey: ["vehicles", id],
    queryFn: () => vehiclesApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: vehiclesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      toast.success("Vehicle added to the fleet.");
    },
    onError: (err) => toast.error(err.message || "Could not add the vehicle."),
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, payload }) => vehiclesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      toast.success("Vehicle updated.");
    },
    onError: (err) =>
      toast.error(err.message || "Could not update the vehicle."),
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: vehiclesApi.retire,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      toast.success("Vehicle retired.");
    },
    onError: (err) =>
      toast.error(err.message || "Could not remove the vehicle."),
  });
}

export function useVerifyVehicle() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: vehiclesApi.verify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle verified.");
    },
    onError: (err) =>
      toast.error(err.message || "Could not verify the vehicle."),
  });
}

export function useVehicleDocuments(id) {
  return useQuery({
    queryKey: ["vehicles", id, "documents"],
    queryFn: () => vehiclesApi.getDocuments(id),
    enabled: Boolean(id),
  });
}

export function useUploadVehicleDocument() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: vehiclesApi.uploadDocument,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles", variables.id, "documents"] });
      toast.success("Document uploaded successfully.");
    },
    onError: (err) => toast.error(err.message || "Could not upload document."),
  });
}

export function useDeleteVehicleDocument() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: vehiclesApi.deleteDocument,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles", variables.id, "documents"] });
      toast.success("Document deleted.");
    },
    onError: (err) => toast.error(err.message || "Could not delete document."),
  });
}

export function useVerifyVehicleDocument() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: vehiclesApi.verifyDocument,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles", variables.id, "documents"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success(variables.isVerified ? "Document verified." : "Document unverified.");
    },
    onError: (err) => toast.error(err.message || "Could not update document verification."),
  });
}
