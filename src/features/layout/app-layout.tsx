'use client';

import { useUIStore } from '@/stores';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isSidebarCollapsed, isSidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div className="relative min-h-screen bg-white">
      {/* Sidebar - Desktop (Fixed) and Mobile (Overlay) */}
      <AppSidebar />

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={cn(
        "transition-all duration-300 min-h-screen flex flex-col",
        // Desktop padding
        "lg:pl-64",
        isSidebarCollapsed && "lg:pl-20",
        // Mobile padding
        "pl-0"
      )}>
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
