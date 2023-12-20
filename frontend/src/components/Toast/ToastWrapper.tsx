"use client";

import { useToastStore } from "../../hooks/toastStore";
import { Toast } from "./Toast";

export const ToastWrapper = () => {
  const toast = useToastStore((state) => state.toast);
  const close = useToastStore((state) => state.close);

  return (
    <Toast
      open={Boolean(toast)}
      color={toast?.color}
      onClick={close}
      onOpenChange={(value) => {
        if (!value) close();
      }}
    >
      {toast?.children}
    </Toast>
  );
};
