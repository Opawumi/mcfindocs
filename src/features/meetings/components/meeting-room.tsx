'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Mic, MicOff, Video, VideoOff, PhoneOff,
    MessageSquare, Users, Settings, Share2,
    Hand, Smile, MoreVertical, LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function MeetingRoom() {
    const router = useRouter();
    const { code } = useParams();
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLeave = () => {
        router.push('/dashboard/meetings');
        toast.success('You have left the meeting');
    };

    return (
        <div className="flex flex-col h-screen bg-[#202124] text-white">
            {/* Main Video Area */}
            <div className="flex-1 relative flex items-center justify-center p-4">
                {/* Mock Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full max-w-6xl max-h-[80%]">
                    {/* Main User (Self) */}
                    <div className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 aspect-video flex items-center justify-center">
                        {isCameraOn ? (
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary border-4 border-primary/30">
                                    U
                                </div>
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-bold">
                                U
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 px-3 py-1 rounded text-sm">
                            {!isMicOn && <MicOff className="h-4 w-4 text-red-500" />}
                            You
                        </div>
                    </div>

                    {/* Dummy Participant 1 */}
                    <div className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 aspect-video flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-blue-600/30 flex items-center justify-center text-4xl font-bold text-blue-400">
                            JD
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 px-3 py-1 rounded text-sm">
                            <MicOff className="h-4 w-4 text-red-500" />
                            John Doe
                        </div>
                    </div>

                    {/* Dummy Participant 2 */}
                    <div className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 aspect-video flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-purple-600/30 flex items-center justify-center text-4xl font-bold text-purple-400">
                            AS
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 px-3 py-1 rounded text-sm">
                            Alice Smith
                        </div>
                    </div>
                </div>

                {/* Meeting Info (Top Left) */}
                <div className="absolute top-6 left-6 flex items-center gap-4">
                    <div className="text-lg font-medium">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | {code}</div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="h-20 bg-[#202124] flex items-center justify-between px-6 shrink-0 border-t border-gray-800">
                <div className="flex items-center gap-4 min-w-[200px]">
                    <span className="text-sm font-medium">Meeting details</span>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={cn(
                            "h-10 w-10 rounded-full border border-gray-600 transition-colors",
                            !isMicOn ? "bg-red-500 border-red-500 hover:bg-red-600" : "hover:bg-gray-700"
                        )}
                    >
                        {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsCameraOn(!isCameraOn)}
                        className={cn(
                            "h-10 w-10 rounded-full border border-gray-600 transition-colors",
                            !isCameraOn ? "bg-red-500 border-red-500 hover:bg-red-600" : "hover:bg-gray-700"
                        )}
                    >
                        {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 rounded-full border border-gray-600 hover:bg-gray-700"
                    >
                        <Hand className="h-5 w-5" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 rounded-full border border-gray-600 hover:bg-gray-700"
                    >
                        <Smile className="h-5 w-5" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 rounded-full border border-gray-600 hover:bg-gray-700"
                    >
                        <Share2 className="h-5 w-5" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleLeave}
                        className="h-10 w-12 rounded-full bg-red-600 hover:bg-red-700 border-none transition-colors"
                    >
                        <PhoneOff className="h-5 w-5" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 rounded-full border border-gray-600 hover:bg-gray-700"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex items-center gap-2 min-w-[200px] justify-end">
                    <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-gray-700">
                        <LayoutGrid className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-gray-700">
                        <Users className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-gray-700">
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-gray-700">
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
