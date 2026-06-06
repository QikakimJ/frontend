"use client";

import { Package, TrendingUp, MapPin, Truck, BarChart3, Settings, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
  role?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ role = "User", isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const menuItems = [
    {
      label: "Dashboard",
      icon: TrendingUp,
      href: "/dashboard",
      roles: ["Admin", "User", "Courier", "Supervisor"],
    },
    {
      label: "Pengiriman",
      icon: Package,
      roles: ["User", "Courier", "Supervisor"],
      submenu: [
        { label: "Kirim Barang", href: "/shipping-cost" },
        { label: "Kiriman Saya", href: "/my-shipments" },
        { label: "Request Pickup", href: "/pickup-request" },
      ],
    },
    {
      label: "Tracking",
      icon: MapPin,
      href: "/track",
      roles: ["User", "Courier", "Admin"],
    },
    {
      label: "Kurir",
      icon: Truck,
      href: "/dashboard",
      roles: ["Supervisor", "Admin"],
    },
    {
      label: "Analitik",
      icon: BarChart3,
      href: "/analytics",
      roles: ["Admin", "Supervisor"],
    },
    {
      label: "Pengaturan",
      icon: Settings,
      href: "/settings",
      roles: ["Admin", "User"],
    },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(role));

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative left-0 top-0 w-80 lg:w-80 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-y-auto z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur px-6 py-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">JNE</h2>
                <p className="text-xs text-slate-400">Express</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenu === item.label;
            const isItemActive = item.href ? isActive(item.href) : false;

            return (
              <div key={item.label}>
                {hasSubmenu ? (
                  <>
                    <button
                      onClick={() =>
                        setExpandedMenu(isExpanded ? null : item.label)
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        isExpanded
                          ? "bg-red-600/20 text-red-200"
                          : "text-slate-300 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Submenu */}
                    {isExpanded && (
                      <div className="mt-1 ml-6 space-y-1 border-l-2 border-slate-600 pl-4">
                        {item.submenu?.map((subitem) => (
                          <Link
                            key={subitem.label}
                            href={subitem.href}
                            className={`block px-4 py-2 rounded-lg transition-all text-sm ${
                              isActive(subitem.href)
                                ? "bg-red-600 text-white font-medium"
                                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                            }`}
                            onClick={onClose}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isItemActive
                        ? "bg-red-600 text-white font-medium"
                        : "text-slate-300 hover:bg-slate-700/50"
                    }`}
                    onClick={onClose}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent border-t border-slate-700">
          <div className="text-xs text-slate-400 text-center">
            <p>Role: <span className="font-medium text-slate-300">{role}</span></p>
            <p className="mt-1 text-slate-500">© 2026 JNE Express</p>
          </div>
        </div>
      </aside>
    </>
  );
}
