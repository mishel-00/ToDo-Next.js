import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return <table className="w-full border-collapse border bg-white dark:bg-gray-900 text-black dark:text-white">{children}</table>;
}

export function TableHead({ children }: TableProps) {
  return <thead className="bg-gray-200 dark:bg-gray-700">{children}</thead>;
}

export function TableHeader({ children }: TableProps) {
  return <th className="border p-2 text-black dark:text-white">{children}</th>;
}

export function TableBody({ children }: TableProps) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }: TableProps) {
  return <tr className="border bg-white dark:bg-gray-800 text-black dark:text-white">{children}</tr>;
}

export function TableCell({ children }: TableProps) {
  return <td className="border p-2 text-black dark:text-white">{children}</td>;
}