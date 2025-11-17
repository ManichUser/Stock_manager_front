// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/mobileSideBar";

export const metadata: Metadata = {
  title: "Stock Manager",
  description: "Application de gestion de stock",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900 antialiased min-h-screen flex flex-col">

        {/* Header mobile */}
        <header className="w-full flex flex-row items-center justify-between px-4 bg-white shadow-sm md:hidden sticky top-0 z-20">
        <MobileSidebar/>
          <h1 className="text-lg font-semibold">Stock Manager</h1>
          <img src="/logo-removebg.png" alt="logo"
          className="w-14 h-14 "
          />
        </header>
      
        {/* Contenu principal */}
        <main className="flex-1 flex max-w-screen mx-auto w-full">

          {/* Sidebar desktop uniquement */}
          <div className="hidden md:flex">
            <Sidebar />
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {children}
          </div>
        </main>

        {/* Footer mobile */}
        <footer className="bg-white shadow-inner p-4 text-center md:hidden">
          <p className="text-sm text-gray-500">© 2025 Stock Manager</p>
        </footer>

      </body>
    </html>
  );
}

