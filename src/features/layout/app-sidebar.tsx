'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FileText,
  Folder,
  Mail,
  Settings,
  Users,
  LayoutDashboard,
  ChevronRight,
  ChevronDown,
  Video,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores';
import { useSession, signOut } from 'next-auth/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { mockCategories } from '@/lib/mock-data';
import type { Category } from '@/lib/types';
import { FolderTree, CreateFolderDialog } from '@/features/folders';
import { createFolder } from '@/services/folder.service';
import { toast } from 'sonner';
import { useFolderContext } from '@/contexts/folder-context';

// Extended Category type with children for tree display
interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

// Build hierarchical tree from flat category array
function buildCategoryTree(categories: Category[]): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>();
  const rootCategories: CategoryWithChildren[] = [];

  // First pass: create map of all categories
  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Second pass: build tree structure
  categories.forEach(cat => {
    const category = categoryMap.get(cat.id)!;
    if (cat.parentId) {
      const parent = categoryMap.get(cat.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(category);
      }
    } else {
      rootCategories.push(category);
    }
  });

  return rootCategories;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const adminNavItems: NavItem[] = [
  {
    title: 'Users',
    href: '/dashboard/admin/users',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

// Category Tree Component
function CategoryTreeItem({ category, level = 0 }: { category: CategoryWithChildren; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { selectedCategoryId, setSelectedCategoryId } = useUIStore();
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategoryId === category.id;

  const handleClick = () => {
    // Navigate to documents page if not already there
    if (!pathname.startsWith('/dashboard/documents')) {
      router.push('/dashboard/documents');
    }
    // Set selected category
    setSelectedCategoryId(category.id);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          level > 0 && 'pl-8 justify-self-end',
          isSelected
            ? 'bg-primary text-white'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        )}
      >
        {hasChildren && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center cursor-pointer"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
        {!hasChildren && <div className="w-4" />}
        <span className="flex-1 text-left">{category.name}</span>
        {category.documentCount && category.documentCount > 0 && (
          <span className={cn(
            "text-xs",
            isSelected ? "text-white/80" : "text-gray-500 dark:text-gray-400"
          )}>
            {category.documentCount}
          </span>
        )}
      </button>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.children!.map((child) => (
            <CategoryTreeItem key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryTree() {
  const { selectedCategoryId, setSelectedCategoryId } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  useEffect(() => {
    // Fetch categories with real counts from API
    fetch('/api/sidebar/data')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  const categoryTree = buildCategoryTree(categories);

  const handleAllDocuments = () => {
    if (!pathname.startsWith('/dashboard/documents')) {
      router.push('/dashboard/documents');
    }
    setSelectedCategoryId(null);
  };

  return (
    <div className="space-y-1">
      <div className="px-3 py-2">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Categories
        </h2>
      </div>

      {/* All Documents Option */}
      <button
        onClick={handleAllDocuments}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          selectedCategoryId === null
            ? 'bg-primary text-white'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        )}
      >
        <span className="flex-1 text-left">All Documents</span>
      </button>

      {categoryTree.map((category) => (
        <CategoryTreeItem key={category.id} category={category} />
      ))}
    </div>
  );
}

// Main Navigation Component
function MainNavigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';
  const [unreadMemos, setUnreadMemos] = useState(0);

  useEffect(() => {
    // Fetch real-time sidebar data
    fetch('/api/sidebar/data')
      .then(res => res.json())
      .then(data => {
        if (data.unreadMemos !== undefined) {
          setUnreadMemos(data.unreadMemos);
        }
      })
      .catch(err => console.error('Failed to fetch sidebar data:', err));
  }, []);

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Documents',
      href: '/dashboard/documents',
      icon: FileText,
    },
    {
      title: 'My Folders',
      href: '/dashboard/my-folders',
      icon: Folder,
    },
    {
      title: 'E-Memos',
      href: '/dashboard/memos',
      icon: Mail,
      badge: unreadMemos > 0 ? unreadMemos : undefined,
    },
    {
      title: 'E-Meetings',
      href: '/dashboard/meetings',
      icon: Video,
    },
    {
      title: 'E-Senate',
      href: '/dashboard/senate',
      icon: GraduationCap,
    },
  ];

  return (
    <>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.title}</span>
              {item.badge && (
                <span className={cn(
                  "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                  isActive ? "bg-white text-primary" : "bg-primary text-white"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin Section */}
      <>
        <Separator className="my-4 dark:bg-gray-700" />
        <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Admin
        </p>

        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </>
    </>
  );
}

// Memo Navigation Component
function MemoNavigation() {
  const pathname = usePathname();

  const memoItems = [
    {
      title: 'Create Memo',
      href: '/dashboard/memos/create',
    },
    {
      title: 'Draft',
      href: '/dashboard/memos/draft',
    },
    {
      title: 'Inbox',
      href: '/dashboard/memos/inbox',
    },
    {
      title: 'Sent',
      href: '/dashboard/memos/sent',
    },
    {
      title: 'Archive',
      href: '/dashboard/memos/archive',
    },
    {
      title: 'Tracking',
      href: '/dashboard/memos/tracking',
    },
    {
      title: 'Department Activity',
      href: '/dashboard/memos/department',
    },
  ];

  return (
    <>
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">E-Memos</h2>
        </div>
      </div>

      <nav className="space-y-1 mt-2">
        {memoItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block px-4 py-2 text-sm font-medium transition-colors rounded-lg mx-2',
                isActive
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

// Meeting Navigation Component
function MeetingNavigation() {
  const pathname = usePathname();

  const meetingItems = [
    {
      title: 'Meetings',
      href: '/dashboard/meetings',
    },
    {
      title: 'E-Senate Meeting List',
      href: '/dashboard/meetings/list',
    },
    {
      title: 'Vote Management',
      href: '/dashboard/meetings/vote-management',
    },
    {
      title: 'Give Vote',
      href: '/dashboard/meetings/give-vote',
    },
  ];

  return (
    <>
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Meetings</h2>
        </div>
      </div>

      <nav className="space-y-1 mt-2">
        {meetingItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block px-4 py-2 text-sm font-medium transition-colors rounded-lg mx-2',
                isActive
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebarCollapse, isSidebarOpen } = useUIStore();
  const { folders, setCurrentFolderId, setCurrentFolder, refreshFolders } = useFolderContext();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Determine what to show in sidebar based on current route
  const isDocumentsPage = pathname.startsWith('/dashboard/documents');
  const isMyFoldersPage = pathname.startsWith('/dashboard/my-folders');
  const isMemosPage = pathname.startsWith('/dashboard/memos');
  const isMeetingsPage = pathname.startsWith('/dashboard/meetings');

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300",
      // Desktop widths
      isSidebarCollapsed ? "lg:w-20" : "lg:w-64",
      // Mobile handling
      isSidebarOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {!isSidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-lg font-bold text-dark dark:text-white">McFin Docs</span>
            </Link>
          )}
          <button
            onClick={toggleSidebarCollapse}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              isSidebarCollapsed && "mx-auto"
            )}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>

        {/* Dynamic Content Area */}
        {!isSidebarCollapsed && (
          <ScrollArea className="flex-1 px-3 py-4">
            {isDocumentsPage ? (
              <CategoryTree />
            ) : isMyFoldersPage ? (
              <>
                <FolderTree
                  folders={folders}
                  selectedFolderId={useUIStore.getState().selectedFolderId}
                  onSelectFolder={(folderId) => {
                    const selectedId = folderId || null;
                    useUIStore.getState().setSelectedFolderId(selectedId);
                    // Update folder context
                    setCurrentFolderId(selectedId);
                    if (selectedId) {
                      const folder = folders.find(f => f.id === selectedId);
                      setCurrentFolder(folder || null);
                    } else {
                      setCurrentFolder(null);
                    }
                  }}
                  onCreateFolder={(parentId) => {
                    // Sidebar button creates root folders (no parent)
                    setCreateDialogOpen(true);
                  }}
                  onRenameFolder={(folderId) => {
                    console.log('Rename folder', folderId);
                    // TODO: Open rename folder dialog
                  }}
                  onDeleteFolder={(folderId) => {
                    console.log('Delete folder', folderId);
                    // TODO: Open delete folder dialog
                  }}
                />
                <CreateFolderDialog
                  open={createDialogOpen}
                  onOpenChange={(open) => {
                    setCreateDialogOpen(open);
                  }}
                  folders={folders}
                  parentId={undefined} // Sidebar always creates root folders
                  onCreate={async (name, parentId) => {
                    try {
                      await createFolder({ name, parentId });
                      toast.success('Folder created successfully');
                      // Refresh folders from shared context
                      refreshFolders();
                      setCreateDialogOpen(false);
                    } catch (error) {
                      toast.error('Failed to create folder');
                      console.error('Error creating folder:', error);
                    }
                  }}
                />
              </>
            ) : isMemosPage ? (
              <MemoNavigation />
            ) : isMeetingsPage ? (
              <MeetingNavigation />
            ) : (
              <MainNavigation />
            )}
          </ScrollArea>
        )}

        {/* Footer Section: Support & Logout */}
        {!isSidebarCollapsed && (
          <div className="border-t border-gray-200 p-4 space-y-2">
            {!isDocumentsPage && !isMyFoldersPage && !isMemosPage && !isMeetingsPage && (
              <div className="rounded-lg bg-gray-50 p-3 mb-2">
                <p className="text-xs font-semibold text-gray-700 mb-1">Need support?</p>
                <p className="text-xs text-gray-600 mb-2">Get help with document management.</p>
                <button className="w-full rounded-md bg-primary text-white text-xs font-medium py-2 hover:bg-primary/90 transition-colors">
                  Contact support
                </button>
              </div>
            )}

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
