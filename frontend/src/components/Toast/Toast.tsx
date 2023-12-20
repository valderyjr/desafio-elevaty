"use client";
import * as ToastRadix from "@radix-ui/react-toast";
import { ReactNode } from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";

export type ToastType = {
  children: ReactNode;
  color?: "success" | "error";
};

export type ToastProps = ToastType & ToastRadix.ToastProps;

export const Toast = ({
  children,
  color = "success",
  ...props
}: ToastProps) => {
  const classByColor = {
    success: "bg-green-600",
    error: "bg-red-600",
  }[color];
  return (
    <ToastRadix.Provider swipeDirection="right" duration={3000}>
      <ToastRadix.Root
        className={`${classByColor} text-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_close'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut`}
        {...props}
      >
        <ToastRadix.Title className="[grid-area:_title] font-semibold">
          {children}
        </ToastRadix.Title>
        <ToastRadix.Close className="[grid-area:_close]" asChild>
          <button className="w-4 h-4">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </ToastRadix.Close>
      </ToastRadix.Root>
      <ToastRadix.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </ToastRadix.Provider>
  );
};
