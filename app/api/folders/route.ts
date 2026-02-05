import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserFolder from '@/models/UserFolder';
import FolderDocument from '@/models/FolderDocument';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const userId = (session.user as any).id;

        // Get all user's folders
        const folders = await UserFolder.find({ userId })
            .sort({ createdAt: 1 })
            .lean();

        // Get document counts for each folder
        const folderIds = folders.map(f => f._id);
        const documentCounts = await FolderDocument.aggregate([
            { $match: { folderId: { $in: folderIds } } },
            { $group: { _id: '$folderId', count: { $sum: 1 } } }
        ]);

        // Create a map of folder ID to document count
        const countMap = new Map(
            documentCounts.map(dc => [dc._id.toString(), dc.count])
        );

        // Get subfolder counts for each folder
        const subfolderCounts = new Map<string, number>();
        folders.forEach(folder => {
            if (folder.parentId) {
                const parentIdStr = folder.parentId.toString();
                subfolderCounts.set(
                    parentIdStr,
                    (subfolderCounts.get(parentIdStr) || 0) + 1
                );
            }
        });

        // Format folders with counts
        const foldersWithCounts = folders.map(folder => ({
            id: folder._id.toString(),
            name: folder.name,
            parentId: folder.parentId?.toString() || undefined,
            userId: folder.userId.toString(),
            createdAt: folder.createdAt.toISOString(),
            updatedAt: folder.updatedAt.toISOString(),
            documentCount: countMap.get(folder._id.toString()) || 0,
            subfolderCount: subfolderCounts.get(folder._id.toString()) || 0,
        }));

        return NextResponse.json({ folders: foldersWithCounts });
    } catch (error) {
        console.error('Error fetching folders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch folders' },
            { status: 500 }
        );
    }
}
