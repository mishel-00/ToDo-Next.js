import { cn } from "@/lib/utils";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
