'use client';

import { useUIStore } from '@/stores';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        isSidebarCollapsed ? "pl-16" : "pl-64"
      )}>
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
