"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmployerRedirect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user && (session.user as any).role === "employer") {
      router.push("/employer");
    }
  }, [session, router]);

  return null;
}
