"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const exchangeCode = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }
      router.replace("/");
    };
    exchangeCode();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-svh">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={40} className="animate-spin text-indigo-500" />
        <p className="text-white/50 text-sm font-medium">Completando sesión...</p>
      </div>
    </div>
  );
}