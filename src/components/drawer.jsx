import React, { useState } from "react";

export const Drawer = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const DrawerTrigger = ({ asChild, children }) => {
  const [open, setOpen] = useState(false);

  return React.cloneElement(children, {
    onClick: () => setOpen(true),
    "data-drawer-trigger": "true",
  });
};

export const DrawerContent = ({ children }) => {
  const [open, setOpen] = useState(false);

  // Listen for trigger click
  React.useEffect(() => {
    const triggers = document.querySelectorAll("[data-drawer-trigger]");
    triggers.forEach((btn) => {
      btn.addEventListener("click", () => setOpen(true));
    });
  }, []);

  return (
    open && (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
        <div className="bg-white w-full max-w-lg rounded-t-2xl p-6 shadow-lg">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-4 text-gray-500 hover:text-black"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    )
  );
};

export const DrawerHeader = ({ children }) => (
  <div className="mb-4 border-b pb-2">{children}</div>
);

export const DrawerTitle = ({ children }) => (
  <h3 className="text-xl font-bold">{children}</h3>
);

export const DrawerDescription = ({ children }) => (
  <div className="text-gray-600 mt-2">{children}</div>
);
