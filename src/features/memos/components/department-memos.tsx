'use client';

import { useState } from 'react';
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
    TrendingUp
} from 'lucide-react';

// Mock data for departmental memos
const mockDeptMemos = [
    {
        id: '1',
        initiator: 'Dr. Sarah Connor',
        subject: 'Research Grant Application',
        dept: 'Information Technology',
        status: 'pending',
        date: '2026-01-04',
        isRead: true,
    },
    {
        id: '2',
        initiator: 'Prof. John Smith',
        subject: 'New Curriculum Proposal',
        dept: 'Information Technology',
        status: 'reviewed',
        date: '2026-01-03',
        isRead: false,
    },
    {
        id: '3',
        initiator: 'Jessica Davis',
        subject: 'Hardware Upgrade Request',
        dept: 'Information Technology',
        status: 'approved',
        date: '2025-12-28',
        isRead: true,
    },
];

export function DepartmentMemos() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMemos = mockDeptMemos.filter(memo =>
        memo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memo.initiator.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 uppercase text-[10px]">Approved</Badge>;
            case 'reviewed':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 uppercase text-[10px]">Reviewed</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 uppercase text-[10px]">Pending</Badge>;
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
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
                        <h1 className="text-2xl font-bold text-gray-900">Department Activity</h1>
                        <p className="text-sm text-gray-500">Monitoring all internal memos within Information Technology</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 border-gray-200 text-gray-700">
                        <TrendingUp className="h-4 w-4" />
                        Analytics
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase">Total Memos</p>
                            <p className="text-2xl font-bold text-gray-900">124</p>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase">Pending Review</p>
                            <p className="text-2xl font-bold text-gray-900">8</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase">Unread Memos</p>
                            <p className="text-2xl font-bold text-gray-900">3</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Eye className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters & Search */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search initiator or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white border-gray-200 text-gray-900"
                    />
                </div>
                <Button variant="outline" className="gap-2 border-gray-200 text-gray-700">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
            </div>

            {/* Memos Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-gray-50/50 bg-gray-50/50">
                            <TableHead className="text-[10px] font-bold uppercase text-gray-400">Initiator</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase text-gray-400">Subject</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase text-gray-400">Date</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase text-gray-400">Status</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase text-gray-400 text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMemos.map((memo) => (
                            <TableRow key={memo.id} className="hover:bg-gray-50/50 group">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            memo.isRead ? "bg-transparent" : "bg-primary"
                                        )} title={memo.isRead ? "Read" : "Unread"} />
                                        <span className="font-medium text-gray-900 text-sm">{memo.initiator}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-700 text-sm">{memo.subject}</TableCell>
                                <TableCell className="text-gray-500 text-xs">{memo.date}</TableCell>
                                <TableCell>{getStatusBadge(memo.status)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-primary hover:text-primary/90 gap-1"
                                        onClick={() => router.push(`/dashboard/memos/inbox/${memo.id}`)}
                                    >
                                        <Eye className="h-3 w-3" />
                                        View
                                    </Button>
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
        <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props}>
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
