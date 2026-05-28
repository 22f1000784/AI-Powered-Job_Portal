import { useState, useEffect } from "react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const Toast = ({ id, message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
    </div>
  );
};

let toastContainerRef: { show: (message: string, type?: ToastType) => void } | null = null;

export const showToast = (message: string, type: ToastType = "info") => {
  if (toastContainerRef) {
    toastContainerRef.show(message, type);
  } else {
    // Fallback to console if not fully initialized
    console.log(`[Toast ${type}]: ${message}`);
  }
};

export const toast = {
  success: (msg: string) => showToast(msg, "success"),
  error: (msg: string) => showToast(msg, "error"),
  info: (msg: string) => showToast(msg, "info"),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType }[]>([]);

  useEffect(() => {
    toastContainerRef = {
      show: (message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
      },
    };
    return () => {
      toastContainerRef = null;
    };
  }, []);

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} id={t.id} message={t.message} type={t.type} onClose={handleClose} />
      ))}
    </div>
  );
};
export default toast;
