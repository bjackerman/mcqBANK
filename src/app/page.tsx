import AppLayout from "@/components/layout/app-layout";
import { HoldingPen } from "@/components/dashboard/holding-pen";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <AppLayout title="Holding Pen">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Holding Pen</h2>
          <p className="text-muted-foreground">Review, correct, and graduate new questions.</p>
        </div>
        <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
          <HoldingPen />
        </Suspense>
      </div>
    </AppLayout>
  );
}
