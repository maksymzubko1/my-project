import React from 'react';
import ToastComponent from "~/components/Toast/Toast";
import { ToastProps } from "~/contexts/ToastContext";
import { useToast } from "~/hooks/useToast";

interface ToastContainerProps {
  toasts: ToastProps[];
  removeToast: (id: number) => void;
}

const toastPositions = {
  'top-right': 'top-5 right-5',
  'top-left': 'top-5 left-5',
  'bottom-right': 'bottom-5 right-5',
  'bottom-left': 'bottom-5 left-5'
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  const {position} = useToast();
  return (
    <div className={`fixed ${toastPositions[position]} m-4 z-50`}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastProps;
  removeToast: (id: number) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, removeToast }) => {
  const { id, message, variant } = toast;
  return (
    <ToastComponent variant={variant} message={message} id={id} onClick={()=>removeToast(id)}/>
  );
};

export default ToastContainer;
