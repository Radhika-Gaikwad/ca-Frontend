import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { User } from "lucide-react"; // profile icon
import Header from "../components/Header";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 p-4 text-center mt-6">
    <p>© {new Date().getFullYear()} Chartered Accounts Portal. All rights reserved.</p>
  </footer>
);

const UserLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // 🔹 No auto-login, manual for now

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
