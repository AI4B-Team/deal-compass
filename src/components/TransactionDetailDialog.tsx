import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fmtMoney, fmtNum } from "@/lib/format";
import { monthsBetween, zillowUrl } from "@/lib/buyer-helpers";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Calendar, Bed, Bath, Maximize, TrendingUp, Home, Timer, GitCompare } from "lucide-react";

export function TransactionDetailDialog({
  txn,
  open,
  onOpenChange,
  subjectArvPct,
}: {
  txn: any | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** % of ARV the current subject deal is at, for buyer-comp comparison. */
  subjectArvPct?: number | null;
}) {
  if (!txn) return null;

  const months = monthsBetween(txn.purchase_date, txn.sold_date);
  const profit =
    txn.sold_price && txn.purchase_price ? Number(txn.sold_price) - Number(txn.purchase_price) : null;
  const roi =
    profit !== null && txn.purchase_price ? (profit / Number(txn.purchase_price)) * 100 : null;
  const arvPct =
    txn.purchase_price && txn.arv_at_purchase
      ? (Number(txn.purchase_price) / Number(txn.arv_at_purchase)) * 100
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            {txn.address}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {[txn.city, txn.state, txn.zip].filter(Boolean).join(", ")}
          </div>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 mt-2">
          <Pill>{(txn.deal_type ?? "—").toUpperCase()}</Pill>
          {txn.property_type && <Pill>{txn.property_type.replace(/_/g, " ")}</Pill>}
          {txn.confidence && <Pill>{txn.confidence}</Pill>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <Stat icon={Bed} label="Beds" v={fmtNum(txn.beds)} />
          <Stat icon={Bath} label="Baths" v={fmtNum(txn.baths)} />
          <Stat icon={Maximize} label="Sqft" v={fmtNum(txn.sqft)} />
          <Stat icon={Home} label="Acreage" v={txn.acreage ?? "—"} />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <Block title="Purchase">
            <Row label="Price" v={fmtMoney(txn.purchase_price)} strong />
            <Row label="Date" v={txn.purchase_date ?? "—"} icon={Calendar} />
            <Row label="ARV at purchase" v={fmtMoney(txn.arv_at_purchase)} />
            {arvPct !== null && <Row label="% of ARV" v={`${arvPct.toFixed(0)}%`} />}
            {txn.days_on_market != null && (
              <Row label="Days on market" v={`${txn.days_on_market} days`} icon={Timer} />
            )}
          </Block>
          <Block title="Sold / Current">
            <Row label="Sold price" v={fmtMoney(txn.sold_price)} strong />
            <Row label="Sold date" v={txn.sold_date ?? "Still owned"} icon={Calendar} />
            {months !== null && <Row label="Held for" v={`${months} mo`} />}
            {profit !== null && (
              <Row
                label="Profit"
                v={`${fmtMoney(profit)}${roi !== null ? ` · ${roi.toFixed(0)}% ROI` : ""}`}
                strong
              />
            )}
          </Block>
        </div>

        {/* Comp vs subject deal */}
        {subjectArvPct != null && arvPct != null && (
          <div className="mt-3 p-3 rounded-lg border border-border bg-card text-xs flex items-start gap-2">
            <GitCompare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Vs. your deal:</span>{" "}
              this buyer paid <span className="font-semibold">{arvPct.toFixed(0)}% of ARV</span> here.
              Your deal is at <span className="font-semibold">{subjectArvPct.toFixed(0)}%</span> —{" "}
              {subjectArvPct <= arvPct ? (
                <span className="text-emerald-700 font-semibold">priced inside their box ✓</span>
              ) : (
                <span className="text-amber-700 font-semibold">
                  {(subjectArvPct - arvPct).toFixed(0)} pts higher than they typically pay
                </span>
              )}
              .
            </div>
          </div>
        )}


        {(profit !== null && profit > 0) || months !== null ? (
          <div className="mt-3 p-3 rounded-lg bg-[color:var(--primary-soft)]/40 text-xs flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary shrink-0" />
            <span>
              This buyer {txn.sold_price ? "closed" : "is holding"}{" "}
              {months !== null && `after ${months} months`}
              {profit !== null && profit > 0 && ` with ${fmtMoney(profit)} in equity captured`}.
            </span>
          </div>
        ) : null}

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            asChild
          >
            <a
              href={zillowUrl(txn.address, txn.city, txn.state, txn.zip)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-1" /> View on Zillow
            </a>
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ icon: Icon, label, v }: { icon: any; label: string; v: any }) {
  return (
    <div className="rounded-lg border border-border p-2.5 bg-card">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="text-sm font-semibold number mt-0.5">{v}</div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: any }) {
  return (
    <div className="rounded-xl border border-border p-3 bg-card">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
        {title}
      </div>
      <div className="space-y-1.5 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, v, strong, icon: Icon }: { label: string; v: any; strong?: boolean; icon?: any }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </span>
      <span className={strong ? "font-semibold number" : "number"}>{v}</span>
    </div>
  );
}

function Pill({ children }: { children: any }) {
  return (
    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[color:var(--surface-2)]">
      {children}
    </span>
  );
}
