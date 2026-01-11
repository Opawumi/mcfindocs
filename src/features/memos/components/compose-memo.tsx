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
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Send, Save, CreditCard, Plus, X, Paperclip } from 'lucide-react';
import { useUIStore } from '@/stores';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-50 animate-pulse rounded-md" />
});
import 'react-quill-new/dist/quill.snow.css';


interface MemoFormData {
    to: string[];
    cc: string[];
    subject: string;
    sideNote: string;
    recommender: string[];
    approver: string[];
    message: string;
    isFinancial: boolean;
    attachments: { name: string; url: string }[];
}

export function ComposeMemo() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const memoId = searchParams.get('id');
    const { addNotification } = useUIStore();

    const [formData, setFormData] = useState<MemoFormData>({
        to: [],
        cc: [],
        subject: '',
        sideNote: '',
        recommender: [],
        approver: [],
        message: '',
        isFinancial: false,
        attachments: [],
    });

    const [loading, setLoading] = useState(!!memoId);
    const [toInput, setToInput] = useState('');
    const [ccInput, setCcInput] = useState('');
    const [recommenderInput, setRecommenderInput] = useState('');
    const [approverInput, setApproverInput] = useState('');
    const [showCc, setShowCc] = useState(false);

    useEffect(() => {
        if (memoId) {
            const fetchMemo = async () => {
                try {
                    const res = await fetch(`/api/memos/${memoId}`);
                    const result = await res.json();
                    if (result.success) {
                        const m = result.data;
                        setFormData({
                            to: m.to || [],
                            cc: m.cc || [],
                            subject: m.subject || '',
                            sideNote: m.sideNote || '',
                            recommender: m.recommender || [],
                            approver: m.approver || [],
                            message: m.message || '',
                            isFinancial: m.isFinancial || false,
                            attachments: m.attachments || [],
                        });
                    }
                } catch (error) {
                    toast.error('Failed to load draft');
                } finally {
                    setLoading(false);
                }
            };
            fetchMemo();
        }
    }, [memoId]);

    // Mock users for Recommender/Approver
    const mockUsers = [
        { id: '1', email: 'hod.it@mcfin.com', name: 'Dr. Samuel Ojo (HOD IT)' },
        { id: '2', email: 'dean.sci@mcfin.com', name: 'Prof. Alice Williams (Dean)' },
        { id: '3', email: 'registrar@mcfin.com', name: 'Mrs. Janet Cole (Registrar)' },
        { id: '4', email: 'vc@mcfin.com', name: 'Prof. Robert King (VC)' },
    ];

    const addRecipient = (type: 'to' | 'cc' | 'recommender' | 'approver') => {
        let input = '';
        if (type === 'to') input = toInput;
        else if (type === 'cc') input = ccInput;
        else if (type === 'recommender') input = recommenderInput;
        else if (type === 'approver') input = approverInput;

        if (!input) return;

        // Basic email validation
        if (!input.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (!formData[type].includes(input)) {
            setFormData({
                ...formData,
                [type]: [...formData[type], input]
            });
        }

        if (type === 'to') setToInput('');
        else if (type === 'cc') setCcInput('');
        else if (type === 'recommender') setRecommenderInput('');
        else if (type === 'approver') setApproverInput('');
    };

    const removeRecipient = (type: 'to' | 'cc' | 'recommender' | 'approver', email: string) => {
        setFormData({
            ...formData,
            [type]: formData[type].filter(e => e !== email)
        });
    };

    const { data: session } = useSession();
    const currentUser = session?.user as any;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // In a real app, this would upload to S3/Cloudinary and return a URL
        // For now, we'll mock it with a local object URL
        const mockUrl = URL.createObjectURL(file);

        setFormData({
            ...formData,
            attachments: [...formData.attachments, { name: file.name, url: mockUrl }]
        });
        toast.success(`File "${file.name}" attached`);
    };

    const removeAttachment = (index: number) => {
        setFormData({
            ...formData,
            attachments: formData.attachments.filter((_, i) => i !== index)
        });
    };

    const handleSaveDraft = async () => {
        try {
            const res = await fetch(memoId ? `/api/memos/${memoId}` : '/api/memos', {
                method: memoId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    from: currentUser?.email,
                    fromName: currentUser?.name,
                    fromDept: currentUser?.department,
                    fromDesignation: currentUser?.designation,
                    status: 'initiated'
                }),
            });
            if (res.ok) {
                toast.success('Draft saved successfully');
                router.push('/dashboard/memos/draft');
            } else {
                toast.error('Failed to save draft');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
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

        try {
            const res = await fetch(memoId ? `/api/memos/${memoId}` : '/api/memos', {
                method: memoId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    from: currentUser?.email,
                    fromName: currentUser?.name,
                    fromDept: currentUser?.department,
                    fromDesignation: currentUser?.designation,
                    status: 'pending'
                }),
            });
            if (res.ok) {
                toast.success('Memo sent successfully');
                addNotification({
                    id: Date.now().toString(),
                    userId: currentUser?.id || 'system',
                    title: 'Memo Sent',
                    message: `Your memo "${formData.subject}" has been sent.`,
                    type: 'new_memo',
                    isRead: false,
                    createdAt: new Date().toISOString()
                });
                router.push('/dashboard/memos/sent');
            } else {
                toast.error('Failed to send memo');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading draft...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/dashboard')}
                    className="h-8 w-8 shrink-0"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Compose Memo</h1>
                </div>
            </div>

            {/* Branding Header */}
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 py-6 sm:py-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary/20 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                    <span className="text-[8px] sm:text-[10px] text-gray-400 font-bold text-center">UNIMED<br />LOGO</span>
                </div>
                <div className="bg-[#004a99] text-white px-6 sm:px-8 py-1.5 sm:py-2 rounded-xl text-base sm:text-lg font-bold tracking-wider shadow-sm uppercase">
                    Internal Memorandum
                </div>
            </div>

            <Card className="p-4 sm:p-6 bg-white shadow-sm border border-gray-200">
                <form className="space-y-6">
                    {/* From Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="from" className="text-gray-900">From</Label>
                            <Input
                                id="from"
                                value={currentUser?.email || ''}
                                disabled
                                className="bg-white border-gray-200 disabled:opacity-100 disabled:cursor-default text-gray-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dept" className="text-gray-900">Department</Label>
                            <Input
                                id="dept"
                                value={currentUser?.department || ''}
                                disabled
                                className="bg-white border-gray-200 disabled:opacity-100 disabled:cursor-default text-gray-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="designation" className="text-gray-900">Designation</Label>
                            <Input
                                id="designation"
                                value={currentUser?.designation || ''}
                                disabled
                                className="bg-white border-gray-200 disabled:opacity-100 disabled:cursor-default text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Financial Approval Toggle */}
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Financial Approval</p>
                                <p className="text-xs text-gray-500">Enable this if the memo requires financial authorization</p>
                            </div>
                        </div>
                        <Switch
                            checked={formData.isFinancial}
                            onCheckedChange={(checked) => setFormData({ ...formData, isFinancial: checked })}
                        />
                    </div>

                    {/* To */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="to" className="text-gray-900 font-semibold">To (Recipients)</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowCc(!showCc)}
                                    className="text-xs text-primary hover:text-primary/80"
                                >
                                    {showCc ? '- Hide Cc' : '+ Add Cc'}
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    id="to"
                                    placeholder="Enter recipient email..."
                                    value={toInput}
                                    onChange={(e) => setToInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addRecipient('to');
                                        }
                                    }}
                                    className="bg-white border-gray-200 text-gray-900"
                                />
                                <Button
                                    type="button"
                                    onClick={() => addRecipient('to')}
                                    variant="secondary"
                                    className="shrink-0"
                                >
                                    Add
                                </Button>
                            </div>
                            {formData.to.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.to.map((email) => (
                                        <div
                                            key={email}
                                            className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-full text-xs font-medium"
                                        >
                                            {email}
                                            <button
                                                type="button"
                                                onClick={() => removeRecipient('to', email)}
                                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cc */}
                        {showCc && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Label htmlFor="cc" className="text-gray-900 font-semibold">Cc</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="cc"
                                        placeholder="Enter Cc email..."
                                        value={ccInput}
                                        onChange={(e) => setCcInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addRecipient('cc');
                                            }
                                        }}
                                        className="bg-white border-gray-200 text-gray-900"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => addRecipient('cc')}
                                        variant="secondary"
                                        className="shrink-0"
                                    >
                                        Add
                                    </Button>
                                </div>
                                {formData.cc.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.cc.map((email) => (
                                            <div
                                                key={email}
                                                className="flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded-full text-xs font-medium"
                                            >
                                                {email}
                                                <button
                                                    type="button"
                                                    onClick={() => removeRecipient('cc', email)}
                                                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div> */}

                    {/* Recommender and Approver Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recommender */}
                        <div className="space-y-2">
                            <Label htmlFor="recommender" className="text-gray-900 font-semibold">Recommenders</Label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Input
                                        id="recommender"
                                        placeholder="Add recommender email..."
                                        value={recommenderInput}
                                        onChange={(e) => setRecommenderInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addRecipient('recommender');
                                            }
                                        }}
                                        className="bg-white border-gray-200 text-gray-900"
                                    />
                                    {recommenderInput && (
                                        <div className="absolute top-full left-0 w-full z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                            {mockUsers.filter(u => u.email.toLowerCase().includes(recommenderInput.toLowerCase())).map(user => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                                    onClick={() => {
                                                        if (!formData.recommender.includes(user.email)) {
                                                            setFormData({ ...formData, recommender: [...formData.recommender, user.email] });
                                                        }
                                                        setRecommenderInput('');
                                                    }}
                                                >
                                                    {user.name} ({user.email})
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => addRecipient('recommender')}
                                    variant="secondary"
                                    className="shrink-0"
                                >
                                    Add
                                </Button>
                            </div>
                            {formData.recommender.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.recommender.map((email) => (
                                        <div
                                            key={email}
                                            className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full text-xs font-medium"
                                        >
                                            {email}
                                            <button
                                                type="button"
                                                onClick={() => removeRecipient('recommender', email)}
                                                className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Approver */}
                        <div className="space-y-2">
                            <Label htmlFor="approver" className="text-gray-900 font-semibold">Approvers</Label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Input
                                        id="approver"
                                        placeholder="Add approver email..."
                                        value={approverInput}
                                        onChange={(e) => setApproverInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addRecipient('approver');
                                            }
                                        }}
                                        className="bg-white border-gray-200 text-gray-900"
                                    />
                                    {approverInput && (
                                        <div className="absolute top-full left-0 w-full z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                            {mockUsers.filter(u => u.email.toLowerCase().includes(approverInput.toLowerCase())).map(user => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                                    onClick={() => {
                                                        if (!formData.approver.includes(user.email)) {
                                                            setFormData({ ...formData, approver: [...formData.approver, user.email] });
                                                        }
                                                        setApproverInput('');
                                                    }}
                                                >
                                                    {user.name} ({user.email})
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => addRecipient('approver')}
                                    variant="secondary"
                                    className="shrink-0"
                                >
                                    Add
                                </Button>
                            </div>
                            {formData.approver.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.approver.map((email) => (
                                        <div
                                            key={email}
                                            className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-full text-xs font-medium"
                                        >
                                            {email}
                                            <button
                                                type="button"
                                                onClick={() => removeRecipient('approver', email)}
                                                className="ml-1 hover:bg-green-100 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-4">
                        <Label htmlFor="message" className="text-gray-900 font-semibold text-base sm:text-lg">Message</Label>
                        <div className="prose-none min-h-[300px] sm:min-h-[400px] border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <ReactQuill
                                theme="snow"
                                value={formData.message}
                                onChange={(content) => setFormData({ ...formData, message: content })}
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        [{ 'color': [] }, { 'background': [] }],
                                        ['link', 'blockquote', 'code-block'],
                                        ['clean']
                                    ],
                                }}
                                className="h-[350px] border-none"
                            />
                        </div>
                        <style jsx global>{`
                            .ql-toolbar.ql-snow {
                                border: none !important;
                                border-bottom: 1px solid #e5e7eb !important;
                                background-color: #f9fafb;
                                padding: 8px 12px !important;
                            }
                            .ql-container.ql-snow {
                                border: none !important;
                                font-family: inherit !important;
                                font-size: 1rem !important;
                            }
                            .ql-editor {
                                min-height: 350px;
                                padding: 20px !important;
                            }
                            .ql-editor.ql-blank::before {
                                font-style: normal !important;
                                color: #9ca3af !important;
                                left: 20px !important;
                            }
                            .ql-snow .ql-stroke {
                                stroke: #4b5563 !important;
                            }
                            .ql-snow .ql-fill {
                                fill: #4b5563 !important;
                            }
                            .ql-snow .ql-picker {
                                color: #4b5563 !important;
                            }
                        `}</style>
                    </div>

                    {/* Attachments Section */}
                    <div className="space-y-4">
                        <Label className="text-gray-900">Attachments</Label>
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <Input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <Label
                                    htmlFor="file-upload"
                                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-gray-500"
                                >
                                    <Paperclip className="h-4 w-4" />
                                    <span>Click to attach files or drag and drop</span>
                                </Label>
                            </div>

                            {formData.attachments.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {formData.attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg group">
                                            <div className="flex items-center gap-2 truncate">
                                                <Paperclip className="h-4 w-4 text-gray-400 shrink-0" />
                                                <span className="text-sm text-gray-600 truncate">{file.name}</span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeAttachment(index)}
                                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSaveDraft}
                            className="gap-2 w-full sm:w-auto order-2 sm:order-1"
                        >
                            <Save className="h-4 w-4" />
                            Save Draft
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSend}
                            className="gap-2 bg-primary hover:bg-primary/90 w-full sm:w-auto order-1 sm:order-2"
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
