"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { normalizeRole } from "../lib/auth";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState<string>("User");
  const [userName, setUserName] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedRole = normalizeRole(localStorage.getItem("role"));
    const storedEmail = localStorage.getItem("email");
    setRole(storedRole);
    setUserName(storedEmail?.split("@")[0] || "User");
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-80">
        <Header
          userName={userName}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
