export function requireAdmin(_userId?: string) {
  return { userId: "admin-dev" };
}

/** Alias for backward compatibility */
export const requireAuth = requireAdmin;
