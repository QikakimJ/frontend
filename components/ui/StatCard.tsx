"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  trend?: "up" | "down";
  variant?: "primary" | "success" | "warning" | "error";
}

const variantStyles = {
  primary: {
    bg: "bg-gradient-to-br from-blue-500 to-blue-700",
    icon: "text-blue-200",
  },
  success: {
    bg: "bg-gradient-to-br from-green-500 to-green-700",
    icon: "text-green-200",
  },
  warning: {
    bg: "bg-gradient-to-br from-amber-500 to-amber-700",
    icon: "text-amber-200",
  },
  error: {
    bg: "bg-gradient-to-br from-red-500 to-red-700",
    icon: "text-red-200",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  trend = "up",
  variant = "primary",
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`card ${styles.bg} text-white`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-90">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-white/20 ${styles.icon}`}>
          <Icon size={24} />
        </div>
      </div>

      {change && (
        <div className="flex items-center gap-1 text-sm">
          <span className={trend === "up" ? "text-green-200" : "text-red-200"}>
            {trend === "up" ? "↑" : "↓"} {change}
          </span>
          <span className="opacity-75">dari bulan lalu</span>
        </div>
      )}
    </div>
  );
}
