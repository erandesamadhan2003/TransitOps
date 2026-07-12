import { createContext, useCallback, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";

export const ToastContext = createContext(null);

const TONE = {
  success: {
    icon: CheckCircle2,
    border: "border-status-resolved-border",
    text: "text-status-resolved-fg",
  },
  error: {
    icon: XCircle,
    border: "border-priority-critical-border",
    text: "text-priority-critical-fg",
  },
  info: {
    icon: Info,
    border: "border-status-open-border",
    text: "text-status-open-fg",
  },
};

const AUTO_DISMISS_MS = 4500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (type, message) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, message }]);
      const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const api = {
    success: (message) => push("success", message),
    error: (message) => push("error", message),
    info: (message) => push("info", message),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const tone = TONE[t.type] ?? TONE.info;
          const Icon = tone.icon;
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "animate-toast-in flex items-start gap-2.5 rounded-lg border bg-white px-4 py-3",
                "shadow-glass",
                tone.border,
              )}
            >
              <Icon size={18} className={cn("mt-0.5 shrink-0", tone.text)} />
              <p className="flex-1 text-sm font-medium text-text-primary">
                {t.message}
              </p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded p-0.5 text-text-tertiary hover:text-text-secondary"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
