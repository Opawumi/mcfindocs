'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Memo {
    _id: string;
    from: string;
    fromName?: string;
    fromDept?: string;
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    status: 'initiated' | 'pending' | 'reviewed' | 'approved';
    date: string;
    createdAt?: string;
    updatedAt?: string;
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

    const filteredMemos = memos.filter((memo: Memo) => {
        const query = searchQuery.toLowerCase();
        const initiatedDate = memo.createdAt ? new Date(memo.createdAt).toLocaleDateString('en-GB').toLowerCase() : memo.date.toLowerCase();
        const updatedDate = memo.updatedAt ? new Date(memo.updatedAt).toLocaleDateString('en-GB').toLowerCase() : '';

        return (
            memo.subject.toLowerCase().includes(query) ||
            initiatedDate.includes(query) ||
            updatedDate.includes(query) ||
            (memo.fromDept && memo.fromDept.toLowerCase().includes(query)) ||
            (memo.fromName && memo.fromName.toLowerCase().includes(query)) ||
            memo.from.toLowerCase().includes(query) ||
            memo.to.some(t => t.toLowerCase().includes(query)) ||
            (memo.cc && memo.cc.some(c => c.toLowerCase().includes(query))) ||
            (memo.bcc && memo.bcc.some(b => b.toLowerCase().includes(query)))
        );
    });

    const currentPage = 1;
    const totalPages = 1;
    const startItem = filteredMemos.length > 0 ? 1 : 0;
    const endItem = filteredMemos.length;
    const totalItems = filteredMemos.length;

    // Helper to generate a display reference number
    const getReferenceNo = (memo: Memo) => {
        // Mocking a reference number based on date and ID
        const datePart = memo.date.replace(/\//g, '');
        const idPart = memo._id.substring(memo._id.length - 2); // Last 2 chars
        // Using MCFINDOCS prefix
        return `MCFINDOCS/Ref/${datePart}/${idPart}`;
    };

    // Helper for status display
    const getStatusDisplay = (status: string) => {
        if (status === 'approved') return 'Closed';
        return 'Open';
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading tracking information...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="default"
                    size="icon"
                    onClick={() => router.push('/dashboard')}
                    className="h-8 w-8 bg-primary text-white hover:bg-primary/90 dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/30"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold text-foreground dark:text-white">Memo Tracking</h1>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 flex-1 w-full max-w-md">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Search by subject, date, or sender..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            className="pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-primary/20 transition-all shadow-sm"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                    </div>
                </div>
                <Button
                    onClick={() => router.push('/dashboard/memos/create')}
                    className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto shadow-md shadow-primary/20 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    Create Memo
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
                            <TableHead className="w-[200px] font-bold text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-wider">Reference No</TableHead>
                            <TableHead className="font-bold text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-wider">Subject</TableHead>
                            <TableHead className="w-[100px] font-bold text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-wider">Status</TableHead>
                            <TableHead className="w-[120px] font-bold text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-wider">Initiated Date</TableHead>
                            <TableHead className="w-[120px] font-bold text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-wider">Update Date</TableHead>
                            <TableHead className="font-bold text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-wider">From</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMemos.length === 0 ? (
                            <TableRow className="border-gray-100 dark:border-gray-800">
                                <TableCell colSpan={6} className="h-32 text-center text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8 opacity-20" />
                                        <p className="font-medium">No tracking information available</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMemos.map((memo: Memo) => (
                                <TableRow
                                    key={memo._id}
                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 border-gray-100 dark:border-gray-800 transition-colors"
                                    onClick={() => router.push(`/dashboard/memos/inbox/${memo._id}`)}
                                >
                                    <TableCell className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                                        {getReferenceNo(memo)}
                                    </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <div className="font-semibold text-gray-900 dark:text-gray-200 truncate" title={memo.subject}>
                                            {memo.subject}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold",
                                            getStatusDisplay(memo.status) === 'Closed'
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                        )}>
                                            {getStatusDisplay(memo.status)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-gray-400">
                                        {memo.createdAt ? new Date(memo.createdAt).toLocaleDateString('en-GB') : memo.date}
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-gray-400">
                                        {memo.updatedAt ? new Date(memo.updatedAt).toLocaleDateString('en-GB') : '-'}
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-gray-400 truncate max-w-[200px]" title={memo.from}>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-gray-200">{memo.fromName || memo.from}</span>
                                            {memo.fromDept && <span className="text-xs text-gray-500 dark:text-gray-400">{memo.fromDept}</span>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

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
