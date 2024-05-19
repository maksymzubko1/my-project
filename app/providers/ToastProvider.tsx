import React, { useCallback, useEffect, useState } from "react";
import { ToastContext, ToastProps, TToastPosition } from "~/contexts/ToastContext";
import ToastContainer from "~/components/Toast/ToastContainer";

interface ToastProviderProps {
  children: React.ReactNode;
  closeAfter?: ToastProps['closeAfter']
  position?: TToastPosition;
}

export const ToastProvider = ({ children, closeAfter, position }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [idCounter, setIdCounter] = useState(0);
  const [closeAfterValue] = useState<ToastProps['closeAfter']>(closeAfter || 5000);
  const [positionValue] = useState<TToastPosition>(position || 'bottom-right');

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => {
      const toast = prevToasts.find(toast => toast.id === id);
      if (toast && toast.timerId) {
        clearTimeout(toast.timerId);
      }
      return prevToasts.filter(toast => toast.id !== id);
    });
  }, []);

  const addToast = useCallback(({variant, closeAfter: closeAfterProp, message}: Omit<ToastProps, "id">) => {
    const id = idCounter;
    const closeAfter = closeAfterProp ?? closeAfterValue;

    setIdCounter(prevId => prevId + 1);

    const timerId = window.setTimeout(() => removeToast(id), closeAfter || 5000);

    setToasts(prevToasts => [...prevToasts, { id, closeAfter, message, variant, timerId}]);
  }, [idCounter]);

  useEffect(() => {
  //   TODO: queue for toasts
  }, []);

  return (
    <ToastContext.Provider value={{ position: positionValue, toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};