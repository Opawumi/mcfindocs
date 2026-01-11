'use client';

import { Suspense } from 'react';
import { ComposeMemo } from '@/features/memos';

export default function CreateMemoPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading editor...</div>}>
            <ComposeMemo />
        </Suspense>
    );
}
