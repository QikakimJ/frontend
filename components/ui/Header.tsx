"use client";

import { Bell, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  userName?: string;
  onSidebarToggle?: () => void;
}

export function Header({ userName, onSidebarToggle }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded-lg transition"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">JNE Express</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userName?.[0] || "U"}
              </div>
              <span className="text-sm font-medium text-slate-700">{userName}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm text-slate-500">Akun</p>
                  <p className="text-sm font-medium text-slate-900">{userName}</p>
                </div>
                <button className="w-full flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-100 transition">
                  <User size={16} />
                  <span className="text-sm">Profil</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
