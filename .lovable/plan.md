The spec is large (3 phases, ~9 feature areas, schema changes, design system swap). I'll scope this plan to **Phase 1** from the spec — that's already a multi-step build. Phases 2 & 3 land in follow-up turns once Phase 1 is in.

## 1. Brand & design system overhaul

Swap the current dark "Disposition / emerald" theme for the Real brand system applied Apple-style. Reference: `deal-compass-redesign-preview.html`.

- `src/styles.css`: light theme only. `--background: #FFFFFF`, surface `#FAFAFA`, primary `#CC0000`, primary-soft `#FCEBEB`, border `#EEEEEE`. Remove gradients/glow tokens. Pill radius `980px` for buttons, `14–24px` cards. Font: DM Sans 400/500/700 via `<link>` in `__root.tsx`.
- Rename product from "Disposition" → "Deal Compass" everywhere (nav, footer, meta titles, auth page).
- Rewrite `src/routes/index.tsx` landing to mirror the HTML preview: centered hero with one red accent word + soft-shadowed product shot, 3-col feature grid (red icon tile, hover lifts border to red), **new 4-up "Buyer types" section** (Cash · Landlord · Flipper · Builder & Land), red rounded CTA panel.
- Re-skin `AppShell`, `PageHeader`, `BuyerForm`, `DealForm`, `TierBadge`, auth page to the light/red system. Keep functionality intact.
- Sentence-case audit across all pages: headlines, section titles, button labels — first letter capitalized only (acronyms preserved).

## 2. Buyer-type schema + matching v2

One migration:

- `buyers`: add `buyer_type` (`cash_flip` default), `buyer_tags text[]`, landlord fields (`min_cap_rate`, `min_cash_on_cash`, `occupancy_pref`, `target_rent_min/max`), builder/land fields (`min_acreage`, `max_acreage`, `zoning_types`, `requires_utilities`, `requires_entitlements`, `min_lot_count`, `build_typology`).
- `deals`: add `deal_category` (`house` default), `acreage`, `zoning`, `utilities_status`, `topo_notes`, `entitlements_status`, `entry_fee`, `interest_rate`, `monthly_payment`.

Then:

- `src/lib/matching.ts`: branch on `buyer_type` before scoring. Cash/flip path = current scorer. Landlord path = rent-to-price, cap rate, cash-on-cash, occupancy. Builder/land path = acreage band, zoning hard-gate, utilities/entitlements bonus multipliers, `$/acre` price fit.
- Match-result rows render a type badge (Cash · Landlord · Builder/Land) next to the score.
- `BuyerForm` and `DealForm` become category-aware — `deal_category=land|creative_finance` hides irrelevant fields and reveals the matching ones.

## 3. Public marketplace + deal pages

New unauthenticated routes:

- `src/routes/marketplace.tsx` — grid of live deals with filters (state/county/city, price, house vs land, beds/baths, "just listed" sort). SEO meta.
- `src/routes/deals_.$slug.tsx` (pathless layout, no auth gate) — IL-style detail page: hero photo carousel, price/ARV/margin stat row, category-aware spec row (beds/baths/sqft OR acreage/zoning), condition & systems, repair range, attached PA link, "Make offer" + "Request address" CTAs, days-on-market, view count.
- Address masked until requested; address request captures buyer contact.
- Migration: `deals.public_slug text unique`, `deals.is_published boolean`, `deals.view_count int`, `address_requests` table. Public-read RLS policy gated on `is_published=true`.

## 4. Buyer self-onboarding + Buy Box

- `buyer_accounts` table separate from wholesaler `auth.users` (own RLS policies). Public sign-up route `src/routes/buyer-signup.tsx` + `src/routes/buyer-portal/*` for the buyer's own Buy Box manager and saved-deal feed.
- Buy Box form supports free-text entry; calls existing `parse-buybox` edge function and writes structured fields.
- Saved-search notifications: when a new published deal matches a buyer's Buy Box, queue email (Resend) / SMS (Twilio) via a new `notify-buyer-match` edge function. (Resend/Twilio secrets added if not already present.)

## 5. In-platform offers & messaging

- `offers` table (`deal_match_id`, `buyer_account_id`, `amount`, `terms jsonb`, `status`, `created_at`) + `offer_messages` table (`offer_id`, `sender_role`, `body`, `created_at`). Full GRANTs + RLS so both wholesaler and buyer see only their thread.
- Offer thread UI on both the wholesaler deal detail page and the buyer portal deal page.

## 6. Verification

- `tsgo` clean, migrations apply, RLS policies cover every new table.
- Smoke flow: create deal → publish → marketplace lists it → buyer signs up → submits offer → wholesaler sees thread.

## Technical notes (for the agent)

- All new public tables require `GRANT` to `anon` (public reads) and/or `authenticated` (writes) per the project's public-schema rule, plus `service_role` for the edge functions.
- Buyer accounts intentionally do NOT share `auth.users` with wholesalers — separate identity surface, separate RLS predicates keyed on `buyer_account_id`.
- Keep the existing `parse-buybox` edge function; reuse it from the buyer onboarding form.
- Phases 2 & 3 (engagement intelligence, Compass Mode address search, comps/MAO, transaction portfolios, integrations, team seats) are explicitly out of scope for this plan — flagged for a follow-up turn.

## Open question before I build

This is roughly 2–3 sprints of work in one go. Want me to:

- **(A)** Ship it all at once in this plan, or
- **(B)** Split it into 3 smaller plans — (1) brand + design redesign, (2) buyer types + matching v2 + category-aware forms, (3) public marketplace + buyer accounts + offers — so you can review each landing before the next?
