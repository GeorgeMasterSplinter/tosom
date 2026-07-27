"use client";

import { useState } from 'react';

export default function RadioGroup({ options }) {
  const [selected, setSelected] = useState(options[0].value);

  const handleChange = (value) => {
    setSelected(value);
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value={option.value}
            checked={selected === option.value}
            onChange={() => handleChange(option.value)}
            className="form-radio h-5 w-5 text-[#D4AF37] focus:ring-[#D4AF37]"
          />
          <span className="text-white">{option.label}</span>
        </label>
      ))}
    </div>
  );
}