'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuth from '@/lib/hooks/useAuth';
import { BarChart2, LogOut, Menu, X, ChevronDown } from 'lucide-react';
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

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <nav className="border-b bg-background">
      <div className="max-w-[430px] mx-auto px-4">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
                href={isAuthPage ? "/" : "/cards"}
                className="text-lg font-semibold text-primary hover:text-primary/90 chinese-calligraphy"
              >
                Anki Memory Card
              </Link>
            </div>
            {!isAuthPage && (
              <div className="hidden sm:flex sm:items-center sm:ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "h-9 px-2 text-sm font-medium",
                        isActive('/cards') || isActive('/statistics')
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      Menu
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/cards"
                        className={cn(
                          "flex items-center",
                          isActive('/cards') && "bg-accent"
                        )}
                      >
                        Cards
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/statistics"
                        className={cn(
                          "flex items-center",
                          isActive('/statistics') && "bg-accent"
                        )}
                      >
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Statistics
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
              </div>
            )}
          </div>
          {!isAuthPage && (
            <div className="flex items-center gap-2">
              <ThemeToggle />
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
            </div>
          )}
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
              Cards
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