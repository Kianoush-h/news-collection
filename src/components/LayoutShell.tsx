"use client";

import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <Sidebar isOpen={mobileMenuOpen} onClose={closeMenu} />
      <div className="flex-1 flex flex-col lg:ml-[260px]">
        <Header onMenuToggle={toggleMenu} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </>
  );
}
