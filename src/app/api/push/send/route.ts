import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { getMessaging } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    webpush.setVapidDetails(
      `mailto:${process.env.VAPID_EMAIL || 'test@example.com'}`,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );

    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { receiverId, payload } = await req.json();
    if (!receiverId || !payload) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const { data: subs, error } = await adminSupabase
      .from('push_subscriptions')
      .select('subscription, platform')
      .eq('user_id', receiverId);

    if (error || !subs?.length) {
      console.log('[Push] no subscriptions for receiver:', receiverId);
      return NextResponse.json({ ok: true });
    }

    console.log('[Push] sending to', subs.length, 'subscription(s)');
    const results = await Promise.allSettled(
      subs.map(({ subscription, platform }) => {
        if (platform === 'android' && subscription.fcm_token) {
          console.log('[Push] sending FCM to token:', subscription.fcm_token.substring(0, 20) + '...');
          // Data-only message → onMessageReceived always called (foreground/background/killed)
          // Our FcmService.java builds the notification with the correct icon (ic_notification)
          return getMessaging().send({
            token: subscription.fcm_token,
            android: { priority: 'high' },
            data: {
              title: payload.title || '¡Zumbido!',
              body: payload.body || 'Te están esperando para votar.',
              url: payload.url || '/',
            },
          });
        }
        return webpush.sendNotification(
          subscription as webpush.PushSubscription,
          JSON.stringify(payload)
        );
      })
    );

    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error('[Push] send failed for sub', i, ':', r.reason);
      else console.log('[Push] send ok for sub', i, ':', r.value);
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Push send error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
