'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderTree, CreateFolderDialog, RenameFolderDialog, DeleteFolderDialog } from '@/features/folders';
import { DocumentGrid } from '@/features/documents';
import type { Document, Folder } from '@/lib/types';
import { useUIStore } from '../../../../src/stores';
import { useFolderContext } from '@/contexts/folder-context';
import { createFolder } from '@/services/folder.service';
import { toast } from 'sonner';

export default function MyFoldersPage() {
  const router = useRouter();
  const { selectedFolderId, setSelectedFolderId } = useUIStore();
  const {
    folders,
    currentFolderId,
    setCurrentFolderId,
    currentFolder: contextFolder,
    setCurrentFolder,
    refreshFolders
  } = useFolderContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  // Sync folder context with UI store
  useEffect(() => {
    if (selectedFolderId) {
      setCurrentFolderId(selectedFolderId);
      const folder = folders.find(f => f.id === selectedFolderId);
      setCurrentFolder(folder || null);
    } else {
      setCurrentFolderId(null);
      setCurrentFolder(null);
    }
  }, [selectedFolderId, folders, setCurrentFolderId, setCurrentFolder]);

  // Fetch documents when folder selection changes
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const url = selectedFolderId
          ? `/api/folders/documents?folderId=${selectedFolderId}`
          : '/api/folders/documents';

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          // Since we don't have a Document model yet, this will be empty
          // But the structure is ready for when documents are added
          setDocuments([]);
        } else {
          console.error('Failed to fetch documents');
          setDocuments([]);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        setDocuments([]);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, [selectedFolderId]);

  // Filter by search
  const searchedDocuments = searchQuery
    ? documents.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : documents;

  // Get current folder info (use context folder if available, otherwise fallback)
  const displayFolder = contextFolder || (selectedFolderId
    ? folders.find(f => f.id === selectedFolderId)
    : null);

  const handleCreateFolder = () => {
    setCreateDialogOpen(true);
  };

  const handleRenameFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    setSelectedFolder(folder || null);
    setRenameDialogOpen(true);
  };

  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    setSelectedFolder(folder || null);
    setDeleteDialogOpen(true);
  };

  const handleFolderCreated = async (name: string, parentId?: string) => {
    try {
      await createFolder({ name, parentId });
      toast.success('Folder created successfully');
      // Refresh folders from shared context
      refreshFolders();
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create folder');
      console.error('Error creating folder:', error);
    }
  };

  const handleFolderRenamed = (folderId: string, newName: string) => {
    console.log('Rename folder:', folderId, 'New name:', newName);
    // TODO: Call API to rename folder
  };

  const handleFolderDeleted = (folderId: string) => {
    console.log('Delete folder:', folderId);
    // TODO: Call API to delete folder
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };

  const handleAddDocuments = () => {
    console.log('Add documents to folder');
    // TODO: Open add documents modal
  };

  const handleBatchSend = () => {
    console.log('Batch send folder documents');
    // TODO: Open batch send dialog
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4 text-dark hover:text-white" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dark">My Folders</h1>
            <p className="text-sm text-dark mt-1">
              Organize your personal document collection
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {selectedFolderId && (
            <>
              <Button variant="outline" size="sm" onClick={handleAddDocuments}>
                <Plus className="h-4 w-4 mr-2" />
                Add Documents
              </Button>
              <Button variant="outline" size="sm" onClick={handleBatchSend}>
                <Send className="h-4 w-4 mr-2" />
                Send All
              </Button>
            </>
          )}
          <Button size="sm" onClick={() => handleCreateFolder()}>
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search in folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Folder Context */}
      {displayFolder && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dark">{displayFolder.name}</h2>
            <p className="text-sm text-dark/60">
              {searchedDocuments.length} {searchedDocuments.length === 1 ? 'document' : 'documents'}
            </p>
          </div>
        </div>
      )}

      {!displayFolder && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dark">All Folders</h2>
            <p className="text-sm text-dark/60">
              {searchedDocuments.length} {searchedDocuments.length === 1 ? 'document' : 'documents'} across all folders
            </p>
          </div>
        </div>
      )}

      {/* Document Grid */}
      <DocumentGrid
        documents={searchedDocuments}
        onView={(doc) => console.log('View', doc)}
        onEdit={(doc) => console.log('Edit', doc)}
        onShare={(doc) => console.log('Share', doc)}
        onDownload={(doc) => console.log('Download', doc)}
        onDelete={(doc) => console.log('Delete', doc)}
      />

      {/* Folder Management Dialogs */}
      <CreateFolderDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        folders={folders}
        onCreate={handleFolderCreated}
      />

      <RenameFolderDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        folder={selectedFolder}
        onRename={handleFolderRenamed}
      />

      <DeleteFolderDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        folder={selectedFolder}
        onDelete={handleFolderDeleted}
      />
    </div>
  );
}
