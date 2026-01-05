'use client';

import { use } from 'react';
import { MemoDetail } from '@/features/memos';

export default function MemoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    // Mock data - in a real app, you would fetch the memo by id
    const mockMemo = {
        id: id,
        from: 'divandsection@gmail.com',
        fromName: 'Dr. Sarah Connor',
        fromDept: 'Computer Science',
        fromDesignation: 'Professor',
        to: ['Registrar', 'Bursar', 'VC'],
        subject: 'Testing on demo Memo for Senate',
        message: 'We would like to inform you that there will be a scheduled system maintenance this weekend. Please ensure all critical documents are saved before Friday 5:00 PM.\n\nBest regards,\nSarah.',
        date: 'Aug 23',
        status: 'approved' as const,
        isFinancial: true,
    };

    return <MemoDetail memo={mockMemo} />;
}
