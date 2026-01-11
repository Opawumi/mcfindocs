import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { name, email, password, role, department, designation } = await request.json();

        if (!name || !email || !password || !department || !designation) {
            return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
        }

        await dbConnect();

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            department,
            designation
        });

        return NextResponse.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                designation: user.designation
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ success: false, error: 'Failed to register user' }, { status: 500 });
    }
}
