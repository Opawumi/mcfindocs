import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Memo from '@/models/Memo';

export async function GET() {
    await dbConnect();
    try {
        const memos = await Memo.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: memos });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch memos' }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const memo = await Memo.create(body);
        return NextResponse.json({ success: true, data: memo }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create memo' }, { status: 400 });
    }
}
