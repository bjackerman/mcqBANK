import AppLayout from "@/components/layout/app-layout";
import { TestPlayer } from "@/components/test/test-player";
import { notFound } from "next/navigation";

export default function TakeTestPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/40">
        <TestPlayer testId={params.id} />
    </div>
  );
}
