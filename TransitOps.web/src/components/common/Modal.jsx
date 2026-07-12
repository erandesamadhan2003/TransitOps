import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

const SIZE_MAP = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = "md",
  className,
  children,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {}
      <div
        className="absolute inset-0 bg-ink-900/40 animate-[fade-in_150ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      {}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "relative w-full glass-elevated p-6 outline-none",
          "animate-[modal-in_160ms_ease-out]",
          SIZE_MAP[size],
          className,
        )}
        style={{
          animation: "modal-in 160ms ease-out",
        }}
      >
        {title && (
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-[18px] font-bold text-text-primary tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-text-secondary hover:bg-ink-50 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {description && <p className="mb-5 text-[13px] text-text-secondary">{description}</p>}
        {(!description && title) && <div className="mb-5" />}
        {children}
        {footer && (
          <div className="mt-6 flex items-center justify-end gap-3 pt-5 border-t border-border/60">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
