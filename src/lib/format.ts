export const fmtMoney = (n: number | null | undefined) => {
  if (n === null || n === undefined || isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(n));
};
export const fmtNum = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : new Intl.NumberFormat("en-US").format(Number(n));

export const daysUntil = (date: string | null | undefined): number | null => {
  if (!date) return null;
  const ms = new Date(date).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

export const urgencyColor = (d: number | null) => {
  if (d === null) return "text-muted-foreground";
  if (d < 0) return "text-destructive";
  if (d <= 3) return "text-destructive";
  if (d <= 7) return "text-[color:var(--warning)]";
  return "text-muted-foreground";
};
