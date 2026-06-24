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
  Activity,
  Calculator,
  MessageSquare,
  Briefcase,
  Plug,
  Search,
  FileText,
  Sparkles,
  Inbox,
  Trophy,
  Check,
  X,
  Users,
  Map,
  Brain,
  Star,
  Clock,
  ShieldCheck,
  PiggyBank,
  Link2,
  Home,
  Receipt,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deal Compass — Stop Blasting Deals. Start Matching Buyers." },
      {
        name: "description",
        content:
          "AI-powered buyer matching for wholesalers. Submit any property — Deal Compass ranks cash buyers, landlords, flippers, and builders based on what they actually buy.",
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
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <div className="w-7 h-7 rounded-[7px] bg-primary flex items-center justify-center">
              <Compass className="w-4 h-4 text-primary-foreground" />
            </div>
            <span>Deal Compass</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-muted-foreground">
            <a href="#process" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="hidden sm:inline-flex h-9 items-center px-4 rounded-full text-sm font-medium hover:text-primary transition-colors"
            >
              Log In
            </Link>
            <Link to="/auth">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-full px-5 text-sm font-medium gap-1.5">
                Find Buyers Now <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 sm:pt-24 pb-16 px-6 sm:px-8 text-center">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold leading-[1.05] tracking-[-0.03em] max-w-[860px] mx-auto mb-6">
            Instantly Find Buyers <br />
            <span className="text-primary">For Any Deal Faster</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-[680px] mx-auto mb-9 leading-relaxed">
            Submit any property and Deal Compass automatically ranks cash buyers, landlords,
            flippers, and builders based on what they actually buy.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5 mb-10">
            <Link to="/auth">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-7 rounded-full text-base font-medium">
                Find Buyers Now <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                variant="outline"
                className="h-12 px-7 rounded-full text-base font-medium border-border bg-background hover:bg-surface-2"
              >
                Submit A Deal
              </Button>
            </Link>
          </div>

          {/* Trust metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[820px] mx-auto mb-14">
            <TrustMetric icon={Users} label="50,000+ Buyers" />
            <TrustMetric icon={Map} label="All 50 States" />
            <TrustMetric icon={Brain} label="AI-Powered Matching" />
            <TrustMetric icon={Target} label="Ranked Automatically" />
          </div>

          {/* Hero mockup — buyer matching interface */}
          <div className="bg-surface border border-border rounded-3xl p-2 max-w-[1080px] mx-auto shadow-soft text-left">
            <div className="bg-background rounded-[22px] p-5 sm:p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-border" />
                  <span className="w-2.5 h-2.5 rounded-full bg-border" />
                  <span className="w-2.5 h-2.5 rounded-full bg-border" />
                </div>
                <div className="text-[11px] text-muted-foreground font-medium hidden sm:block">
                  app.dealcompass.com / deals / ridgeline-trail-12
                </div>
              </div>

              {/* Property header */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 pb-5 border-b border-border">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                    Active Deal
                  </div>
                  <div className="text-[20px] sm:text-[22px] font-bold leading-tight">
                    42 Ridgeline Trail, Lot 12
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">San Antonio, TX</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Tag tone="cash">Vacant Land · 2.4 Acres</Tag>
                  <Tag tone="builder">Zoned Residential</Tag>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-[13px] font-semibold">Top Buyer Matches</div>
                <div className="text-[11px] text-muted-foreground">Ranked by AI</div>
              </div>

              <div className="grid gap-2.5">
                <MatchCard
                  initials="SF"
                  name="Southtown Flips LLC"
                  type="Flipper"
                  score={93}
                  probability="High"
                  reasons={[
                    "Completed 17 flips in last 12 months",
                    "Average hold time 4.5 months",
                    "Active in San Antonio",
                  ]}
                  trackRecord={{ deals: 17, avgPrice: "$152k", recent: [
                    { addr: "1820 Fawn Crk Lot 4", type: "flip", price: "$152,000" },
                    { addr: "29 Boerne Stage Rd", type: "flip", price: "$148,500" },
                  ] }}
                />
                <MatchCard
                  initials="RB"
                  name="Redline Builders LLC"
                  type="Builder"
                  score={89}
                  probability="High"
                  reasons={[
                    "Builds infill homes",
                    "Buys residential lots",
                    "Purchased nearby recently",
                  ]}
                  trackRecord={{ deals: 31, avgPrice: "$96k", recent: [
                    { addr: "112 Alamo Heights Ln", type: "new_build", price: "$112,000" },
                    { addr: "508 Olmos Park Way", type: "new_build", price: "$88,500" },
                  ] }}
                />
                <MatchCard
                  initials="JM"
                  name="Jordan Morales"
                  type="Landlord"
                  score={78}
                  probability="Medium"
                  reasons={[
                    "Buy & hold investor",
                    "Prefers rental corridors",
                    "Strong closing history",
                  ]}
                  trackRecord={{ deals: 8, avgPrice: "$165k", recent: [
                    { addr: "744 Southtown Blvd", type: "rental", price: "$172,000" },
                  ] }}
                />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-10 border-t border-surface-2">
        <p className="text-center text-xs tracking-[0.08em] uppercase text-muted-foreground">
          Built For Wholesalers Moving Cash, Rental, Flip, And Land Deals Nationwide
        </p>
      </section>

      {/* Differentiation — comparison */}
      <section id="why" className="py-20 sm:py-24 bg-surface">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <h2 className="text-3xl sm:text-[42px] font-bold tracking-tight mb-3.5">
              Why Deal Compass Beats <br />
              <span className="text-primary">Buyer Lists & Software</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Same address. Two completely different outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Traditional */}
            <div className="bg-background border border-border rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-full bg-surface-2 text-muted-foreground flex items-center justify-center">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[15px] font-bold">Buyer Lists & Software</div>
                  <div className="text-xs text-muted-foreground">Generic tools</div>
                </div>
              </div>
              <ul className="space-y-3">
                <CompareRow ok={false}>Cash buyers only</CompareRow>
                <CompareRow ok={false}>Same blast sent to everyone</CompareRow>
                <CompareRow ok={false}>No ranking</CompareRow>
                <CompareRow ok={false}>No buyer intent data</CompareRow>
                <CompareRow ok={false}>Manual follow-up</CompareRow>
                <CompareRow ok={false}>No auto marketing</CompareRow>
                <CompareRow ok={false}>Hope someone bites</CompareRow>
              </ul>
            </div>

            {/* Deal Compass */}
            <div className="bg-background border-2 border-primary rounded-2xl p-7 relative shadow-card-hover">
              <span className="absolute -top-3 right-6 text-[10px] font-bold tracking-wider uppercase bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
                Deal Compass
              </span>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[15px] font-bold">AI Buyer Matching</div>
                  <div className="text-xs text-muted-foreground">The Deal Compass way</div>
                </div>
              </div>
              <ul className="space-y-3">
                <CompareRow ok>Cash buyers</CompareRow>
                <CompareRow ok>Landlords</CompareRow>
                <CompareRow ok>Flippers</CompareRow>
                <CompareRow ok>Builders</CompareRow>
                <CompareRow ok>Land investors</CompareRow>
                <CompareRow ok>AI buyer ranking</CompareRow>
                <CompareRow ok>Match explanations</CompareRow>
                <CompareRow ok>Smart targeting</CompareRow>
                <CompareRow ok>Auto marketing</CompareRow>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer types */}
      <section id="buyers" className="py-20 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <h2 className="text-3xl sm:text-[42px] font-bold tracking-tight mb-3.5">
              One Engine. Every Buyer Type.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Most dispo tools only know cash buyers. Deal Compass scores every buyer that
              matters — with the criteria they actually use to buy.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <BuyerTypeCard
              icon={Banknote}
              tone="cash"
              title="Cash Buyers"
              need="Speed, spread, proof of funds."
            />
            <BuyerTypeCard
              icon={Key}
              tone="landlord"
              title="Landlords"
              need="Rent estimates, occupancy, cash flow."
            />
            <BuyerTypeCard
              icon={Hammer}
              tone="flipper"
              title="Flippers"
              need="Margin, renovation scope, resale value."
            />
            <BuyerTypeCard
              icon={Building2}
              tone="builder"
              title="Builders"
              need="Lot dimensions, zoning, density."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-24 bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-[900px] mx-auto mb-14">
            <h2 className="text-3xl sm:text-[42px] font-bold tracking-tight whitespace-nowrap">
              Everything You Need To Dispo Deals Faster
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              From the moment a deal is locked up to the moment it's assigned.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={Target}
              title="AI Buyer Matching"
              copy="Automatically ranks buyers based on purchase history and behavior."
            />
            <FeatureCard
              icon={Sparkles}
              title="Why This Buyer Matched"
              copy="See exactly why each buyer was selected — every score is explainable."
            />
            <FeatureCard
              icon={MapPin}
              title="Buyer Search By Address"
              copy="Find buyers actively purchasing near your deal, ranked and skiptraced."
            />
            <FeatureCard
              icon={Globe}
              title="Public Deal Marketplace"
              badge="New"
              copy="Publish deals to a branded public page buyers can browse and request access to."
            />
            <FeatureCard
              icon={MessageSquare}
              title="In-Platform Messaging"
              copy="Chat directly with buyers — no more chasing texts across five apps."
            />
            <FeatureCard
              icon={FileText}
              title="Offer Management"
              copy="Track offers and negotiations in one place from first contact to close."
            />
            <FeatureCard
              icon={Activity}
              title="Engagement Tracking"
              copy="See opens, views, clicks, and activity — call your warmest buyer first."
            />
            <FeatureCard
              icon={Calculator}
              title="Comps & MAO"
              copy="Estimate ARV, repairs, and offer ranges from real comp and rent data."
            />
            <FeatureCard
              icon={Briefcase}
              title="Buyer Profiles"
              copy="View purchase history, preferences, and buying patterns for every buyer."
            />
            <FeatureCard
              icon={Plug}
              title="CRM & SMS"
              copy="Manage conversations and follow-up without leaving Deal Compass."
            />
            <FeatureCard
              icon={Search}
              title="Smart Buyer Discovery"
              copy="Surface new buyers actively closing in the markets you wholesale."
            />
            <FeatureCard
              icon={Inbox}
              title="Unified Pipeline"
              copy="Every deal, every buyer, every conversation — one workspace."
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-20 sm:py-24">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-[900px] mx-auto mb-14">
            <h2 className="text-3xl sm:text-[42px] font-bold tracking-tight whitespace-nowrap">
              From Locked-Up Deal To Buyer In Minutes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Step n={1} title="Submit The Deal" copy="Enter address, property details, and photos." />
            <Step n={2} title="AI Matches Buyers" copy="Deal Compass ranks the buyers most likely to purchase." />
            <Step n={3} title="Buyers Engage" copy="Interested buyers receive the opportunity." />
            <Step n={4} title="Receive Offers" copy="Track offers, negotiations, and activity." />
            <Step n={5} title="Choose Your Buyer" copy="Accept the best offer and close." />
          </div>
        </div>
      </section>

      {/* Buyer Intelligence — Linked Deals + Property Intel + Closing Reliability */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-[760px] mx-auto mb-14">
            <h2 className="text-3xl sm:text-[42px] font-bold tracking-tight mb-3.5">
              See Every Buyer's Real Track Record
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Linked deals, property intelligence, and a closing‑reliability score on every buyer. Know who actually performs — not just who picks up the phone.
            </p>
          </div>

          {/* Mockup: buyer profile with linked deals + portfolio stats */}
          <div className="max-w-[1080px] mx-auto bg-card rounded-2xl border border-border shadow-elevated overflow-hidden mb-10">
            <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-bold text-lg">Hamilton Investment Group LLC</div>
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-primary" />
                  Closes a deal every ~38 days, mostly flips at 61% of ARV.
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-[color:var(--primary-soft)] text-primary">Flipper</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  <Trophy className="w-2.5 h-2.5" /> 87% Close Rate
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-[color:var(--surface-2)]">
                  <Link2 className="w-2.5 h-2.5" /> 23 Linked Deals
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 sm:px-6 py-5 bg-[color:var(--surface-2)]/40">
              <PortfolioStat label="Portfolio Value" value="$8.4M" />
              <PortfolioStat label="Avg Purchase" value="$182k" />
              <PortfolioStat label="Avg Flip Time" value="94 days" />
              <PortfolioStat label="Buy ARV%" value="61%" />
            </div>
            <div className="divide-y divide-border">
              <LinkedDealRow addr="4015 E Osborne Ave, Tampa FL" type="flip" purchasePrice="$165,000" purchaseDate="Mar 2026" soldPrice="$248,000" soldDate="Jul 2026" months={4} roi="50%" beds={3} baths={2} sqft={1480} />
              <LinkedDealRow addr="2208 Manhattan Ave, Tampa FL" type="flip" purchasePrice="$198,500" purchaseDate="Jan 2026" soldPrice="$295,000" soldDate="Jun 2026" months={5} roi="49%" beds={4} baths={2} sqft={1820} />
              <LinkedDealRow addr="912 Lake Carlton Dr, Plant City FL" type="rental" purchasePrice="$224,000" purchaseDate="Dec 2025" beds={3} baths={2.5} sqft={2010} />
            </div>
          </div>

          {/* Three pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <IntelCard
              icon={Link2}
              title="Linked Deals & Portfolio"
              copy="Every buyer's full purchase history — flip count, rental count, lots owned, portfolio value, average ARV%. Self‑qualify before you reach out."
            />
            <IntelCard
              icon={Home}
              title="Property Intelligence"
              copy="Owner, tax assessment, mortgage, lender, monthly payment, and live equity estimate on every deal you load. Vet without leaving Deal Compass."
            />
            <IntelCard
              icon={ShieldCheck}
              title="Closing Reliability Score"
              copy="Offers closed ÷ offers made. Surfaces the buyers who actually perform — not just the ones with the loudest cash buyer list bio."
            />
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-[680px] mx-auto mb-12">
            <h2 className="text-3xl sm:text-[42px] font-bold tracking-tight mb-3.5">

              Wholesalers Are Closing Faster With Deal Compass
            </h2>
          </div>

          {/* Metrics strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-[980px] mx-auto">
            <MetricStat value="50,000+" label="Active Buyers" />
            <MetricStat value="< 24h" label="Average Time To Offer" />
            <MetricStat value="93%" label="Match Accuracy" />
            <MetricStat value="50" label="States Covered" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Testimonial
              quote="$42,000 assignment fee. Found the buyer in under 24 hours."
              name="Marcus W."
              role="Wholesaler · Dallas, TX"
            />
            <Testimonial
              quote="Deal Compass showed buyers I never would have contacted."
              name="Priya R."
              role="Dispo Manager · Phoenix, AZ"
            />
            <Testimonial
              quote="The buyer explanations alone changed our dispo process."
              name="Jordan T."
              role="Acquisitions Lead · Atlanta, GA"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-8">
        <div className="bg-primary text-primary-foreground rounded-[28px] mx-auto max-w-[1116px] px-8 sm:px-10 py-16 sm:py-[72px] text-center">
          <h2 className="text-2xl sm:text-[38px] font-bold tracking-tight mb-3.5 leading-tight">
            Every Deal Has A Buyer. <br className="hidden sm:block" />
            We'll Help You Find Them.
          </h2>
          <p className="text-base sm:text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Stop blasting deals and start matching them.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/auth">
              <Button className="bg-background text-primary hover:bg-surface-2 h-12 px-8 rounded-full text-base font-medium">
                Find Buyers Now <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                variant="outline"
                className="h-12 px-8 rounded-full text-base font-medium bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Book A Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Deal Compass — Built For Serious Wholesalers.
      </footer>
    </div>
  );
}

/* ───────────────────────── sub-components ───────────────────────── */

function TrustMetric({ icon: Icon, label }: { icon: typeof Users; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
      <Icon className="w-4 h-4 text-primary" />
      <span>{label}</span>
    </div>
  );
}

function Tag({
  tone,
  children,
}: {
  tone: "cash" | "landlord" | "flipper" | "builder";
  children: React.ReactNode;
}) {
  return (
    <span
      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
      style={{ background: `var(--buyer-${tone}-bg)`, color: `var(--buyer-${tone}-fg)` }}
    >
      {children}
    </span>
  );
}

function typeTone(type: string): "cash" | "landlord" | "flipper" | "builder" {
  const t = type.toLowerCase();
  if (t === "flipper" || t === "flip") return "flipper";
  if (t === "landlord" || t === "rental" || t === "buy_hold") return "landlord";
  if (t === "builder" || t === "new_build" || t === "land") return "builder";
  return "cash";
}

function MatchCard({
  initials,
  name,
  type,
  score,
  probability,
  reasons,
  trackRecord,
}: {
  initials: string;
  name: string;
  type: string;
  score: number;
  probability: string;
  reasons: string[];
  trackRecord?: { deals: number; avgPrice: string; recent: { addr: string; type: string; price: string }[] };
}) {
  const tone = typeTone(type);
  const probColor =
    probability === "High" ? "var(--success)" : probability === "Medium" ? "var(--warning)" : "var(--muted-foreground)";
  return (
    <div className="border border-border rounded-2xl p-4 sm:p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground text-[12px] font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-semibold text-[15px]">{name}</div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: `var(--buyer-${tone}-bg)`, color: `var(--buyer-${tone}-fg)` }}
            >
              {type}
            </span>
          </div>
          <ul className="mt-2 space-y-1">
            {reasons.map((r) => (
              <li key={r} className="text-[12.5px] text-muted-foreground flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Score</div>
          <div className="text-[24px] font-bold leading-none number text-primary">{score}</div>
        </div>
      </div>
      {trackRecord && (
        <div className="mt-3 rounded-lg bg-[color:var(--surface-2)]/60 border border-border p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Track Record</div>
            <div className="text-[11px] text-muted-foreground">
              <span className="text-foreground font-semibold">{trackRecord.deals}</span> deals · avg{" "}
              <span className="text-foreground font-semibold">{trackRecord.avgPrice}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            {trackRecord.recent.map((r) => {
              const rTone = typeTone(r.type);
              return (
                <div key={r.addr} className="flex items-center justify-between text-[11.5px] py-0.5">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="truncate">{r.addr}</span>
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: `var(--buyer-${rTone}-bg)`, color: `var(--buyer-${rTone}-fg)` }}
                    >
                      {r.type}
                    </span>
                  </span>
                  <span className="number font-semibold shrink-0">{r.price}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2 text-center">
        <MiniStat label="Deals" value={trackRecord ? String(trackRecord.deals) : "—"} />
        <MiniStat label="Probability" value={probability} valueColor={probColor} />
        <MiniStat label="Type" value={type} valueColor={`var(--buyer-${tone}-fg)`} />
      </div>
    </div>
  );
}


function MiniStat({
  icon: Icon,
  label,
  value,
  valueColor,
}: {
  icon?: typeof Clock;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div>
      <div className="text-[9.5px] font-medium uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </div>
      <div
        className="text-[12.5px] font-semibold mt-0.5"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function CompareRow({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 text-[14px]">
      {ok ? (
        <span className="w-5 h-5 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0">
          <Check className="w-3 h-3" />
        </span>
      ) : (
        <span className="w-5 h-5 rounded-full bg-surface-2 text-muted-foreground flex items-center justify-center shrink-0">
          <X className="w-3 h-3" />
        </span>
      )}
      <span className={ok ? "text-foreground" : "text-muted-foreground line-through decoration-muted-foreground/40"}>
        {children}
      </span>
    </li>
  );
}

function BuyerTypeCard({
  icon: Icon,
  tone,
  title,
  need,
}: {
  icon: typeof Banknote;
  tone: "cash" | "landlord" | "flipper" | "builder";
  title: string;
  need: string;
}) {
  const bg = `var(--buyer-${tone}-bg)`;
  const fg = `var(--buyer-${tone}-fg)`;
  return (
    <div className="bg-background border border-border rounded-2xl p-6 text-center hover:border-primary/40 transition-colors">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3.5"
        style={{ background: bg, color: fg }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-[15px] font-bold mb-2">{title}</h4>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Need</div>
      <p className="text-[12.5px] text-foreground leading-relaxed">{need}</p>
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
    <div className="bg-background border border-border rounded-[18px] p-7 transition-all hover:border-primary hover:shadow-card-hover">
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

function Step({ n, title, copy }: { n: number; title: string; copy: string }) {
  return (
    <div className="bg-background border border-border rounded-2xl p-6 text-center hover:border-primary/40 transition-colors">
      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-4 text-[15px]">
        {n}
      </div>
      <h3 className="text-[15px] font-bold mb-2">{title}</h3>
      <p className="text-[12.5px] text-muted-foreground leading-relaxed">{copy}</p>
    </div>
  );
}

function MetricStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-background border border-border rounded-2xl p-5 text-center">
      <div className="text-[26px] sm:text-[32px] font-bold tracking-tight text-primary number leading-none">
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-2 font-medium">
        {label}
      </div>
    </div>
  );
}

function Testimonial({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="bg-background border border-border rounded-2xl p-7">
      <div className="flex gap-0.5 mb-3 text-primary">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-current" />
        ))}
      </div>
      <p className="text-[15px] leading-relaxed text-foreground mb-5">"{quote}"</p>
      <div>
        <div className="text-[13px] font-semibold">{name}</div>
        <div className="text-[12px] text-muted-foreground">{role}</div>
      </div>
    </div>
  );
}

function PortfolioStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-lg p-3 border border-border">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-base font-bold number mt-0.5">{value}</div>
    </div>
  );
}

function LinkedDealRow({ addr, type, purchasePrice, purchaseDate, soldPrice, soldDate, months, roi, beds, baths, sqft }: { addr: string; type: string; purchasePrice: string; purchaseDate: string; soldPrice?: string; soldDate?: string; months?: number; roi?: string; beds?: number; baths?: number; sqft?: number }) {
  const clr =
    type === "flip" ? "bg-[color:var(--primary-soft)] text-primary" :
    type === "rental" ? "bg-blue-100 text-blue-900" :
    "bg-amber-100 text-amber-900";
  return (
    <div className="px-5 sm:px-6 py-3 flex items-center justify-between gap-4 hover:bg-[color:var(--surface-2)]/40 transition-colors cursor-pointer">
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm flex items-center gap-2 flex-wrap">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{addr}</span>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${clr}`}>{type}</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            <ShieldCheck className="w-2.5 h-2.5" /> Verified
          </span>
        </div>
        {(beds || baths || sqft) && (
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {beds ?? "—"}bd / {baths ?? "—"}ba · {sqft ? sqft.toLocaleString() : "—"} sqft
            {months !== undefined && <> · held <span className="text-foreground font-medium">{months} mo</span></>}
            {roi && <> · <span className="text-emerald-700 font-semibold">{roi} ROI</span></>}
          </div>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-2 sm:gap-3">
        <div className="bg-card border border-border rounded-lg px-3 py-2 min-w-[90px] text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Purchase</div>
          <div className="text-sm font-semibold number">{purchasePrice}</div>
          <div className="text-xs text-muted-foreground">{purchaseDate}</div>
        </div>
        <div className="bg-card border border-border rounded-lg px-3 py-2 min-w-[90px] text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sale</div>
          {soldPrice ? (
            <>
              <div className="text-sm font-semibold number text-emerald-700">{soldPrice}</div>
              <div className="text-xs text-muted-foreground">{soldDate ?? "—"}</div>
            </>
          ) : (
            <>
              <div className="text-sm font-semibold number text-muted-foreground">—</div>
              <div className="text-xs text-muted-foreground">Not sold</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function IntelCard({ icon: Icon, title, copy }: { icon: any; title: string; copy: string }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-elevated transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-[color:var(--primary-soft)] flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{copy}</p>
    </div>
  );
}
