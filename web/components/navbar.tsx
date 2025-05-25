'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuth from '@/lib/hooks/useAuth';
import { BarChart2, LogOut, List, Settings, Plus } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (path: string) => pathname === path;
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between px-4 py-2">
          <Link
            href="/cards"
            className="text-lg font-semibold text-primary hover:text-primary/90 chinese-calligraphy"
          >
            <span className="font-bold">Anki AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/cards')}
                tooltip="Cards"
              >
                <Link href="/cards">
                  <List className="mr-2 h-4 w-4" />
                  <span>Cards</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/cards/new')}
                tooltip="New Card"
              >
                <Link href="/cards/new">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>New Card</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/statistics')}
                tooltip="Statistics"
              >
                <Link href="/statistics">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  <span>Statistics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/settings')}
                tooltip="Settings"
              >
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={logout}
                tooltip="Logout"
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
} 