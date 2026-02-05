'use client';

import { useState } from 'react';
import { Folder as FolderIcon, ChevronRight, ChevronDown, MoreVertical, Plus, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildFolderTree, type FolderWithChildren } from '@/lib/utils/folder';
import type { Folder as FolderType } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface FolderTreeItemProps {
  folder: FolderWithChildren;
  level: number;
  selectedFolderId: string | null;
  onSelect: (folderId: string) => void;
  onCreateSubfolder: (parentId: string) => void;
  onRename: (folderId: string) => void;
  onDelete: (folderId: string) => void;
}

function FolderTreeItem({
  folder,
  level,
  selectedFolderId,
  onSelect,
  onCreateSubfolder,
  onRename,
  onDelete,
}: FolderTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedFolderId === folder.id;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors group',
          level > 0 && 'pl-8',
          isSelected
            ? 'bg-primary text-white'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        )}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center cursor-pointer"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        ) : (
          <div className="w-4" />
        )}

        {/* Folder Icon & Name */}
        <button
          onClick={() => onSelect(folder.id)}
          className="flex items-center gap-2 flex-1 text-left"
        >
          <FolderIcon className="h-4 w-4" />
          <span className="flex-1">{folder.name}</span>
          {folder.documentCount !== undefined && folder.documentCount > 0 && (
            <span className={cn(
              "text-xs",
              isSelected ? "text-white/80" : "text-gray-500 dark:text-gray-400"
            )}>
              {folder.documentCount}
            </span>
          )}
        </button>

        {/* Actions Menu */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6",
                  isSelected ? "hover:bg-white/20" : "hover:bg-gray-200 dark:hover:bg-gray-600"
                )}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()} className="dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuItem onClick={() => onCreateSubfolder(folder.id)} className="dark:hover:bg-gray-700">
                <Plus className="mr-2 h-4 w-4" />
                New Subfolder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRename(folder.id)} className="dark:hover:bg-gray-700">
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-gray-700" />
              <DropdownMenuItem onClick={() => onDelete(folder.id)} className="text-red-600 dark:hover:bg-gray-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {folder.children!.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
              onCreateSubfolder={onCreateSubfolder}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FolderTreeProps {
  folders: FolderType[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (parentId?: string) => void;
  onRenameFolder: (folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
}: FolderTreeProps) {
  const folderTree = buildFolderTree(folders);

  return (
    <div className="space-y-1">
      {/* All Folders Button */}
      <button
        onClick={() => onSelectFolder(null)}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          selectedFolderId === null
            ? 'bg-primary text-white'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        )}
      >
        <FolderIcon className="h-4 w-4" />
        <span className="flex-1 text-left">All Folders</span>
      </button>

      {/* Folder Tree */}
      {folderTree.map((folder) => (
        <FolderTreeItem
          key={folder.id}
          folder={folder}
          level={0}
          selectedFolderId={selectedFolderId}
          onSelect={onSelectFolder}
          onCreateSubfolder={onCreateFolder}
          onRename={onRenameFolder}
          onDelete={onDeleteFolder}
        />
      ))}

      {/* New Folder Button */}
      <button
        onClick={() => onCreateFolder()}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-2"
      >
        <Plus className="h-4 w-4" />
        <span>New Folder</span>
      </button>
    </div>
  );
}
