import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  A: "bg-[color:var(--tier-a)]/15 text-[color:var(--tier-a)] border-[color:var(--tier-a)]/30",
  B: "bg-[color:var(--tier-b)]/15 text-[color:var(--tier-b)] border-[color:var(--tier-b)]/30",
  C: "bg-[color:var(--tier-c)]/15 text-[color:var(--tier-c)] border-[color:var(--tier-c)]/30",
  Stretch: "bg-muted text-muted-foreground border-border",
};

export function TierBadge({ tier, className }: { tier: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border", styles[tier] ?? styles.C, className)}>
      {tier}
    </span>
  );
}
