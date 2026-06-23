import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Users, Target, Sparkles, Briefcase, Zap, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Disposition — Close Deals Faster" }] }),
  component: LandingPage,
});

function LandingPage() {
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) window.location.href = "/dashboard";
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg grad-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">Disposition</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link to="/auth">
              <Button className="grad-primary text-primary-foreground hover:opacity-90 h-9">
                Get started <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-24 lg:pt-40 lg:pb-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-[10%] -left-[10%] w-[55%] h-[60%] rounded-full blur-[140px]"
            style={{ background: "radial-gradient(circle, oklch(0.78 0.17 158 / 0.16) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[55%] rounded-full blur-[140px]"
            style={{ background: "radial-gradient(circle, oklch(0.74 0.13 220 / 0.12) 0%, transparent 70%)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="flex flex-col gap-7 lg:gap-8 z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-primary text-[11px] font-bold tracking-widest uppercase">Version 2.0 Live</span>
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
              Close deals faster with{" "}
              <span className="text-grad">intelligent disposition</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              The premium disposition engine for real estate wholesalers. Match your locked-up deals to your cash buyers instantly,
              generate personalized pitches, and track every touch to the close.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/auth">
                <Button size="lg" className="grad-primary text-primary-foreground hover:opacity-90 h-12 px-8 text-base shadow-[0_0_30px_-5px_oklch(0.78_0.17_158/0.5)]">
                  Start disposing <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base border-border/60 bg-white/5 hover:bg-white/10">
                  Explore features
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-8 pt-6 mt-2 border-t border-border/40">
              <div className="pt-6">
                <div className="text-2xl font-bold number">$4.2B+</div>
                <div className="text-muted-foreground text-sm">Deals disposed</div>
              </div>
              <div className="w-px h-10 bg-border/60 mt-6" />
              <div className="pt-6">
                <div className="text-2xl font-bold number">12k+</div>
                <div className="text-muted-foreground text-sm">Active buyers</div>
              </div>
            </div>
          </div>

          {/* Right: product mock */}
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl bg-[oklch(0.74_0.13_220/0.25)]" />
            <div className="absolute top-1/2 -left-16 w-44 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent rotate-45" />

            <div className="relative glass rounded-2xl p-4 shadow-elevated overflow-hidden">
              <div className="flex items-center gap-2 mb-5 border-b border-border/40 pb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="text-[10px] text-muted-foreground font-mono ml-3 uppercase tracking-widest">
                  app.disposition.io/dashboard
                </div>
              </div>

              <div className="space-y-4">
                {/* Deal card */}
                <div className="bg-white/5 rounded-xl p-4 border border-border/40">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-[10px] text-primary font-bold mb-1 uppercase tracking-widest">Active deal</div>
                      <div className="font-semibold">1244 Maplewood Terrace</div>
                    </div>
                    <div className="bg-primary/20 text-primary text-[10px] px-2 py-1 rounded font-bold uppercase">
                      98% match
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-white/5 rounded-lg" />
                    <div className="h-12 bg-white/5 rounded-lg" />
                    <div className="h-12 bg-white/5 rounded-lg" />
                  </div>
                </div>

                {/* Buyer notification */}
                <div className="relative -left-6 w-[calc(100%-1rem)] sm:w-72 glass rounded-xl p-3.5 border border-white/15 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full grad-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      JD
                    </div>
                    <div>
                      <div className="text-xs font-semibold">James Dalton</div>
                      <div className="text-[10px] text-muted-foreground italic">Sent POF • 2 mins ago</div>
                    </div>
                  </div>
                </div>

                {/* Engagement bar */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    <span>Buyer engagement</span>
                    <span>82%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="grad-primary h-full w-[82%] rounded-full shadow-[0_0_10px_oklch(0.78_0.17_158/0.6)]" />
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                style={{ background: "linear-gradient(to top, oklch(0.78 0.17 158 / 0.10), transparent)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">Built for speed. Designed for closers.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              From buyer list management to AI-powered matching and outreach — all in one refined workspace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <FeatureCard
              icon={Users}
              title="Buyer CRM"
              description="Maintain a curated cash buyers list with detailed buy-boxes — location, strategy, price range, condition, and more."
            />
            <FeatureCard
              icon={Target}
              title="Smart matching"
              description="Drop in a deal and instantly see which buyers it fits. Deterministic scoring from 0–100 with zero guesswork."
            />
            <FeatureCard
              icon={Sparkles}
              title="AI pitches"
              description="Generate personalized SMS and email outreach for every top match. Each pitch references the buyer's exact criteria."
            />
            <FeatureCard
              icon={Briefcase}
              title="Deal pipeline"
              description="Track every deal from locked to closed. Monitor inspection periods, closing deadlines, and assignment fees at a glance."
            />
            <FeatureCard
              icon={Zap}
              title="Instant ranking"
              description="See your buyers ranked A-tier, B-tier, C-tier, or stretch — so you know exactly who to call first."
            />
            <FeatureCard
              icon={BarChart3}
              title="Pipeline intelligence"
              description="Know your pipeline value, deals closing this week, and buyer engagement — all from one elegant dashboard."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">How it works</h2>
            <p className="text-muted-foreground">Three steps from locked deal to signed assignment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Drop the deal",
                desc: "Enter the property details, your price, and the deadline. The engine knows your buyers before you do.",
              },
              {
                num: "02",
                title: "Match & pitch",
                desc: "Review your ranked buyer list. Generate a personalized pitch for each top match in seconds.",
              },
              {
                num: "03",
                title: "Track to close",
                desc: "Mark interest, follow up, and identify the winner. Your pipeline stays clean and your close rate climbs.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="glass rounded-2xl p-8 relative overflow-hidden group hover:border-primary/30 transition-colors"
              >
                <div className="text-5xl font-bold text-grad opacity-30 mb-5">{item.num}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, oklch(0.78 0.17 158 / 0.10) 0%, transparent 60%)" }}
          />
        </div>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">Ready to dispose with precision?</h2>
          <p className="text-muted-foreground mb-8 text-base sm:text-lg">
            Join wholesalers who close faster by matching the right buyer to every deal.
          </p>
          <Link to="/auth">
            <Button size="lg" className="grad-primary text-primary-foreground hover:opacity-90 h-12 px-10 text-base">
              Get started free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md grad-primary flex items-center justify-center">
              <Building2 className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">Disposition</span>
          </div>
          <span className="text-xs text-muted-foreground">Built for serious wholesalers.</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Users;
  title: string;
  description: string;
}) {
  return (
    <div className="glass rounded-2xl p-6 hover:border-primary/20 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
