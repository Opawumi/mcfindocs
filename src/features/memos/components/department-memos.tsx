'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Search,
    ArrowLeft,
    Filter,
    FileText,
    Eye,
    TrendingUp,
    Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface Memo {
    _id: string;
    fromName: string;
    subject: string;
    fromDept: string;
    status: 'initiated' | 'pending' | 'reviewed' | 'approved';
    date: string;
    isRead: boolean;
}

export function DepartmentMemos() {
    const router = useRouter();
    const [memos, setMemos] = useState<Memo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: session } = useSession();
    const targetDept = (session?.user as any)?.department;

    useEffect(() => {
        if (!targetDept) return;
        const fetchMemos = async () => {
            try {
                const res = await fetch('/api/memos');
                const result = await res.json();
                if (result.success) {
                    const deptMemos = result.data.filter((m: Memo) => m.fromDept === targetDept);
                    setMemos(deptMemos);
                }
            } catch (error) {
                toast.error('Failed to load department memos');
            } finally {
                setLoading(false);
            }
        };
        fetchMemos();
    }, [targetDept]);

    const filteredMemos = memos.filter(memo =>
        memo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memo.fromName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: memos.length,
        pending: memos.filter(m => m.status === 'pending').length,
        unread: memos.filter(m => !m.isRead).length
    };

    const handleDeleteIndividual = async (memoId: string) => {
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 uppercase text-[10px]">Approved</Badge>;
            case 'reviewed':
                return <Badge className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 uppercase text-[10px]">Reviewed</Badge>;
            default:
                return <Badge className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 uppercase text-[10px]">Pending</Badge>;
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/dashboard')}
                        className="h-8 w-8 shrink-0 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="h-4 w-4 dark:text-gray-400" />
                    </Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Department Activity</h1>
                        <p className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">Monitoring memos in {targetDept || 'your department'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 w-full sm:w-auto text-xs h-9 dark:hover:bg-gray-800">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Analytics
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 font-bold">
                <Card className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[9px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter sm:tracking-normal">Total Memos</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[9px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter sm:tracking-normal">Pending Review</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-500" />
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[9px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter sm:tracking-normal">Unread Memos</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.unread}</p>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-500" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                        placeholder="Search initiator or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm h-10 w-full placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                </div>
                <Button variant="outline" className="gap-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 h-10 text-xs px-4 dark:hover:bg-gray-700">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                </Button>
            </div>

            {/* Memos Table */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-x-auto scrollbar-none">
                <Table className="min-w-[700px] lg:min-w-full">
                    <TableHeader>
                        <TableRow className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
                            <TableHead className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Initiator</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Subject</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Date</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Status</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMemos.map((memo) => (
                            <TableRow key={memo._id} className="hover:bg-gray-50/50 group">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            memo.isRead ? "bg-transparent" : "bg-primary"
                                        )} title={memo.isRead ? "Read" : "Unread"} />
                                        <span className="font-medium text-gray-900 dark:text-white text-sm">{memo.fromName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300 text-sm">{memo.subject}</TableCell>
                                <TableCell className="text-gray-500 dark:text-gray-400 text-xs">{memo.date}</TableCell>
                                <TableCell>{getStatusBadge(memo.status)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary dark:text-primary-foreground hover:text-primary/90 gap-1 dark:hover:bg-primary/20"
                                            onClick={() => router.push(`/dashboard/memos/inbox/${memo._id}`)}
                                        >
                                            <Eye className="h-3 w-3" />
                                            View
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            onClick={() => handleDeleteIndividual(memo._id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// Internal Card component to avoid missing imports if not exported from UI
function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("rounded-lg border bg-card dark:bg-gray-800 text-card-foreground dark:text-white shadow-sm border-gray-200 dark:border-gray-700", className)} {...props}>
            {children}
        </div>
    );
}

function Clock(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
