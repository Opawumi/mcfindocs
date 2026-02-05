'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/utils';

interface FileUploadZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

export function FileUploadZone({ file, onFileSelect, onFileRemove }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  if (file) {
    return (
      <div className="border border-border dark:border-gray-700 rounded-lg p-4 flex items-center justify-between dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onFileRemove}
          className="h-8 w-8 dark:hover:bg-gray-700 dark:text-gray-400"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        }`}
    >
      <Upload className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
      <p className="text-sm font-medium text-dark dark:text-gray-200 mb-1">
        Drag and drop your file here
      </p>
      <p className="text-xs text-dark/60 dark:text-gray-400 mb-4">or</p>
      <label htmlFor="file-upload">
        <Button variant="outline" size="sm" asChild className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
          <span className="cursor-pointer">Browse Files</span>
        </Button>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
