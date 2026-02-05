'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, ArrowLeft, Trash2 } from 'lucide-react';
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

function SentMemoItem({ memo, onClick, onDelete }: { memo: Memo, onClick: () => void, onDelete: (e: React.MouseEvent) => void }) {
    const statusColors = {
        pending: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        reviewed: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        approved: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        initiated: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    };

    const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'R';

    return (
        <div
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md cursor-pointer transition-all duration-200 group relative"
            onClick={onClick}
        >
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground font-bold text-xs shrink-0">
                {getInitials(memo.to[0] || 'Recipient')}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        To: {memo.to.join(', ')}
                    </p>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap uppercase">
                        {memo.date}
                    </span>
                </div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">
                    {memo.subject}
                </h3>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                    statusColors[memo.status as keyof typeof statusColors]
                )}>
                    {memo.status}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    className="h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Memo"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export function MemoSent() {
    const router = useRouter();
    const [memos, setMemos] = useState<Memo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: session } = useSession();
    const currentUserEmail = session?.user?.email;

    useEffect(() => {
        if (!currentUserEmail) return;
        const fetchMemos = async () => {
            try {
                const res = await fetch('/api/memos');
                const result = await res.json();
                if (result.success) {
                    const sentByUser = result.data.filter((m: Memo) =>
                        m.from === currentUserEmail && m.status !== 'initiated'
                    );
                    setMemos(sentByUser);
                }
            } catch (error) {
                toast.error('Failed to load sent memos');
            } finally {
                setLoading(false);
            }
        };
        fetchMemos();
    }, [currentUserEmail]);

    const filteredMemos = memos.filter(
        (memo: Memo) =>
            memo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memo.to.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleDeleteIndividual = async (memoId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this sent memo?')) return;

        try {
            const res = await fetch(`/api/memos/${memoId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setMemos(prev => prev.filter(m => m._id !== memoId));
                toast.success('Memo deleted successfully');
            } else {
                toast.error('Failed to delete memo');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const currentPage = 1;
    const totalPages = 1;
    const startItem = filteredMemos.length > 0 ? 1 : 0;
    const endItem = filteredMemos.length;
    const totalItems = filteredMemos.length;

    if (loading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading sent memos...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/dashboard')}
                    className="h-8 w-8 dark:hover:bg-gray-800"
                >
                    <ArrowLeft className="h-4 w-4 text-gray-900 dark:text-white" />
                </Button>
                <h1 className="text-2xl font-bold text-foreground dark:text-white">Memo Sent</h1>
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

            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1 max-w-xs">
                    <Input
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                </div>
                <Button
                    size="icon"
                    className="bg-primary hover:bg-primary/90"
                >
                    <Search className="h-4 w-4" />
                </Button>
            </div>

            {/* List */}
            {filteredMemos.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 shadow-sm text-center text-gray-500 dark:text-gray-400">
                    No sent memos found
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredMemos.map((memo: Memo) => (
                        <SentMemoItem
                            key={memo._id}
                            memo={memo}
                            onClick={() => router.push(`/dashboard/memos/inbox/${memo._id}`)}
                            onDelete={(e) => handleDeleteIndividual(memo._id, e)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-end gap-4 text-sm text-muted-foreground dark:text-gray-400">
                <span>
                    {startItem}-{endItem} of {totalItems}
                </span>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 dark:hover:bg-gray-800" disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 dark:hover:bg-gray-800" disabled={currentPage === totalPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
