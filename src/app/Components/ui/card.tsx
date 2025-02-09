import { ReactNode, forwardRef, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-black dark:text-white ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps {
  children: ReactNode;
}

export function CardHeader({ children }: CardHeaderProps) {
  return <div className="border-b pb-2 text-lg font-semibold">{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
}

export function CardTitle({ children }: CardTitleProps) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

interface CardContentProps {
  children: ReactNode;
}

export function CardContent({ children }: CardContentProps) {
  return <div className="mt-2">{children}</div>;
}
