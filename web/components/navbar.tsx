'use client';

import { BarChart2, LogOut, List, Settings, Plus, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import useAuth from '@/lib/hooks/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { toggleSidebar, isMobile } = useSidebar();

  const isActive = (path: string) => pathname === path;
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return null;
  }

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-background border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link
            href="/cards"
            className="text-lg font-semibold text-primary hover:text-primary/90 flex items-center"
          >
            <span className="font-bold">Anki AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      )}
      <Sidebar>
        <SidebarHeader className="flex flex-row items-center justify-between px-4 py-2">
        {!isMobile && (
          <>
            <Link
              href="/cards"
              className="text-lg font-semibold text-primary hover:text-primary/90 flex items-center"
            >
              <span className="font-bold">Anki AI</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </>
        )}
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
    </>
  );
} 