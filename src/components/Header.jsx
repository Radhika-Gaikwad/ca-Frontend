import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBalanceScale, FaUser, FaBars, FaTimes } from "react-icons/fa"; // Removed unused icons
import { toast } from "react-toastify";

const navItems = [
  { name: "Plan", path: "/user/plan" },
  { name: "Purchased Plan", path: "/user/purchased-plan" },
  { name: "Articles", path: "/user/articles" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("");
const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Gradient styles (aligned with Home component)
  const gradientText = "bg-gradient-to-r from-blue-900 via-green-700 to-blue-900";
  const gradientBtn =
    "bg-gradient-to-r from-blue-900 via-green-700 to-blue-900 bg-[length:200%_200%] animate-gradientMove";

  useEffect(() => {
    const handler = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      const user = JSON.parse(localStorage.getItem("user"));
      setUserName(user?.name?.split(" ")[0] || ""); // Get the first word of the name
    };

    handler(); // Initialize on mount
    window.addEventListener("authChange", handler);
    window.addEventListener("storage", handler); // other tabs
    return () => {
      window.removeEventListener("authChange", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [profileOpen]);

 const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  setIsLoggedIn(false);
  setProfileOpen(false);
  window.dispatchEvent(new Event("authChange"));
  toast.success("Logged out successfully");
  navigate("/login");
};

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative shadow-md border-b border-gray-50 bg-gradient-to-b from-gray-50 via-white to-gray-100"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/"
            className={`flex items-center space-x-2 ${gradientText} text-transparent bg-clip-text`}
          >
            <FaBalanceScale className="text-3xl md:text-4xl text-blue-900 drop-shadow-md" />
            <span className="text-xl md:text-3xl font-extrabold tracking-wide">
              CA Portal
            </span>
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 font-medium">
          {navItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Link
                to={item.path}
                className={`relative group ${gradientText} text-transparent bg-clip-text`}
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-800 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 md:space-x-6 text-lg md:text-xl relative">
          {isLoggedIn ? (
            <div ref={profileRef} className="relative flex items-center space-x-2">
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="p-2 rounded-full bg-blue-900 text-white hover:bg-blue-800 transition"
                aria-label="Profile"
              >
                <FaUser />
              </button>
              <span className="text-sm font-medium text-gray-700">{userName}</span>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-100 z-50">
                 <button
  onClick={() => setShowLogoutConfirm(true)}
  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700"
>
  Logout
</button>

                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`px-4 py-2 rounded-full shadow-md ${gradientBtn} text-white hover:scale-105 transition-all duration-300 font-medium text-sm md:text-base`}
            >
              Login
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-2xl text-blue-900"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gradient-to-r from-blue-900 via-green-700 to-blue-900 bg-opacity-95 backdrop-blur-md overflow-hidden"
          >
            <nav className="flex flex-col space-y-4 p-4 text-white">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="hover:text-blue-300 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Popup */}
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
          onClick={() => {
            setShowLogoutConfirm(false);
            handleLogout();
          }}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Yes, Logout
        </button>
      </div>
    </div>
  </div>
)}

    </motion.header>
  );
};

export default Header;

