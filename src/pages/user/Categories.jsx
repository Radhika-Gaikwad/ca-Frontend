
import React from "react";

const Categories = () => {
  const categoryList = ["Indoor Plants", "Outdoor Plants", "Succulents", "Flowering Plants"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shop by Categories</h1>
      <ul className="space-y-2">
        {categoryList.map((cat, index) => (
          <li 
            key={index} 
            className="p-4 border rounded-lg hover:bg-green-50 cursor-pointer"
          >
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
