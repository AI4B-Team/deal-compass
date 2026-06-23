
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS auto_market_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auto_market_channels text NOT NULL DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS auto_market_target_mode text NOT NULL DEFAULT 'top_n',
  ADD COLUMN IF NOT EXISTS auto_market_min_score integer NOT NULL DEFAULT 70,
  ADD COLUMN IF NOT EXISTS auto_market_top_n integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS auto_market_content_mode text NOT NULL DEFAULT 'ai',
  ADD COLUMN IF NOT EXISTS auto_market_email_template text,
  ADD COLUMN IF NOT EXISTS auto_market_sms_template text,
  ADD COLUMN IF NOT EXISTS auto_market_trigger text NOT NULL DEFAULT 'manual';

ALTER TABLE public.deals
  ADD COLUMN IF NOT EXISTS auto_market_override boolean,
  ADD COLUMN IF NOT EXISTS auto_market_status text NOT NULL DEFAULT 'idle',
  ADD COLUMN IF NOT EXISTS auto_marketed_at timestamptz;

CREATE TABLE IF NOT EXISTS public.deal_outreach (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id uuid NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  channel text NOT NULL,
  recipient text,
  subject text,
  body text,
  status text NOT NULL DEFAULT 'queued',
  error_message text,
  match_score integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.deal_outreach TO authenticated;
GRANT ALL ON public.deal_outreach TO service_role;

ALTER TABLE public.deal_outreach ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deal_outreach_owner_all" ON public.deal_outreach
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_deal_outreach_deal ON public.deal_outreach(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_outreach_buyer ON public.deal_outreach(buyer_id);

CREATE TRIGGER trg_deal_outreach_updated
  BEFORE UPDATE ON public.deal_outreach
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
