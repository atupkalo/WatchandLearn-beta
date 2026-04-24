import type { User } from "@supabase/supabase-js";

export type AppRole = "regular" | "admin";

export function getUserRole(user: User | null | undefined): AppRole {
  return user?.app_metadata?.role === "admin" ? "admin" : "regular";
}

export function isAdmin(user: User | null | undefined) {
  return getUserRole(user) === "admin";
}

export function getUserDisplayName(user: User | null | undefined) {
  const metadataName = user?.user_metadata?.name;

  if (typeof metadataName === "string" && metadataName.trim().length > 0) {
    return metadataName.trim();
  }

  if (user?.email) {
    return user.email.split("@")[0];
  }

  return "User";
}
