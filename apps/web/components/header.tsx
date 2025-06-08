'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Code2, Plus, User, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Snippet Vault</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button asChild variant="ghost\" size="sm">
                <Link href="/create\" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create</span>
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/my-snippets" className="flex items-center space-x-2">
                      <Code2 className="h-4 w-4" />
                      <span>My Snippets</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}