'use client';

import { useState, useMemo } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Document, Folder } from '@/lib/types';
import { formatFileSize } from '@/lib/utils';

interface AddDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: Folder | null;
  allDocuments: Document[];
  documentsInFolder: string[]; // Array of document IDs already in folder
  onAddDocuments?: (documentIds: string[]) => void;
}

export function AddDocumentsDialog({
  open,
  onOpenChange,
  folder,
  allDocuments,
  documentsInFolder,
  onAddDocuments,
}: AddDocumentsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  // Filter documents by search
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allDocuments, searchQuery]);

  // Toggle document selection
  const toggleDocument = (documentId: string) => {
    setSelectedDocumentIds(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  // Select all filtered documents
  const selectAll = () => {
    const availableIds = filteredDocuments
      .filter(doc => !documentsInFolder.includes(doc.id))
      .map(doc => doc.id);
    setSelectedDocumentIds(availableIds);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedDocumentIds([]);
  };

  const handleAdd = () => {
    if (selectedDocumentIds.length === 0) return;
    onAddDocuments?.(selectedDocumentIds);
    setSelectedDocumentIds([]);
    setSearchQuery('');
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedDocumentIds([]);
    setSearchQuery('');
    onOpenChange(false);
  };

  if (!folder) return null;

  const availableCount = filteredDocuments.filter(
    doc => !documentsInFolder.includes(doc.id)
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Documents to "{folder.name}"</DialogTitle>
          <DialogDescription>
            Select documents to add to this folder
          </DialogDescription>
        </DialogHeader>

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

        {/* Selection Controls */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            {selectedDocumentIds.length} selected • {availableCount} available
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAll}
              disabled={availableCount === 0}
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              disabled={selectedDocumentIds.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Document List */}
        <ScrollArea className="flex-1 border rounded-lg">
          <div className="p-4 space-y-2">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No documents found
              </div>
            ) : (
              filteredDocuments.map((doc) => {
                const isInFolder = documentsInFolder.includes(doc.id);
                const isSelected = selectedDocumentIds.includes(doc.id);

                return (
                  <div
                    key={doc.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      isInFolder
                        ? 'bg-gray-50 border-gray-200 opacity-60'
                        : isSelected
                        ? 'bg-primary/5 border-primary'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleDocument(doc.id)}
                      disabled={isInFolder}
                    />
                    
                    <FileText className="h-5 w-5 text-gray-400 shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </p>
                        {isInFolder && (
                          <Badge variant="secondary" className="text-xs">
                            Already in folder
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(doc.fileSize)} • {doc.fileType}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selectedDocumentIds.length === 0}
          >
            Add {selectedDocumentIds.length > 0 && `(${selectedDocumentIds.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
