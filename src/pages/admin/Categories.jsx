import React from "react";

const AdminCategories = () => {
  const categories = ["Indoor Plants", "Outdoor Plants", "Succulents"];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Categories</h1>
      <button className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Add Category
      </button>
      <ul className="space-y-2">
        {categories.map((cat, index) => (
          <li 
            key={index} 
            className="p-4 border rounded hover:bg-green-50 flex justify-between"
          >
            {cat}
            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategories;
