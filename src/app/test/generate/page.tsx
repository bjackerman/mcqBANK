import AppLayout from "@/components/layout/app-layout";
import { TestGenerator } from "@/components/test/test-generator";

export default function GenerateTestPage() {
  return (
    <AppLayout title="Generate Test">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Generate a New Test</h2>
          <p className="text-muted-foreground">Select criteria to build your custom test.</p>
        </div>
        <div className="flex justify-center pt-8">
            <TestGenerator />
        </div>
      </div>
    </AppLayout>
  );
}
