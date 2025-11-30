import React from "react";

export const Card = ({ className = "", children }) => (
  <div className={`bg-white rounded-2xl shadow-md p-4 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ className = "", children }) => (
  <div className={`mb-2 ${className}`}>{children}</div>
);

export const CardTitle = ({ className = "", children }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);

export const CardContent = ({ className = "", children }) => (
  <div className={`flex-1 ${className}`}>{children}</div>
);
