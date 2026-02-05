'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ChevronLeft, ChevronRight, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface Memo {
    _id: string;
    from: string;
    fromName: string;
    fromDept: string;
    to: string[];
    cc?: string[];
    subject: string;
    message: string;
    date: string;
    status: 'initiated' | 'pending' | 'reviewed' | 'approved';
    isRead: boolean;
    approvedByName?: string;
    approvedByDept?: string;
}

function MemoItem({ memo, selected, onSelect, onClick, onDelete, getInitials }: { memo: Memo, selected: boolean, onSelect: () => void, onClick: () => void, onDelete: (e: React.MouseEvent) => void, getInitials: (s: string) => string }) {
    const isApproved = memo.status === 'approved';

    return (
        <div
            className={cn(
                "flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md cursor-pointer transition-all duration-200 group relative",
                memo.isRead ? "border-gray-200 dark:border-gray-700" : "border-primary/30 dark:border-primary/50 bg-primary/[0.01] dark:bg-primary/[0.05]"
            )}
            onClick={onClick}
        >
            <div
                className="h-full absolute left-0 top-0 w-1 bg-primary rounded-l-lg transition-opacity duration-200"
                style={{ opacity: memo.isRead ? 0 : 1 }}
            />

            <div onClick={(e) => e.stopPropagation()} className="pt-1 sm:pt-0">
                <Checkbox
                    checked={selected}
                    onCheckedChange={onSelect}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
                />
            </div>

            <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 text-primary font-bold text-[10px] sm:text-xs shrink-0 mt-0.5 sm:mt-0">
                {getInitials(memo.fromName || memo.from || 'User')}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                        <p className={cn(
                            "text-sm truncate",
                            memo.isRead ? "text-gray-600 dark:text-gray-400 font-normal" : "text-gray-900 dark:text-gray-100 font-bold"
                        )}>
                            {memo.fromName || memo.from}
                        </p>
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium whitespace-nowrap uppercase sm:hidden">
                            {memo.date}
                        </span>
                    </div>

                    <div className="flex flex-col sm:items-end">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap uppercase hidden sm:block">
                            {memo.date}
                        </span>
                        {isApproved ? (
                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-1 sm:gap-0 sm:mt-0.5">
                                <span className="text-[8px] sm:text-[9px] font-bold text-green-600 dark:text-green-500 uppercase">Approved</span>
                                <span className="hidden sm:inline-block text-[10px] font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[100px]">{memo.approvedByName}</span>
                            </div>
                        ) : (
                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-1 sm:gap-0 sm:mt-0.5">
                                <span className="text-[8px] sm:text-[9px] font-bold text-primary dark:text-primary uppercase">Office:</span>
                                <span className="text-[9px] sm:text-[10px] font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[100px]">{memo.fromDept}</span>
                            </div>
                        )}
                    </div>
                </div>

                <h3 className={cn(
                    "text-xs sm:text-sm truncate mt-0.5",
                    memo.isRead ? "text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-200 font-semibold"
                )}>
                    {memo.subject}
                </h3>

                <div className="flex items-center justify-between gap-4 mt-1">
                    <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 truncate line-clamp-1 flex-1 italic">
                        {memo.message?.replace(/<[^>]*>?/gm, '')}
                    </p>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        title="Delete Memo"
                    >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
export function MemoInbox() {
    const router = useRouter();
    const [memos, setMemos] = useState<Memo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMemos, setSelectedMemos] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');

    useEffect(() => {
        const fetchMemos = async () => {
            try {
                const res = await fetch('/api/memos');
                const result = await res.json();
                if (result.success) {
                    setMemos(result.data);
                }
            } catch (error) {
                toast.error('Failed to load memos');
            } finally {
                setLoading(false);
            }
        };
        fetchMemos();
    }, []);

    const { data: session } = useSession();
    const currentUserEmail = session?.user?.email;

    const userMemos = memos.filter((m: Memo) =>
        m.to.includes(currentUserEmail || '') ||
        (Array.isArray(m.cc) && m.cc.includes(currentUserEmail || ''))
    );

    const approvedMemos = userMemos.filter((memo: Memo) => memo.status === 'approved');
    const pendingMemos = userMemos.filter((memo: Memo) => ['pending', 'initiated', 'reviewed'].includes(memo.status));

    const displayedMemos = activeTab === 'approved' ? approvedMemos : pendingMemos;
    const filteredMemos = displayedMemos.filter(
        (memo: Memo) =>
            memo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memo.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memo.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleMemoSelection = (memoId: string) => {
        setSelectedMemos((prev: string[]) =>
            prev.includes(memoId)
                ? prev.filter((id: string) => id !== memoId)
                : [...prev, memoId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedMemos.length === filteredMemos.length) {
            setSelectedMemos([]);
        } else {
            setSelectedMemos(filteredMemos.map((memo: Memo) => memo._id));
        }
    };

    const handleMarkAsRead = async (memoId: string) => {
        try {
            const res = await fetch(`/api/memos/${memoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: true })
            });
            if (res.ok) {
                setMemos(prev => prev.map(m => m._id === memoId ? { ...m, isRead: true } : m));
            }
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedMemos.length} memos?`)) return;

        try {
            await Promise.all(selectedMemos.map(id =>
                fetch(`/api/memos/${id}`, { method: 'DELETE' })
            ));
            setMemos(prev => prev.filter(m => !selectedMemos.includes(m._id)));
            setSelectedMemos([]);
            toast.success('Memos deleted successfully');
        } catch (error) {
            toast.error('Failed to delete some memos');
        }
    };

    const handleDeleteIndividual = async (memoId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this memo?')) return;

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

    const getInitials = (name: string) => {
        if (!name) return 'U';
        if (name.includes('@')) return name[0].toUpperCase();
        return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const currentPage = 1;
    const totalPages = 1;
    const startItem = filteredMemos.length > 0 ? 1 : 0;
    const endItem = filteredMemos.length;
    const totalItems = filteredMemos.length;

    if (loading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading memos...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="h-8 w-8 dark:hover:bg-gray-800">
                        <ArrowLeft className="h-4 w-4 text-gray-900 dark:text-white" />
                    </Button>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate dark:text-white">Memo Inbox</h1>
                </div>

                <Button onClick={() => router.push('/dashboard/memos/create')} className="bg-primary hover:bg-primary/90 w-full sm:w-auto h-10 font-bold uppercase tracking-tight text-xs shadow-lg shadow-primary/20 dark:shadow-none">
                    Create Memo
                </Button>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1 max-w-xs">
                        <Input
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            className="pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>

                {selectedMemos.length > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{selectedMemos.length} selected</span>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteSelected}
                            className="h-9"
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as 'approved' | 'pending')} className="w-full">
                <TabsList className="bg-transparent border-b dark:border-gray-800 rounded-none w-full justify-start h-auto p-0 overflow-x-auto overflow-y-hidden scrollbar-none flex-nowrap">
                    <TabsTrigger value="approved" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap dark:text-gray-400 dark:data-[state=active]:text-primary">
                        APPROVED
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap dark:text-gray-400 dark:data-[state=active]:text-primary">
                        PENDING
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="approved" className="mt-6">
                    {approvedMemos.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground dark:text-gray-500 bg-white dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">No approved memos</div>
                    ) : (
                        <div className="space-y-3">
                            {approvedMemos.filter(m =>
                                m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                m.from.toLowerCase().includes(searchQuery.toLowerCase())
                            ).map((memo: Memo) => (
                                <MemoItem
                                    key={memo._id}
                                    memo={memo}
                                    selected={selectedMemos.includes(memo._id)}
                                    onSelect={() => toggleMemoSelection(memo._id)}
                                    onClick={() => {
                                        if (!memo.isRead) handleMarkAsRead(memo._id);
                                        router.push(`/dashboard/memos/inbox/${memo._id}`);
                                    }}
                                    onDelete={(e) => handleDeleteIndividual(memo._id, e)}
                                    getInitials={getInitials}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="pending" className="mt-6">
                    {pendingMemos.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground dark:text-gray-500 bg-white dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">No pending memos</div>
                    ) : (
                        <div className="space-y-3">
                            {pendingMemos.filter(m =>
                                m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                m.from.toLowerCase().includes(searchQuery.toLowerCase())
                            ).map((memo: Memo) => (
                                <MemoItem
                                    key={memo._id}
                                    memo={memo}
                                    selected={selectedMemos.includes(memo._id)}
                                    onSelect={() => toggleMemoSelection(memo._id)}
                                    onClick={() => {
                                        if (!memo.isRead) handleMarkAsRead(memo._id);
                                        router.push(`/dashboard/memos/inbox/${memo._id}`);
                                    }}
                                    onDelete={(e) => handleDeleteIndividual(memo._id, e)}
                                    getInitials={getInitials}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <div className="flex items-center justify-end gap-4 text-sm text-muted-foreground dark:text-gray-400">
                <span>{startItem}-{endItem} of {totalItems}</span>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 dark:hover:bg-gray-800" disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 dark:hover:bg-gray-800" disabled={currentPage === totalPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div >
    );
}
