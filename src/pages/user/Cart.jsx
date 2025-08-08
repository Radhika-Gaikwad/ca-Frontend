import React from "react";

const Cart = () => {
  const cartItems = []; // You can replace this with state later

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index} className="border-b py-2">{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
