import { cn } from "@/lib/utils";

export function Button({ children, className, ...props }) {
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