'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Send, Save } from 'lucide-react';

interface MemoFormData {
    to: string[];
    cc: string[];
    subject: string;
    sideNote: string;
    recommender: string;
    approver: string;
    message: string;
}

export function ComposeMemo() {
    const router = useRouter();
    const [formData, setFormData] = useState<MemoFormData>({
        to: [],
        cc: [],
        subject: '',
        sideNote: '',
        recommender: '',
        approver: '',
        message: '',
    });

    const [selectedTo, setSelectedTo] = useState('');
    const [selectedCc, setSelectedCc] = useState('');

    // Mock users - in production, fetch from API
    const mockUsers = [
        { id: '1', email: 'john.doe@example.com', name: 'John Doe' },
        { id: '2', email: 'jane.smith@example.com', name: 'Jane Smith' },
        { id: '3', email: 'admin@example.com', name: 'Admin User' },
        { id: '4', email: 'manager@example.com', name: 'Manager' },
    ];

    const currentUserEmail = 'divandsection@gmail.com'; // Mock current user

    const handleSaveDraft = async () => {
        // TODO: Implement save draft API call
        toast.success('Draft saved successfully');
        router.push('/dashboard/memos/draft');
    };

    const handleSend = async () => {
        if (!formData.to.length) {
            toast.error('Please select at least one recipient');
            return;
        }
        if (!formData.subject) {
            toast.error('Please enter a subject');
            return;
        }
        if (!formData.message) {
            toast.error('Please enter a message');
            return;
        }

        // TODO: Implement send memo API call
        toast.success('Memo sent successfully');
        router.push('/dashboard/memos/sent');
    };

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
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Compose Memo</h1>
                </div>
            </div>

            <Card className="p-6 bg-white shadow-sm border border-gray-200">
                <form className="space-y-6">
                    {/* From (Read-only) */}
                    <div className="space-y-2">
                        <Label htmlFor="from" className="text-gray-900">From</Label>
                        <Input
                            id="from"
                            value={currentUserEmail}
                            disabled
                            className="bg-white border-gray-200 disabled:opacity-100 disabled:cursor-default text-gray-900"
                        />
                    </div>

                    {/* To */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="to" className="text-gray-900">To</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/dashboard/memos/compose')}
                                className="text-xs text-primary hover:text-primary/80"
                            >
                                Cc
                            </Button>
                        </div>
                        <Select value={selectedTo} onValueChange={setSelectedTo}>
                            <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                                <SelectValue placeholder="Select recipients..." />
                            </SelectTrigger>
                            <SelectContent>
                                {mockUsers.map((user) => (
                                    <SelectItem key={user.id} value={user.email}>
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formData.to.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.to.map((email) => (
                                    <div
                                        key={email}
                                        className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-sm"
                                    >
                                        {email}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    to: formData.to.filter((e) => e !== email),
                                                })
                                            }
                                            className="ml-1 hover:text-primary/70"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gray-900">Subject</Label>
                        <Input
                            id="subject"
                            placeholder="Enter subject..."
                            value={formData.subject}
                            onChange={(e) =>
                                setFormData({ ...formData, subject: e.target.value })
                            }
                            className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Side Note and Send As Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="sideNote" className="text-gray-900">Side Note</Label>
                            <Input
                                id="sideNote"
                                placeholder="Optional note..."
                                value={formData.sideNote}
                                onChange={(e) =>
                                    setFormData({ ...formData, sideNote: e.target.value })
                                }
                                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sendAs" className="text-gray-900">Send As</Label>
                            <Input
                                id="sendAs"
                                value="Memo"
                                disabled
                                className="bg-white border-gray-200 disabled:opacity-100 disabled:cursor-default text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Recommender and Approver Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="recommender" className="text-gray-900">Recommender</Label>
                            <Select
                                value={formData.recommender}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, recommender: value })
                                }
                            >
                                <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                                    <SelectValue placeholder="Select recommender..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.email}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="approver" className="text-gray-900">Approver</Label>
                            <Select
                                value={formData.approver}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, approver: value })
                                }
                            >
                                <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                                    <SelectValue placeholder="Select approver..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.email}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-900">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Enter your memo message..."
                            rows={10}
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({ ...formData, message: e.target.value })
                            }
                            className="resize-none bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSaveDraft}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            Save Draft
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSend}
                            className="gap-2 bg-primary hover:bg-primary/90"
                        >
                            <Send className="h-4 w-4" />
                            Send Memo
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
