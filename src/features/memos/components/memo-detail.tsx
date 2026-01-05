'use client';

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
    Stamp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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

export function MemoDetail({ memo }: MemoDetailProps) {
    const router = useRouter();

    const steps = [
        { id: 'initiated', label: 'Initiated', icon: Clock },
        { id: 'pending', label: 'Pending', icon: Clock },
        { id: 'reviewed', label: 'Reviewed', icon: FileCheck },
        { id: 'approved', label: 'Approved', icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === memo.status);

    const handleGeneratePDF = () => {
        toast.success('Secured PDF copy generated and sent to Bursar');
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
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
                    <h1 className="text-2xl font-bold text-gray-900">Memo Details</h1>
                </div>
                {memo.isFinancial && (
                    <Button
                        onClick={handleGeneratePDF}
                        className="bg-primary hover:bg-primary/90 gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Generate Secured PDF
                    </Button>
                )}
            </div>

            {/* Status Stepper */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between relative">
                    {/* Line behind */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2" />

                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const StepIcon = step.icon;

                        return (
                            <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-2">
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors",
                                    isCompleted ? "bg-primary border-primary text-white" : "bg-white border-gray-200 text-gray-400",
                                    isCurrent && "ring-4 ring-primary/20"
                                )}>
                                    <StepIcon className="h-5 w-5" />
                                </div>
                                <span className={cn(
                                    "mt-2 text-xs font-medium",
                                    isCompleted ? "text-primary" : "text-gray-400"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Memo Content */}
            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="border-b bg-gray-50/50 p-8">
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Internal Memorandum</p>
                                <h2 className="text-xl font-bold text-gray-900">{memo.subject}</h2>
                            </div>
                            <Badge variant="outline" className="bg-white text-gray-500 border-gray-200 font-normal">
                                {memo.date}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <User className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">From</p>
                                        <p className="text-sm font-semibold text-gray-900">{memo.fromName}</p>
                                        <p className="text-xs text-gray-600">{memo.fromDesignation}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Building2 className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Department</p>
                                        <p className="text-sm font-semibold text-gray-900">{memo.fromDept}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">To</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {memo.to.map(recipient => (
                                            <Badge key={recipient} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                                                {recipient}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                {memo.isFinancial && (
                                    <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none gap-1 py-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Financial Approval Required
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed min-h-[300px]">
                        {memo.message}
                    </div>

                    <div className="mt-12 pt-8 border-t flex justify-end">
                        <div className="text-center space-y-2">
                            <div className="h-20 w-48 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center bg-gray-50/50">
                                {memo.status === 'approved' ? (
                                    <div className="flex flex-col items-center text-primary rotate-[-5deg]">
                                        <Stamp className="h-8 w-8 opacity-20 absolute" />
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
                </CardContent>
            </Card>
        </div>
    );
}
