import React from "react";

const Blogs = () => {
  const blogs = [
    { id: 1, title: "How to Care for Indoor Plants", author: "Admin" },
    { id: 2, title: "Best Plants for Air Purification", author: "Admin" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Blogs</h1>
      <button className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Add Blog
      </button>
      <table className="w-full border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog.id}>
              <td className="border p-2">{blog.id}</td>
              <td className="border p-2">{blog.title}</td>
              <td className="border p-2">{blog.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Blogs;
