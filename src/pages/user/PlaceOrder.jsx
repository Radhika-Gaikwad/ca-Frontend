import React from "react";

const PlaceOrder = () => {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Place Your Order</h1>
      <form className="space-y-4">
        <input 
          type="text" 
          placeholder="Full Name" 
          className="w-full border p-2 rounded"
        />
        <input 
          type="text" 
          placeholder="Address" 
          className="w-full border p-2 rounded"
        />
        <input 
          type="text" 
          placeholder="Phone Number" 
          className="w-full border p-2 rounded"
        />
        <button 
          type="submit" 
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
