import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { adminClient, corsHeaders, isServiceRequest, json } from '../_shared/http.ts';
import { usageInput } from '../_shared/usage-input.ts';

// Called only by the trusted AI gateway, never a desktop or browser client.
serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ allowed: false, reason: 'Method not allowed' }, 405);
  if (!isServiceRequest(req)) return json({ allowed: false, reason: 'Trusted AI gateway required' }, 401);
  if (Deno.env.get('SOLUN_AI_ENABLED') !== 'true') return json({ allowed: false, reason: 'AI is temporarily unavailable' }, 503);
  try {
    const input = usageInput(await req.json());
    const { data, error } = await adminClient().rpc('reserve_ai_usage', {
      p_user_id: input.userId, p_request_id: input.requestId, p_tokens: input.tokens, p_cost: input.cost, p_model: input.model,
    });
    if (error) throw error;
    if (!data) throw new Error('Missing reservation result');
    return json(data, data.allowed ? 200 : 403);
  } catch (error) {
    if (error instanceof TypeError || error instanceof SyntaxError) return json({ allowed: false, reason: 'Invalid reservation input' }, 400);
    console.error('AI reservation failed');
    return json({ allowed: false, reason: 'Unable to reserve AI allowance' }, 503);
  }
});
