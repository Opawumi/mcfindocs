'use client';

import { useState } from 'react';
import { Upload, Filter, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DocumentGrid, 
  DocumentUploadDialog, 
  DocumentShareDialog,
  DocumentViewer 
} from '@/features/documents';
import { mockDocuments, mockCategories } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores';
import type { Document } from '@/lib/types';

export default function DocumentsPage() {
  const router = useRouter();
  const [documents] = useState<Document[]>(mockDocuments);
  const { selectedCategoryId, setSelectedCategoryId } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Filter documents by category (including sub-categories)
  const filteredDocuments = selectedCategoryId
    ? documents.filter(doc => {
        // Get all category IDs that should be included (parent + children)
        const category = mockCategories.find(c => c.id === selectedCategoryId);
        if (!category) return false;
        
        // Include documents from this category
        if (doc.categoryId === selectedCategoryId) return true;
        
        // Include documents from sub-categories
        const subCategories = mockCategories.filter(c => c.parentId === selectedCategoryId);
        return subCategories.some(sub => doc.categoryId === sub.id);
      })
    : documents;

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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4 text-dark hover:text-white" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dark">Documents</h1>
            <p className="text-sm text-dark mt-1">
              Browse and manage organizational documents
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
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
          className="pl-10"
        />
      </div>

      {/* Category Context */}
      {currentCategory && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dark">{currentCategory.name}</h2>
            <p className="text-sm text-dark/60">
              {searchedDocuments.length} {searchedDocuments.length === 1 ? 'document' : 'documents'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategoryId(null)}
            className="text-dark/60 hover:text-dark"
          >
            Clear filter
          </Button>
        </div>
      )}

      {/* Document Grid */}
      <DocumentGrid
        documents={searchedDocuments}
        onView={handleView}
        onEdit={handleEdit}
        onShare={handleShare}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

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
