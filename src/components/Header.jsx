import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" },
  { name: "Blogs", path: "/blogs" },
  { name: "Orders", path: "/orders" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Darker gradient colors
  const gradientText = "bg-gradient-to-r from-green-900 via-green-700 to-green-900";
  const gradientBtn =
    "bg-gradient-to-r from-green-900 via-green-700 to-green-900 bg-[length:200%_200%] animate-gradientMove";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative shadow-md border-b border-gray-50 bg-white"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/"
            className={`flex items-center space-x-2 ${gradientText} text-transparent bg-clip-text`}
          >
            <GiPlantRoots className="text-3xl md:text-4xl text-green-900 drop-shadow-md" />
            <span className="text-xl md:text-3xl font-extrabold tracking-wide">
              Plant Paradise
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
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-800 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 md:space-x-6 text-lg md:text-xl">
          <Link to="/wishlist" className="relative hover:opacity-80">
            <FaHeart className="text-green-900" />
            <span className="absolute -top-2 -right-2 bg-pink-600 text-xs w-4 h-4 flex items-center justify-center rounded-full text-white">
              2
            </span>
          </Link>

          <Link to="/cart" className="relative hover:opacity-80">
            <FaShoppingCart className="text-green-900" />
            <span className="absolute -top-2 -right-2 bg-yellow-600 text-xs w-4 h-4 flex items-center justify-center rounded-full text-white">
              5
            </span>
          </Link>

          {isLoggedIn ? (
            <Link to="/profile" className={`${gradientText} text-transparent bg-clip-text`}>
              <FaUser />
            </Link>
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
            className="md:hidden text-2xl text-green-900"
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
            className="md:hidden bg-gradient-to-r from-green-900 via-green-700 to-green-900 bg-opacity-95 backdrop-blur-md overflow-hidden"
          >
            <nav className="flex flex-col space-y-4 p-4 text-white">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="hover:text-green-300 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;

