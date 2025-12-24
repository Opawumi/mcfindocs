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

interface RenameFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: Folder | null;
  onRename?: (folderId: string, newName: string) => void;
}

export function RenameFolderDialog({
  open,
  onOpenChange,
  folder,
  onRename,
}: RenameFolderDialogProps) {
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    if (folder) {
      setFolderName(folder.name);
    }
  }, [folder]);

  const handleRename = () => {
    if (!folderName.trim() || !folder) return;

    onRename?.(folder.id, folderName.trim());
    setFolderName('');
    onOpenChange(false);
  };

  const handleClose = () => {
    setFolderName('');
    onOpenChange(false);
  };

  if (!folder) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription>
            Enter a new name for "{folder.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="new-folder-name">New Folder Name *</Label>
          <Input
            id="new-folder-name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter new folder name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
            }}
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={!folderName.trim()}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
