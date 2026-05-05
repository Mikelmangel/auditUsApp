import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user }, error: authError } = await adminSupabase.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  // Native FCM token
  if (body.fcmToken) {
    const { error } = await adminSupabase.from('push_subscriptions').upsert(
      { user_id: user.id, subscription: { fcm_token: body.fcmToken }, platform: 'android' },
      { onConflict: 'user_id,subscription->fcm_token' }
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // Web VAPID subscription
  const { subscription } = body;
  if (!subscription?.endpoint) return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });

  const { error } = await adminSupabase.from('push_subscriptions').upsert(
    { user_id: user.id, subscription, platform: 'web' },
    { onConflict: 'user_id,endpoint' }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
