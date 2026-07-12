import { QueryProvider, ToastProvider } from "@/providers";
import AppRouter from "@/routes/AppRouter";

export default function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </QueryProvider>
  );
}
