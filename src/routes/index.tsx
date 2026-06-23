import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Compass,
  ArrowRight,
  Banknote,
  Key,
  Hammer,
  Building2,
  Target,
  MapPin,
  Globe,
  UserPlus,
  Activity,
  Calculator,
  MessageSquare,
  Briefcase,
  Plug,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deal Compass — Every deal finds its perfect buyer" },
      {
        name: "description",
        content:
          "Cash buyers, landlords, flippers, and builders — one AI engine that scores, ranks, and reaches every buyer type for every wholesale deal.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) window.location.href = "/dashboard";
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-[1180px] mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <div className="w-7 h-7 rounded-[7px] bg-primary flex items-center justify-center">
              <Compass className="w-4 h-4 text-primary-foreground" />
            </div>
            <span>Deal Compass</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Product</a>
            <a href="#buyers" className="hover:text-foreground transition-colors">Buyer Network</a>
            <a href="#marketplace" className="hover:text-foreground transition-colors">Marketplace</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="hidden sm:inline-flex h-9 items-center px-4 rounded-full text-sm font-medium hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link to="/auth">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-full px-5 text-sm font-medium gap-1.5">
                Start Free <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 sm:px-8 text-center">
        <div className="max-w-[1180px] mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.08] tracking-[-0.03em] max-w-[780px] mx-auto mb-5">
            Every Deal. <br />
            Finds Its <span className="text-primary">Perfect Buyer.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-[600px] mx-auto mb-9 leading-relaxed">
            Cash buyers, landlords, flippers, and builders — one AI engine that scores, ranks,
            and reaches every buyer type for every deal you submit.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5 mb-14">
            <Link to="/auth">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-7 rounded-full text-base font-medium">
                Start matching free
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="outline"
                className="h-12 px-7 rounded-full text-base font-medium border-border bg-background hover:bg-surface-2"
              >
                Submit a deal
              </Button>
            </a>
          </div>

          {/* Product shot */}
          <div className="bg-surface border border-border rounded-3xl p-2 max-w-[1000px] mx-auto shadow-soft">
            <div className="bg-background rounded-[22px] p-7 text-left">
              <div className="flex gap-1.5 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-border" />
                <span className="w-2.5 h-2.5 rounded-full bg-border" />
                <span className="w-2.5 h-2.5 rounded-full bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-5">
                {/* Deal card */}
                <div className="bg-background border border-border rounded-2xl p-5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1.5">
                    Active deal
                  </div>
                  <div className="text-[17px] font-bold mb-3.5">
                    42 Ridgeline Trail, Lot 12 — San Antonio, TX
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{ background: "var(--buyer-cash-bg)", color: "var(--buyer-cash-fg)" }}
                    >
                      Vacant land · 2.4 acres
                    </span>
                    <span
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{ background: "var(--buyer-builder-bg)", color: "var(--buyer-builder-fg)" }}
                    >
                      Zoned residential
                    </span>
                  </div>
                  <MatchRow initials="RB" name="Ridgeline Builders LLC" score="97 · A" tier="a" />
                  <MatchRow initials="TX" name="Texas Land Partners" score="93 · A" tier="a" />
                  <MatchRow initials="JM" name="Jordan Mireles — Buy &amp; Hold" score="71 · B" tier="b" />
                </div>
                {/* Side stats */}
                <div className="flex flex-col gap-3">
                  <Stat label="Buyer types reached" value="4" />
                  <Stat label="Match score" value="97%" valueColor="var(--success)" />
                  <Stat label="Time to first offer" value="3 hrs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-12 border-t border-surface-2">
        <p className="text-center text-xs tracking-[0.08em] uppercase text-muted-foreground">
          Built for wholesalers moving cash, rental, and land deals nationwide
        </p>
      </section>

      {/* Buyer types */}
      <section id="buyers" className="py-20 sm:py-24 bg-surface">
        <div className="max-w-[1180px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <h2 className="text-3xl sm:text-[38px] font-bold tracking-tight mb-3.5">
              One engine. Every buyer type.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Most dispo tools only know cash buyers. Deal Compass scores landlords, builders,
              and flippers with criteria built for how they actually buy.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <BuyerTypeCard
              icon={Banknote}
              tone="cash"
              title="Cash buyers"
              copy="Flip & wholesale spread, ARV, rehab tolerance, proof of funds."
            />
            <BuyerTypeCard
              icon={Key}
              tone="landlord"
              title="Landlords"
              copy="Cap rate, rent comps, cash-on-cash, tenant occupancy preference."
            />
            <BuyerTypeCard
              icon={Hammer}
              tone="flipper"
              title="Flippers"
              copy="Condition tolerance, rehab budget bands, days-to-flip pace."
            />
            <BuyerTypeCard
              icon={Building2}
              tone="builder"
              title="Builders & land"
              copy="Acreage, zoning, utilities, topo, entitlements, lot count, build typology."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-24">
        <div className="max-w-[1180px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <h2 className="text-3xl sm:text-[38px] font-bold tracking-tight mb-3.5">
              Built for speed. Designed for closers.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Everything from buyer intelligence to public deal pages — refined into one workspace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={Target}
              title="Smart matching"
              badge="v2"
              copy="Deterministic + behavioral scoring across cash, landlord, flip, and land/builder buy boxes — weighted, explainable, 0–100."
            />
            <FeatureCard
              icon={MapPin}
              title="Buyer search by address"
              copy="Drop any address, instantly surface the highest-probability buyers nearby, skiptraced and ranked."
            />
            <FeatureCard
              icon={Globe}
              title="Public marketplace"
              badge="New"
              copy="Branded, mobile-ready deal pages buyers can browse, favorite, and request address access to."
            />
            <FeatureCard
              icon={UserPlus}
              title="Buyer self-onboarding"
              badge="New"
              copy="Buyers submit their own buy box — AI parses free-text criteria straight into structured fields."
            />
            <FeatureCard
              icon={Activity}
              title="Engagement tracking"
              badge="New"
              copy="See who viewed, clicked, and lingered on a deal — call your warmest buyer first."
            />
            <FeatureCard
              icon={Calculator}
              title="Comps & MAO"
              badge="New"
              copy="ARV from comps and rent data, MAO calculator, and land per-acre valuation for raw lots."
            />
            <FeatureCard
              icon={MessageSquare}
              title="In-platform messaging & offers"
              badge="New"
              copy="Buyers submit offers and negotiate directly — no more chasing texts across five apps."
            />
            <FeatureCard
              icon={Briefcase}
              title="Buyer portfolios"
              copy="Full purchase history per buyer — profit, ARV%, hold time, and what they're likely to buy next."
            />
            <FeatureCard
              icon={Plug}
              title="CRM, SMS & dialer"
              badge="New"
              copy="Push and pull from your existing CRM and dialer stack without leaving Deal Compass."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="max-w-[1180px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <h2 className="text-3xl sm:text-[38px] font-bold tracking-tight">
              Three steps from locked deal to signed assignment
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Step n={1} title="Submit the deal">
              Address, price, condition or land details — the engine classifies it instantly.
            </Step>
            <Step n={2} title="AI matches every buyer type">
              Cash, landlord, flip, and builder buyers ranked side by side with reasons.
            </Step>
            <Step n={3} title="Buyers respond in-platform">
              Offers, messages, and proof of funds land in one pipeline — pick the winner.
            </Step>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-8">
        <div className="bg-primary text-primary-foreground rounded-[28px] mx-auto max-w-[1116px] px-8 sm:px-10 py-16 sm:py-[72px] text-center">
          <h2 className="text-2xl sm:text-[34px] font-bold tracking-tight mb-3.5">
            Ready to match every deal, every time?
          </h2>
          <p className="text-base sm:text-base opacity-90 mb-7 max-w-xl mx-auto">
            Join wholesalers closing faster with buyer-type-aware AI matching.
          </p>
          <Link to="/auth">
            <Button className="bg-background text-primary hover:bg-surface-2 h-12 px-8 rounded-full text-base font-medium">
              Start free <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Deal Compass — Built for serious wholesalers.
      </footer>
    </div>
  );
}

function Stat({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="bg-surface rounded-xl p-3.5">
      <div className="text-[11px] text-muted-foreground mb-1">{label}</div>
      <div className="text-xl font-bold" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </div>
    </div>
  );
}

function MatchRow({
  initials,
  name,
  score,
  tier,
}: {
  initials: string;
  name: string;
  score: string;
  tier: "a" | "b";
}) {
  const tierColor = tier === "a" ? "var(--success)" : "var(--warning)";
  return (
    <div className="flex items-center justify-between py-2.5 border-t border-surface-2 first:border-t-0 text-[13px]">
      <div className="flex items-center gap-2 font-medium">
        <div className="w-[26px] h-[26px] rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
          {initials}
        </div>
        {name}
      </div>
      <div className="font-bold text-[13px]" style={{ color: tierColor }}>
        {score}
      </div>
    </div>
  );
}

function BuyerTypeCard({
  icon: Icon,
  tone,
  title,
  copy,
}: {
  icon: typeof Banknote;
  tone: "cash" | "landlord" | "flipper" | "builder";
  title: string;
  copy: string;
}) {
  const bg = `var(--buyer-${tone}-bg)`;
  const fg = `var(--buyer-${tone}-fg)`;
  return (
    <div className="bg-background border border-border rounded-2xl p-6 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3.5"
        style={{ background: bg, color: fg }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-[15px] font-bold mb-1.5">{title}</h4>
      <p className="text-[12.5px] text-muted-foreground leading-relaxed">{copy}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  copy,
  badge,
}: {
  icon: typeof Target;
  title: string;
  copy: string;
  badge?: string;
}) {
  return (
    <div className="border border-border rounded-[18px] p-7 transition-all hover:border-primary hover:shadow-card-hover">
      <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4">
        <Icon className="w-[22px] h-[22px]" />
      </div>
      <h3 className="text-[17px] font-bold mb-2 flex items-center gap-2">
        {title}
        {badge && (
          <span className="text-[10px] font-bold text-primary bg-primary-soft px-2 py-0.5 rounded-md">
            {badge}
          </span>
        )}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{copy}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-4 text-[15px]">
        {n}
      </div>
      <h3 className="text-[17px] font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px] mx-auto">
        {children}
      </p>
    </div>
  );
}
