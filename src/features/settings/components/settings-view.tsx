'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Bell, Lock, Globe, Moon, Sun } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';
import { useTheme } from 'next-themes';

export function SettingsView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, update } = useSession();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [mounted, setMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Profile State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');
    const [bio, setBio] = useState(''); // Not persisted yet but mocked
    const [isProfileLoading, setProfileLoading] = useState(false);
    const [isImageUploading, setImageUploading] = useState(false);

    // Other state...
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSecurityLoading, setSecurityLoading] = useState(false);

    // ... (rest of effects)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) { // 1MB
            toast.error("Image size must be less than 1MB");
            return;
        }

        setImageUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result as string;
            try {
                const res = await fetch('/api/users/profile', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Image })
                });

                const result = await res.json();
                if (result.success) {
                    // Update session with new avatar URL (with timestamp to bust cache)
                    const userId = (session?.user as any)?.id;
                    const newAvatarUrl = `/api/users/${userId}/avatar?t=${Date.now()}`;

                    await update({
                        ...session,
                        user: {
                            ...session?.user,
                            image: newAvatarUrl
                        }
                    });

                    toast.success('Profile picture updated');
                } else {
                    toast.error('Failed to update profile picture');
                }
            } catch (error) {
                toast.error('An error occurred');
            } finally {
                setImageUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // ... (rest of handlers)

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    useEffect(() => {
        if (session?.user) {
            const user = session.user as any;
            const names = (user.name || '').split(' ');
            if (names.length > 0) setFirstName(names[0]);
            if (names.length > 1) setLastName(names.slice(1).join(' '));
            setDepartment(user.department || '');
            setDesignation(user.designation || '');
        }
    }, [session]);

    const user = session?.user as any;

    const handleProfileSave = async () => {
        setProfileLoading(true);
        try {
            const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
            const res = await fetch('/api/users/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fullName,
                    department,
                    designation
                })
            });

            const result = await res.json();

            if (result.success) {
                // Update session client-side
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: fullName,
                        department,
                        designation
                    }
                });
                toast.success('Profile updated successfully');
            } else {
                toast.error(result.error || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setSecurityLoading(true);
        try {
            const res = await fetch('/api/users/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const result = await res.json();

            if (result.success) {
                toast.success('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(result.error || 'Failed to update password');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setSecurityLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/dashboard')}
                    className="h-8 w-8 dark:hover:bg-gray-700"
                >
                    <ArrowLeft className="h-4 w-4 text-gray-900 dark:text-white" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account preferences</p>
                </div>
            </div>

            <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar for Tabs */}
                    <aside className="w-full md:w-64 space-y-4">
                        <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-1 bg-white dark:bg-gray-800">
                            <TabsTrigger
                                value="profile"
                                className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg justify-start gap-3"
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="notifications"
                                className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg justify-start gap-3"
                            >
                                <Bell className="h-4 w-4" />
                                Notifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="security"
                                className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg justify-start gap-3"
                            >
                                <Lock className="h-4 w-4" />
                                Security
                            </TabsTrigger>
                            <TabsTrigger
                                value="appearance"
                                className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg justify-start gap-3"
                            >
                                <Moon className="h-4 w-4" />
                                Appearance
                            </TabsTrigger>
                        </TabsList>
                    </aside>

                    {/* Content */}
                    <div className="flex-1">
                        {/* Profile Tab */}
                        <TabsContent value="profile" className="space-y-6 mt-0">
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-gray-900 dark:text-white">Profile Information</CardTitle>
                                    <CardDescription className="dark:text-gray-400">Update your photo and personal details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={user?.image} />
                                            <AvatarFallback className="text-2xl bg-primary text-white">
                                                {getInitials(user?.name || 'U')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                            <Button
                                                variant="outline"
                                                className="text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isImageUploading}
                                            >
                                                {isImageUploading ? 'Uploading...' : 'Change Photo'}
                                            </Button>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">JPG, GIF or PNG. Max 1MB.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-gray-900 dark:text-gray-200">First name</Label>
                                            <Input
                                                id="firstName"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-gray-900 dark:text-gray-200">Last name</Label>
                                            <Input
                                                id="lastName"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-gray-900 dark:text-gray-200">Email</Label>
                                            <Input id="email" defaultValue={user?.email} disabled className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="role" className="text-gray-900 dark:text-gray-200">Role</Label>
                                            <Input id="role" defaultValue={user?.role} disabled className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 capitalize cursor-not-allowed" />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="dept" className="text-gray-900 dark:text-gray-200">Department</Label>
                                            <Input
                                                id="dept"
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="designation" className="text-gray-900 dark:text-gray-200">Designation</Label>
                                            <Input
                                                id="designation"
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleProfileSave} disabled={isProfileLoading} className="bg-primary hover:bg-primary/90">
                                        {isProfileLoading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Notifications Tab */}
                        <TabsContent value="notifications" className="space-y-6 mt-0">
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-gray-900 dark:text-white">Notification Preferences</CardTitle>
                                    <CardDescription className="dark:text-gray-400">Choose what you want to be notified about.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="marketing" className="flex flex-col space-y-1">
                                                <span className="text-gray-900 dark:text-white font-medium">New Documents</span>
                                                <span className="text-gray-500 dark:text-gray-400 font-normal text-sm">Receive emails when new documents are shared with you.</span>
                                            </Label>
                                            <Switch id="marketing" defaultChecked />
                                        </div>
                                        <Separator className="dark:bg-gray-700" />
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="social" className="flex flex-col space-y-1">
                                                <span className="text-gray-900 dark:text-white font-medium">Memo Updates</span>
                                                <span className="text-gray-500 dark:text-gray-400 font-normal text-sm">Receive emails about status changes on your memos.</span>
                                            </Label>
                                            <Switch id="social" defaultChecked />
                                        </div>
                                        <Separator className="dark:bg-gray-700" />
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="security" className="flex flex-col space-y-1">
                                                <span className="text-gray-900 dark:text-white font-medium">Meeting Invites</span>
                                                <span className="text-gray-500 dark:text-gray-400 font-normal text-sm">Receive emails when you are invited to a meeting.</span>
                                            </Label>
                                            <Switch id="security" defaultChecked />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="bg-primary hover:bg-primary/90">Save Preferences</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security" className="space-y-6 mt-0">
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-gray-900 dark:text-white">Security</CardTitle>
                                    <CardDescription className="dark:text-gray-400">Manage your password and security settings.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="current" className="text-gray-900 dark:text-gray-200">Current Password</Label>
                                        <Input
                                            id="current"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new" className="text-gray-900 dark:text-gray-200">New Password</Label>
                                        <Input
                                            id="new"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm" className="text-gray-900 dark:text-gray-200">Confirm Password</Label>
                                        <Input
                                            id="confirm"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handlePasswordUpdate} disabled={isSecurityLoading} className="bg-primary hover:bg-primary/90">
                                        {isSecurityLoading ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Appearance Tab */}
                        <TabsContent value="appearance" className="space-y-6 mt-0">
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-gray-900 dark:text-white">Appearance</CardTitle>
                                    <CardDescription className="dark:text-gray-400">Customize the interface of the application.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="darkMode" className="flex flex-col space-y-1">
                                            <span className="text-gray-900 dark:text-white font-medium">Dark Mode</span>
                                            <span className="text-gray-500 dark:text-gray-400 font-normal text-sm">Enable dark mode for a comfortable viewing experience in low light.</span>
                                        </Label>
                                        {mounted && (
                                            <Switch
                                                id="darkMode"
                                                checked={resolvedTheme === 'dark'}
                                                onCheckedChange={(checked) => {
                                                    setTheme(checked ? 'dark' : 'light');
                                                    toast.success(checked ? 'Dark mode enabled' : 'Light mode enabled');
                                                }}
                                            />
                                        )}
                                    </div>
                                    <Separator className="dark:bg-gray-700" />
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="systemTheme" className="flex flex-col space-y-1">
                                            <span className="text-gray-900 dark:text-white font-medium">Use System Theme</span>
                                            <span className="text-gray-500 dark:text-gray-400 font-normal text-sm">Automatically match your operating system's theme preference.</span>
                                        </Label>
                                        {mounted && (
                                            <Switch
                                                id="systemTheme"
                                                checked={theme === 'system'}
                                                onCheckedChange={(checked) => {
                                                    setTheme(checked ? 'system' : (resolvedTheme || 'light'));
                                                    toast.success(checked ? 'Using system theme' : 'Using manual theme');
                                                }}
                                            />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
