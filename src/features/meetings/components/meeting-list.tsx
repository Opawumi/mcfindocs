'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data based on screenshot
const mockMeetings = [
    {
        id: '1',
        to: 'divandsection@gmail.com',
        subject: 'Final year result-it start prompt',
        date: '24/12/2025'
    },
    {
        id: '2',
        to: 'ajitshete0...@gmail.com',
        subject: 'Demo for Testing the flow-',
        date: '25/08/2025'
    },
    {
        id: '3',
        to: 'ajitshete0...@gmail.com',
        subject: 'Demo Meeting-',
        date: '23/08/2025'
    },
    {
        id: '4',
        to: 'rkubadge...@gmail.com',
        subject: 'Demo Meeting for Senate-',
        date: '23/08/2025'
    },
    {
        id: '5',
        to: 'rkubadge...@gmail.com',
        subject: 'Demo Meeting for Senate-',
        date: '23/08/2025'
    }
];

export function MeetingList() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMeetings = mockMeetings.filter(meeting =>
        meeting.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.to.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/dashboard')}
                    className="h-8 w-8"
                >
                    <ArrowLeft className="h-4 w-4 text-gray-900" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Meeting List</h1>
            </div>

            <div className="flex items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-72">
                    <Input
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                </div>

                {/* Pagination Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>1-{filteredMeetings.length} of {mockMeetings.length}</span>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" disabled>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" disabled>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {filteredMeetings.map((meeting, index) => (
                    <div
                        key={meeting.id}
                        className={cn(
                            "flex items-center px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer",
                            index !== filteredMeetings.length - 1 && "border-b border-gray-100"
                        )}
                    >
                        <div className="w-1/4 font-semibold text-gray-900 truncate pr-4">
                            To: {meeting.to}
                        </div>
                        <div className="flex-1 text-gray-700 truncate pr-4">
                            {meeting.subject}
                        </div>
                        <div className="min-w-[100px] text-right text-gray-500 text-sm">
                            {meeting.date}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
