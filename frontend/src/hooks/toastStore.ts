import { create } from "zustand";
import { ToastType } from "../components/Toast/Toast";

export const useToastStore = create<{
  toast?: ToastType;
  close: () => void;
  showToast: (value: ToastType) => void;
}>((set) => ({
  close: () => set(() => ({ toast: undefined })),
  showToast: (value) => set(() => ({ toast: value })),
  toast: undefined,
}));
