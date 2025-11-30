import React from "react";

export const Button = ({
  children,
  className = "",
  variant = "solid",
  ...props
}) => {
  const base =
    "px-4 py-2 rounded-xl font-medium transition-all duration-200 text-center";

  const variants = {
    solid: "bg-green-600 hover:bg-green-700 text-white",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 bg-white",
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.solid} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
