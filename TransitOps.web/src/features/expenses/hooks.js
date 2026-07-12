import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expensesApi } from "./api";
import { useToast } from "@/hooks";
import { STALE_TIME } from "@/constants/app";

export function useFuelLogs(params = {}) {
  return useQuery({
    queryKey: ["fuel-logs", params],
    queryFn: () => expensesApi.getFuelLogs(params),
    staleTime: STALE_TIME.DEFAULT,
  });
}

export function useExpenses(params = {}) {
  return useQuery({
    queryKey: ["expenses", params],
    queryFn: () => expensesApi.getExpenses(params),
    staleTime: STALE_TIME.DEFAULT,
  });
}

export function useCreateFuelLog() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: expensesApi.createFuelLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-logs"] });
      toast.success("Fuel log added.");
    },
    onError: (err) => toast.error(err.message || "Could not add fuel log."),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: expensesApi.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense recorded.");
    },
    onError: (err) => toast.error(err.message || "Could not record expense."),
  });
}

export function useDeleteFuelLog() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: expensesApi.deleteFuelLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-logs"] });
      toast.success("Fuel log removed.");
    },
    onError: (err) => toast.error(err.message || "Could not remove fuel log."),
  });
}
