'use client';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed } from '@/state';
import {  ClipboardList, Home, LucideIcon, Search, Settings, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const SideBar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const sidebarClassNames = `fixed top-0 left-0 h-full transition-all duration-300 z-40 
    dark:bg-gray-800 bg-white overflow-y-auto shadow-xl
    ${isSidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-64 opacity-100'}
  `;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-full w-full flex-col justify-start">
        {/* 🔹 Sidebar Header */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-gray-800">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            Listas
          </div>
          {!isSidebarCollapsed && (
            <button
              className="py-3"
              onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>

        {/* 🔹 Profile Section */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Image src="/logo.png" alt="logo" width={80} height={80} className="rounded-full" />
          <div>
            <h3 className="text-xl font-bold tracking-wide text-gray-800 dark:text-gray-200">
              Mishel
            </h3>
            <div className="mt-1 flex items-start gap-2 text-gray-500 dark:text-gray-300">
              Online
            </div>
          </div>
        </div>

        {/* 🔹 Navigation Links */}
        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={ClipboardList} label="Proyectos" href="/proyectos" />
          <SidebarLink icon={Search} label="Buscar" href="/buscar" />
          <SidebarLink icon={Settings} label="Ajustes" href="/ajuste" />
        </nav>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors 
          hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 
          ${isActive ? "bg-gray-200 text-white dark:bg-gray-500" : ""}
          justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-[5px] bg-blue-400" />
        )}
        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {label}
        </span>
      </div>
    </Link>
  );
};

export default SideBar;


