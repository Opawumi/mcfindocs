'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Link as LinkIcon, Video, Calendar } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function MeetingHome() {
    const router = useRouter();
    const [joinCode, setJoinCode] = useState('');

    const generateMeetingCode = () => {
        const parts = [];
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < 3; i++) {
            let part = '';
            const len = i === 1 ? 4 : 3;
            for (let j = 0; j < len; j++) {
                part += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            parts.push(part);
        }
        return parts.join('-');
    };

    const handleStartInstantMeeting = () => {
        const code = generateMeetingCode();
        router.push(`/dashboard/meetings/${code}`);
        toast.info(`Starting instant meeting: ${code}`);
    };

    const handleJoinMeeting = () => {
        if (!joinCode) return;

        // Basic validation - check if it's a URL or just a code
        let code = joinCode;
        if (joinCode.includes('/')) {
            const parts = joinCode.split('/');
            code = parts[parts.length - 1];
        }

        router.push(`/dashboard/meetings/${code}`);
        toast.success(`Joining meeting: ${code}`);
    };

    const handleCreateLater = () => {
        const code = generateMeetingCode();
        const link = `${window.location.origin}/dashboard/meetings/${code}`;

        navigator.clipboard.writeText(link);
        toast.success('Meeting link copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/dashboard')}
                    className="h-8 w-8"
                >
                    <ArrowLeft className="h-4 w-4 text-gray-900" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-medium text-gray-900 tracking-tight">E-Meetings</h1>
                    <p className="text-xl text-gray-500 max-w-2xl font-light">
                        Connect, collaborate, and communicate<br />
                        from anywhere with secure video conferencing.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl px-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="bg-primary hover:bg-primary/90 text-white min-w-[180px] h-12 text-base gap-2"
                            >
                                <Video className="h-5 w-5" />
                                New meeting
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56 p-1">
                            <DropdownMenuItem onClick={handleCreateLater} className="py-3 cursor-pointer gap-3">
                                <LinkIcon className="h-4 w-4 text-gray-500" />
                                <span>Create a meeting for later</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleStartInstantMeeting} className="py-3 cursor-pointer gap-3">
                                <Plus className="h-4 w-4 text-gray-500" />
                                <span>Start an instant meeting</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/dashboard/meetings/list')} className="py-3 cursor-pointer gap-3">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>Schedule in Meeting List</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-2 flex-1 w-full relative">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Enter code or link"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                className="h-12 pl-4 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-base"
                                onKeyDown={(e) => e.key === 'Enter' && handleJoinMeeting()}
                            />
                        </div>
                        <Button
                            variant="ghost"
                            onClick={handleJoinMeeting}
                            className="text-primary font-semibold hover:text-primary/80 hover:bg-primary/5 h-12 px-6 text-base"
                            disabled={!joinCode}
                        >
                            Join
                        </Button>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 w-full max-w-md text-center">
                    <p className="text-sm text-gray-400">
                        Learn more about <a href="#" className="underline text-primary/70 hover:text-primary">E-Meetings</a> security and privacy.
                    </p>
                </div>
            </div>
        </div>
    );
}
