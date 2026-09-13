-- Subscription writes and entitlement synchronization commit or fail together.
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS stripe_created_at bigint NOT NULL DEFAULT 0;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS stripe_synced_at timestamptz;

CREATE OR REPLACE FUNCTION public.sync_subscription_to_entitlements() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.user_entitlements (user_id, tier, is_valid, expires_at, validated_at)
  VALUES (NEW.user_id, coalesce(NEW.tier, 'basic'),
    NEW.status IN ('active', 'trialing') AND NEW.tier IN ('professional', 'team') AND coalesce(NEW.current_period_end > now(), false),
    NEW.current_period_end, now())
  ON CONFLICT (user_id) DO UPDATE SET
    tier = EXCLUDED.tier, is_valid = EXCLUDED.is_valid, expires_at = EXCLUDED.expires_at,
    validated_at = now(), updated_at = now()
  -- Preserve independently redeemed license access. AI checks subscriptions directly.
  WHERE user_entitlements.license_id IS NULL;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS sync_subscription_status ON public.subscriptions;
CREATE TRIGGER sync_subscription_status AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.sync_subscription_to_entitlements();

CREATE OR REPLACE FUNCTION public.apply_stripe_subscription(p_user_id uuid, p_subscription jsonb, p_observed_at timestamptz)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM 1 FROM auth.users WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Account does not exist'; END IF;
  INSERT INTO public.subscriptions (
    user_id, stripe_customer_id, stripe_subscription_id, stripe_price_id, status, tier,
    current_period_start, current_period_end, cancel_at_period_end, canceled_at, trial_start, trial_end,
    stripe_created_at, stripe_synced_at)
  VALUES (p_user_id, p_subscription->>'customer', p_subscription->>'id', p_subscription->>'price_id',
    p_subscription->>'status', p_subscription->>'tier',
    to_timestamp((p_subscription->>'current_period_start')::bigint), to_timestamp((p_subscription->>'current_period_end')::bigint),
    (p_subscription->>'cancel_at_period_end')::boolean, to_timestamp((p_subscription->>'canceled_at')::bigint),
    to_timestamp((p_subscription->>'trial_start')::bigint), to_timestamp((p_subscription->>'trial_end')::bigint),
    (p_subscription->>'created')::bigint, p_observed_at)
  ON CONFLICT (user_id) DO UPDATE SET
    stripe_customer_id = EXCLUDED.stripe_customer_id, stripe_subscription_id = EXCLUDED.stripe_subscription_id,
    stripe_price_id = EXCLUDED.stripe_price_id, status = EXCLUDED.status, tier = EXCLUDED.tier,
    current_period_start = EXCLUDED.current_period_start, current_period_end = EXCLUDED.current_period_end,
    cancel_at_period_end = EXCLUDED.cancel_at_period_end, canceled_at = EXCLUDED.canceled_at,
    trial_start = EXCLUDED.trial_start, trial_end = EXCLUDED.trial_end,
    stripe_created_at = EXCLUDED.stripe_created_at, stripe_synced_at = EXCLUDED.stripe_synced_at, updated_at = now()
  WHERE (subscriptions.stripe_subscription_id IS NULL OR EXCLUDED.stripe_created_at >= subscriptions.stripe_created_at)
    AND (subscriptions.stripe_synced_at IS NULL OR EXCLUDED.stripe_synced_at >= subscriptions.stripe_synced_at);
END;
$$;
REVOKE ALL ON FUNCTION public.apply_stripe_subscription(uuid, jsonb, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_stripe_subscription(uuid, jsonb, timestamptz) TO service_role;
REVOKE ALL ON FUNCTION public.sync_subscription_to_entitlements(), public.check_expired_subscriptions(), public.invalidate_expired_entitlements()
FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_expired_subscriptions(), public.invalidate_expired_entitlements() TO service_role;

-- Authenticated callers may refresh only their own usage period.
CREATE OR REPLACE FUNCTION public.current_ai_usage() RETURNS public.user_usage_periods
LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.get_or_create_usage_period(auth.uid());
$$;
REVOKE ALL ON FUNCTION public.current_ai_usage() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_ai_usage() TO authenticated;
