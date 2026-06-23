
-- BUYER TRANSACTION HISTORY
CREATE TABLE public.buyer_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT, state TEXT, zip TEXT,
  lat NUMERIC, lng NUMERIC,
  property_type TEXT,
  deal_type TEXT NOT NULL,
  beds INT, baths NUMERIC, sqft INT, acreage NUMERIC,
  purchase_price NUMERIC, purchase_date DATE,
  sold_price NUMERIC, sold_date DATE,
  arv_at_purchase NUMERIC,
  source TEXT,
  confidence TEXT NOT NULL DEFAULT 'verified',
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_btx_buyer ON public.buyer_transactions(buyer_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.buyer_transactions TO authenticated;
GRANT ALL ON public.buyer_transactions TO service_role;
ALTER TABLE public.buyer_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage transactions for their own buyers"
ON public.buyer_transactions FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.buyers b WHERE b.id = buyer_transactions.buyer_id AND b.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.buyers b WHERE b.id = buyer_transactions.buyer_id AND b.user_id = auth.uid()));

CREATE TRIGGER set_buyer_transactions_updated_at
BEFORE UPDATE ON public.buyer_transactions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PROPERTY INTELLIGENCE RECORD
CREATE TABLE public.property_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  apn TEXT, county TEXT,
  beds INT, baths NUMERIC, sqft INT, acreage NUMERIC, year_built INT,
  owner_entity TEXT, is_absentee_owner BOOLEAN,
  owner_mailing_address TEXT,
  last_purchase_price NUMERIC, last_purchase_date DATE,
  last_assessment NUMERIC, last_assessment_year INT,
  annual_property_tax NUMERIC,
  loan_amount NUMERIC, loan_balance_est NUMERIC,
  interest_rate_est NUMERIC, monthly_payment_est NUMERIC,
  loan_origination_date DATE, lender_name TEXT,
  est_current_value NUMERIC,
  data_source TEXT, last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_pr_address ON public.property_records(address);
CREATE INDEX idx_pr_user ON public.property_records(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_records TO authenticated;
GRANT ALL ON public.property_records TO service_role;
ALTER TABLE public.property_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own property records"
ON public.property_records FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER set_property_records_updated_at
BEFORE UPDATE ON public.property_records
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PROPERTY TRANSACTION HISTORY (chain of title)
CREATE TABLE public.property_transaction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_record_id UUID NOT NULL REFERENCES public.property_records(id) ON DELETE CASCADE,
  sale_date DATE,
  sale_type TEXT,
  price NUMERIC,
  buyer_name TEXT,
  seller_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_pth_property ON public.property_transaction_history(property_record_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_transaction_history TO authenticated;
GRANT ALL ON public.property_transaction_history TO service_role;
ALTER TABLE public.property_transaction_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage transaction history for their own properties"
ON public.property_transaction_history FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.property_records p WHERE p.id = property_transaction_history.property_record_id AND p.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.property_records p WHERE p.id = property_transaction_history.property_record_id AND p.user_id = auth.uid()));

-- BUYER RELIABILITY COLUMNS
ALTER TABLE public.buyers ADD COLUMN offers_made_count INT NOT NULL DEFAULT 0;
ALTER TABLE public.buyers ADD COLUMN offers_closed_count INT NOT NULL DEFAULT 0;

-- PORTFOLIO STATS VIEW
CREATE OR REPLACE VIEW public.buyer_portfolio_stats AS
SELECT
  buyer_id,
  COUNT(*) FILTER (WHERE deal_type = 'rental') AS rental_count,
  COUNT(*) FILTER (WHERE deal_type = 'flip') AS flip_count,
  COUNT(*) FILTER (WHERE deal_type = 'land') AS land_count,
  COUNT(*) FILTER (WHERE deal_type = 'wholetail') AS wholetail_count,
  COUNT(*) AS total_count,
  MODE() WITHIN GROUP (ORDER BY property_type) AS main_property_type,
  SUM(COALESCE(sold_price, purchase_price)) AS est_portfolio_value,
  AVG(purchase_price) AS avg_purchase_price,
  AVG(sold_date - purchase_date) FILTER (WHERE deal_type = 'flip') AS avg_flip_duration_days,
  AVG(purchase_price / NULLIF(arv_at_purchase, 0)) FILTER (WHERE arv_at_purchase > 0) AS avg_purchase_arv_pct,
  AVG(EXTRACT(DAY FROM now() - purchase_date)) AS avg_days_between_purchases
FROM public.buyer_transactions
GROUP BY buyer_id;

GRANT SELECT ON public.buyer_portfolio_stats TO authenticated;
GRANT ALL ON public.buyer_portfolio_stats TO service_role;
