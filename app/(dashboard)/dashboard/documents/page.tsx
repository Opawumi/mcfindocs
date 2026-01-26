'use client';

import { useState } from 'react';
import { Upload, Filter, ArrowLeft, Search, LayoutGrid, Library } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DocumentGrid,
  DocumentUploadDialog,
  DocumentShareDialog,
  DocumentViewer,
  DocumentShelves
} from '@/features/documents';

import { mockDocuments, mockCategories, mockFolders } from '@/lib/mock-data';

import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores';
import type { Document } from '@/lib/types';

export default function DocumentsPage() {
  const router = useRouter();
  const [documents] = useState<Document[]>(mockDocuments);
  const { selectedCategoryId, setSelectedCategoryId } = useUIStore();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'shelves'>('shelves');

  // Filter documents by category or folder
  const filteredDocuments = documents.filter(doc => {
    // If folder is selected, only show documents in that folder
    if (selectedFolderId) {
      return doc.folderId === selectedFolderId;
    }

    // If category is selected, include sub-categories
    if (selectedCategoryId) {
      // Get all category IDs that should be included (parent + children)
      const category = mockCategories.find(c => c.id === selectedCategoryId);
      if (!category) return false;

      // Include documents from this category
      if (doc.categoryId === selectedCategoryId) return true;

      // Include documents from sub-categories
      const subCategories = mockCategories.filter(c => c.parentId === selectedCategoryId);
      return subCategories.some(sub => doc.categoryId === sub.id);
    }

    return true;
  });

  // Get current folder info for display
  const currentFolder = selectedFolderId
    ? mockFolders.find(f => f.id === selectedFolderId)
    : null;

  // Further filter by search query
  const searchedDocuments = searchQuery
    ? filteredDocuments.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : filteredDocuments;

  // Get current category info for display
  const currentCategory = selectedCategoryId
    ? mockCategories.find(c => c.id === selectedCategoryId)
    : null;

  const handleView = (doc: Document) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

  const handleEdit = (doc: Document) => {
    console.log('Edit document:', doc.name);
    // TODO: Open document editor
  };

  const handleShare = (doc?: Document) => {
    if (doc) {
      setSelectedDocument(doc);
    }
    setShareDialogOpen(true);
  };

  const handleDownload = (doc: Document) => {
    console.log('Download document:', doc.name);
    // TODO: Trigger download
    window.open(doc.fileUrl, '_blank');
  };

  const handleDelete = (doc: Document) => {
    console.log('Delete document:', doc.name);
    // TODO: Show delete confirmation
  };

  const handleUpload = (data: any) => {
    console.log('Upload document:', data);
    // TODO: Call upload service
  };

  const handleShareSubmit = (data: any) => {
    console.log('Share document:', data);
    // TODO: Call share service
  };

  return (
    <div className="space-y-6">
      {/* View Toggle and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
            className="h-8 w-8 shrink-0"
          >
            <ArrowLeft className="h-4 w-4 text-dark hover:text-white" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark truncate">Documents</h1>
            <p className="text-xs sm:text-sm text-dark mt-1 line-clamp-1">
              Browse and manage organizational documents
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {!selectedCategoryId && !selectedFolderId && (
            <div className="flex bg-muted/20 p-1 rounded-lg border mr-2">
              <Button
                variant={viewMode === 'shelves' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('shelves')}
                className="h-7 px-2 text-xs"
                title="Shelf View"
              >
                <Library className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Library</span>
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-7 px-2 text-xs"
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
            </div>
          )}
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs h-9">
            <Filter className="h-3.5 w-3.5 sm:mr-2" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <Button size="sm" onClick={() => setUploadDialogOpen(true)} className="flex-1 sm:flex-none text-xs h-9">
            <Upload className="h-3.5 w-3.5 sm:mr-2" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 text-sm"
        />
      </div>

      {/* Category/Folder Context */}
      {(currentCategory || currentFolder) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-dark truncate">
              {currentCategory ? currentCategory.name : currentFolder?.name}
            </h2>
            <p className="text-xs sm:text-sm text-dark/60">
              {searchedDocuments.length} {searchedDocuments.length === 1 ? 'document' : 'documents'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategoryId(null);
              setSelectedFolderId(null);
            }}
            className="text-dark/60 hover:text-dark text-xs h-8 w-full sm:w-auto"
          >
            Clear filter
          </Button>
        </div>
      )}

      {/* Document Content */}
      {viewMode === 'shelves' && !selectedCategoryId && !selectedFolderId && !searchQuery ? (
        <DocumentShelves
          categories={mockCategories}
          documents={documents}
          folders={mockFolders.filter(f => !f.parentId)}
          onCategoryClick={setSelectedCategoryId}
          onFolderClick={setSelectedFolderId}
          onDocumentClick={handleView}
          onDocumentDrop={(docId, targetId, targetType) => {
            console.log(`Dropped doc ${docId} on ${targetType} ${targetId}`);
            // Logic to move document would go here
          }}
        />
      ) : (
        <DocumentGrid
          documents={searchedDocuments}
          onView={handleView}
          onEdit={handleEdit}
          onShare={handleShare}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      )}

      {/* Dialogs */}
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUpload}
      />

      <DocumentShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        document={selectedDocument}
        onShare={handleShareSubmit}
      />

      <DocumentViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        document={selectedDocument}
        onShare={() => handleShare()}
        onDownload={() => selectedDocument && handleDownload(selectedDocument)}
      />
    </div>
  );
}
