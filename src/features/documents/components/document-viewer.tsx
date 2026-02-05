'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, Download, Share2, Info, Maximize2, Minimize2, FileText, File, FileImage, FileSpreadsheet, FileVideo, FileAudio, FileArchive, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatFileSize, formatRelativeDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Document } from '@/lib/types';

// Dynamically import PDF viewer to avoid SSR issues
const PDFViewerClient = dynamic(
  () => import('./pdf-viewer-client').then((mod) => ({ default: mod.PDFViewerClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading PDF viewer...</p>
        </div>
      </div>
    ),
  }
);

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

interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onShare?: () => void;
  onDownload?: () => void;
}

export function DocumentViewer({
  open,
  onOpenChange,
  document,
  onShare,
  onDownload,
}: DocumentViewerProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!document) return null;

  const IconComponent = getFileIconComponent(document.fileType);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-[95vw] h-[95vh] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-900 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg flex flex-col overflow-hidden border dark:border-gray-800">
          <DialogPrimitive.Title className="sr-only">
            {document.name}
          </DialogPrimitive.Title>
          {/* Header - Hidden in fullscreen */}
          {!isFullScreen && (
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {document.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {formatFileSize(document.fileSize)}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">•</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {formatRelativeDate(document.lastModifiedAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-dark dark:text-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInfo(!showInfo)}
                  className={cn(showInfo && "bg-gray-100 dark:bg-gray-800", "dark:hover:bg-gray-800")}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Info
                </Button>
                <Button variant="ghost" size="sm" onClick={onShare} className="dark:hover:bg-gray-800">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="default" size="sm" onClick={onDownload} className="dark:bg-primary dark:text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="dark:hover:bg-gray-800"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Document Preview */}
            {document.fileType.toLowerCase() === 'pdf' ? (
              <div className="flex-1 flex flex-col overflow-hidden relative bg-white dark:bg-gray-900">
                {/* Fullscreen controls */}
                {isFullScreen && (
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsFullScreen(false)}
                      className="shadow-lg text-dark dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    >
                      <Minimize2 className="h-4 w-4 mr-2" />
                      Exit Fullscreen
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onOpenChange(false)}
                      className="h-9 w-9 shadow-lg rounded-full text-dark dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}
                <PDFViewerClient
                  file={document.fileUrl}
                  className="flex-1"
                />
              </div>
            ) : (
              <div className="flex-1 bg-gray-100 dark:bg-gray-950 overflow-auto relative">
                {/* Fullscreen controls */}
                {isFullScreen && (
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsFullScreen(false)}
                      className="shadow-lg text-dark dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    >
                      <Minimize2 className="h-4 w-4 mr-2" />
                      Exit Fullscreen
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onOpenChange(false)}
                      className="h-9 w-9 shadow-lg rounded-full text-dark dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                {/* Preview Content */}
                <div className="flex items-center justify-center min-h-full p-8">
                  <div className="text-center max-w-md">
                    <IconComponent className="h-24 w-24 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Preview not available
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                      This file type cannot be previewed in the browser
                    </p>
                    <Button onClick={onDownload} variant="outline" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Info Sidebar */}
            {showInfo && !isFullScreen && (
              <div className="w-80 border-l dark:border-gray-800 bg-white dark:bg-gray-900 overflow-auto shrink-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Document Info</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowInfo(false)}
                      className="h-8 w-8 dark:hover:bg-gray-800"
                    >
                      <X className="h-4 w-4 dark:text-gray-400" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Uploaded By
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-200 mt-1">
                        {document.uploadedBy}
                      </p>
                    </div>

                    <Separator className="dark:bg-gray-800" />

                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Last Modified
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-200 mt-1">
                        {formatRelativeDate(document.lastModifiedAt)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        by {document.lastModifiedBy}
                      </p>
                    </div>

                    <Separator className="dark:bg-gray-800" />

                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Description
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-200 mt-1">
                        {document.metadata.description || 'No description'}
                      </p>
                    </div>

                    <Separator className="dark:bg-gray-800" />

                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {document.metadata.tags && document.metadata.tags.length > 0 ? (
                          document.metadata.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs dark:bg-gray-800 dark:text-gray-200">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-400">No tags</p>
                        )}
                      </div>
                    </div>

                    <Separator className="dark:bg-gray-800" />

                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        File Details
                      </label>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Size</span>
                          <span className="text-gray-900 dark:text-gray-200">{formatFileSize(document.fileSize)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Type</span>
                          <span className="text-gray-900 dark:text-gray-200">{document.fileType}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Version</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
