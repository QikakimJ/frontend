export const normalizeRole = (value: string | null | undefined) => {
  const normalized = value?.toLowerCase().trim();

  if (normalized === "kurir" || normalized === "courier") return "Courier";
  if (normalized === "supervisor") return "Supervisor";
  if (normalized === "admin") return "Admin";
  if (normalized === "user") return "User";

  return value?.trim() || "Guest";
};

export const isAdminRole = (value: string | null | undefined) => normalizeRole(value) === "Admin";
export const isCourierRole = (value: string | null | undefined) => normalizeRole(value) === "Courier";
export const isUserRole = (value: string | null | undefined) => normalizeRole(value) === "User";
export const isSupervisorRole = (value: string | null | undefined) => normalizeRole(value) === "Supervisor";

export const getRoleLabel = (value: string | null | undefined) => {
  const role = normalizeRole(value);

  switch (role) {
    case "Admin":
      return "Administrator";
    case "Courier":
      return "Kurir";
    case "Supervisor":
      return "Supervisor";
    case "User":
    default:
      return "Pengguna";
  }
};
