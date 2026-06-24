import { deriveInvestorType } from "@/lib/buyer-helpers";
import { Briefcase, Home, Hammer, Wrench, Building } from "lucide-react";

const ICON: Record<string, any> = {
  Flipper: Wrench,
  Landlord: Home,
  Wholetailer: Briefcase,
  Builder: Hammer,
  "Multi-Strategy": Building,
};

function typeTone(label: string): "cash" | "landlord" | "flipper" | "builder" {
  const t = label.toLowerCase();
  if (t === "flipper") return "flipper";
  if (t === "landlord") return "landlord";
  if (t === "builder") return "builder";
  return "cash";
}

export function InvestorTypeBadge({ buyer, className = "" }: { buyer: any; className?: string }) {
  const label = deriveInvestorType(buyer);
  const Icon = ICON[label] ?? Briefcase;
  const tone = typeTone(label);
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${className}`}
      style={{ background: `var(--buyer-${tone}-bg)`, color: `var(--buyer-${tone}-fg)` }}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
