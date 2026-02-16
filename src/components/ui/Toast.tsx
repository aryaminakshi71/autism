import { cn } from "~/lib/utils";

interface ToastProps {
  id: string | number;
  title?: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: (id: string | number) => void;
}

const toastStyles = {
  success:
    "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100",
  error:
    "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100",
  warning:
    "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-100",
  info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100",
};

const iconStyles = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

export function Toast({
  id,
  title,
  description,
  type = "info",
  duration = 4000,
  onClose,
}: ToastProps) {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <div
      className={cn(
        "flex max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg",
        toastStyles[type],
      )}
      role="alert"
    >
      <span className="text-lg">{iconStyles[type]}</span>
      <div className="flex-1">
        {title && <h4 className="font-semibold">{title}</h4>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={() => onClose?.(id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}

const toastContext = React.createContext<{
  show: (props: Omit<ToastProps, "id">) => string | number;
  hide: (id: string | number) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<
    (ToastProps & { id: string | number })[]
  >([]);
  const idCounter = React.useRef(0);

  const show = React.useCallback((props: Omit<ToastProps, "id">) => {
    const id = ++idCounter.current;
    setToasts((prev) => [...prev, { ...props, id }]);
    return id;
  }, []);

  const hide = React.useCallback((id: string | number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <toastContext.Provider value={{ show, hide }}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={hide} />
          </div>
        ))}
      </div>
    </toastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(toastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function showSuccess(message: string, title?: string) {
  return { message, title, type: "success" as const, duration: 4000 };
}

export function showError(message: string, title?: string) {
  return { message, title, type: "error" as const, duration: 5000 };
}

export function showWarning(message: string, title?: string) {
  return { message, title, type: "warning" as const, duration: 4000 };
}

export function showInfo(message: string, title?: string) {
  return { message, title, type: "info" as const, duration: 4000 };
}

import React from "react";
