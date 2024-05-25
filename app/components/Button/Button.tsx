import React from "react";
import { Link } from "@remix-run/react";
import Spinner from "~/components/Spinner/Spinner";

interface ButtonProps {
  isSubmit?: boolean;
  variant: "primary" | "secondary" | "secondary-2" | "destructive" | "plain";
  children: React.ReactNode;
  onClick?: () => void;
  link?: {
    to: string;
    search?: string;
  };
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  formMethod?: "post" | "put" | "delete" | "get";
}

const buttonStyles = {
  primary: "text-white hover:bg-blue-600 bg-blue-500 disabled:opacity-25 disabled:transform-none disabled:pointer-events-none",
  secondary: "text-blue-700 hover:bg-blue-50 bg-white disabled:opacity-25 disabled:transform-none disabled:pointer-events-none",
  destructive: "text-white hover:bg-red-400 bg-red-500 disabled:opacity-25 disabled:transform-none disabled:pointer-events-none",
  plain: "text-blue-700 disabled:opacity-25 disabled:transform-none disabled:pointer-events-none",
  "secondary-2": "bg-slate-600 text-blue-100 hover:bg-blue-500 active:bg-blue-600 disabled:opacity-25 disabled:transform-none disabled:pointer-events-none"
};

const Button = ({
                  isSubmit,
                  formMethod,
                  children,
                  variant,
                  onClick,
                  link,
                  fullWidth,
                  loading,
                  disabled
                }: ButtonProps) => {
  if (link) {
    return (
      <Link
        to={{
          pathname: link.to,
          search: link.search || undefined
        }}
        className={`${fullWidth ? "w-full" : ""} transition-all flex items-center justify-center rounded-md border border-transparent px-4 py-3 text-base font-medium shadow-sm sm:px-8 ${buttonStyles[variant]}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      formMethod={formMethod}
      type={isSubmit ? "submit" : "button"}
      onClick={() => onClick?.()}
      disabled={loading || disabled}
      className={`${fullWidth ? "w-full" : ""} transition-all rounded px-4 py-2 ${buttonStyles[variant]}`}
    >
      {loading ?
        <span className="flex justify-center">
          <Spinner size={"medium"} />
        </span>
        : children}
    </button>
  );
};

export default Button;