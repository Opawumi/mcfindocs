import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { name, department, designation, image } = data;

        await dbConnect();

        // Build update object
        const updateData: any = {
            name,
            department,
            designation
        };

        // Only update image if provided (to avoid clearing it on regular profile saves)
        if (image) {
            updateData.image = image;
        }

        // Update user
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                department: updatedUser.department,
                designation: updatedUser.designation,
                image: updatedUser.image
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
    }
}
