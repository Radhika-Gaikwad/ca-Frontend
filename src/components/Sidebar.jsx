import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", to: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Plans", to: "/admin/plans", icon: <Package size={18} /> },
  { name: "Purchases", to: "/admin/purchases", icon: <ShoppingCart size={18} /> },
  { name: "Users", to: "/admin/users", icon: <Users size={18} /> },
  { name: "Articles", to: "/admin/articles", icon: <FileText size={18} /> },
];

const Sidebar = ({
  isCollapsed,
  toggleSidebar,
  isMobile,
  mobileOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const desktopWidthClass = isCollapsed ? "w-20" : "w-64";
  const mobileTransformClass = mobileOpen ? "translate-x-0" : "-translate-x-full";

  const containerClass = isMobile
    ? `fixed top-0 left-0 h-screen z-50 w-64 transform transition-transform duration-300 ${mobileTransformClass} bg-white text-gray-800 shadow-lg`
    : `fixed top-0 left-0 h-screen z-50 bg-white text-gray-800 transition-all duration-300 ${desktopWidthClass} border-r border-gray-100`;

  // Handle logout
  const handleLogout = () => {
    localStorage.clear(); // Remove tokens or anything you stored
    navigate("/login");
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={containerClass}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {!isCollapsed && !isMobile ? (
            <h2 className="text-lg font-extrabold whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-700">
              Admin Panel
            </h2>
          ) : (
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-blue-900 to-green-700 text-white flex items-center justify-center font-bold">
              AI
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {isMobile ? (mobileOpen ? <X size={18} /> : <Menu size={18} />) : (isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />)}
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4 space-y-1 px-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.to;

            const activeClass = active
              ? "bg-gradient-to-r from-blue-900 to-green-700 text-white shadow"
              : "hover:bg-gray-50";

            const justifyClass = isCollapsed && !isMobile ? "justify-center" : "justify-start";

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 p-3 mx-2 rounded-lg transition-colors duration-150 ${activeClass} ${justifyClass}`}
                onClick={() => isMobile && toggleSidebar()}
              >
                <div className={active ? "" : "text-gray-600"}>
                  {item.icon}
                </div>

                {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer + Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          {/* Logout button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 ${isCollapsed ? "justify-center" : ""}`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>

          {/* Version text */}
          <div className={`mt-3 text-xs text-gray-500 ${isCollapsed ? "text-center" : ""}`}>
            v1.0 • Admin
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h3 className="text-lg font-semibold mb-3">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

