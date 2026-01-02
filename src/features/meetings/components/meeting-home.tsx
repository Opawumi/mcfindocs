'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function MeetingHome() {
    const router = useRouter();
    const [joinCode, setJoinCode] = useState('');

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
                    <h1 className="text-4xl font-normal text-gray-900">E-Meetings</h1>
                    <p className="text-xl text-gray-500 max-w-2xl">
                        Connect, collaborate, communicate and vote<br />
                        from anywhere with eMeetings
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full max-w-md">
                    <Button
                        className="bg-primary hover:bg-primary/90 text-white min-w-[140px] h-11"
                    >
                        New meeting
                    </Button>

                    <div className="flex items-center gap-2 flex-1">
                        <Input
                            placeholder="Enter code/link"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            className="h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        />
                        <Button
                            variant="ghost"
                            className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            disabled={!joinCode}
                        >
                            join
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
