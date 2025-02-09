import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 dark:text-gray-400">✖</button>
        {children}
      </div>
    </div>
  );
}
