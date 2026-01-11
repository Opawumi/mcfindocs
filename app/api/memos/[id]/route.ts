import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Memo from '@/models/Memo';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    try {
        const memo = await Memo.findById(id);
        if (!memo) {
            return NextResponse.json({ success: false, error: 'Memo not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: memo });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch memo' }, { status: 400 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    try {
        const body = await request.json();
        console.log('PATCH API received body:', JSON.stringify(body, null, 2));

        const memo = await Memo.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        console.log('Updated memo result:', memo ? 'Found & Updated' : 'Not Found');
        if (memo && memo.minutes) {
            console.log('Updated minutes count:', memo.minutes.length);
        }

        if (!memo) {
            return NextResponse.json({ success: false, error: 'Memo not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: memo });
    } catch (error) {
        console.error('PATCH API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update memo' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    try {
        const deletedMemo = await Memo.deleteOne({ _id: id });
        if (!deletedMemo.deletedCount) {
            return NextResponse.json({ success: false, error: 'Memo not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete memo' }, { status: 400 });
    }
}
