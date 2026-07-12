import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes — data considered fresh
      gcTime: 1000 * 60 * 5, // 5 minutes — cache garbage collection
      retry: 1, // one retry on failure
      refetchOnWindowFocus: false, // disable aggressive background refetch
    },
    mutations: {
      onError: (error) => {
        console.error(
          "[mutation error]",
          error?.response?.data ?? error.message,
        );
      },
    },
  },
});
