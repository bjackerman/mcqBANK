import { TestTube2 } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2" >
      <TestTube2 className="h-6 w-6 text-accent" />
      <span className="font-headline text-lg font-bold">TestGenius</span>
    </div>
  );
}
