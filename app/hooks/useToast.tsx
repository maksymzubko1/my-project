import { useContext, useEffect } from "react";

import { ToastContext } from "~/contexts/ToastContext";

export const useToast = (actionData?: any) => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  useEffect(() => {
    if (actionData) {
      if (actionData.status === "success" && actionData.message) {
        context.addToast({ message: actionData.message, variant: "success" });
      } else if (actionData.status === "error" && actionData.message) {
        context.addToast({
          message: `Error: ${actionData.message}`,
          variant: "error",
        });
      }
    }
  }, [actionData]);

  return context;
};
