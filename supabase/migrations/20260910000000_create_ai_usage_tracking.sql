-- AI quotas are enforced inside one database transaction, before provider work.
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id text NOT NULL UNIQUE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  tokens_input integer CHECK (tokens_input >= 0),
  tokens_output integer CHECK (tokens_output >= 0),
  tokens_cached integer DEFAULT 0 CHECK (tokens_cached >= 0),
  tokens_total integer NOT NULL CHECK (tokens_total >= 0),
  cost_usd numeric(12,6) NOT NULL DEFAULT 0 CHECK (cost_usd >= 0),
  model text,
  provider text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'failed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_period ON public.ai_usage(user_id, period_start, period_end);
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own AI usage" ON public.ai_usage FOR SELECT TO authenticated USING (auth.uid() = user_id);
REVOKE ALL ON public.ai_usage FROM anon, authenticated;
GRANT SELECT ON public.ai_usage TO authenticated;
GRANT ALL ON public.ai_usage TO service_role;

CREATE TABLE IF NOT EXISTS public.plan_allowances (
  tier text PRIMARY KEY CHECK (tier IN ('professional', 'team')),
  requests_per_month integer NOT NULL CHECK (requests_per_month >= 0),
  tokens_per_month integer NOT NULL CHECK (tokens_per_month >= 0),
  cost_limit_usd numeric(10,2) NOT NULL CHECK (cost_limit_usd >= 0),
  allow_overage boolean NOT NULL DEFAULT false CHECK (NOT allow_overage),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.plan_allowances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plan allowances are publicly readable" ON public.plan_allowances FOR SELECT USING (true);
REVOKE ALL ON public.plan_allowances FROM anon, authenticated;
GRANT SELECT ON public.plan_allowances TO anon, authenticated;
GRANT ALL ON public.plan_allowances TO service_role;
-- Fail closed until the operator configures approved limits before enabling sales.
INSERT INTO public.plan_allowances (tier, requests_per_month, tokens_per_month, cost_limit_usd)
VALUES ('professional', 0, 0, 0), ('team', 0, 0, 0) ON CONFLICT (tier) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.user_usage_periods (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_period_start date NOT NULL,
  current_period_end date NOT NULL,
  period_requests_used integer NOT NULL DEFAULT 0,
  period_tokens_used bigint NOT NULL DEFAULT 0,
  period_cost_used numeric(12,6) NOT NULL DEFAULT 0,
  tier text CHECK (tier IN ('professional', 'team')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_usage_periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own usage period" ON public.user_usage_periods FOR SELECT TO authenticated USING (auth.uid() = user_id);
REVOKE ALL ON public.user_usage_periods FROM anon, authenticated;
GRANT SELECT ON public.user_usage_periods TO authenticated;
GRANT ALL ON public.user_usage_periods TO service_role;

CREATE OR REPLACE FUNCTION public.get_or_create_usage_period(p_user_id uuid)
RETURNS public.user_usage_periods LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  sub public.subscriptions;
  period public.user_usage_periods;
  month_start date := date_trunc('month', now() AT TIME ZONE 'UTC')::date;
BEGIN
  -- Locks the subscription even when no usage row exists yet. All writers use this lock.
  SELECT * INTO sub FROM public.subscriptions WHERE user_id = p_user_id FOR UPDATE;
  IF NOT FOUND OR sub.status NOT IN ('active', 'trialing') OR sub.tier NOT IN ('professional', 'team')
     OR sub.current_period_end IS NULL OR sub.current_period_end <= now() THEN RETURN NULL; END IF;
  INSERT INTO public.user_usage_periods (user_id, current_period_start, current_period_end, tier)
  VALUES (p_user_id, month_start, (month_start + interval '1 month')::date, sub.tier)
  ON CONFLICT (user_id) DO UPDATE SET
    tier = sub.tier,
    current_period_start = month_start,
    current_period_end = (month_start + interval '1 month')::date,
    period_requests_used = CASE WHEN user_usage_periods.current_period_start = month_start THEN user_usage_periods.period_requests_used ELSE 0 END,
    period_tokens_used = CASE WHEN user_usage_periods.current_period_start = month_start THEN user_usage_periods.period_tokens_used ELSE 0 END,
    period_cost_used = CASE WHEN user_usage_periods.current_period_start = month_start THEN user_usage_periods.period_cost_used ELSE 0 END,
    updated_at = now()
  RETURNING * INTO period;
  RETURN period;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_usage_allowance(p_user_id uuid, p_estimated_tokens integer DEFAULT 0)
RETURNS TABLE (allowed boolean, reason text, requests_remaining integer, tokens_remaining integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE period public.user_usage_periods; allowance public.plan_allowances;
BEGIN
  IF p_estimated_tokens IS NULL OR p_estimated_tokens < 0 THEN RAISE EXCEPTION 'Invalid token estimate'; END IF;
  period := public.get_or_create_usage_period(p_user_id);
  IF period.user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Sign in with an active AI subscription to continue'::text, 0, 0; RETURN;
  END IF;
  SELECT * INTO allowance FROM public.plan_allowances WHERE tier = period.tier;
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'AI allowance is not configured'::text, 0, 0; RETURN;
  END IF;
  requests_remaining := greatest(0, allowance.requests_per_month - period.period_requests_used);
  tokens_remaining := greatest(0, allowance.tokens_per_month - period.period_tokens_used)::integer;
  allowed := requests_remaining > 0 AND tokens_remaining > 0 AND p_estimated_tokens <= tokens_remaining
    AND period.period_cost_used < allowance.cost_limit_usd;
  reason := CASE WHEN allowed THEN 'AI allowance available' ELSE 'Monthly AI allowance reached' END;
  RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION public.reserve_ai_usage(p_user_id uuid, p_request_id text, p_tokens integer, p_cost numeric, p_model text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE period public.user_usage_periods; decision record; allowance public.plan_allowances; existing public.ai_usage;
BEGIN
  IF p_tokens IS NULL OR p_tokens <= 0 OR p_tokens > 2000000 OR p_cost IS NULL OR p_cost <= 0
    OR p_request_id IS NULL OR length(p_request_id) NOT BETWEEN 1 AND 100 THEN RAISE EXCEPTION 'Invalid reservation'; END IF;
  period := public.get_or_create_usage_period(p_user_id);
  IF period.user_id IS NULL THEN RETURN jsonb_build_object('allowed', false, 'reason', 'Active AI subscription required'); END IF;
  SELECT * INTO existing FROM public.ai_usage WHERE request_id = p_request_id;
  IF FOUND THEN
    -- Retrying a reservation must never authorize a second provider request.
    RETURN jsonb_build_object('allowed', false, 'reason', 'Request already reserved');
  END IF;
  SELECT * INTO decision FROM public.check_usage_allowance(p_user_id, p_tokens);
  IF NOT decision.allowed THEN RETURN to_jsonb(decision); END IF;
  SELECT * INTO allowance FROM public.plan_allowances WHERE tier = period.tier;
  IF period.period_cost_used + p_cost > allowance.cost_limit_usd THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'Monthly AI cost allowance reached');
  END IF;
  INSERT INTO public.ai_usage (user_id, request_id, period_start, period_end, tokens_total, cost_usd, model)
  VALUES (p_user_id, p_request_id, period.current_period_start, period.current_period_end, p_tokens, p_cost, p_model);
  UPDATE public.user_usage_periods SET period_requests_used = period_requests_used + 1,
    period_tokens_used = period_tokens_used + p_tokens, period_cost_used = period_cost_used + p_cost, updated_at = now()
  WHERE user_id = p_user_id;
  RETURN jsonb_build_object('allowed', true, 'reservation_id', p_request_id,
    'requests_remaining', decision.requests_remaining - 1, 'tokens_remaining', decision.tokens_remaining - p_tokens);
END;
$$;

CREATE OR REPLACE FUNCTION public.settle_ai_usage(p_user_id uuid, p_request_id text, p_tokens integer, p_cost numeric, p_status text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE reservation public.ai_usage; settled_tokens integer; settled_cost numeric;
BEGIN
  IF p_tokens IS NULL OR p_tokens < 0 OR p_cost IS NULL OR p_cost < 0 OR p_status IS NULL
    OR p_status NOT IN ('settled', 'failed', 'cancelled') THEN RAISE EXCEPTION 'Invalid settlement'; END IF;
  PERFORM 1 FROM public.subscriptions WHERE user_id = p_user_id FOR UPDATE;
  SELECT * INTO reservation FROM public.ai_usage WHERE request_id = p_request_id AND user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'reason', 'Reservation not found'); END IF;
  IF reservation.status <> 'pending' THEN
    RETURN jsonb_build_object('success', true, 'reason', 'Already finalized', 'tokens_settled', reservation.tokens_total);
  END IF;
  -- Failed/cancelled may release only requests known not to have incurred provider usage.
  IF p_status <> 'settled' AND (p_tokens <> 0 OR p_cost <> 0) THEN RAISE EXCEPTION 'Consumed usage must be settled'; END IF;
  settled_tokens := CASE WHEN p_status = 'settled' THEN p_tokens ELSE 0 END;
  settled_cost := CASE WHEN p_status = 'settled' THEN p_cost ELSE 0 END;
  UPDATE public.ai_usage SET tokens_total = settled_tokens, cost_usd = settled_cost,
    status = p_status, settled_at = now(), updated_at = now() WHERE id = reservation.id;
  UPDATE public.user_usage_periods SET
    period_requests_used = period_requests_used - CASE WHEN p_status = 'settled' THEN 0 ELSE 1 END,
    period_tokens_used = period_tokens_used + settled_tokens - reservation.tokens_total,
    period_cost_used = period_cost_used + settled_cost - reservation.cost_usd, updated_at = now()
  WHERE user_id = p_user_id AND current_period_start = reservation.period_start AND current_period_end = reservation.period_end;
  RETURN jsonb_build_object('success', true, 'tokens_settled', settled_tokens);
END;
$$;

REVOKE ALL ON FUNCTION public.get_or_create_usage_period(uuid), public.check_usage_allowance(uuid, integer),
  public.reserve_ai_usage(uuid, text, integer, numeric, text), public.settle_ai_usage(uuid, text, integer, numeric, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_or_create_usage_period(uuid), public.check_usage_allowance(uuid, integer),
  public.reserve_ai_usage(uuid, text, integer, numeric, text), public.settle_ai_usage(uuid, text, integer, numeric, text) TO service_role;
