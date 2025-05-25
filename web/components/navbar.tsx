'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuth from '@/lib/hooks/useAuth';
import { BarChart2, LogOut, Menu, X, List, Settings, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <nav className="border-b bg-background">
      <div className="max-w-[960px] mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href={isAuthPage ? "/" : "/cards"}
              className="text-lg font-semibold text-primary hover:text-primary/90 chinese-calligraphy"
            >
              <span className="font-bold">Anki AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                href="/cards"
                className={cn(
                  "text-sm font-medium transition-colors flex items-center",
                  isActive('/cards')
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="mr-1 h-4 w-4" />
                Cards
              </Link>
              <Link
                href="/cards/new"
                className={cn(
                  "text-sm font-medium transition-colors flex items-center",
                  isActive('/cards/new')
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Plus className="mr-1 h-4 w-4" />
                New Card
              </Link>
              <Link
                href="/statistics"
                className={cn(
                  "text-sm font-medium transition-colors flex items-center",
                  isActive('/statistics')
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <BarChart2 className="mr-1 h-4 w-4" />
                Statistics
              </Link>
            </div>
          )}

          {/* Theme Toggle and Avatar */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isAuthPage && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          M
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  variant="ghost"
                  size="icon"
                  className="sm:hidden"
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {!isAuthPage && isMenuOpen && (
        <div className="sm:hidden border-t">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/cards"
              className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                isActive('/cards')
                  ? "border-primary text-primary bg-primary/10"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <div className="flex items-center">
                <List className="h-5 w-5 mr-2" />
                Cards
              </div>
            </Link>
            <Link
              href="/cards/new"
              className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                isActive('/cards/new')
                  ? "border-primary text-primary bg-primary/10"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <div className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                New Card
              </div>
            </Link>
            <Link
              href="/statistics"
              className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                isActive('/statistics')
                  ? "border-primary text-primary bg-primary/10"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Statistics
              </div>
            </Link>
            <Link
              href="/settings"
              className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                isActive('/settings')
                  ? "border-primary text-primary bg-primary/10"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </div>
            </Link>
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full justify-start pl-3 pr-4 py-2 h-auto text-base font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <div className="flex items-center">
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </div>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
} 