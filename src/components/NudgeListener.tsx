"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { nudgeService } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NudgeListener() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const checkNudges = async () => {
      const nudges = await nudgeService.getUnreadNudges(user.id);
      if (nudges.length > 0) {
        processNudges(nudges);
      }
    };

    const processNudges = async (nudges: any[]) => {
      // Trigger visual shake
      document.body.classList.add("shake-animation");
      setTimeout(() => document.body.classList.remove("shake-animation"), 800);

      // Play sound
      try {
        const audio = new Audio('/nudge.mp3'); // We'll assume we have a sound or just fail silently
        audio.volume = 0.5;
        audio.play().catch(() => {}); // Catch autoplay errors
      } catch (e) {}

      // Show toast and mark read
      nudges.forEach(n => {
        toast.error(`🔔 ¡ZUMBIDO de ${n.sender?.username}!`, {
          description: "Te están esperando para votar.",
          duration: 8000,
          action: {
            label: "Ir a votar",
            onClick: () => router.push(`/poll/${n.poll_id}`)
          }
        });
      });

      await nudgeService.markAsRead(nudges.map((n: any) => n.id));
    };

    // Check on mount
    checkNudges();

    // Listen to real-time nudges
    const sub = supabase.channel(`nudges-${user.id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "nudges",
        filter: `receiver_id=eq.${user.id}`,
      }, () => {
        checkNudges(); // Fetch to get the joined data like sender username
      }).subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [user, router]);

  return null;
}
