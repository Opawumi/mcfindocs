'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Download,
    CheckCircle2,
    Clock,
    FileCheck,
    User,
    Building2,
    Stamp,
    Trash2,
    Printer,
    Forward,
    Plus,
    Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import { Paperclip, X, FileText } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-gray-50 animate-pulse rounded-md border border-gray-200" />
});

interface MemoDetailProps {
    memo: {
        id: string;
        from: string;
        fromName: string;
        fromDept: string;
        fromDesignation: string;
        to: string[];
        subject: string;
        message: string;
        date: string;
        status: 'initiated' | 'pending' | 'reviewed' | 'approved';
        isFinancial: boolean;
        signature?: string;
    };
}

export function MemoDetail({ memo: initialMemo }: any) {
    const router = useRouter();
    const { data: session } = useSession();
    const [memo, setMemo] = useState(initialMemo);
    const [updating, setUpdating] = useState(false);
    const [showMinuteForm, setShowMinuteForm] = useState(false);
    const [minuteData, setMinuteData] = useState({
        message: '',
        status: 'comment' as 'approved' | 'rejected' | 'comment',
        attachments: [] as { name: string; url: string }[]
    });

    // Forwarding State
    const [isForwardOpen, setIsForwardOpen] = useState(false);
    const [forwardForm, setForwardForm] = useState({
        recipient: '',
        office: '',
        message: '',
        file: null as File | null
    });

    const handleForwardSubmit = () => {
        // Logic to forward would go here (e.g., API call)
        console.log('Forwarding to:', forwardForm);
        toast.success(`Memo forwarded to ${forwardForm.recipient}`);
        setIsForwardOpen(false);
        setForwardForm({ recipient: '', office: '', message: '', file: null });
    };

    // Sync memo state when initialMemo changes
    useEffect(() => {
        setMemo(initialMemo);
    }, [initialMemo]);

    const steps = [
        { id: 'initiated', label: 'Initiated', icon: Clock },
        { id: 'pending', label: 'Pending', icon: Clock },
        { id: 'reviewed', label: 'Reviewed', icon: FileCheck },
        { id: 'approved', label: 'Approved', icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === memo.status);

    const updateMemo = async (updates: any) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/memos/${memo._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            const result = await res.json();
            if (result.success) {
                setMemo(result.data);
                return result.data;
            } else {
                toast.error(result.error || 'Failed to update memo');
                return null;
            }
        } catch (error) {
            toast.error('An error occurred');
            return null;
        } finally {
            setUpdating(false);
        }
    };

    const handleGeneratePDF = async () => {
        const toastId = toast.loading('Preparing PDF...');
        try {
            const { jsPDF } = await import('jspdf');
            const { toPng } = await import('html-to-image');

            const element = document.getElementById('memo-content');
            if (!element) throw new Error('Memo content not found');

            // Temporarily hide elements that shouldn't be in the PDF
            const buttons = element.querySelectorAll('button');
            buttons.forEach((btn: any) => btn.style.visibility = 'hidden');

            const dataUrl = await toPng(element, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });

            // Restore buttons
            buttons.forEach((btn: any) => btn.style.visibility = 'visible');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const elementWidth = element.offsetWidth;
            const elementHeight = element.offsetHeight;

            const imgWidth = pageWidth;
            const imgHeight = (elementHeight * imgWidth) / elementWidth;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`memo-${memo._id.slice(-6)}.pdf`);
            toast.success('PDF downloaded successfully', { id: toastId });
        } catch (error) {
            console.error('PDF Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`PDF Failed: ${errorMessage}`, { id: toastId });
        }
    };

    const handleArchive = () => updateMemo({ isArchived: true });
    const handleReview = () => updateMemo({ status: 'reviewed' });
    const handleApprove = () => {
        const user = session?.user as any;
        updateMemo({
            status: 'approved',
            approvedByName: user?.name || user?.email,
            approvedByDept: user?.department || 'Registry'
        });
    };

    const handleAddMinute = async (status: 'approved' | 'rejected' | 'comment') => {
        if (!minuteData.message && status === 'comment') {
            toast.error('Please enter a message for the minute');
            return;
        }

        const author = session?.user as any;
        const newMinute = {
            authorName: author?.name || author?.email,
            authorEmail: author?.email,
            authorDept: author?.department || 'General',
            message: minuteData.message,
            status,
            attachments: minuteData.attachments,
            createdAt: new Date()
        };

        const updates: any = {
            minutes: [...(memo.minutes || []), newMinute]
        };

        if (status === 'approved') {
            updates.status = 'approved';
            updates.approvedByName = author?.name || author?.email;
            updates.approvedByDept = author?.department || 'Registry';
        } else if (status === 'rejected') {
            updates.status = 'pending';
        }

        const updatedMemo = await updateMemo(updates);

        if (updatedMemo) {
            toast.success(status === 'approved' ? 'Memo Approved with Minute' : 'Minute added successfully');
            setShowMinuteForm(false);
            setMinuteData({ message: '', status: 'comment', attachments: [] });
            // Reload to ensure the latest data is displayed
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const mockUrl = URL.createObjectURL(file);
            setMinuteData(prev => ({
                ...prev,
                attachments: [...prev.attachments, { name: file.name, url: mockUrl }]
            }));
            toast.success(`File "${file.name}" ready to upload`);
        }
    };

    const removeMinuteAttachment = (index: number) => {
        setMinuteData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this memo permanently?')) return;

        setUpdating(true);
        try {
            const res = await fetch(`/api/memos/${memo._id}`, {
                method: 'DELETE',
            });
            const result = await res.json();
            if (result.success) {
                toast.success('Memo deleted successfully');
                router.back();
            } else {
                toast.error('Failed to delete memo');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <style jsx global>{`
                .quill-wrapper .ql-container {
                    height: 200px;
                    font-family: inherit;
                    font-size: 14px;
                }
                .quill-wrapper .ql-editor {
                    min-height: 180px;
                    padding: 12px 15px;
                    color: #1f2937;
                }
                .quill-wrapper .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                }
                .quill-wrapper .ql-toolbar {
                    border-bottom: 1px solid #e5e7eb;
                }
                .quill-wrapper .ql-container,
                .quill-wrapper .ql-toolbar {
                    border: none;
                }
            `}</style>
            {/* Header / Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-100 px-1">
                <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-8 w-8 sm:h-9 sm:w-9 text-gray-600 hover:bg-gray-100 shrink-0"
                        title="Return"
                    >
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <div className="h-4 w-px bg-gray-200 mx-1 shrink-0" />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.print()}
                        className="h-8 w-8 sm:h-9 sm:w-9 text-gray-600 hover:bg-gray-100 shrink-0"
                        title="Print"
                    >
                        <Printer className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleGeneratePDF}
                        className="h-8 w-8 sm:h-9 sm:w-9 text-gray-600 hover:bg-gray-100 shrink-0"
                        title="Download PDF"
                    >
                        <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsForwardOpen(true)}
                        className="h-8 w-8 sm:h-9 sm:w-9 text-gray-600 hover:bg-gray-100 shrink-0"
                        title="Forward Memo"
                    >
                        <Forward className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                    <Button
                        variant={showMinuteForm ? "secondary" : "outline"}
                        onClick={() => setShowMinuteForm(!showMinuteForm)}
                        disabled={updating}
                        className={cn(
                            "h-9 sm:h-10 px-3 sm:px-6 border-primary/30 text-primary hover:bg-primary/5 rounded-md text-xs sm:text-sm font-bold gap-2 transition-all flex-1 sm:flex-none",
                            showMinuteForm && "bg-primary/10 border-primary"
                        )}
                    >
                        {showMinuteForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        {showMinuteForm ? "Cancel" : "Add Minute"}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                        disabled={updating}
                        className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md shrink-0 transition-colors"
                        title="Delete Memo"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    {!memo.isArchived && memo.status === 'approved' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleArchive}
                            disabled={updating}
                            className="h-9 w-9 text-gray-400 hover:text-primary hover:bg-primary/5"
                            title="Archive Memo"
                        >
                            <Archive className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Status Stepper */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm overflow-x-auto scrollbar-none">
                <div className="flex items-center justify-between relative min-w-[500px]">
                    {/* Line behind */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2" />

                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const StepIcon = step.icon;

                        return (
                            <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-2">
                                <div className={cn(
                                    "h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center border-2 transition-colors",
                                    isCompleted ? "bg-primary border-primary text-white" : "bg-white border-gray-200 text-gray-400",
                                    isCurrent && "ring-4 ring-primary/20"
                                )}>
                                    <StepIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>
                                <span className={cn(
                                    "mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-tight",
                                    isCompleted ? "text-primary" : "text-gray-400"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Minute Form (Moved to top) */}
            {showMinuteForm && (
                <div className="border-2 border-primary/20 rounded-xl overflow-hidden bg-primary/[0.02] animate-in fade-in slide-in-from-top-2 shadow-lg mb-6">
                    <div className="bg-primary/5 px-4 py-2 border-b border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Add New Minute</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setShowMinuteForm(false)} className="h-6 w-6 text-primary hover:bg-primary/10">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-gray-700">Minute Message</Label>
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                <div className="quill-wrapper">
                                    <ReactQuill
                                        theme="snow"
                                        value={minuteData.message}
                                        onChange={(val) => setMinuteData(prev => ({ ...prev, message: val }))}
                                        placeholder="Enter your minute message here..."
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['clean']
                                            ],
                                        }}
                                        style={{ height: '200px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-gray-700">Attach Supporting File</Label>
                                <div className="flex flex-col gap-2">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="minute-file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="minute-file"
                                            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-gray-500 group"
                                        >
                                            <Paperclip className="h-5 w-5 group-hover:text-primary transition-colors" />
                                            <span className="text-xs font-medium">Click or drag to attach file</span>
                                        </label>
                                    </div>
                                    {minuteData.attachments.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {minuteData.attachments.map((file, idx) => (
                                                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs group shadow-sm">
                                                    <FileText className="h-3.5 w-3.5 text-gray-400" />
                                                    <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                                                    <button onClick={() => removeMinuteAttachment(idx)} className="text-gray-400 hover:text-red-500 ml-1">
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col justify-end">
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-gray-700">Review Decision</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            onClick={() => handleAddMinute('rejected')}
                                            disabled={updating}
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50 border-2 font-bold uppercase text-xs h-12"
                                        >
                                            REJECT / QUERY
                                        </Button>
                                        <Button
                                            onClick={() => handleAddMinute('approved')}
                                            disabled={updating}
                                            className="bg-primary hover:bg-primary/90 font-bold uppercase text-xs h-12 shadow-lg shadow-primary/20"
                                        >
                                            APPROVE MEMO
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={() => handleAddMinute('comment')}
                                        disabled={updating}
                                        variant="ghost"
                                        className="w-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 text-[11px] font-bold uppercase tracking-wider"
                                    >
                                        Add as comment only
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Memo Content */}
            <div id="memo-content" className="bg-white">
                <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <div className="space-y-6">
                            {/* Logo and Title */}
                            <div className="flex flex-col items-center space-y-2">
                                <div className="h-20 w-auto relative flex items-center justify-center">
                                    <svg width="240" height="80" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Icon */}
                                        <path d="M45 15C45 15 50 15 50 20V60C50 65 45 65 45 65H25C25 65 20 65 20 60V20C20 15 25 15 25 15H45Z" fill="#00923f" fillOpacity="0.1" />
                                        <path d="M35 10C35 10 40 10 40 15V55C40 60 35 60 35 60H15C15 60 10 60 10 55V15C10 10 15 10 15 10H35Z" stroke="#00923f" strokeWidth="3" fill="white" />
                                        <path d="M20 25H30" stroke="#00923f" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M20 32H30" stroke="#00923f" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M20 39H27" stroke="#00923f" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="32" cy="50" r="6" fill="#cafe48" />
                                        <path d="M30 50L31.5 51.5L34.5 48.5" stroke="#00923f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                                        {/* Text */}
                                        <text x="60" y="45" fontFamily="sans-serif" fontWeight="bold" fontSize="32" fill="#111827">McFin<tspan fill="#00923f">Docs</tspan></text>
                                        <text x="60" y="62" fontFamily="sans-serif" fontSize="10" fill="#6b7280" letterSpacing="0.1em">FINANCIAL DOCUMENT SYSTEM</text>
                                    </svg>
                                </div>
                                <div className="bg-[#004a99] text-white px-8 py-2 rounded-xl text-lg font-bold tracking-wider shadow-sm uppercase">
                                    Internal Memorandum
                                </div>
                            </div>

                            {/* Metadata Grid */}
                            <div className="border-y border-gray-400 py-4 mt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 md:divide-x divide-gray-400">
                                    {/* Left Side */}
                                    <div className="space-y-3 md:pr-6">
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold min-w-[60px] text-gray-900">From:</span>
                                            <span className="text-gray-800">{memo.from}</span>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold min-w-[60px] text-gray-900">Date:</span>
                                            <span className="text-gray-800 font-medium">{new Date(memo.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>

                                    {/* Right Side */}
                                    <div className="space-y-3 md:pl-6 border-t md:border-t-0 pt-3 md:pt-0 border-gray-200 border-dashed md:border-none">
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold min-w-[40px] text-gray-900">To:</span>
                                            <div className="flex flex-wrap gap-x-2 text-gray-800">
                                                {Array.isArray(memo.to) ? memo.to.join(', ') : memo.to}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold min-w-[40px] text-gray-900">Cc:</span>
                                            <span className="text-gray-800">
                                                {Array.isArray(memo.cc) && memo.cc.length > 0 ? memo.cc.join(', ') : 'NA'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold min-w-[40px] text-gray-900">Ref:</span>
                                            <span className="text-gray-800 uppercase font-mono tracking-tight text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                                UNIMED/{memo.fromDept || 'GENERAL'}/{new Date(memo.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '')}/{String(memo._id).slice(-4)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Badge (Optional/Floating) */}
                            {memo.isFinancial && (
                                <div className="flex justify-end">
                                    <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none gap-1 py-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Financial Approval Required
                                    </Badge>
                                </div>
                            )}

                            <div className="pt-4">
                                <h2 className="text-xl font-bold text-gray-900 border-b-2 border-primary/10 pb-2">{memo.subject}</h2>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-8">
                        <div
                            className="prose prose-sm max-w-none text-gray-700 leading-relaxed min-h-[200px] sm:min-h-[300px] w-full break-words [&>p]:break-words [&>span]:break-words"
                            dangerouslySetInnerHTML={{ __html: memo.message }}
                        />

                        <div className="mt-12 pt-8 border-t flex justify-end">
                            <div className="text-center space-y-2">
                                <div className="h-20 w-48 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center bg-gray-50/50">
                                    {memo.status === 'approved' ? (
                                        <div className="flex flex-col items-center text-primary rotate-[-5deg] relative">
                                            <Stamp className="h-12 w-12 opacity-10 absolute -top-2" />
                                            <span className="font-serif italic text-xl font-bold border-2 border-primary px-4 py-1 rounded select-none">
                                                APPROVED
                                            </span>
                                            <span className="text-[8px] font-sans font-bold uppercase tracking-[0.2em] mt-1">Digital Signature</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">Signature Placeholder</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{memo.fromName}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-medium">{memo.fromDesignation}</p>
                                </div>
                            </div>
                        </div>

                        {/* Minutes Section */}
                        {memo.minutes && memo.minutes.length > 0 && (
                            <div className="mt-8 sm:mt-12 border-t border-gray-200 pt-8">
                                <h3 className="text-center text-base font-bold text-gray-500 uppercase tracking-wider mb-6 sm:mb-8">
                                    MINUTES
                                </h3>
                                <div className="space-y-4 sm:space-y-6">
                                    {memo.minutes.map((minute: any, idx: number) => {
                                        const getInitials = (name: string) => {
                                            if (!name) return '?';
                                            return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                                        };

                                        return (
                                            <div key={idx} className="bg-gray-50/30 rounded-lg p-4 sm:p-6 border border-gray-100">
                                                <div className="flex gap-3 sm:gap-4">
                                                    <div className="shrink-0">
                                                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                                                            {getInitials(minute.authorName)}
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                            <div className="flex-1">
                                                                <div className="font-bold text-gray-900 text-sm">
                                                                    {minute.authorName}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {minute.authorEmail || 'No email provided'}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col items-start sm:items-end gap-1">
                                                                <span className={cn(
                                                                    "px-3 sm:px-4 py-1 rounded-md text-xs font-bold uppercase",
                                                                    minute.status === 'approved' ? "bg-teal-500 text-white" :
                                                                        minute.status === 'rejected' ? "bg-red-500 text-white" :
                                                                            "bg-lime-400 text-gray-800"
                                                                )}>
                                                                    {minute.authorDept || 'Admin'}
                                                                </span>
                                                                <span className="text-[10px] sm:text-xs text-gray-400">
                                                                    {new Date(minute.createdAt).toLocaleDateString('en-GB', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric'
                                                                    })} {new Date(minute.createdAt).toLocaleTimeString('en-US', {
                                                                        hour: 'numeric',
                                                                        minute: '2-digit',
                                                                        hour12: true
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="prose prose-xs sm:prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: minute.message }} />

                                                        {minute.attachments && minute.attachments.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                {minute.attachments.map((file: any, fidx: number) => (
                                                                    <a
                                                                        key={fidx}
                                                                        href={file.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-primary hover:border-primary hover:bg-primary/5 transition-colors"
                                                                    >
                                                                        <Paperclip className="h-3 w-3" />
                                                                        {file.name}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>

            {/* Forward Dialog */}
            <Dialog open={isForwardOpen} onOpenChange={setIsForwardOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Forward Memo</DialogTitle>
                        <DialogDescription>
                            Forward this document to another person or office.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="recipient">Recipient (Person)</Label>
                            <Input
                                id="recipient"
                                placeholder="Enter name of recipient"
                                value={forwardForm.recipient}
                                onChange={(e) => setForwardForm({ ...forwardForm, recipient: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="office">Office</Label>
                            <Input
                                id="office"
                                placeholder="Enter office/department"
                                value={forwardForm.office}
                                onChange={(e) => setForwardForm({ ...forwardForm, office: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Add a note..."
                                value={forwardForm.message}
                                onChange={(e) => setForwardForm({ ...forwardForm, message: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="file">Attachment</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={(e) => setForwardForm({ ...forwardForm, file: e.target.files?.[0] || null })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsForwardOpen(false)}>Cancel</Button>
                        <Button onClick={handleForwardSubmit}>Forward</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
