'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useUIStore } from '@/stores';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';

export function AppHeader() {
  const { data: session } = useSession();
  const { notifications, unreadNotificationsCount, toggleSidebar, setSidebarOpen } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Auto-close sidebar on mobile after navigation
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 md:px-6">
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-4 text-sm"
              disabled
            />
          </div>
        </div>
        <div className="flex-1 md:hidden" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 md:gap-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 md:px-6 transition-colors duration-300">
      {/* Mobile Menu Toggle */}
      <Button
        variant="default"
        size="icon"
        className="lg:hidden h-9 w-9 bg-primary text-white hover:bg-primary/90"
        onClick={toggleSidebar}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Button>

      <div className="flex items-center gap-2 lg:hidden">
        <span className="text-lg font-bold text-primary truncate max-w-[120px]">McFin</span>
      </div>

      {/* Search - Desktop */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="search"
            placeholder="Search documents, memos..."
            className="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      {/* Right Section */}
      <div className="flex items-center gap-1 md:gap-3">
        {/* Search - Mobile Toggle (Placeholder) */}
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
          <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {unreadNotificationsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-0 -top-0 h-4 min-w-4 flex items-center justify-center rounded-full px-0.5 text-[8px] font-bold"
                >
                  {unreadNotificationsCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-32px)] md:w-80 dark:bg-gray-800 dark:border-gray-700">
            <DropdownMenuLabel className="font-semibold dark:text-gray-100">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-3 cursor-pointer dark:hover:bg-gray-700"
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {notification.message}
                    </p>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-1 md:px-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Avatar className="h-7 w-7">
                <AvatarImage src={(session?.user as any)?.image} alt={session?.user?.name || ''} />
                <AvatarFallback className="bg-primary text-white text-[10px] font-semibold">
                  {session?.user?.name ? getInitials(session.user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start hidden sm:flex">
                <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 leading-none">
                  {session?.user?.name}
                </span>
                <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium">
                  {(session?.user as any)?.role || 'User'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 dark:bg-gray-800 dark:border-gray-700">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{session?.user?.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="flex w-full cursor-pointer items-center dark:hover:bg-gray-700">
                <User className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-200">Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex w-full cursor-pointer items-center dark:hover:bg-gray-700">
                <Settings className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-200">Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer dark:hover:bg-gray-700">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
