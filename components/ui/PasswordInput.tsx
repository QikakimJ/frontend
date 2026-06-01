"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">

      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full
          rounded-full
          border
          px-5
          pr-14
          py-4
          outline-none
          ${className}
        `}
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="
          absolute
          top-1/2
          right-4
          -translate-y-1/2
          flex
          items-center
          justify-center
          text-gray-500
          hover:text-gray-700
          bg-transparent
          border-none
          p-0
          z-20
        "
      >
        {showPassword ? (
          <EyeOff size={22} />
        ) : (
          <Eye size={22} />
        )}
      </button>

    </div>
  );
}