import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BuyerForm } from "@/components/BuyerForm";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_authenticated/buyers/new")({
  head: () => ({ meta: [{ title: "Add Buyer" }] }),
  component: NewBuyer,
});

function NewBuyer() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Add buyer" subtitle="Capture their buy-box once — match deals forever." />
      <BuyerForm onSaved={(id) => navigate({ to: "/buyers/$id", params: { id } })} />
    </div>
  );
}
