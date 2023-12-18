import { PropsWithChildren } from "react";

import { ButtonHTMLAttributes, MouseEventHandler } from "react";

export type ButtonSizes = "sm" | "md" | "lg";

export type ButtonVariants = "primary" | "outlined";

export type ButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  size?: ButtonSizes;
  variant?: ButtonVariants;
  loading?: boolean;
  title?: string;
};

export const Button = ({
  children,
  onClick,
  size = "md",
  variant = "primary",
  type = "button",
  title,
  loading,
}: PropsWithChildren<ButtonProps>) => {
  const classNameBySize: { [key in ButtonSizes]: string } = {
    sm: "px-4 py-1",
    md: "px-5 py-2",
    lg: "px-6 py-4",
  };

  const classNameByVariant: { [key in ButtonVariants]: string } = {
    primary: "bg-gray-800 hover:bg-gray-900 text-white active:bg-gray-950",
    outlined:
      "bg-white text-gray-900 outline outline-1 outline-gray-800 hover:bg-gray-800 hover:outline-0 hover:text-white active:bg-gray-900 active:text-white active:outline-0",
  };

  const classNameLoadingByVariant: { [key in ButtonVariants]: string } = {
    primary: "border-white border-r-gray-500",
    outlined: "border-gray-500 border-r-gray-800",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`transition-colors ease-linear duration-200 font-semibold rounded flex gap-1 items-center justify-center ${
        classNameByVariant[variant]
      } ${classNameBySize[size]} ${loading ? "pointer-events-none" : ""}`}
      title={title}
    >
      {loading ? (
        <div
          role="status"
          className={`w-6 h-6 rounded-full animate-spin border ${classNameLoadingByVariant[variant]}`}
        ></div>
      ) : (
        children
      )}
    </button>
  );
};
