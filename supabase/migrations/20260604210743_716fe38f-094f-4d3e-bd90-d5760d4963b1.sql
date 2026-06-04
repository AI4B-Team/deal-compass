
-- Helper: updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- BUYERS
CREATE TABLE public.buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  preferred_contact_method TEXT DEFAULT 'text',
  target_areas TEXT[] NOT NULL DEFAULT '{}',
  property_types TEXT[] NOT NULL DEFAULT '{}',
  price_min NUMERIC,
  price_max NUMERIC,
  deal_types TEXT[] NOT NULL DEFAULT '{}',
  condition_tolerance TEXT DEFAULT 'any',
  min_beds INT,
  min_baths NUMERIC,
  min_sqft INT,
  arv_min NUMERIC,
  arv_max NUMERIC,
  min_spread NUMERIC,
  financing_type TEXT DEFAULT 'cash',
  max_concurrent_deals INT,
  buy_box_notes TEXT,
  general_notes TEXT,
  last_purchase_date DATE,
  last_contacted_date DATE,
  deals_bought_count INT NOT NULL DEFAULT 0,
  buyer_tier TEXT NOT NULL DEFAULT 'B',
  proof_of_funds BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active'
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.buyers TO authenticated;
GRANT ALL ON public.buyers TO service_role;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "buyers_owner_all" ON public.buyers FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_buyers_updated BEFORE UPDATE ON public.buyers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_buyers_user ON public.buyers(user_id);

-- DEALS
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip TEXT,
  county TEXT,
  property_type TEXT,
  beds INT,
  baths NUMERIC,
  sqft INT,
  year_built INT,
  condition TEXT,
  intended_use TEXT,
  contract_price NUMERIC,
  assignment_fee NUMERIC,
  asking_price NUMERIC,
  arv NUMERIC,
  estimated_rehab NUMERIC,
  contract_date DATE,
  inspection_deadline DATE,
  closing_deadline DATE,
  status TEXT NOT NULL DEFAULT 'locked',
  assigned_buyer_id UUID REFERENCES public.buyers(id) ON DELETE SET NULL,
  final_assignment_fee NUMERIC,
  description TEXT,
  deal_notes TEXT
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deals TO authenticated;
GRANT ALL ON public.deals TO service_role;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deals_owner_all" ON public.deals FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_deals_updated BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_deals_user ON public.deals(user_id);

-- DEAL_MATCHES
CREATE TABLE public.deal_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  match_score INT NOT NULL DEFAULT 0,
  match_tier TEXT NOT NULL DEFAULT 'C',
  match_reasons TEXT,
  interest_status TEXT NOT NULL DEFAULT 'not_contacted',
  contacted_at TIMESTAMPTZ,
  generated_pitch TEXT,
  pitch_subject TEXT,
  notes TEXT,
  is_winner BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(deal_id, buyer_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deal_matches TO authenticated;
GRANT ALL ON public.deal_matches TO service_role;
ALTER TABLE public.deal_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deal_matches_owner_all" ON public.deal_matches FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_dm_updated BEFORE UPDATE ON public.deal_matches
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_dm_deal ON public.deal_matches(deal_id);
CREATE INDEX idx_dm_buyer ON public.deal_matches(buyer_id);

-- USER_SETTINGS
CREATE TABLE public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  default_state TEXT,
  default_market TEXT,
  weight_price INT NOT NULL DEFAULT 30,
  weight_strategy INT NOT NULL DEFAULT 25,
  weight_condition INT NOT NULL DEFAULT 20,
  weight_spread INT NOT NULL DEFAULT 15,
  weight_size INT NOT NULL DEFAULT 10,
  signature TEXT,
  brand_name TEXT
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings TO service_role;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_settings_owner_all" ON public.user_settings FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_us_updated BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
