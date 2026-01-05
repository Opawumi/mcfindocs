'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Memo {
    id: string;
    from: string;
    to: string;
    subject: string;
    preview: string;
    date: string;
    status: 'initiated' | 'pending' | 'reviewed' | 'approved';
    isRead: boolean;
}

// Mock data
const mockMemos: Memo[] = [
    {
        id: '1',
        from: 'sarah.connor@unilorin.edu.ng',
        to: 'Registrar',
        subject: 'Research Grant Application',
        preview: 'This memorandum is to formally request approval for...',
        date: 'Jan 04',
        status: 'pending',
        isRead: false,
    },
    {
        id: '2',
        from: 'john.smith@unilorin.edu.ng',
        to: 'VC',
        subject: 'Senate Minutes Approval',
        preview: 'Please find attached the minutes for the 254th senate...',
        date: 'Jan 03',
        status: 'approved',
        isRead: true,
    },
    {
        id: '3',
        from: 'jessica.davis@unilorin.edu.ng',
        to: 'HOD IT',
        subject: 'New Curriculum Proposal',
        preview: 'Proposed changes to the undergraduate computer science...',
        date: 'Jan 02',
        status: 'reviewed',
        isRead: true,
    }
];

export function MemoInbox() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMemos, setSelectedMemos] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');

    const approvedMemos = mockMemos.filter((memo) => ['approved', 'reviewed'].includes(memo.status));
    const pendingMemos = mockMemos.filter((memo) => ['pending', 'initiated'].includes(memo.status));

    const displayedMemos = activeTab === 'approved' ? approvedMemos : pendingMemos;
    const filteredMemos = displayedMemos.filter(
        (memo) =>
            memo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memo.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memo.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleMemoSelection = (memoId: string) => {
        setSelectedMemos((prev) =>
            prev.includes(memoId)
                ? prev.filter((id) => id !== memoId)
                : [...prev, memoId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedMemos.length === filteredMemos.length) {
            setSelectedMemos([]);
        } else {
            setSelectedMemos(filteredMemos.map((memo) => memo.id));
        }
    };

    const currentPage = 1;
    const totalPages = 1;
    const startItem = filteredMemos.length > 0 ? 1 : 0;
    const endItem = filteredMemos.length;
    const totalItems = filteredMemos.length;

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
                <h1 className="text-2xl font-bold text-foreground">Memo-Inbox</h1>
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
                        onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'approved' | 'pending')}>
                <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0">
                    <TabsTrigger
                        value="approved"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        APPROVED MEMOS
                    </TabsTrigger>
                    <TabsTrigger
                        value="pending"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        PENDING MEMOS
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="approved" className="mt-6">
                    {approvedMemos.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No approved memos
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredMemos.map((memo) => (
                                <div
                                    key={memo.id}
                                    className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                                    onClick={() => router.push(`/dashboard/memos/inbox/${memo.id}`)}
                                >
                                    <Checkbox
                                        checked={selectedMemos.includes(memo.id)}
                                        onCheckedChange={() => toggleMemoSelection(memo.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-2">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    To: {memo.to}
                                                </p>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    {memo.subject} - {memo.preview}
                                                </p>
                                            </div>
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                                {memo.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="pending" className="mt-6">
                    {pendingMemos.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No pending memos
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredMemos.map((memo) => (
                                <div
                                    key={memo.id}
                                    className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                                    onClick={() => router.push(`/dashboard/memos/inbox/${memo.id}`)}
                                >
                                    <Checkbox
                                        checked={selectedMemos.includes(memo.id)}
                                        onCheckedChange={() => toggleMemoSelection(memo.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-2">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    To: {memo.to}
                                                </p>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    {memo.subject} - {memo.preview}
                                                </p>
                                            </div>
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                                {memo.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-4 text-sm text-muted-foreground">
                <span>
                    {startItem}-{endItem} of {totalItems}
                </span>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
