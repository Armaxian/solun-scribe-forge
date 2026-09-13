import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

import { adminClient, corsHeaders, json, requestUser } from '../_shared/http.ts';

serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (!['GET', 'POST'].includes(req.method)) return json({ has_access: false, reason: 'Method not allowed' }, 405);
  try {
    const client = adminClient();
    const user = await requestUser(req, client);
    if (!user) return json({ has_access: false, reason: 'Sign in to use AI assistance' }, 401);
    if (Deno.env.get('SOLUN_AI_ENABLED') !== 'true') return json({ has_access: false, reason: 'AI is temporarily unavailable' }, 503);
    const { data: decisions, error } = await client.rpc('check_usage_allowance', { p_user_id: user.id, p_estimated_tokens: 0 });
    if (error || !decisions?.[0]) throw new Error('Allowance unavailable');
    const decision = decisions[0];
    const { data: period, error: periodError } = await client.from('user_usage_periods').select('*').eq('user_id', user.id).maybeSingle();
    if (periodError) throw periodError;
    // A read is informative only. The gateway must reserve atomically before each provider call.
    return json({
      has_access: decision.allowed,
      reason: decision.reason,
      tier: period?.tier,
      usage: period ? {
        requests_used: period.period_requests_used, requests_remaining: decision.requests_remaining,
        tokens_used: period.period_tokens_used, tokens_remaining: decision.tokens_remaining,
        period_start: period.current_period_start, period_end: period.current_period_end,
      } : undefined,
    }, decision.allowed ? 200 : 403);
  } catch {
    return json({ has_access: false, reason: 'Unable to verify AI access. Please try again.' }, 503);
  }
});
