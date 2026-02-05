'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    MoreHorizontal,
    Plus,
    Search,
    UserPlus,
    Mail,
    Shield
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock Data
const mockUsers = [
    {
        id: '1',
        name: 'Dr. Sarah Connor',
        email: 'sarah.connor@university.edu',
        role: 'Admin',
        status: 'Active',
        department: 'Computer Science',
        lastActive: '2 mins ago'
    },
    {
        id: '2',
        name: 'Prof. John Smith',
        email: 'john.smith@university.edu',
        role: 'Faculty',
        status: 'Active',
        department: 'Physics',
        lastActive: '1 hour ago'
    },
    {
        id: '3',
        name: 'Emily Chen',
        email: 'emily.chen@university.edu',
        role: 'Staff',
        status: 'On Leave',
        department: 'Administration',
        lastActive: '3 days ago'
    },
    {
        id: '4',
        name: 'Michael Brown',
        email: 'm.brown@university.edu',
        role: 'Faculty',
        status: 'Active',
        department: 'Mathematics',
        lastActive: '5 hours ago'
    },
    {
        id: '5',
        name: 'Jessica Davis',
        email: 'j.davis@university.edu',
        role: 'Staff',
        status: 'Inactive',
        department: 'HR',
        lastActive: '1 week ago'
    }
];

export function UserManagement() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/dashboard')}
                        className="h-8 w-8 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="h-4 w-4 text-gray-900 dark:text-white" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage system users and access roles</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        onClick={() => router.push('/dashboard/admin/roles')}
                    >
                        <Shield className="h-4 w-4" />
                        Roles & Permissions
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                        <UserPlus className="h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                </div>
                {/* Placeholder for more filters if needed */}
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                        <TableRow className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                            <TableHead className="w-[300px] dark:text-gray-300">User</TableHead>
                            <TableHead className="dark:text-gray-300">Role</TableHead>
                            <TableHead className="dark:text-gray-300">Status</TableHead>
                            <TableHead className="dark:text-gray-300">Department</TableHead>
                            <TableHead className="dark:text-gray-300">Last Active</TableHead>
                            <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-gray-50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                                            <AvatarFallback className="dark:bg-gray-700 dark:text-gray-300">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                        <span className="text-gray-700 dark:text-gray-300">{user.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={
                                        user.status === 'Active' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50' :
                                            user.status === 'Inactive' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600' :
                                                'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50'
                                    }>
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-700 dark:text-gray-300">{user.department}</TableCell>
                                <TableCell className="text-gray-500 dark:text-gray-400 text-sm">{user.lastActive}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 dark:hover:bg-gray-700">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4 dark:text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                            <DropdownMenuLabel className="dark:text-gray-300">Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className="cursor-pointer dark:hover:bg-gray-700 dark:text-gray-300">
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer dark:hover:bg-gray-700 dark:text-gray-300">
                                                Edit User
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="dark:bg-gray-700" />
                                            <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer dark:hover:bg-red-900/20">
                                                Deactivate User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
