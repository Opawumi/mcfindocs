'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface Memo {
    _id: string;
    from: string;
    to: string[];
    cc: string[];
    subject: string;
    message: string;
    date: string;
    status: 'initiated' | 'pending' | 'reviewed' | 'approved';
    isArchived: boolean;
}

function ArchiveMemoItem({ memo, onClick }: { memo: Memo, onClick: () => void }) {
    const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'A';

    return (
        <div
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md cursor-pointer transition-all duration-200 group relative opacity-80 hover:opacity-100"
            onClick={onClick}
        >
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-400 font-bold text-xs shrink-0">
                {getInitials(memo.from || 'User')}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        {memo.subject}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap uppercase">
                        {memo.date}
                    </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">
                    From: {memo.from}
                </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50 text-gray-400 uppercase tracking-wider">
                    Archived
                </span>
            </div>
        </div>
    );
}

export function MemoArchive() {
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
                    const archived = result.data.filter((m: Memo) =>
                        m.isArchived && (
                            m.from === currentUserEmail ||
                            m.to.includes(currentUserEmail) ||
                            (Array.isArray(m.cc) && m.cc.includes(currentUserEmail))
                        )
                    );
                    setMemos(archived);
                }
            } catch (error) {
                toast.error('Failed to load archived memos');
            } finally {
                setLoading(false);
            }
        };
        fetchMemos();
    }, [currentUserEmail]);

    const filteredMemos = memos.filter(
        (memo: Memo) =>
            memo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memo.from.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentPage = 1;
    const totalPages = 1;
    const startItem = filteredMemos.length > 0 ? 1 : 0;
    const endItem = filteredMemos.length;
    const totalItems = filteredMemos.length;

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading archive...</div>;
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
                <h1 className="text-2xl font-bold text-foreground">Memo Archive</h1>
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
                        className="pr-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
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
                <div className="bg-white border border-gray-200 rounded-lg p-12 shadow-sm text-center text-gray-500">
                    No archived memos found
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredMemos.map((memo: Memo) => (
                        <ArchiveMemoItem
                            key={memo._id}
                            memo={memo}
                            onClick={() => router.push(`/dashboard/memos/inbox/${memo._id}`)}
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
