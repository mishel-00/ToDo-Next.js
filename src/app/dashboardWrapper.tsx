'use client'; 

import React, { useEffect } from 'react'
import Navbar from './Components/Navbar';
import SideBar from './Components/SideBar';
import StoreProvider, { useAppSelector } from './redux';

const DashboardLayout = ({ children } : {children: React.ReactNode}) => {
   const isSidebarCollapsed = useAppSelector(
     (state) => state.global.isSidebarCollapsed, 
   );
   const modoOscuro = useAppSelector ((state) => state.global.modoOscuro); 

   useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      document.documentElement.classList.toggle("dark", savedMode === "true");
    }
  }, []);
  
  useEffect(() => {
    if (modoOscuro !== undefined) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", modoOscuro?.toString() ?? "false");
    }
  }, [modoOscuro]);
  return (
    <div className="flex max-h-screen w-full bg-gray-50 text-gray-900 dark:bg-black">

  <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-0" : "w-64"}`}>
    <SideBar />
  </div>

 
  <div className="flex flex-col flex-1 transition-all duration-300">
    <Navbar />
    <main className="flex-1">{children}</main>
  </div>
</div>
  )
}

//* Esto sirve para el manager state Redux toolkit se aplique globalmente y guarde el estado de abierto y cerrado de nuevo sidebar
const DashboardWrapper = ({ children }: {children: React.ReactNode}) => {
    return (
        <StoreProvider > 
            <DashboardLayout>{children}</DashboardLayout>
        </StoreProvider>
    )
}
export default DashboardWrapper;
