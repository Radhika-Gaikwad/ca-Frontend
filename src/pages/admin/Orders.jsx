import React from "react";

const AdminOrders = () => {
  const orders = [
    { id: 101, customer: "Ravi Sharma", total: 450, status: "Pending" },
    { id: 102, customer: "Neha Patil", total: 700, status: "Shipped" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Orders</h1>
      <table className="w-full border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.customer}</td>
              <td className="border p-2">₹{order.total}</td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">
                <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
