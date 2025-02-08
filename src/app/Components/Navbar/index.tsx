"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";

import { Menu, Moon, Sun, Search, Settings } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const modoOscuro = useAppSelector((state) => state.global.isDarkMode); 

 
  const handleDarkModeToggle = () => {
    const newMode = !modoOscuro;
    dispatch(setIsDarkMode(newMode));

    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", newMode.toString());
    }
  };

  return (
    <div className="w-full flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      {/* Left Section - Sidebar Toggle & Search Bar */}
      <div className="flex items-center gap-8">
        {!isSidebarCollapsed ? null : (
          <button onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}

        {/* 🔹 Search Bar with Proper Alignment */}
        <div className="relative flex h-min w-[300px] ml-6">
          <Search className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
          <input
            className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 
              focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
            type="search"
            placeholder="Buscar..."
          />
        </div>
      </div>

      {/* Right Section - Dark Mode Toggle & Settings */}
      <div className="flex items-center">
        {/* 🔹 Dark Mode Toggle */}
        <button
          onClick={handleDarkModeToggle}
          className={modoOscuro 
            ? "rounded p-2 dark:hover:bg-gray-700" 
            : "rounded p-2 hover:bg-gray-100"}
        >
          {modoOscuro ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
          )}
        </button>

        {/* 🔹 Settings Link */}
        <Link 
          href="/ajustes"
          className={modoOscuro 
            ? "h-min w-min rounded p-2 dark:hover:bg-gray-700" 
            : "h-min w-min rounded p-2 hover:bg-gray-100"}
        > 
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
        </Link>

        {/* 🔹 Vertical Divider */}
        <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
      </div>
    </div>
  );
};

export default Navbar;

