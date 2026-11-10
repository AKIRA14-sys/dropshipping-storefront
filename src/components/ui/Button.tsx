import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "dark" | "outline";
  children: ReactNode;
}

export function Button({ variant = "dark", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`button ${variant === "dark" ? "button-dark" : "button-outline"} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
