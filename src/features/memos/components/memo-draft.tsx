'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface Memo {
    _id: string;
    from: string;
    to: string[];
    subject: string;
    message: string;
    date: string;
    status: 'initiated' | 'pending' | 'reviewed' | 'approved';
}

function DraftMemoItem({ memo, onClick }: { memo: Memo, onClick: () => void }) {
    const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'D';

    return (
        <div
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary/50 hover:shadow-md cursor-pointer transition-all duration-200 group relative"
            onClick={onClick}
        >
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500 font-bold text-xs shrink-0">
                {getInitials(memo.to[0] || 'Draft')}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                        {memo.subject || '(Untitled Draft)'}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap uppercase">
                        {memo.date}
                    </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">
                    To: {memo.to.length > 0 ? memo.to.join(', ') : 'No recipients'}
                </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider">
                    Draft
                </span>
            </div>
        </div>
    );
}

export function MemoDraft() {
    const router = useRouter();
    const [drafts, setDrafts] = useState<Memo[]>([]);
    const [loading, setLoading] = useState(true);

    const { data: session } = useSession();
    const currentUserEmail = session?.user?.email;

    useEffect(() => {
        if (!currentUserEmail) return;
        const fetchDrafts = async () => {
            try {
                const res = await fetch('/api/memos');
                const result = await res.json();
                if (result.success) {
                    const userDrafts = result.data.filter((m: Memo) =>
                        m.from === currentUserEmail && m.status === 'initiated'
                    );
                    setDrafts(userDrafts);
                }
            } catch (error) {
                toast.error('Failed to load drafts');
            } finally {
                setLoading(false);
            }
        };
        fetchDrafts();
    }, [currentUserEmail]);

    const currentPage = 1;
    const totalPages = 1;
    const startItem = drafts.length > 0 ? 1 : 0;
    const endItem = drafts.length;
    const totalItems = drafts.length;

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading drafts...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/dashboard')}
                    className="h-8 w-8"
                >
                    <ArrowLeft className="h-4 w-4 text-gray-900" />
                </Button>
                <h1 className="text-2xl font-bold text-foreground">Memo Drafts</h1>
            </div>

            {/* Create Memo Button */}
            <div>
                <Button
                    onClick={() => router.push('/dashboard/memos/create')}
                    className="bg-primary hover:bg-primary/90"
                >
                    Create Memo
                </Button>
            </div>

            {/* List */}
            {drafts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12 shadow-sm text-center text-gray-500">
                    No drafts found
                </div>
            ) : (
                <div className="space-y-3">
                    {drafts.map((memo: Memo) => (
                        <DraftMemoItem
                            key={memo._id}
                            memo={memo}
                            onClick={() => router.push(`/dashboard/memos/create?id=${memo._id}`)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-end gap-4 text-sm text-muted-foreground">
                <span>
                    {startItem}-{endItem} of {totalItems}
                </span>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentPage === totalPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
