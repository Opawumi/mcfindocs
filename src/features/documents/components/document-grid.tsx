'use client';

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

interface DocumentGridProps {
  documents: Document[];
  onView?: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onShare?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

export function DocumentGrid({
  documents,
  onView,
  onEdit,
  onShare,
  onDownload,
  onDelete,
}: DocumentGridProps) {
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {documents.map((doc) => {
        const FileIcon = getFileIconComponent(doc.fileType);

        return (
          <div
            key={doc.id}
            onClick={() => onView?.(doc)}
            className='cursor-pointer relative group'
          >
            {/* Document Icon */}
            <div className="flex flex-col items-center text-center mb-2 sm:mb-3">
              <div className="relative mb-1.5 sm:mb-2">
                <FileIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                {doc.metadata.tags && doc.metadata.tags.length > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1">
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-primary" />
                  </div>
                )}
              </div>

              {/* Document Name */}
              <div
                className="text-xs sm:text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2 w-full px-1"
                title={doc.name}
              >
                {doc.name}
              </div>

              {/* Document Info */}
              <div className="space-y-0.5 sm:space-y-1 w-full text-dark mt-1">
                <span className="text-[10px] sm:text-xs text-gray-500">
                  {formatFileSize(doc.fileSize)}
                </span>{" • "}
                <span className="text-[10px] sm:text-xs text-gray-500">
                  {formatRelativeDate(doc.lastModifiedAt)}
                </span>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="absolute top-0 right-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 bg-dark text-white rounded-full shadow-sm">
                    <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
