'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function MemosPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard')}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">E-Memos</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Manage your electronic memos
          </p>
        </div>
      </div>

      {/* E-memo UI will go here */}
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-sm text-muted-foreground">E-memo inbox will be implemented here</p>
      </div>
    </div>
  );
}
