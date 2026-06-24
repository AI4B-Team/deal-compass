import { deriveInvestorType } from "@/lib/buyer-helpers";
import { Briefcase, Home, TreePine, Hammer, Wrench, Building } from "lucide-react";

const ICON: Record<string, any> = {
  Flipper: Wrench,
  Landlord: Home,
  Wholetailer: Briefcase,
  "Land Investor": TreePine,
  Builder: Hammer,
  "Multi-Strategy": Building,
};

export function InvestorTypeBadge({ buyer, className = "" }: { buyer: any; className?: string }) {
  const label = deriveInvestorType(buyer);
  const Icon = ICON[label] ?? Briefcase;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[color:var(--primary-soft)] text-primary ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
