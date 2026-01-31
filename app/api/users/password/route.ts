import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { currentPassword, newPassword } = data;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: 'Incorrect current password' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Password Update Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update password' }, { status: 500 });
    }
}
