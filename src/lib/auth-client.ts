"use client";

import { createAuthClient } from "better-auth/react";

export const cs_authClient = createAuthClient();

const CS_JWT_FLAG = "cs_jwt_user";

// session hook
export function useCs_Session() {
  return cs_authClient.useSession();
}

// exchange session for jwt cookie
export async function cs_issueToken(userId?: string) {
  const cs_res = await fetch("/api/jwt", { method: "POST", credentials: "include" });
  if (cs_res.ok && userId) {
    try {
      sessionStorage.setItem(CS_JWT_FLAG, userId);
    } catch {}
  }
  return cs_res.ok;
}

// token already issued in this tab
export function cs_hasIssuedToken(userId: string) {
  try {
    return sessionStorage.getItem(CS_JWT_FLAG) === userId;
  } catch {
    return false;
  }
}

// logout
export async function cs_logout() {
  await cs_authClient.signOut();
  await fetch("/api/logout", { method: "POST", credentials: "include" });
  try {
    sessionStorage.removeItem(CS_JWT_FLAG);
  } catch {}
}

// safe redirect target
export function cs_safeRedirect(target: string | null) {
  if (!target || !target.startsWith("/") || target.startsWith("//")) return "/";
  return target;
}
