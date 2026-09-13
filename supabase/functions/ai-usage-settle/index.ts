import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

import { adminClient, corsHeaders, isServiceRequest, json } from '../_shared/http.ts';
import { usageInput } from '../_shared/usage-input.ts';

// Settlement stays available during an AI outage so incurred usage is recorded.
serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ success: false, reason: 'Method not allowed' }, 405);
  if (!isServiceRequest(req)) return json({ success: false, reason: 'Trusted AI gateway required' }, 401);
  try {
    const input = usageInput(await req.json(), true);
    const { data, error } = await adminClient().rpc('settle_ai_usage', {
      p_user_id: input.userId, p_request_id: input.requestId, p_tokens: input.tokens, p_cost: input.cost, p_status: input.status,
    });
    if (error) throw error;
    if (!data) throw new Error('Missing settlement result');
    return json(data, data.success ? 200 : 404);
  } catch (error) {
    if (error instanceof TypeError || error instanceof SyntaxError) return json({ success: false, reason: 'Invalid settlement input' }, 400);
    console.error('AI settlement failed');
    return json({ success: false, reason: 'Unable to record AI usage' }, 503);
  }
});
