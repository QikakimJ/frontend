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
        className="
          w-full
          h-[56px]
          rounded-full
          border
          border-slate-300
          bg-white
          px-5
          pr-14
          text-base
          outline-none
          focus:border-red-500
        "
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="
          absolute
          top-0
          right-0
          h-full
          w-14
          flex
          items-center
          justify-center
          text-slate-500
          hover:text-slate-700
          bg-transparent
          border-none
          cursor-pointer
          z-20
        "
      >
        {showPassword ? (
          <EyeOff size={20} />
        ) : (
          <Eye size={20} />
        )}
      </button>

    </div>
  );
}