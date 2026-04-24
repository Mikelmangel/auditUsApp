"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { nudgeService } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function saveSubscription(userId: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    const sub = existing ?? await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });
    const { data: { session } } = await supabase.auth.getSession();
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ subscription: sub.toJSON() }),
    });
  } catch {
    // push not supported or blocked
  }
}

export function NudgeListener() {
  const { user } = useAuth();
  const router = useRouter();

  // Register service worker once
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // Handle push permission
  useEffect(() => {
    if (!user || typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      saveSubscription(user.id);
    } else if (Notification.permission === 'default') {
      toast.info('🔔 Activa las notificaciones', {
        description: 'Recibe zumbidos aunque no tengas la app abierta.',
        duration: Infinity,
        id: 'push-permission',
        action: {
          label: 'Activar',
          onClick: async () => {
            const perm = await Notification.requestPermission();
            if (perm === 'granted') await saveSubscription(user.id);
          },
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const checkNudges = async () => {
      const nudges = await nudgeService.getUnreadNudges(user.id);
      if (nudges.length > 0) processNudges(nudges);
    };

    const processNudges = async (nudges: any[]) => {
      document.body.classList.add("shake-animation");
      setTimeout(() => document.body.classList.remove("shake-animation"), 800);

      try {
        const audio = new Audio('/nudge.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {}

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

    checkNudges();

    const sub = supabase.channel(`nudges-${user.id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "nudges",
        filter: `receiver_id=eq.${user.id}`,
      }, () => {
        checkNudges();
      }).subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [user, router]);

  return null;
}
