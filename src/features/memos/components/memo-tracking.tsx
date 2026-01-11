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
    subject: string;
    status: 'initiated' | 'pending' | 'reviewed' | 'approved';
    date: string;
}

function TrackingMemoItem({ memo, onClick }: { memo: Memo, onClick: () => void }) {
    const statusSteps = {
        initiated: 1,
        pending: 2,
        reviewed: 3,
        approved: 4
    };

    const currentStep = statusSteps[memo.status];

    return (
        <div
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary/50 hover:shadow-md cursor-pointer transition-all duration-200 group"
            onClick={onClick}
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        {memo.subject}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap uppercase">
                        {memo.date}
                    </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                        {[1, 2, 3, 4].map((step) => (
                            <div
                                key={step}
                                className={cn(
                                    "flex-1 h-full border-r border-white last:border-0",
                                    step <= currentStep ? "bg-primary" : "bg-gray-200"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                        {memo.status}
                    </span>
                </div>
            </div>
        </div>
    );
}

export function MemoTracking() {
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
                    const tracking = result.data.filter((m: Memo) =>
                        m.from === currentUserEmail && m.status !== 'initiated'
                    );
                    setMemos(tracking);
                }
            } catch (error) {
                toast.error('Failed to load tracking data');
            } finally {
                setLoading(false);
            }
        };
        fetchMemos();
    }, [currentUserEmail]);

    const filteredMemos = memos.filter(
        (memo: Memo) =>
            memo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memo.to.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const currentPage = 1;
    const totalPages = 1;
    const startItem = filteredMemos.length > 0 ? 1 : 0;
    const endItem = filteredMemos.length;
    const totalItems = filteredMemos.length;

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading tracking information...</div>;
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
                <h1 className="text-2xl font-bold text-foreground">Memo Tracking</h1>
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
                    No tracking information available
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredMemos.map((memo: Memo) => (
                        <TrackingMemoItem
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
