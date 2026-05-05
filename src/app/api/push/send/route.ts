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

    if (error || !subs?.length) return NextResponse.json({ ok: true });

    await Promise.allSettled(
      subs.map(({ subscription, platform }) => {
        if (platform === 'android' && subscription.fcm_token) {
          return getMessaging().send({
            token: subscription.fcm_token,
            notification: {
              title: payload.title || '¡Zumbido!',
              body: payload.body || 'Te están esperando para votar.',
            },
            android: {
              notification: {
                channelId: 'nudges',
                priority: 'high',
                defaultVibrateTimings: true,
              },
            },
            data: { url: payload.url || '/' },
          });
        }
        return webpush.sendNotification(
          subscription as webpush.PushSubscription,
          JSON.stringify(payload)
        );
      })
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Push send error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
