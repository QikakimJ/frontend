"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          w-10
          h-10
          flex
          items-center
          justify-center
          text-slate-500
          hover:text-slate-700
          bg-transparent
          border-none
          outline-none
          cursor-pointer
          z-20
        "
        aria-label={
          showPassword
            ? "Sembunyikan password"
            : "Tampilkan password"
        }
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}