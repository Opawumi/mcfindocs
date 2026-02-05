'use client';

import dynamic from 'next/dynamic';

// Dynamically import SettingsView with SSR disabled to prevent hydration mismatch
// Radix UI Tabs generates unique IDs that differ between server and client
const SettingsView = dynamic(
    () => import('@/features/settings/components/settings-view').then(mod => ({ default: mod.SettingsView })),
    {
        ssr: false,
        loading: () => <div className="animate-pulse p-8">Loading settings...</div>
    }
);

export default function SettingsPage() {
    return <SettingsView />;
}
