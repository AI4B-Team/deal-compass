import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Users, Briefcase, Settings, LogOut, Compass, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/buyers", label: "Buyers", icon: Users },
  { to: "/deals", label: "Deals", icon: Briefcase },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const Brand = ({ size = 7 }: { size?: number }) => (
    <div className="flex items-center gap-2">
      <div
        className="rounded-[7px] bg-primary flex items-center justify-center"
        style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      >
        <Compass className="text-primary-foreground" style={{ width: 16, height: 16 }} />
      </div>
      <span className="font-bold tracking-tight">Deal Compass</span>
    </div>
  );

  const NavItems = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-1 px-3">
      {nav.map((n) => {
        const active = path.startsWith(n.to);
        const Icon = n.icon;
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              active
                ? "bg-primary-soft text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            )}
          >
            <Icon className="w-4 h-4" />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-surface">
        <div className="px-6 py-5">
          <Brand />
        </div>
        <div className="mt-4 flex-1">
          <NavItems />
        </div>
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background/90 backdrop-blur border-b border-border px-4 h-14 flex items-center justify-between">
        <Brand />
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 top-14 z-20 bg-background pt-4">
          <NavItems onClick={() => setOpen(false)} />
          <div className="px-3 mt-4">
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-start text-muted-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      )}

      <main className="flex-1 lg:pl-0 pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

