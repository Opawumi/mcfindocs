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
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4 text-gray-900" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-sm text-gray-500">Manage system users and access roles</p>
                    </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white border-gray-200"
                    />
                </div>
                {/* Placeholder for more filters if needed */}
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-gray-50">
                            <TableHead className="w-[300px]">User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-gray-50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{user.name}</span>
                                            <span className="text-sm text-gray-500">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-3 w-3 text-gray-400" />
                                        <span className="text-gray-700">{user.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={
                                        user.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                            user.status === 'Inactive' ? 'bg-gray-100 text-gray-700 hover:bg-gray-100' :
                                                'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                    }>
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-700">{user.department}</TableCell>
                                <TableCell className="text-gray-500 text-sm">{user.lastActive}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white border-gray-200">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className="cursor-pointer">
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                Edit User
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 cursor-pointer">
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
