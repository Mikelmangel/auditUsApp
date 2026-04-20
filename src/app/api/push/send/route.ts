import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export async function POST(req: NextRequest) {
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { receiverId, payload } = await req.json();
  if (!receiverId || !payload) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { data: subs, error } = await adminSupabase
    .from('push_subscriptions')
    .select('subscription')
    .eq('user_id', receiverId);

  if (error || !subs?.length) return NextResponse.json({ ok: true });

  await Promise.allSettled(
    subs.map(({ subscription }) =>
      webpush.sendNotification(subscription as webpush.PushSubscription, JSON.stringify(payload))
    )
  );

  return NextResponse.json({ ok: true });
}
