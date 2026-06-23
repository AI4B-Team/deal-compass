import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DealForm } from "@/components/DealForm";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_authenticated/deals/new")({
  head: () => ({ meta: [{ title: "New deal" }] }),
  component: NewDeal,
});

function NewDeal() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="New Deal" subtitle="Drop it in. We'll find your buyers instantly." />
      <DealForm onSaved={(id) => navigate({ to: "/deals/$id", params: { id } })} />
    </div>
  );
}
