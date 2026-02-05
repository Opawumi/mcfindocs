import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Memo from '@/models/Memo';
import { mockCategories } from '@/lib/mock-data';

export async function GET() {
    try {
        await dbConnect();

        // Get unread memos count (memos sent to user with 'pending' status)
        const unreadMemos = await Memo.countDocuments({ status: 'pending' });

        // Get total memos count as a placeholder for documents
        const totalMemos = await Memo.countDocuments();

        // Since we don't have a separate Document model yet, 
        // we'll aggregate memos by status/type to simulate category counts
        // For now, return categories with 0 counts but the structure is ready

        // You can uncomment and modify this when you have categoryId in your documents
        // const documentCounts = await DocumentModel.aggregate([
        //     { $group: { _id: '$categoryId', count: { $sum: 1 } } }
        // ]);

        const categoriesWithCounts = mockCategories.map(cat => ({
            ...cat,
            documentCount: 0 // Set to 0 until Document model with categoryId exists
        }));

        return NextResponse.json({
            categories: categoriesWithCounts,
            unreadMemos,
            totalDocuments: totalMemos // Using memos as documents for now
        });
    } catch (error) {
        console.error('Error fetching sidebar data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sidebar data' },
            { status: 500 }
        );
    }
}
