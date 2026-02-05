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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-gray-50 dark:bg-gray-800 animate-pulse rounded-md border border-gray-200 dark:border-gray-700" />
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
        toEmails: [] as string[],
        ccEmails: [] as string[],
        bccEmails: [] as string[],
        replyTo: '',
        office: '',
        message: '',
        file: null as File | null
    });

    const [showForwardCc, setShowForwardCc] = useState(false);
    const [showForwardBcc, setShowForwardBcc] = useState(false);
    const [showForwardReplyTo, setShowForwardReplyTo] = useState(false);

    const addForwardRecipient = (type: 'toEmails' | 'ccEmails' | 'bccEmails', email: string) => {
        if (!forwardForm[type].includes(email)) {
            setForwardForm({
                ...forwardForm,
                [type]: [...forwardForm[type], email]
            });
        }
    };

    const removeForwardRecipient = (type: 'toEmails' | 'ccEmails' | 'bccEmails', email: string) => {
        setForwardForm({
            ...forwardForm,
            [type]: forwardForm[type].filter(e => e !== email)
        });
    };

    const handleForwardSubmit = async () => {
        if (!forwardForm.toEmails.length) {
            toast.error('Please select at least one main recipient');
            return;
        }

        const currentUser = session?.user as any;
        if (!currentUser) {
            toast.error('You must be logged in to forward memos');
            return;
        }

        setUpdating(true);
        try {
            // Construct forwarded body
            const forwardedHeader = `

---------- Forwarded message ----------
From: ${memo.fromName} <${memo.from}>
Date: ${new Date(memo.createdAt || Date.now()).toLocaleString()}
Subject: ${memo.subject}
To: ${Array.isArray(memo.to) ? memo.to.join(', ') : memo.to}
`;

            const fullMessage = (forwardForm.message || '') + forwardedHeader + `\n\n${memo.message}`;
            const newSubject = memo.subject.startsWith('Fwd:') ? memo.subject : `Fwd: ${memo.subject}`;

            const payload = {
                from: currentUser.email,
                fromName: currentUser.name || 'Unknown',
                fromDept: currentUser.department || 'General',
                fromDesignation: currentUser.designation || 'Staff',
                to: forwardForm.toEmails,
                cc: forwardForm.ccEmails,
                bcc: forwardForm.bccEmails,
                replyTo: forwardForm.replyTo,
                subject: newSubject,
                message: fullMessage,
                status: 'pending', // Forwarded memos typically go to pending/inbox
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                isFinancial: memo.isFinancial // Carry over financial flag? Maybe
            };

            const res = await fetch('/api/memos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (result.success) {
                toast.success(`Memo forwarded successfully`);
                setIsForwardOpen(false);
                setForwardForm({ toEmails: [], ccEmails: [], bccEmails: [], replyTo: '', office: '', message: '', file: null });
            } else {
                toast.error(result.error || 'Failed to forward memo');
            }
        } catch (error) {
            console.error('Forward Error:', error);
            toast.error('Failed to forward memo');
        } finally {
            setUpdating(false);
        }
    };

    // Sync memo state when initialMemo changes
    useEffect(() => {
        setMemo(initialMemo);
    }, [initialMemo]);

    const [offices, setOffices] = useState<string[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await fetch('/api/users');
                const userData = await userRes.json();
                if (userData.success) {
                    setAllUsers(userData.data);
                    const depts = Array.from(new Set(userData.data.map((u: any) => u.department))) as string[];
                    setOffices(depts);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (forwardForm.office && forwardForm.office !== 'all') {
            // Filter by specific department
            setFilteredUsers(allUsers.filter(u => u.department === forwardForm.office));
        } else {
            // Show all users when 'all' is selected or nothing is selected
            setFilteredUsers(allUsers);
        }
    }, [forwardForm.office, allUsers]);

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
                .dark .quill-wrapper .ql-editor {
                    color: #e5e7eb;
                }
                .quill-wrapper .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                }
                .dark .quill-wrapper .ql-editor.ql-blank::before {
                    color: #6b7280;
                }
                .quill-wrapper .ql-toolbar {
                    border-bottom: 1px solid #e5e7eb;
                }
                .dark .quill-wrapper .ql-toolbar {
                    border-bottom: 1px solid #374151;
                }
                .quill-wrapper .ql-container,
                .quill-wrapper .ql-toolbar {
                    border: none;
                }
            `}</style>
            {/* Header / Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-100 dark:border-gray-800 px-1">
                <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-8 w-8 sm:h-9 sm:w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                        title="Return"
                    >
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1 shrink-0" />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.print()}
                        className="h-8 w-8 sm:h-9 sm:w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                        title="Print"
                    >
                        <Printer className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleGeneratePDF}
                        className="h-8 w-8 sm:h-9 sm:w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                        title="Download PDF"
                    >
                        <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsForwardOpen(true)}
                        className="h-8 w-8 sm:h-9 sm:w-9 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
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
                            "h-9 sm:h-10 px-3 sm:px-6 border-primary/30 text-primary hover:bg-primary/5 dark:hover:bg-primary/20 dark:border-primary/50 rounded-md text-xs sm:text-sm font-bold gap-2 transition-all flex-1 sm:flex-none",
                            showMinuteForm ? "bg-primary/10 border-primary dark:bg-primary/20" : "dark:text-primary dark:border-primary/40"
                        )}
                    >
                        {showMinuteForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        {showMinuteForm ? "Cancel" : "Add Minute"}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleArchive}
                        disabled={updating || memo.isArchived}
                        className={cn(
                            "h-9 w-9 rounded-md shrink-0 transition-colors",
                            memo.isArchived
                                ? "text-gray-300 dark:text-gray-700 pointer-events-none"
                                : "text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                        )}
                        title="Archive Memo"
                    >
                        <Archive className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Hierarchical Workflow Display */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6 text-center">Memo Approval Workflow</h3>

                <div className="flex items-start gap-0 min-w-max pb-4">
                    {/* 1. Initiator */}
                    <div className="flex items-center group">
                        <div className="flex flex-col items-center px-4">
                            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-lg ring-4 ring-primary/10 dark:ring-primary/20">
                                <User className="h-7 w-7" />
                            </div>
                            <div className="mt-3 text-center min-w-[140px] max-w-[160px]">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Initiator</span>
                                </div>
                                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{memo.fromName}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium truncate">{memo.fromDesignation}</p>
                                <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">{new Date(memo.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                            </div>
                        </div>
                        {/* Connector line */}
                        {((memo.recommender && memo.recommender.length > 0) || (memo.approver && memo.approver.length > 0) || (memo.cc && memo.cc.length > 0)) && (
                            <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-600 mt-8" />
                        )}
                    </div>

                    {/* 2. Recommenders */}
                    {memo.recommender && Array.isArray(memo.recommender) && memo.recommender.length > 0 && (
                        <>
                            {memo.recommender.map((recommenderEmail: string, index: number) => {
                                const recommenderUser = allUsers.find(u => u.email === recommenderEmail);
                                const isLast = index === memo.recommender.length - 1;

                                return (
                                    <div key={recommenderEmail} className="flex items-center">
                                        <div className="flex flex-col items-center px-4">
                                            <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-lg shadow-md">
                                                {recommenderUser ? recommenderUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'R'}
                                            </div>
                                            <div className="mt-3 text-center min-w-[140px] max-w-[160px]">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Recommender {index + 1}</span>
                                                </div>
                                                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{recommenderUser?.name || 'Unknown'}</p>
                                                {recommenderUser && (
                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase truncate">{recommenderUser.designation}</p>
                                                )}
                                                <p className="text-[9px] text-gray-600 dark:text-gray-400 truncate">{recommenderUser?.email || recommenderEmail}</p>
                                            </div>
                                        </div>
                                        {/* Connector line */}
                                        {(!isLast || (memo.approver && memo.approver.length > 0) || (memo.cc && memo.cc.length > 0)) && (
                                            <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-600 mt-8" />
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {/* 3. Approvers */}
                    {memo.approver && Array.isArray(memo.approver) && memo.approver.length > 0 && (
                        <>
                            {memo.approver.map((approverEmail: string, index: number) => {
                                const approverUser = allUsers.find(u => u.email === approverEmail);
                                const isLast = index === memo.approver.length - 1;

                                // Check if this approver has taken any action
                                const userMinute = memo.minutes?.find((m: any) => m.authorEmail === approverEmail);
                                const status = userMinute?.status; // 'approved' | 'rejected' | 'comment'

                                let statusColor = "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300";
                                let Icon = User;
                                let badge = null;

                                if (status === 'approved') {
                                    statusColor = "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300";
                                    Icon = CheckCircle2;
                                    badge = <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 text-[8px] px-1 py-0 ml-1">APPROVED</Badge>;
                                } else if (status === 'rejected') {
                                    statusColor = "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300";
                                    Icon = X;
                                    badge = <Badge className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 text-[8px] px-1 py-0 ml-1">REJECTED</Badge>;
                                } else if (status === 'comment') {
                                    statusColor = "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300";
                                    Icon = FileText;
                                    badge = <Badge className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-[8px] px-1 py-0 ml-1">COMMENTED</Badge>;
                                } else if (memo.status === 'approved' && !userMinute && index === memo.approver.length - 1) {
                                    // Fallback: If memo global status is approved and this is the final approver, assume they did it (legacy/migration support)
                                    statusColor = "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300";
                                    Icon = CheckCircle2;
                                    badge = <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 text-[8px] px-1 py-0 ml-1">APPROVED</Badge>;
                                }

                                return (
                                    <div key={approverEmail} className="flex items-center">
                                        <div className="flex flex-col items-center px-4">
                                            <div className={cn(
                                                "h-16 w-16 rounded-full flex items-center justify-center font-bold text-lg shadow-md border-2 transition-all duration-300 ring-4 ring-transparent",
                                                statusColor,
                                                status === 'approved' && "ring-green-100 dark:ring-green-900/40"
                                            )}>
                                                {status === 'approved' || (memo.status === 'approved' && !userMinute && index === memo.approver.length - 1) ?
                                                    <CheckCircle2 className="h-8 w-8" /> :
                                                    (approverUser ? approverUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'A')
                                                }
                                            </div>
                                            <div className="mt-3 text-center min-w-[140px] max-w-[160px]">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Approver {index + 1}</span>
                                                    {badge}
                                                </div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{approverUser?.name || 'Unknown'}</p>
                                                {approverUser && (
                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium truncate">{approverUser.designation}</p>
                                                )}
                                                <p className="text-[9px] text-gray-400 dark:text-gray-500 truncate font-mono">{approverUser?.email || approverEmail}</p>
                                            </div>
                                        </div>
                                        {/* Connector line */}
                                        {(!isLast || (memo.cc && memo.cc.length > 0) || (memo.bcc && memo.bcc.length > 0 && memo.from === session?.user?.email)) && (
                                            <div className="h-0.5 w-12 bg-gray-200 dark:bg-gray-700 mt-8" />
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {/* 4. CC Recipients */}
                    {memo.cc && Array.isArray(memo.cc) && memo.cc.length > 0 && (
                        <div className="flex items-center">
                            <div className="flex flex-col items-center px-4">
                                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold text-sm shadow-md">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div className="mt-3 text-center min-w-[140px] max-w-[160px]">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">CC (Informed)</span>
                                    </div>
                                    <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">{memo.cc.length} {memo.cc.length === 1 ? 'Person' : 'People'}</p>
                                    <div className="flex flex-col gap-0.5 mt-1 max-h-[60px] overflow-y-auto text-[9px] text-gray-600 dark:text-gray-400">
                                        {memo.cc.slice(0, 3).map((email: string) => {
                                            const user = allUsers.find(u => u.email === email);
                                            return (
                                                <div key={email} className="truncate">
                                                    {user ? user.name : email}
                                                </div>
                                            );
                                        })}
                                        {memo.cc.length > 3 && <div className="text-gray-400 dark:text-gray-500">+{memo.cc.length - 3} more</div>}
                                    </div>
                                </div>
                            </div>
                            {/* Connector line */}
                            {memo.bcc && Array.isArray(memo.bcc) && memo.bcc.length > 0 && memo.from === session?.user?.email && (
                                <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-600 mt-8" />
                            )}
                        </div>
                    )}

                    {/* 5. BCC Recipients (Only visible to sender) */}
                    {memo.bcc && Array.isArray(memo.bcc) && memo.bcc.length > 0 && memo.from === session?.user?.email && (
                        <div className="flex items-center">
                            <div className="flex flex-col items-center px-4">
                                <div className="h-16 w-16 rounded-full bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm shadow-md">
                                    <User className="h-6 w-6" />
                                </div>
                                <div className="mt-3 text-center min-w-[140px] max-w-[160px]">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">BCC (Hidden)</span>
                                    </div>
                                    <p className="font-semibold text-sm text-purple-700 dark:text-purple-300">{memo.bcc.length} {memo.bcc.length === 1 ? 'Person' : 'People'}</p>
                                    <div className="flex flex-col gap-0.5 mt-1 max-h-[60px] overflow-y-auto text-[9px] text-purple-600 dark:text-purple-400 italic">
                                        {memo.bcc.slice(0, 3).map((email: string) => {
                                            const user = allUsers.find(u => u.email === email);
                                            return (
                                                <div key={email} className="truncate">
                                                    {user ? user.name : email}
                                                </div>
                                            );
                                        })}
                                        {memo.bcc.length > 3 && <div className="text-purple-400 dark:text-purple-500">+{memo.bcc.length - 3} more</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Minute Form (Moved to top) */}
            {
                showMinuteForm && (
                    <div className="border-2 border-primary/20 rounded-xl overflow-hidden bg-white dark:bg-gray-900 animate-in fade-in slide-in-from-top-2 shadow-xl mb-6">
                        <div className="bg-primary/5 dark:bg-primary/10 px-4 py-3 border-b border-primary/10 dark:border-primary/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold text-primary dark:text-primary-foreground uppercase tracking-widest">Add New Minute</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowMinuteForm(false)} className="h-8 w-8 text-primary hover:bg-primary/10 dark:hover:bg-primary/20">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Minute Message
                                </Label>
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50/50 dark:bg-gray-950/50 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-4">
                                    <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Paperclip className="h-4 w-4 text-primary" />
                                        Supporting Documents
                                    </Label>
                                    <div className="flex flex-col gap-3">
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                id="minute-file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="minute-file"
                                                className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/20 transition-all text-gray-400 dark:text-gray-500 group"
                                            >
                                                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/20 transition-colors">
                                                    <Paperclip className="h-6 w-6 group-hover:text-primary transition-colors" />
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-xs font-bold block mb-1">Click to browse</span>
                                                    <span className="text-[10px]">Maximum size 5MB</span>
                                                </div>
                                            </label>
                                        </div>
                                        {minuteData.attachments.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {minuteData.attachments.map((file, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg text-xs group shadow-sm animate-in zoom-in-95 duration-200">
                                                        <FileText className="h-3.5 w-3.5 text-primary" />
                                                        <span className="truncate max-w-[150px] font-bold text-primary dark:text-primary-foreground">{file.name}</span>
                                                        <button onClick={() => removeMinuteAttachment(idx)} className="text-primary hover:text-red-500 dark:hover:text-red-400 ml-1 transition-colors">
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col justify-end">
                                    <div className="space-y-4">
                                        <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <Stamp className="h-4 w-4 text-primary" />
                                            Decision & Review
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                onClick={() => handleAddMinute('rejected')}
                                                disabled={updating}
                                                variant="outline"
                                                className="border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-2 font-black uppercase text-[10px] tracking-widest h-14 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                REJECT / QUERY
                                            </Button>
                                            <Button
                                                onClick={() => handleAddMinute('approved')}
                                                disabled={updating}
                                                className="bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-widest h-14 rounded-xl shadow-lg shadow-primary/20 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                APPROVE MEMO
                                            </Button>
                                        </div>
                                        <Button
                                            onClick={() => handleAddMinute('comment')}
                                            disabled={updating}
                                            variant="ghost"
                                            className="w-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white text-[10px] font-black uppercase tracking-[0.2em] h-10 transition-colors"
                                        >
                                            POST COMMENT ONLY
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Memo Content */}
            <div id="memo-content" className="bg-white dark:bg-gray-800 transition-colors duration-300">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden no-border-on-dark">
                    <CardHeader className="p-8 pb-0">
                        <div className="space-y-6">
                            {/* Logo and Title */}
                            <div className="flex flex-col items-center space-y-2">
                                <div className="h-20 w-auto relative flex items-center justify-center">
                                    <svg width="240" height="80" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Icon */}
                                        <path d="M45 15C45 15 50 15 50 20V60C50 65 45 65 45 65H25C25 65 20 65 20 60V20C20 15 25 15 25 15H45Z" fill="#00923f" fillOpacity="0.1" />
                                        <path d="M35 10C35 10 40 10 40 15V55C40 60 35 60 35 60H15C15 60 10 60 10 55V15C10 10 15 10 15 10H35Z" stroke="#00923f" strokeWidth="3" fill="white" className="dark:fill-gray-900" />
                                        <path d="M20 25H30" stroke="#00923f" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M20 32H30" stroke="#00923f" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M20 39H27" stroke="#00923f" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="32" cy="50" r="6" fill="#cafe48" />
                                        <path d="M30 50L31.5 51.5L34.5 48.5" stroke="#00923f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                                        {/* Text */}
                                        <text x="60" y="45" fontFamily="sans-serif" fontWeight="bold" fontSize="32" fill="#111827" className="dark:fill-white">McFin<tspan fill="#00923f">Docs</tspan></text>
                                        <text x="60" y="62" fontFamily="sans-serif" fontSize="10" fill="#6b7280" className="dark:fill-gray-400" letterSpacing="0.1em">FINANCIAL DOCUMENT SYSTEM</text>
                                    </svg>
                                </div>
                                <div className="bg-[#004a99] dark:bg-[#003d7c] text-white px-8 py-2 rounded-xl text-lg font-bold tracking-wider shadow-sm uppercase">
                                    Internal Memorandum
                                </div>
                            </div>

                            {/* Metadata Grid */}
                            <div className="border-y border-gray-400 dark:border-gray-600 py-4 mt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 md:divide-x divide-gray-400 dark:divide-gray-600">
                                    {/* Left Side */}
                                    <div className="space-y-3 md:pr-6">
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold min-w-[60px] text-gray-900 dark:text-white">From:</span>
                                            <span className="text-gray-800 dark:text-gray-200">{memo.from}</span>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold min-w-[60px] text-gray-900 dark:text-white">Date:</span>
                                            <span className="text-gray-800 dark:text-gray-200 font-medium">{new Date(memo.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>

                                    {/* Right Side */}
                                    <div className="space-y-3 md:pl-6 border-t md:border-t-0 pt-3 md:pt-0 border-gray-400 dark:border-gray-600 border-dashed md:border-none">
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold min-w-[65px] text-gray-900 dark:text-white" title="Main Actionable Recipients">To:</span>
                                            <div className="flex flex-wrap gap-x-2 text-gray-800 dark:text-gray-200">
                                                {Array.isArray(memo.to) ? memo.to.join(', ') : memo.to}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold min-w-[65px] text-gray-900 dark:text-white" title="Carbon Copy (Information only)">Cc:</span>
                                            <span className="text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                                {Array.isArray(memo.cc) && memo.cc.length > 0 ? memo.cc.join(', ') : 'NA'}
                                            </span>
                                        </div>
                                        {/* Bcc only visible to sender */}
                                        {memo.from === session?.user?.email && Array.isArray(memo.bcc) && memo.bcc.length > 0 && (
                                            <div className="flex gap-2 text-sm">
                                                <span className="font-bold min-w-[65px] text-gray-900 dark:text-blue-400 italic text-blue-600" title="Blind Carbon Copy (Only you can see this)">Bcc:</span>
                                                <span className="text-gray-500 dark:text-gray-400 italic">
                                                    {memo.bcc.join(', ')}
                                                </span>
                                            </div>
                                        )}
                                        {memo.replyTo && (
                                            <div className="flex gap-2 text-sm">
                                                <span className="font-bold min-w-[65px] text-gray-900 dark:text-white" title="Replies should go to this address">Reply-To:</span>
                                                <span className="text-primary font-medium">{memo.replyTo}</span>
                                            </div>
                                        )}
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold min-w-[65px] text-gray-900 dark:text-white">Ref:</span>
                                            <span className="text-gray-800 dark:text-gray-200 uppercase font-mono tracking-tight text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                                UNIMED/{memo.fromDept || 'GENERAL'}/{new Date(memo.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '')}/{String(memo._id).slice(-4)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Badge (Optional/Floating) */}
                            {memo.isFinancial && (
                                <div className="flex justify-end">
                                    <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 shadow-none gap-1 py-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Financial Approval Required
                                    </Badge>
                                </div>
                            )}

                            <div className="pt-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-primary/10 pb-2">{memo.subject}</h2>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-8">
                        <div
                            className="prose prose-sm max-w-none text-gray-700 dark:text-gray-200 leading-relaxed min-h-[200px] sm:min-h-[300px] w-full break-words [&>p]:break-words [&>span]:break-words"
                            dangerouslySetInnerHTML={{ __html: memo.message }}
                        />

                        <div className="mt-12 pt-8 border-t dark:border-gray-700 flex justify-end">
                            <div className="text-center space-y-2">
                                <div className="h-20 w-48 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50">
                                    {memo.status === 'approved' ? (
                                        <div className="flex flex-col items-center text-primary rotate-[-5deg] relative">
                                            <Stamp className="h-12 w-12 opacity-10 absolute -top-2" />
                                            <span className="font-serif italic text-xl font-bold border-2 border-primary px-4 py-1 rounded select-none">
                                                APPROVED
                                            </span>
                                            <span className="text-[8px] font-sans font-bold uppercase tracking-[0.2em] mt-1">Digital Signature</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 dark:text-gray-600">Signature Placeholder</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{memo.fromName}</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium">{memo.fromDesignation}</p>
                                </div>
                            </div>
                        </div>

                        {/* Minutes Section */}
                        {memo.minutes && memo.minutes.length > 0 && (
                            <div className="mt-8 sm:mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                                <h3 className="text-center text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 sm:mb-8">
                                    MINUTES
                                </h3>
                                <div className="space-y-4 sm:space-y-6">
                                    {memo.minutes.map((minute: any, idx: number) => {
                                        const getInitials = (name: string) => {
                                            if (!name) return '?';
                                            return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                                        };

                                        return (
                                            <div key={idx} className="bg-gray-50/30 dark:bg-gray-900/30 rounded-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-800">
                                                <div className="flex gap-3 sm:gap-4">
                                                    <div className="shrink-0">
                                                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                                                            {getInitials(minute.authorName)}
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                            <div className="flex-1">
                                                                <div className="font-bold text-gray-900 dark:text-white text-sm">
                                                                    {minute.authorName}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {minute.authorEmail || 'No email provided'}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col items-start sm:items-end gap-1">
                                                                <span className={cn(
                                                                    "px-3 sm:px-4 py-1 rounded-md text-xs font-bold uppercase",
                                                                    minute.status === 'approved' ? "bg-teal-500 text-white" :
                                                                        minute.status === 'rejected' ? "bg-red-500 text-white" :
                                                                            "bg-lime-400 dark:bg-lime-500 text-gray-800"
                                                                )}>
                                                                    {minute.authorDept || 'Admin'}
                                                                </span>
                                                                <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
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

                                                        <div className="prose prose-xs sm:prose-sm max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: minute.message }} />

                                                        {minute.attachments && minute.attachments.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                {minute.attachments.map((file: any, fidx: number) => (
                                                                    <a
                                                                        key={fidx}
                                                                        href={file.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-primary hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
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
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Forward className="h-5 w-5 text-primary" />
                            Forward Memo
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                            Forward this document to other staff members for action or awareness.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        {/* Office Selector */}
                        <div className="grid gap-2">
                            <Label htmlFor="office" className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">1. Filter by Office / Department</Label>
                            <Select
                                value={forwardForm.office}
                                onValueChange={(val) => setForwardForm({ ...forwardForm, office: val })}
                            >
                                <SelectTrigger className="w-full bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {offices.map(office => (
                                        <SelectItem key={office} value={office}>{office}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Recipients Section */}
                        <div className="space-y-4 bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">2. Select Recipients</Label>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setShowForwardCc(!showForwardCc)} className={cn("h-7 text-[10px]", showForwardCc ? "bg-primary/10 text-primary" : "text-gray-400 dark:text-gray-500")}>Cc</Button>
                                    <Button variant="ghost" size="sm" onClick={() => setShowForwardBcc(!showForwardBcc)} className={cn("h-7 text-[10px]", showForwardBcc ? "bg-primary/10 text-primary" : "text-gray-400 dark:text-gray-500")}>Bcc</Button>
                                    <Button variant="ghost" size="sm" onClick={() => setShowForwardReplyTo(!showForwardReplyTo)} className={cn("h-7 text-[10px]", showForwardReplyTo ? "bg-primary/10 text-primary" : "text-gray-400 dark:text-gray-500")}>Send To</Button>
                                </div>
                            </div>

                            {/* TO */}
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">To (Expected to take action)</Label>
                                <Select onValueChange={(val) => addForwardRecipient('toEmails', val)}>
                                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                                        <SelectValue placeholder="Add main recipient..." />
                                    </SelectTrigger>
                                    <SelectContent side="bottom" align="start" className="max-h-[300px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                        <SelectGroup>
                                            <SelectLabel>Available Staff</SelectLabel>
                                            {filteredUsers.map(u => (
                                                <SelectItem key={u._id} value={u.email}>{u.name} ({u.designation})</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {forwardForm.toEmails.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {forwardForm.toEmails.map(email => (
                                            <Badge key={email} variant="secondary" className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary border-primary/20 dark:border-primary/30 gap-1 pr-1">
                                                {email}
                                                <X className="h-3 w-3 cursor-pointer hover:text-red-500 dark:hover:text-red-400" onClick={() => removeForwardRecipient('toEmails', email)} />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* CC */}
                            {showForwardCc && (
                                <div className="space-y-2 animate-in fade-in duration-200">
                                    <Label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Cc (To be informed)</Label>
                                    <Select onValueChange={(val) => addForwardRecipient('ccEmails', val)}>
                                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                                            <SelectValue placeholder="Add CC recipient..." />
                                        </SelectTrigger>
                                        <SelectContent side="bottom" align="start" className="max-h-[300px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                            {filteredUsers.map(u => (
                                                <SelectItem key={u._id} value={u.email}>{u.name} ({u.designation})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {forwardForm.ccEmails.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {forwardForm.ccEmails.map(email => (
                                                <Badge key={email} variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 gap-1 pr-1">
                                                    {email}
                                                    <X className="h-3 w-3 cursor-pointer hover:text-red-500 dark:hover:text-red-400" onClick={() => removeForwardRecipient('ccEmails', email)} />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* BCC */}
                            {showForwardBcc && (
                                <div className="space-y-2 animate-in fade-in duration-200">
                                    <Label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Bcc (Discreet awareness)</Label>
                                    <Select onValueChange={(val) => addForwardRecipient('bccEmails', val)}>
                                        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                                            <SelectValue placeholder="Add BCC recipient..." />
                                        </SelectTrigger>
                                        <SelectContent side="bottom" align="start" className="max-h-[300px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                            {filteredUsers.map(u => (
                                                <SelectItem key={u._id} value={u.email}>{u.name} ({u.designation})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {forwardForm.bccEmails.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {forwardForm.bccEmails.map(email => (
                                                <Badge key={email} variant="secondary" className="bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 italic gap-1 pr-1">
                                                    {email}
                                                    <X className="h-3 w-3 cursor-pointer hover:text-red-500 dark:hover:text-red-400" onClick={() => removeForwardRecipient('bccEmails', email)} />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Send To */}
                            {showForwardReplyTo && (
                                <div className="space-y-2 animate-in fade-in duration-200">
                                    <Label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Send To (Where future replies should go)</Label>
                                    <Input
                                        placeholder="Specific email address..."
                                        value={forwardForm.replyTo}
                                        onChange={(e) => setForwardForm({ ...forwardForm, replyTo: e.target.value })}
                                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Notes Section */}
                        <div className="grid gap-2">
                            <Label htmlFor="message" className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">3. Add Forwarding Notes (Instruction)</Label>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-950 min-h-[180px] text-gray-900 dark:text-white transition-all focus-within:border-primary/50">
                                <div className="[&_.ql-editor]:text-gray-900 dark:[&_.ql-editor]:text-gray-100 [&_.ql-editor]:min-h-[140px] [&_.ql-editor.ql-blank::before]:text-gray-400 dark:[&_.ql-editor.ql-blank::before]:text-gray-500">
                                    <ReactQuill
                                        theme="snow"
                                        value={forwardForm.message}
                                        onChange={(val) => setForwardForm(prev => ({ ...prev, message: val }))}
                                        placeholder="Enter your instruction or context for forwarding..."
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['clean']
                                            ],
                                        }}
                                        className="h-[140px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* File Attachment */}
                        <div className="grid gap-2">
                            <Label htmlFor="file" className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">4. Attachment (Optional)</Label>
                            <div className="flex items-center gap-2 p-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-primary/50 dark:hover:border-primary/50 transition-colors cursor-pointer group bg-gray-50/50 dark:bg-gray-800/50">
                                <Label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer w-full">
                                    <Paperclip className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary-foreground" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary-foreground">
                                        {forwardForm.file ? forwardForm.file.name : "Attach additional document..."}
                                    </span>
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setForwardForm({ ...forwardForm, file: e.target.files?.[0] || null })}
                                    />
                                </Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="bg-gray-50 dark:bg-gray-900/100 -mx-6 -mb-6 p-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                        <Button variant="outline" onClick={() => setIsForwardOpen(false)} disabled={updating} className="dark:bg-gray-800 dark:hover:bg-gray-700">Cancel</Button>
                        <Button onClick={handleForwardSubmit} className="gap-2" disabled={updating}>
                            {updating ? <Clock className="h-4 w-4 animate-spin" /> : <Forward className="h-4 w-4" />}
                            Forward Memo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
