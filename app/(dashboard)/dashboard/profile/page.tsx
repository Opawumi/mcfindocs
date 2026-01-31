'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Mail, Building, Briefcase, User as UserIcon, Shield } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user as any;

    if (!user) {
        return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4 text-gray-900" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-sm text-gray-500">View and manage your personal information</p>
                    </div>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white gap-2">
                    <Link href="/dashboard/settings?tab=profile">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Card */}
                <Card className="md:col-span-1 bg-white border-gray-200 shadow-sm overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-primary/80 to-primary/40 relative">
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 p-1.5 bg-white rounded-full">
                            <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                                <AvatarImage src={user.image} />
                                <AvatarFallback className="text-3xl bg-gray-100 text-gray-600 font-bold">
                                    {getInitials(user.name || 'U')}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <div className="mt-14 p-6 text-center space-y-2">
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <div className="flex items-center justify-center gap-2">
                            <Badge variant="secondary" className="font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                                {user.designation || 'Staff Member'}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="border-t border-gray-100 p-6 bg-gray-50 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Department</span>
                            <span className="font-medium text-gray-900">{user.department || 'General'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Role</span>
                            <span className="font-medium text-gray-900 capitalize">{user.role || 'User'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Joined</span>
                            <span className="font-medium text-gray-900">
                                {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Details Card */}
                <Card className="md:col-span-2 bg-white border-gray-200 shadow-sm h-full">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Personal Details</CardTitle>
                        <CardDescription>Your account information and contact details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                    <UserIcon className="h-4 w-4" />
                                    Full Name
                                </div>
                                <p className="text-gray-900 font-medium ml-6">{user.name}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </div>
                                <p className="text-gray-900 font-medium ml-6">{user.email}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                    <Building className="h-4 w-4" />
                                    Department
                                </div>
                                <p className="text-gray-900 font-medium ml-6">{user.department || 'Not Assigned'}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                    <Briefcase className="h-4 w-4" />
                                    Designation
                                </div>
                                <p className="text-gray-900 font-medium ml-6">{user.designation || 'Staff'}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                    <Shield className="h-4 w-4" />
                                    Account Role
                                </div>
                                <div className="ml-6">
                                    <Badge className={user.role === 'admin' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}>
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 mt-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Bio</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {user.bio || "No bio information available. Please edit your profile to add a bio."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
