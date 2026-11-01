import { createContext, useContext, useState, type ReactNode } from "react";

type ToastType = "success" | "error";
type Toast = { id: string; message: string; type: ToastType };

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(message: string, type: ToastType = "success") {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* The Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`bento shadow-neu-flat px-6 py-4 text-sm font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 ${
              t.type === "error" ? "text-red-500" : "text-ink"
            }`}
          >
            {t.type === "success" ? (
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-neu-sm" />
            ) : (
              <div className="h-2 w-2 rounded-full bg-red-500 shadow-neu-sm" />
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}