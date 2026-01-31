import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await dbConnect();

        const user = await User.findById(id).select('image');

        if (!user || !user.image) {
            // Return 404 or a default placeholder URL redirect?
            // Returning 404 is fine as the frontend can handle fallback.
            return new NextResponse(null, { status: 404 });
        }

        const imageBuffer = Buffer.from(user.image.split(',')[1], 'base64');
        const contentType = user.image.split(';')[0].split(':')[1];

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600, must-revalidate' // Cache for 1 hour
            }
        });

    } catch (error) {
        console.error('Error serving avatar:', error);
        return new NextResponse(null, { status: 500 });
    }
}
