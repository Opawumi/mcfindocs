import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FolderDocument from '@/models/FolderDocument';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const folderId = searchParams.get('folderId');

        let query = {};
        if (folderId) {
            query = { folderId };
        }

        // Get folder documents
        const folderDocs = await FolderDocument.find(query)
            .sort({ addedAt: -1 })
            .lean();

        // Since we don't have a Document collection yet, return empty array
        // In the future, you would fetch the actual documents based on documentIds
        const documents = folderDocs.map(fd => ({
            id: fd.documentId,
            folderId: fd.folderId.toString(),
            addedAt: fd.addedAt.toISOString(),
            addedBy: fd.addedBy.toString(),
        }));

        return NextResponse.json({
            documents,
            count: documents.length
        });
    } catch (error) {
        console.error('Error fetching folder documents:', error);
        return NextResponse.json(
            { error: 'Failed to fetch folder documents' },
            { status: 500 }
        );
    }
}
