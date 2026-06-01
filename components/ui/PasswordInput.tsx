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
  className = "input-field",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex items-center">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`${className} pr-12`}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 text-slate-500 hover:text-slate-700 transition-colors p-1"
        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
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
