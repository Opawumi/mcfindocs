'use client';

import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadZone } from './file-upload-zone';
import { CategorySelector } from './category-selector';

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload?: (data: any) => void;
}

export function DocumentUploadDialog({
  open,
  onOpenChange,
  onUpload,
}: DocumentUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    parentCategoryId: '',
    subCategoryId: '',
    description: '',
    tags: '',
    department: '',
    project: '',
  });

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setFormData(prev => ({
      ...prev,
      name: selectedFile.name,
    }));
  };

  const handleFileRemove = () => {
    setFile(null);
    setFormData(prev => ({ ...prev, name: '' }));
  };

  const handleSubmit = () => {
    if (!file) return;

    const uploadData = {
      file,
      ...formData,
      categoryId: formData.subCategoryId || formData.parentCategoryId,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    onUpload?.(uploadData);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setFormData({
      name: '',
      parentCategoryId: '',
      subCategoryId: '',
      description: '',
      tags: '',
      department: '',
      project: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Upload Document</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Upload a new document to the system with metadata
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Zone */}
          <FileUploadZone
            file={file}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
          />

          {/* Metadata Form */}
          {file && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name" className="dark:text-gray-200">Document Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter document name"
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>

                {/* Category Selection */}
                <CategorySelector
                  value={formData.parentCategoryId}
                  onChange={(value) =>
                    setFormData(prev => ({ ...prev, parentCategoryId: value }))
                  }
                  subCategoryValue={formData.subCategoryId}
                  onSubCategoryChange={(value) =>
                    setFormData(prev => ({ ...prev, subCategoryId: value }))
                  }
                />

                <div className="col-span-2">
                  <Label htmlFor="description" className="dark:text-gray-200">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Brief description of the document"
                    rows={3}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="tags" className="dark:text-gray-200">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, tags: e.target.value }))
                    }
                    placeholder="Comma-separated tags (e.g., finance, report, 2024)"
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="department" className="dark:text-gray-200">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, department: e.target.value }))
                    }
                    placeholder="e.g., HR, Finance"
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="project" className="dark:text-gray-200">Project</Label>
                  <Input
                    id="project"
                    value={formData.project}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, project: e.target.value }))
                    }
                    placeholder="e.g., Q4 2024"
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="dark:border-gray-800">
          <Button variant="outline" onClick={handleClose} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!file || !formData.name || !formData.parentCategoryId || !formData.description}
            className="dark:bg-primary dark:text-white"
          >
            Upload Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
