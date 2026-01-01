'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import {
  FlaskConical,
  LayoutGrid,
  Home,
  Upload,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

const menuItems = [
  { href: '/', label: 'Holding Pen', icon: Home },
  { href: '/test/generate', label: 'Generate Test', icon: FlaskConical },
  { href: '/questions', label: 'All Questions', icon: LayoutGrid },
  { href: '/documents', label: 'Documents', icon: Upload },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Logo />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <div className="flex items-center gap-3 p-2">
            <Avatar>
                <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-medium">Educator</span>
                <span className="text-xs text-muted-foreground">educator@testgenius.com</span>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
