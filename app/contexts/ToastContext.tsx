import { createContext } from "react";

import { Toast } from "~/components/Toast/Toast";

export interface ToastProps extends Omit<Toast, "onClick"> {
  id: number;
  closeAfter?: number;
  timerId: number;
}

export type TToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-left"
  | "bottom-right";

interface ToastContextProps {
  toasts: ToastProps[];
  position: TToastPosition;
  addToast: ({
    variant,
    closeAfter,
    message,
  }: Omit<ToastProps, "id" | "timerId">) => void;
  removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextProps | undefined>(
  undefined,
);
