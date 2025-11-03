-- Create licenses table to store license keys and metadata
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'revoked', 'pending')),
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'professional', 'team')),
  assigned_user UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expiry TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Create user_entitlements table to store validated license status for users
CREATE TABLE IF NOT EXISTS user_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  license_id UUID REFERENCES licenses(id) ON DELETE SET NULL,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'professional', 'team')),
  is_valid BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_entitlements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for licenses table
-- Only service role and edge functions can read/write licenses (no direct client access)
CREATE POLICY "Licenses are only accessible by service role"
  ON licenses
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- RLS Policies for user_entitlements table
-- Users can only view their own entitlements
CREATE POLICY "Users can view own entitlements"
  ON user_entitlements FOR SELECT
  USING (auth.uid() = user_id);

-- Users cannot insert/update/delete their own entitlements (only via Edge Function)
CREATE POLICY "Users cannot modify entitlements"
  ON user_entitlements
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(key);
CREATE INDEX IF NOT EXISTS idx_licenses_assigned_user ON licenses(assigned_user);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_user_id ON user_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_is_valid ON user_entitlements(is_valid);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_licenses_updated_at
  BEFORE UPDATE ON licenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_entitlements_updated_at
  BEFORE UPDATE ON user_entitlements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically invalidate expired entitlements
CREATE OR REPLACE FUNCTION invalidate_expired_entitlements()
RETURNS void AS $$
BEGIN
  UPDATE user_entitlements
  SET is_valid = false,
      updated_at = TIMEZONE('utc'::text, NOW())
  WHERE expires_at < NOW()
    AND is_valid = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample licenses (for testing - remove in production or use a secure key generation)
-- WARNING: These are demo keys - DO NOT use in production without proper key generation
INSERT INTO licenses (key, status, tier, expiry, notes) VALUES
  ('SOLUN-PRO-2024-DEMO', 'active', 'professional', '2025-12-31 23:59:59+00', 'Demo license for testing'),
  ('SOLUN-BASIC-2024', 'active', 'basic', '2024-12-31 23:59:59+00', 'Demo basic license')
ON CONFLICT (key) DO NOTHING;

