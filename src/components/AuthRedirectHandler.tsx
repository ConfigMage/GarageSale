"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase";

export function AuthRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseClient();

    if (!supabase || !window.location.hash.includes("access_token")) {
      return;
    }

    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      return;
    }

    const client = supabase;
    const tokens = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    async function storeSession() {
      const { error } = await client.auth.setSession(tokens);

      if (!error) {
        window.history.replaceState(null, "", "/admin");
        router.replace("/admin");
      }
    }

    void storeSession();
  }, [router]);

  return null;
}
