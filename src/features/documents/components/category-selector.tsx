'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockCategories } from '@/lib/mock-data';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  onSubCategoryChange: (value: string) => void;
  subCategoryValue: string;
}

export function CategorySelector({
  value,
  onChange,
  onSubCategoryChange,
  subCategoryValue,
}: CategorySelectorProps) {
  const [isCreatingParent, setIsCreatingParent] = useState(false);
  const [isCreatingSub, setIsCreatingSub] = useState(false);
  const [newParentName, setNewParentName] = useState('');
  const [newSubName, setNewSubName] = useState('');
  
  // Store created category names to display them
  const [createdParentName, setCreatedParentName] = useState('');
  const [createdSubName, setCreatedSubName] = useState('');

  const subCategories = value
    ? mockCategories.filter(cat => cat.parentId === value)
    : [];

  const handleCreateParentCategory = () => {
    if (!newParentName.trim()) return;
    
    console.log('Creating parent category:', newParentName);
    
    const newId = `cat-new-${Date.now()}`;
    setCreatedParentName(newParentName); // Store the name
    onChange(newId);
    setNewParentName('');
    setIsCreatingParent(false);
  };

  const handleCreateSubCategory = () => {
    if (!newSubName.trim()) return;
    
    console.log('Creating sub-category:', newSubName, 'under', value);
    
    const newId = `cat-new-${Date.now()}`;
    setCreatedSubName(newSubName); // Store the name
    onSubCategoryChange(newId);
    setNewSubName('');
    setIsCreatingSub(false);
  };

  // Get display name for selected category
  const getParentDisplayName = () => {
    if (value.startsWith('cat-new-')) return createdParentName;
    const category = mockCategories.find(cat => cat.id === value);
    return category?.name || '';
  };

  const getSubDisplayName = () => {
    if (subCategoryValue.startsWith('cat-new-')) return createdSubName;
    const category = mockCategories.find(cat => cat.id === subCategoryValue);
    return category?.name || '';
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Parent Category */}
      <div>
        <Label htmlFor="parent-category">Category *</Label>
        {!isCreatingParent ? (
          <Select
            value={value}
            onValueChange={(val) => {
              if (val === 'create-new') {
                setIsCreatingParent(true);
              } else {
                onChange(val);
                onSubCategoryChange(''); // Reset sub-category
                setCreatedParentName(''); // Reset created name
                setCreatedSubName(''); // Reset sub name too
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category">
                {value && getParentDisplayName()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="create-new" className="text-primary font-medium">
                + Create New Category
              </SelectItem>
              {mockCategories.filter(cat => cat.level === 0).map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="space-y-2">
            <Input
              value={newParentName}
              onChange={(e) => setNewParentName(e.target.value)}
              placeholder="Enter new category name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateParentCategory();
                if (e.key === 'Escape') {
                  setIsCreatingParent(false);
                  setNewParentName('');
                }
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleCreateParentCategory}
                disabled={!newParentName.trim()}
                className="flex-1"
              >
                Create
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsCreatingParent(false);
                  setNewParentName('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Category */}
      {value && value !== 'create-new' && (
        <div>
          <Label htmlFor="sub-category">Sub-Category</Label>
          {!isCreatingSub ? (
            <Select
              value={subCategoryValue}
              onValueChange={(val) => {
                if (val === 'create-new') {
                  setIsCreatingSub(true);
                } else {
                  onSubCategoryChange(val);
                  setCreatedSubName(''); // Reset created name
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sub-category (optional)">
                  {subCategoryValue && getSubDisplayName()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create-new" className="text-primary font-medium">
                  + Create New Sub-Category
                </SelectItem>
                {subCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="space-y-2">
              <Input
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="Enter new sub-category name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateSubCategory();
                  if (e.key === 'Escape') {
                    setIsCreatingSub(false);
                    setNewSubName('');
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateSubCategory}
                  disabled={!newSubName.trim()}
                  className="flex-1"
                >
                  Create
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsCreatingSub(false);
                    setNewSubName('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
