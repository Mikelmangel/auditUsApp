"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { nudgeService } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { native } from "@/components/NativeProvider";
import { NotificationType } from "@capacitor/haptics";
import { useLanguage } from "@/hooks/useLanguage";

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function saveFcmToken(token: string, accessToken: string): Promise<number> {
  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fcmToken: token }),
  });
  return res.status;
}

async function saveWebSubscription(userId: string) {
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
  const { t } = useLanguage();

  // Web: register service worker
  useEffect(() => {
    if (!Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // Native: register FCM token (depends on user.id only to avoid re-runs on object re-render)
  useEffect(() => {
    if (!user?.id || !Capacitor.isNativePlatform()) return;

    let listeners: Array<{ remove: () => void }> = [];

    (async () => {
      try {
        const { PushNotifications } = await import('@capacitor/push-notifications');

        const permResult = await PushNotifications.requestPermissions();
        if (permResult.receive !== 'granted') return;

        // Create high-importance channel so background notifications show as popup
        await PushNotifications.createChannel({
          id: 'nudges',
          name: 'Zumbidos',
          description: 'Notificaciones de zumbidos',
          importance: 5,
          vibration: true,
          sound: 'default',
          visibility: 1,
        });

        const regListener = await PushNotifications.addListener('registration', async (tokenData) => {
          try {
            console.log('[FCM] token:', tokenData.value.substring(0, 20) + '...');
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
              const res = await saveFcmToken(tokenData.value, session.access_token);
              console.log('[FCM] token saved, status:', res);
            }
          } catch (e) {
            console.warn('[FCM] save token failed:', e);
          }
        });

        const errListener = await PushNotifications.addListener('registrationError', (err) => {
          console.error('[FCM] registration error:', err);
        });

        listeners = [regListener, errListener];

        await PushNotifications.register();
      } catch (e) {
        console.warn('[FCM] registration failed:', e);
      }
    })();

    return () => { listeners.forEach(l => l.remove()); };
  }, [user?.id]);

  // Web: handle push permission
  useEffect(() => {
    if (!user || Capacitor.isNativePlatform() || typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      saveWebSubscription(user.id);
    } else if (Notification.permission === 'default') {
      toast.info(t.nudge.title, {
        description: t.nudge.desc,
        duration: Infinity,
        id: 'push-permission',
        action: {
          label: t.nudge.label,
          onClick: async () => {
            const perm = await Notification.requestPermission();
            if (perm === 'granted') await saveWebSubscription(user.id);
          },
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const processNudges = async (nudges: any[]) => {
      native.haptics.notification(NotificationType.Warning);

      document.body.classList.add("shake-animation");
      setTimeout(() => document.body.classList.remove("shake-animation"), 800);

      try {
        const audio = new Audio('/nudge.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch {}

      nudges.forEach(n => {
        toast.error(t.nudge.toastTitle.replace('{name}', n.sender?.username || 'someone'), {
          description: t.nudge.toastDesc,
          duration: 8000,
          action: {
            label: t.nudge.toastAction,
            onClick: () => router.push(`/poll/${n.poll_id}`)
          }
        });
      });

      await nudgeService.markAsRead(nudges.map((n: any) => n.id));
    };

    const checkNudges = async () => {
      const nudges = await nudgeService.getUnreadNudges(user.id);
      if (nudges.length > 0) processNudges(nudges);
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

  // ── Battle Royale real-time elimination listener ──
  useEffect(() => {
    if (!user) return;

    const brSub = supabase.channel(`battle-royale-${user.id}-${Math.random().toString(36).substring(7)}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "survival_participants",
        filter: `is_eliminated=eq.true`,
      }, async (payload) => {
        const eliminated = payload.new as any;
        if (!eliminated.is_eliminated) return;

        // Fetch the eliminated user's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', eliminated.profile_id)
          .single();

        const name = profile?.username || '???';

        if (eliminated.profile_id === user.id) {
          // YOU were eliminated
          native.haptics.notification(NotificationType.Error);
          document.body.classList.add("shake-animation");
          setTimeout(() => document.body.classList.remove("shake-animation"), 800);

          toast.error(`💀 ${t.group.battleEliminated.replace("{round}", String(eliminated.eliminated_round || '?'))}`, {
            description: t.group.battleSpectator,
            duration: 10000,
          });
        } else {
          // Someone else was eliminated
          native.haptics.notification(NotificationType.Warning);
          toast(`⚔️ ${name} — ${t.group.battleEliminated.replace("{round}", String(eliminated.eliminated_round || '?'))}`, {
            duration: 6000,
          });
        }
      })
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "survival_games",
      }, async (payload) => {
        const game = payload.new as any;

        // Winner crowned
        if (game.status === 'finished' && game.winner_id) {
          const { data: winner } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', game.winner_id)
            .single();

          const winnerName = winner?.username || '???';
          native.haptics.notification(NotificationType.Success);
          toast.success(t.group.battleCrowned.replace("{name}", winnerName), {
            duration: 12000,
          });
        }

        // Final duel started
        if (game.phase === 'final_duel') {
          native.haptics.notification(NotificationType.Warning);
          toast(t.group.battleFinalDuel, {
            description: t.group.battleFinalDuelDesc,
            duration: 8000,
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(brSub); };
  }, [user, t]);

  return null;
}
