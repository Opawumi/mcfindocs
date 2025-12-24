'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Folder } from '@/lib/types';
import { FolderTreeSelector } from './folder-tree-selector';
import { useFolderContext } from '@/contexts/folder-context';

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: Folder[];
  parentId?: string; // Initial parent ID (e.g., from sidebar button)
  onCreate?: (name: string, parentId?: string) => void;
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  folders,
  parentId: initialParentId,
  onCreate,
}: CreateFolderDialogProps) {
  const { currentFolderId } = useFolderContext();
  const [folderName, setFolderName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>(
    initialParentId || currentFolderId || undefined
  );

  // Update selected parent when dialog opens or current folder changes
  useEffect(() => {
    if (open) {
      // Priority: initialParentId > currentFolderId > undefined
      setSelectedParentId(initialParentId || currentFolderId || undefined);
    }
  }, [open, initialParentId, currentFolderId]);

  const handleCreate = () => {
    if (!folderName.trim()) return;

    onCreate?.(folderName.trim(), selectedParentId);
    setFolderName('');
    setSelectedParentId(undefined);
    onOpenChange(false);
  };

  const handleClose = () => {
    setFolderName('');
    setSelectedParentId(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your documents
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="folder-name" className="text-dark">
              Folder Name *
            </Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
              autoFocus
            />
          </div>

          <div>
            <Label className="text-dark mb-2 block">
              Parent Folder (Optional)
            </Label>
            <FolderTreeSelector
              folders={folders}
              selectedFolderId={selectedParentId}
              onSelect={setSelectedParentId}
            />
            <p className="text-xs text-gray-500 mt-2">
              Select a parent folder or leave as root level
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!folderName.trim()}>
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
