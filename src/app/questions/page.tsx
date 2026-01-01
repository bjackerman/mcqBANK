import AppLayout from "@/components/layout/app-layout";
import { QuestionsTable } from "@/components/questions/questions-table";

export default function QuestionsPage() {
  return (
    <AppLayout title="All Questions">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight font-headline">All Questions</h2>
          <p className="text-muted-foreground">Browse and manage all available questions.</p>
        </div>
        <QuestionsTable />
      </div>
    </AppLayout>
  );
}
