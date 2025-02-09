import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`border p-2 rounded w-full bg-white text-black dark:bg-gray-800 dark:text-white ${className}`}
      {...props}
    />
  );
}