import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "./api";
import { useToast } from "@/hooks";
import { STALE_TIME } from "@/constants/app";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.getGeneral,
    staleTime: STALE_TIME.LONG,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: settingsApi.updateGeneral,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved.");
    },
    onError: (err) => toast.error(err.message || "Could not save settings."),
  });
}
