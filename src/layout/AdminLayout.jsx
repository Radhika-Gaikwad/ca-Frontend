import React from "react";
import { Outlet, Link } from "react-router-dom";

const Sidebar = () => (
  <aside className="bg-gray-900 text-white w-64 min-h-screen fixed left-0 top-0 p-4">
    <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
    <nav className="space-y-3">
      <Link to="/admin/dashboard" className="block hover:bg-gray-700 p-2 rounded">Dashboard</Link>
      <Link to="/admin/products" className="block hover:bg-gray-700 p-2 rounded">Products</Link>
      <Link to="/admin/orders" className="block hover:bg-gray-700 p-2 rounded">Orders</Link>
      <Link to="/admin/users" className="block hover:bg-gray-700 p-2 rounded">Users</Link>
      <Link to="/admin/categories" className="block hover:bg-gray-700 p-2 rounded">Categories</Link>
      <Link to="/admin/blogs" className="block hover:bg-gray-700 p-2 rounded">Blogs</Link>
    </nav>
  </aside>
);

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 flex-1 overflow-y-auto">
        <Outlet /> {/* Active admin page */}
      </main>
    </div>
  );
};

export default AdminLayout;
