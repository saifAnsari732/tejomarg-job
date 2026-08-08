"use server";

import { cookies } from "next/headers";

export async function setRoleCookie(role: string) {
  const cookieStore = await cookies();
  cookieStore.set("intended_role", role, {
    path: "/",
    maxAge: 3600,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
