CREATE UNIQUE INDEX IF NOT EXISTS push_subscriptions_user_fcm_idx
  ON public.push_subscriptions (user_id, (subscription->>'fcm_token'))
  WHERE (subscription->>'fcm_token') IS NOT NULL;
