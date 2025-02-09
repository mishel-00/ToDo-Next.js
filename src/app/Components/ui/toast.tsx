

interface ToastProps {
    message: string;
    className?: string;
  }
  
  export function Toast({ message, className }: ToastProps) {
    return (
      <div className={`fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded shadow-md ${className}`}>
        {message}
      </div>
    );
  }
  