'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PDFViewerClientProps {
  file: string | File | ArrayBuffer;
  className?: string;
}

/**
 * PDF viewer built on top of react-pdf, loaded entirely on the client.
 * - Avoids Next.js SSR/pdf.js bundling issues by dynamic-importing react-pdf.
 * - Uses a worker file copied to /public via the existing copy-pdf-worker script.
 */
export function PDFViewerClient({ file, className }: PDFViewerClientProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfModule, setPdfModule] = useState<any>(null);

  const options = useMemo(() => ({
    workerSrc: typeof window !== 'undefined' ? `${window.location.origin}/pdf.worker.min.mjs` : '',
  }), []);

  // Lazy load react-pdf only on client side
  useEffect(() => {
    let mounted = true;

    const loadPdf = async () => {
      try {
        // Import CSS first
        await import('react-pdf/dist/Page/TextLayer.css');
        await import('react-pdf/dist/Page/AnnotationLayer.css');

        // Import react-pdf and get pdfjs reference from it
        const reactPdf = await import('react-pdf');
        const { pdfjs, Document, Page } = reactPdf;

        // Configure worker immediately after import
        pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;

        if (mounted) {
          setPdfModule({ Document, Page, pdfjs });
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load PDF library');
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      mounted = false;
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setError(error.message || 'Failed to load PDF');
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages || 1, prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(3.0, prev + 0.25));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.25));
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <p className="text-red-600 mb-4">Error loading PDF: {error}</p>
        <p className="text-sm text-gray-600">Please try downloading the file instead.</p>
      </div>
    );
  }

  // Wait for PDF module to load
  if (!pdfModule) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading PDF viewer...</p>
        </div>
      </div>
    );
  }

  const { Document, Page } = pdfModule;

  // Normalize file to ensure it's in the correct format
  const normalizedFile = (() => {
    if (!file) return null;
    if (typeof file === 'string') {
      // Ensure string URLs are valid
      return file.startsWith('http') || file.startsWith('/') ? file : `/${file}`;
    }
    return file;
  })();


  if (!normalizedFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <p className="text-red-600 mb-4">No file provided</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-3">
            Page {pageNumber} of {numPages || '...'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={!numPages || pageNumber >= (numPages || 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-2 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3.0}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={rotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-100 flex items-start justify-center p-4">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}
        <Document
          file={normalizedFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex flex-col items-center"
          options={options}
          error={
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-red-600 mb-2">Failed to load PDF document</p>
              <p className="text-sm text-gray-600">Please check the file URL or try downloading the file.</p>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            className="shadow-lg"
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center p-8">
                <p className="text-red-600 mb-2">Failed to render page {pageNumber}</p>
                <p className="text-sm text-gray-600">Please try a different page.</p>
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
}


