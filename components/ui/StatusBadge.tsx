"use client";

interface StatusBadgeProps {
  status: string;
  variant?: "primary" | "success" | "warning" | "error" | "info";
}

const statusVariants = {
  primary: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  info: "bg-cyan-100 text-cyan-700",
};

const statusColorMap: Record<string, keyof typeof statusVariants> = {
  Picked: "warning",
  "In Transit": "info",
  Delivered: "success",
  Failed: "error",
  Pending: "primary",
  Cancelled: "error",
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const variantKey = variant || statusColorMap[status] || "primary";
  const variantClass = statusVariants[variantKey];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${variantClass}`}
    >
      {status}
    </span>
  );
}
