import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Compass, ArrowRight, Check, Target, Users, MapPin } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In or Sign Up — Deal Compass" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

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
      setMode("signin");
    } catch (err: any) {
      toast.error(err.message ?? "Sign up failed");
    } finally {
      setSignupLoading(false);
    }
  };

  const isSignin = mode === "signin";

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left panel — brand / value props */}
      <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 bg-surface border-r border-border">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-[8px] bg-primary flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Deal Compass</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-4">
              Find The Right Buyer For Every Deal
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Submit any property and rank cash buyers, landlords, flippers, and builders by what they actually buy.
            </p>
          </div>

          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">AI-Powered Matching</p>
                <p>Ranked automatically by deal type, location, and buyer history.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Verified Buyer Data</p>
                <p>Skip tracing and contact info included with every match.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">All 50 States</p>
                <p>From vacant land to teardowns to rental portfolios.</p>
              </div>
            </li>
          </ul>

          <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-primary" />
            <span>No credit card required to get started.</span>
          </div>
        </div>
      </div>

      {/* Right panel — auth forms */}
      <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 bg-background">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-1">
              {isSignin ? "Welcome Back" : "Create Your Account"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isSignin ? "Sign in to your buyers list." : "Start matching deals to every buyer type."}
            </p>
          </div>

          {isSignin ? (
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
          ) : (
            <form onSubmit={onSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="mt-1.5"
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
                  className="mt-1.5"
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
                  className="mt-1.5"
                />
              </div>
              <Button
                type="submit"
                disabled={signupLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-full"
              >
                {signupLoading ? "..." : "Create Account"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          )}

          <div className="text-center text-sm text-muted-foreground mt-6">
            {isSignin ? "New here?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(isSignin ? "signup" : "signin")}
              className="text-primary hover:underline font-medium"
            >
              {isSignin ? "Create One" : "Sign In"}
            </button>
          </div>

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
