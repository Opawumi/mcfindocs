'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Folder as FolderType } from '@/lib/types';

interface DeleteFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: FolderType | null;
  onDelete?: (folderId: string) => void;
}

export function DeleteFolderDialog({
  open,
  onOpenChange,
  folder,
  onDelete,
}: DeleteFolderDialogProps) {
  const handleDelete = () => {
    if (!folder) return;
    onDelete?.(folder.id);
    onOpenChange(false);
  };

  if (!folder) return null;

  const hasDocuments = folder.documentCount && folder.documentCount > 0;
  const hasSubfolders = folder.subfolderCount && folder.subfolderCount > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Folder?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <strong>"{folder.name}"</strong>?
            </p>

            {hasDocuments && (
              <p className="text-amber-600">
                This folder contains {folder.documentCount} {folder.documentCount === 1 ? 'document' : 'documents'}.
                Documents will remain in the system but will be removed from this folder.
              </p>
            )}

            {hasSubfolders && (
              <p className="text-amber-600">
                This folder contains {folder.subfolderCount} {folder.subfolderCount === 1 ? 'subfolder' : 'subfolders'}
                which will also be deleted.
              </p>
            )}

            <p className="text-sm text-gray-600">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Folder
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
