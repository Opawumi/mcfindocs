'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Bell, Lock, Globe, Moon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export function SettingsView() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="space-y-6 pb-12">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/dashboard')}
                    className="h-8 w-8"
                >
                    <ArrowLeft className="h-4 w-4 text-gray-900" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-500">Manage your account preferences</p>
                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar for Tabs */}
                    <aside className="w-full md:w-64 space-y-4">
                        <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-1 bg-white">
                            <TabsTrigger
                                value="profile"
                                className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-gray-600 hover:bg-gray-50 rounded-lg justify-start gap-3"
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="notifications"
                                className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-gray-600 hover:bg-gray-50 rounded-lg justify-start gap-3"
                            >
                                <Bell className="h-4 w-4" />
                                Notifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="security"
                                className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-gray-600 hover:bg-gray-50 rounded-lg justify-start gap-3"
                            >
                                <Lock className="h-4 w-4" />
                                Security
                            </TabsTrigger>
                            <TabsTrigger
                                value="appearance"
                                className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-gray-600 hover:bg-gray-50 rounded-lg justify-start gap-3"
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
                            <Card className="bg-white border-gray-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Profile Information</CardTitle>
                                    <CardDescription>Update your photo and personal details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <Button variant="outline" className="text-gray-900 border-gray-300">Change Photo</Button>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-gray-900">First name</Label>
                                            <Input id="firstName" defaultValue="John" className="bg-white border-gray-300 text-gray-900" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-gray-900">Last name</Label>
                                            <Input id="lastName" defaultValue="Doe" className="bg-white border-gray-300 text-gray-900" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-900">Email</Label>
                                        <Input id="email" defaultValue="john.doe@example.com" className="bg-white border-gray-300 text-gray-900" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio" className="text-gray-900">Bio</Label>
                                        <Textarea id="bio" placeholder="Write a short bio..." className="bg-white border-gray-300 text-gray-900 resize-none min-h-[100px]" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Notifications Tab */}
                        <TabsContent value="notifications" className="space-y-6 mt-0">
                            <Card className="bg-white border-gray-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Notification Preferences</CardTitle>
                                    <CardDescription>Choose what you want to be notified about.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="marketing" className="flex flex-col space-y-1">
                                                <span className="text-gray-900 font-medium">New Documents</span>
                                                <span className="text-gray-500 font-normal text-sm">Receive emails when new documents are shared with you.</span>
                                            </Label>
                                            <Switch id="marketing" defaultChecked />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="social" className="flex flex-col space-y-1">
                                                <span className="text-gray-900 font-medium">Memo Updates</span>
                                                <span className="text-gray-500 font-normal text-sm">Receive emails about status changes on your memos.</span>
                                            </Label>
                                            <Switch id="social" defaultChecked />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="security" className="flex flex-col space-y-1">
                                                <span className="text-gray-900 font-medium">Meeting Invites</span>
                                                <span className="text-gray-500 font-normal text-sm">Receive emails when you are invited to a meeting.</span>
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
                            <Card className="bg-white border-gray-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Security</CardTitle>
                                    <CardDescription>Manage your password and security settings.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="current" className="text-gray-900">Current Password</Label>
                                        <Input id="current" type="password" className="bg-white border-gray-300 text-gray-900" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new" className="text-gray-900">New Password</Label>
                                        <Input id="new" type="password" className="bg-white border-gray-300 text-gray-900" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm" className="text-gray-900">Confirm Password</Label>
                                        <Input id="confirm" type="password" className="bg-white border-gray-300 text-gray-900" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="bg-primary hover:bg-primary/90">Update Password</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Appearance Tab */}
                        <TabsContent value="appearance" className="space-y-6 mt-0">
                            <Card className="bg-white border-gray-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Appearance</CardTitle>
                                    <CardDescription>Customize the interface of the application.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="darkMode" className="flex flex-col space-y-1">
                                            <span className="text-gray-900 font-medium">Dark Mode</span>
                                            <span className="text-gray-500 font-normal text-sm">Enable dark mode for the application. (Currently disabled by admin policy)</span>
                                        </Label>
                                        <Switch id="darkMode" disabled checked={false} />
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
