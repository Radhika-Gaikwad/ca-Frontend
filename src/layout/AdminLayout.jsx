import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MOBILE_BREAKPOINT = 768; // px

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
  const [isCollapsed, setIsCollapsed] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
  const [mobileOpen, setMobileOpen] = useState(false); // controls mobile drawer

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);

      if (mobile) {
        setIsCollapsed(true);
        setMobileOpen(false);
      } else {
        setMobileOpen(false);
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      setIsCollapsed((v) => !v);
    }
  };

  const mainMarginClass = isMobile ? "ml-0" : (isCollapsed ? "ml-20" : "ml-64");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
      />

      {/* mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content: use same background theme as Home component */}
      <main className={`${mainMarginClass} p-6 flex-1 transition-all duration-300 bg-gradient-to-b from-gray-50 via-white to-gray-100 min-h-screen`}>
        {/* mobile topbar to open menu (keeps consistency with user's home header) */}
        {isMobile && (
          <header className="flex items-center justify-between mb-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded bg-white shadow-sm hover:shadow-md"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18"></path>
              </svg>
            </button>

            <div className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-700">
              Admin
            </div>

            <div /> {/* placeholder */}
          </header>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

