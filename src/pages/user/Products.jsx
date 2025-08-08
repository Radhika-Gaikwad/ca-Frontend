import React from "react";

const Products = () => {
  const productList = [
    { id: 1, name: "Aloe Vera", price: 150 },
    { id: 2, name: "Snake Plant", price: 200 },
    { id: 3, name: "Peace Lily", price: 250 }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {productList.map(product => (
          <div key={product.id} className="border p-4 rounded-lg shadow hover:shadow-lg">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-green-600 font-bold">₹{product.price}</p>
            <button className="mt-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
