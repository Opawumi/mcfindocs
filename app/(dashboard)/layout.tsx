import { AppLayout } from '@/features/layout';
import { FolderProvider } from '@/contexts/folder-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FolderProvider>
      <AppLayout>{children}</AppLayout>
    </FolderProvider>
  );
}

