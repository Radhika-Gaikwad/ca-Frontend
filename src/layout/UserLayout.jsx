import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header"; // <-- Import the new header

const Footer = () => (
  <footer className="bg-gray-800 text-white p-4 text-center mt-6">
    <p>© {new Date().getFullYear()} Plant Paradise. All rights reserved.</p>
  </footer>
);

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
