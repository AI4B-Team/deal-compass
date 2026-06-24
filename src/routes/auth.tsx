import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Compass, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In or Sign Up — Deal Compass" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinLoading, setSigninLoading] = useState(false);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigninLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signinEmail,
        password: signinPassword,
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message ?? "Sign in failed");
    } finally {
      setSigninLoading(false);
    }
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    setSignupLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      toast.success("Account created. Check your email to confirm.");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirm("");
    } catch (err: any) {
      toast.error(err.message ?? "Sign up failed");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left panel — Sign up */}
      <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 bg-surface border-r border-border">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-[8px] bg-primary flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Deal Compass</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Start Matching Deals</h2>
            <p className="text-sm text-muted-foreground">
              Create a free account to rank cash buyers, landlords, flippers, and builders.
            </p>
          </div>

          <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>AI-powered buyer matching by deal type and location</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>Skip tracing and contact info included for every buyer</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>Export matched buyer lists to CSV in one click</span>
            </li>
          </ul>

          <form onSubmit={onSignUp} className="space-y-4">
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="mt-1.5 bg-background"
              />
            </div>
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                required
                minLength={6}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="mt-1.5 bg-background"
              />
            </div>
            <div>
              <Label htmlFor="signup-confirm">Confirm Password</Label>
              <Input
                id="signup-confirm"
                type="password"
                required
                minLength={6}
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
                className="mt-1.5 bg-background"
              />
            </div>
            <Button
              type="submit"
              disabled={signupLoading}
              variant="outline"
              className="w-full h-11 rounded-full border-border hover:bg-background"
            >
              {signupLoading ? "..." : "Create Account"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right panel — Sign in */}
      <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 bg-background">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to your buyers list.</p>
          </div>

          <form onSubmit={onSignIn} className="space-y-4">
            <div>
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                required
                value={signinEmail}
                onChange={(e) => setSigninEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                required
                minLength={6}
                value={signinPassword}
                onChange={(e) => setSigninPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <Button
              type="submit"
              disabled={signinLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-full"
            >
              {signinLoading ? "..." : "Sign In"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-8">
            <Link to="/" className="hover:text-foreground">
              ← Back Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
