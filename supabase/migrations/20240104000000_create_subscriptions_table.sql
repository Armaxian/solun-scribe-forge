-- Create subscriptions table to store Stripe subscription data
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'unpaid', 'paused')) DEFAULT 'incomplete',
  tier TEXT CHECK (tier IN ('basic', 'professional', 'team')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions table
-- Users can only view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users cannot insert/update/delete subscriptions directly (only via Edge Functions/webhooks)
CREATE POLICY "Users cannot modify subscriptions"
  ON subscriptions
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Users cannot update subscriptions"
  ON subscriptions
  FOR UPDATE
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Users cannot delete subscriptions"
  ON subscriptions
  FOR DELETE
  USING (false);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to sync subscription status to user_entitlements
CREATE OR REPLACE FUNCTION sync_subscription_to_entitlements()
RETURNS TRIGGER AS $$
BEGIN
  -- Only sync if status changed to canceled or expired
  IF NEW.status IN ('canceled', 'incomplete_expired', 'unpaid') THEN
    UPDATE user_entitlements
    SET is_valid = false,
        tier = NULL,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-sync subscription status changes
CREATE TRIGGER sync_subscription_status
  AFTER UPDATE ON subscriptions
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION sync_subscription_to_entitlements();

-- Function to check if subscription is expired based on current_period_end
CREATE OR REPLACE FUNCTION check_expired_subscriptions()
RETURNS void AS $$
BEGIN
  -- Mark subscriptions as canceled if period has ended and cancel_at_period_end was true
  UPDATE subscriptions
  SET status = 'canceled',
      canceled_at = TIMEZONE('utc'::text, NOW()),
      updated_at = TIMEZONE('utc'::text, NOW())
  WHERE current_period_end < NOW()
    AND cancel_at_period_end = true
    AND status = 'active';
    
  -- Also invalidate the corresponding entitlements
  UPDATE user_entitlements
  SET is_valid = false,
      updated_at = TIMEZONE('utc'::text, NOW())
  WHERE user_id IN (
    SELECT user_id FROM subscriptions
    WHERE current_period_end < NOW()
      AND cancel_at_period_end = true
      AND status = 'canceled'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON TABLE subscriptions IS 'Stores Stripe subscription data synced via webhooks. This is the source of truth for billing status.';
COMMENT ON COLUMN subscriptions.status IS 'Stripe subscription status: active, past_due, canceled, incomplete, incomplete_expired, trialing, unpaid, paused';
COMMENT ON COLUMN subscriptions.tier IS 'Subscription tier: basic, professional, or team';

