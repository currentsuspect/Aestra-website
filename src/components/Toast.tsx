import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";
import { cn } from "../lib";

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, opts?: { description?: string; variant?: ToastVariant; duration?: number }) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

const variantStyles: Record<ToastVariant, { ring: string; icon: string; Icon: React.ComponentType<{ className?: string }> }> = {
  success: { ring: "ring-emerald-500/20", icon: "text-emerald-400", Icon: Check },
  error:   { ring: "ring-rose-500/20",    icon: "text-rose-400",    Icon: AlertCircle },
  info:    { ring: "ring-violet-500/20",  icon: "text-violet-400",  Icon: Info },
};

const DEFAULT_DURATION = 4000;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const timers = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) {
      window.clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>((message, opts) => {
    const id = ++idRef.current;
    const next: Toast = {
      id,
      message,
      description: opts?.description,
      variant: opts?.variant ?? "info",
    };
    setToasts((prev) => [...prev, next]);
    const duration = opts?.duration ?? DEFAULT_DURATION;
    const handle = window.setTimeout(() => dismiss(id), duration);
    timers.current.set(id, handle);
  }, [dismiss]);

  const value: ToastContextValue = {
    toast,
    success: (m, d) => toast(m, { description: d, variant: "success" }),
    error:   (m, d) => toast(m, { description: d, variant: "error" }),
    info:    (m, d) => toast(m, { description: d, variant: "info" }),
  };

  useEffect(() => () => {
    timers.current.forEach((handle) => window.clearTimeout(handle));
    timers.current.clear();
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))] pointer-events-none"
      >
        {toasts.map((t) => {
          const { ring, icon, Icon } = variantStyles[t.variant];
          return (
            <div
              key={t.id}
              role={t.variant === "error" ? "alert" : "status"}
              className={cn(
                "pointer-events-auto toast-enter rounded-lg border border-border/80 bg-bg/95 backdrop-blur shadow-lg ring-1",
                ring,
                "p-3.5 pr-9 flex items-start gap-3 relative"
              )}
            >
              <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", icon)} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="text-fg text-sm font-medium leading-snug">{t.message}</div>
                {t.description && (
                  <div className="text-muted text-xs mt-0.5 leading-snug">{t.description}</div>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center text-muted hover:text-fg hover:bg-surface-2 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
