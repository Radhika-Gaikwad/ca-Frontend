import React, { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({ label, options, selected, setSelected, required }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // click outside handler
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* LABEL WITH RED STAR */}
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input box with selected tags */}
      <div
        onClick={() => setOpen(!open)}
        className={`input-modern min-h-[52px] flex flex-wrap items-center gap-2 cursor-pointer 
        ${required && selected.length === 0 ? "border-red-500" : ""}`}
      >
        {selected.length === 0 && (
          <span className="text-gray-400">Select Services...</span>
        )}

        {selected.map((item) => (
          <span
            key={item}
            className="bg-teal-100 text-teal-700 px-2 py-1 rounded-lg flex items-center gap-2"
          >
            {item}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleOption(item);
              }}
              className="text-red-500 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow-md max-h-52 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className={`px-4 py-2 cursor-pointer hover:bg-teal-50 flex justify-between ${
                selected.includes(option) ? "bg-teal-100" : ""
              }`}
            >
              {option}
              {selected.includes(option) && <span>✔</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
