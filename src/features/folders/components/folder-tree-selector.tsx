'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder as LucideFolder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildFolderTree, type FolderWithChildren } from '@/lib/utils/folder';
import type { Folder as FolderType } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FolderTreeSelectorProps {
  folders: FolderType[];
  selectedFolderId?: string;
  onSelect: (folderId: string | undefined) => void;
  excludeFolderId?: string; // Exclude this folder and its children from selection
}

function FolderTreeItem({
  folder,
  level,
  selectedFolderId,
  onSelect,
  excludeFolderId,
}: {
  folder: FolderWithChildren;
  level: number;
  selectedFolderId?: string;
  onSelect: (folderId: string | undefined) => void;
  excludeFolderId?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedFolderId === folder.id;
  const isExcluded = excludeFolderId === folder.id;

  // Don't render if this folder should be excluded
  if (isExcluded) {
    return null;
  }

  const handleSelect = () => {
    onSelect(folder.id);
  };

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors cursor-pointer',
          level > 0 && 'ml-4',
          isSelected
            ? 'bg-primary text-white'
            : 'hover:bg-gray-100 text-gray-700'
        )}
        onClick={handleSelect}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}
        <LucideFolder className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{folder.name}</span>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {folder.children!.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
              excludeFolderId={excludeFolderId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FolderTreeSelector({
  folders,
  selectedFolderId,
  onSelect,
  excludeFolderId,
}: FolderTreeSelectorProps) {
  const folderTree = buildFolderTree(folders);

  return (
    <ScrollArea className="h-[200px] rounded-md border p-2">
      <div className="space-y-1">
        <div
          className={cn(
            'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors cursor-pointer',
            selectedFolderId === undefined
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100 text-gray-700'
          )}
          onClick={() => onSelect(undefined)}
        >
          <LucideFolder className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Root (No parent)</span>
        </div>
        {folderTree.map((folder) => (
          <FolderTreeItem
            key={folder.id}
            folder={folder}
            level={0}
            selectedFolderId={selectedFolderId}
            onSelect={onSelect}
            excludeFolderId={excludeFolderId}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

