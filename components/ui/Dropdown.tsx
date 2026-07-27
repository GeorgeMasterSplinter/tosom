"use client";

import { useState } from 'react';

export default function Dropdown({ options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-full text-left p-3 bg-[#0A1A2A]/5 border border-[#0A1A2A]/10 backdrop-blur-sm rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-colors"
      >
        {selected}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-[#0A1A2A]/5 border border-[#0A1A2A]/10 backdrop-blur-sm rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className="p-3 hover:bg-[#D4AF37]/10 cursor-pointer text-white transition-colors"
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}