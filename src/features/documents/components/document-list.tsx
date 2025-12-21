'use client';

import { useState } from 'react';
import { 
  MoreVertical, 
  Eye, 
  Download, 
  Share2, 
  Trash2,
  Edit,
  Clock,
  FileText,
  File,
  FileImage,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatFileSize, getFileType } from '@/lib/utils';
import { formatRelativeDate } from '@/lib/utils';
import type { Document } from '@/lib/types';

// Helper to get the correct icon component based on file type
function getFileIconComponent(fileType: string) {
  const iconMap: Record<string, any> = {
    image: FileImage,
    document: FileText,
    spreadsheet: FileSpreadsheet,
    video: FileVideo,
    audio: FileAudio,
    archive: FileArchive,
    code: FileCode,
    file: File,
  };
  return iconMap[fileType] || File;
}

interface DocumentListProps {
  documents: Document[];
  onView?: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onShare?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

export function DocumentList({ 
  documents,
  onView,
  onEdit,
  onShare,
  onDownload,
  onDelete,
}: DocumentListProps) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-3 mb-4">
          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">No documents</h3>
        <p className="text-sm text-gray-600">Get started by uploading a document</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input type="checkbox" className="rounded border-gray-300" />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Uploader</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => {
            const FileIcon = getFileIconComponent(doc.fileType);
            
            return (
              <TableRow key={doc.id} className="hover:bg-gray-50">
                <TableCell>
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <button
                        onClick={() => onView?.(doc)}
                        className="font-medium text-gray-900 hover:text-primary transition-colors"
                      >
                        {doc.name}
                      </button>
                      {doc.metadata.tags && doc.metadata.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {doc.metadata.tags.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">v{doc.currentVersion}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900">{doc.uploadedBy}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatRelativeDate(doc.lastModifiedAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatFileSize(doc.fileSize)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(doc)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(doc)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onShare?.(doc)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload?.(doc)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clock className="mr-2 h-4 w-4" />
                        Version History
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete?.(doc)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
