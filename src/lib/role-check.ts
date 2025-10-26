import { auth } from "@/auth";

export const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export async function getUserRole(): Promise<UserRoleType | null> {
  const session = await auth();
  return (session?.user?.role as UserRoleType) || null;
}

export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === UserRole.ADMIN;
}

export async function hasRole(role: UserRoleType): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === role;
}

export async function requireRole(requiredRole: UserRoleType) {
  const role = await getUserRole();
  if (!role) {
    throw new Error("Unauthorized: No role found");
  }
  if (role !== requiredRole) {
    throw new Error(`Forbidden: Requires ${requiredRole} role`);
  }
  return true;
}
