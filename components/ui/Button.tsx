import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
        className={`
            px-3 py-2 rounded-xl font-medium transition-all duration-300 ease-in-out hover:shadow-md
           ${variant === "primary" ? "bg-gold text-black hover:bg-[#E6C08A] hover:shadow-gold/20" : "bg-secondary text-white hover:bg-[#D8B886]/50 hover:shadow-secondary/20"}
        `}
      {...props}
    >
      {children}
    </button>
  );
}
