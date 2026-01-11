'use client';

import { use, useEffect, useState } from 'react';
import { MemoDetail } from '@/features/memos';
import { toast } from 'sonner';

export default function MemoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [memo, setMemo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemo = async () => {
            try {
                const res = await fetch(`/api/memos/${id}`);
                const result = await res.json();
                if (result.success) {
                    setMemo(result.data);
                } else {
                    toast.error('Failed to load memo');
                }
            } catch (error) {
                toast.error('An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchMemo();
    }, [id]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading memo details...</div>;
    }

    if (!memo) {
        return <div className="p-8 text-center text-red-500">Memo not found</div>;
    }

    return <MemoDetail memo={memo} />;
}
