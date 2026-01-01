import { SidebarTrigger } from '@/components/ui/sidebar';
import { NewQuestionForm } from '@/components/questions/new-question-form';

interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <div className="block md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        {/* We can add breadcrumbs or other context here if needed */}
      </div>
      <div className="flex items-center gap-4">
        <NewQuestionForm />
      </div>
    </header>
  );
}
