import { TestResults } from "@/components/test/test-results";
import { notFound } from "next/navigation";

export default function TestResultsPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/40">
        <TestResults testId={params.id} />
    </div>
  );
}
