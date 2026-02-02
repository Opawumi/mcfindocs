import { Suspense } from 'react';
import { SettingsView } from '@/features/settings';

export default function SettingsPage() {
    return (
        <Suspense fallback={<div>Loading settings...</div>}>
            <SettingsView />
        </Suspense>
    );
}
