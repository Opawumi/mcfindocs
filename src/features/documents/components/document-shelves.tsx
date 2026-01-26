'use client';

import { Category, Document, Folder } from '@/lib/types';
import { ChevronRight, Folder as FolderIcon, FileText, Image as ImageIcon, Table, FileCode, Download, Share2, MoreVertical, Star, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentShelvesProps {
    categories: Category[];
    documents: Document[];
    folders?: Folder[];
    onCategoryClick: (categoryId: string) => void;
    onFolderClick?: (folderId: string) => void;
    onDocumentClick: (document: Document) => void;
    onDocumentDrop?: (documentId: string, targetId: string, targetType: 'category' | 'folder') => void;
}

export function DocumentShelves({
    categories,
    documents,
    folders = [],
    onCategoryClick,
    onFolderClick,
    onDocumentClick,
    onDocumentDrop
}: DocumentShelvesProps) {
    const [draggedDocId, setDraggedDocId] = useState<string | null>(null);

    // Group documents by category (including sub-categories)
    const getCategoryDocuments = (catId: string) => {
        // Find subcategories
        const subCats = categories.filter(c => c.parentId === catId).map(c => c.id);
        const targetIds = [catId, ...subCats];
        return documents.filter(d => d.categoryId && targetIds.includes(d.categoryId));
    };

    const getFileIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'pdf':
                return <FileText className="h-12 w-12 text-red-500/50 group-hover:scale-110 transition-transform" />;
            case 'xlsx':
            case 'xls':
            case 'csv':
                return <Table className="h-12 w-12 text-green-500/50 group-hover:scale-110 transition-transform" />;
            case 'docx':
            case 'doc':
                return <FileText className="h-12 w-12 text-blue-500/50 group-hover:scale-110 transition-transform" />;
            case 'jpg':
            case 'png':
            case 'jpeg':
                return <ImageIcon className="h-12 w-12 text-purple-500/50 group-hover:scale-110 transition-transform" />;
            default:
                return <FileCode className="h-12 w-12 text-gray-500/50 group-hover:scale-110 transition-transform" />;
        }
    };

    const handleDragStart = (e: React.DragEvent, docId: string) => {
        e.dataTransfer.setData('text/plain', docId);
        e.dataTransfer.effectAllowed = 'move';
        setDraggedDocId(docId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetId: string, type: 'category' | 'folder') => {
        e.preventDefault();
        const docId = e.dataTransfer.getData('text/plain');
        if (docId && onDocumentDrop) {
            onDocumentDrop(docId, targetId, type);
        }
        setDraggedDocId(null);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-10">

            {/* My Folders Shelf */}
            {folders.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold text-dark flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                My Folders
                            </h3>
                            <p className="text-sm text-muted-foreground">Personal workspace and projects</p>
                        </div>
                    </div>

                    <div className="relative rounded-xl border bg-gradient-to-br from-card to-muted/20 shadow-sm p-4 overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent opacity-50" />

                        <ScrollArea className="w-full whitespace-nowrap pb-2">
                            <div className="flex w-max space-x-4 pb-2 pt-1 px-1">
                                {folders.map((folder) => (
                                    <div
                                        key={folder.id}
                                        className="w-[180px] p-4 rounded-lg border bg-card hover:border-yellow-500/50 hover:shadow-md transition-all cursor-pointer space-y-3 group/folder"
                                        onClick={() => onFolderClick?.(folder.id)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, folder.id, 'folder')}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-600 group-hover/folder:bg-yellow-500/20 transition-colors">
                                                <FolderIcon className="h-6 w-6 fill-yellow-500/20" />
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/folder:opacity-100 transition-opacity">
                                                        <MoreVertical className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => onFolderClick?.(folder.id)}>Open</DropdownMenuItem>
                                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div>
                                            <h4 className="font-medium truncate" title={folder.name}>{folder.name}</h4>
                                            <p className="text-xs text-muted-foreground">{folder.documentCount || 0} items</p>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="h-[108px] w-[100px] border-dashed flex flex-col gap-2 hover:border-primary hover:text-primary">
                                    <FolderIcon className="h-6 w-6" />
                                    <span className="text-xs">New Folder</span>
                                </Button>
                            </div>
                            <ScrollBar orientation="horizontal" className="h-2" />
                        </ScrollArea>
                    </div>
                </div>
            )}

            {categories.filter(c => c.level === 0).map((category) => {
                const categoryDocs = getCategoryDocuments(category.id);
                const subCategories = categories.filter(c => c.parentId === category.id);

                return (
                    <div
                        key={category.id}
                        className="space-y-4"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, category.id, 'category')}
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold text-dark flex items-center gap-2">
                                    <FolderIcon className="h-5 w-5 text-primary" />
                                    {category.name}
                                    <span className="text-sm font-normal text-muted-foreground ml-2">
                                        ({categoryDocs.length})
                                    </span>
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onCategoryClick(category.id)}
                                className="text-primary hover:text-primary/80"
                            >
                                View All <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>

                        {/* Sub-categories Pills */}
                        {subCategories.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {subCategories.map(sub => (
                                    <Button
                                        key={sub.id}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full text-xs h-7 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5"
                                        onClick={() => onCategoryClick(sub.id)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => {
                                            e.stopPropagation();
                                            handleDrop(e, sub.id, 'category');
                                        }}
                                    >
                                        {sub.name}
                                    </Button>
                                ))}
                            </div>
                        )}

                        {/* Documents Shelf */}
                        <div className={cn(
                            "relative rounded-xl border bg-gradient-to-br from-card to-muted/20 shadow-sm p-4 overflow-hidden transition-all",
                            draggedDocId && "border-primary/50 border-dashed bg-primary/5"
                        )}>
                            {/* Shelf visual accent */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50" />

                            {categoryDocs.length > 0 ? (
                                <ScrollArea className="w-full whitespace-nowrap pb-2">
                                    <div className="flex w-max space-x-4 pb-2 pt-1 px-1">
                                        {categoryDocs.slice(0, 10).map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="w-[160px] p-3 rounded-lg border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer space-y-3 group relative"
                                                onClick={() => onDocumentClick(doc)}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, doc.id)}
                                            >
                                                {/* Hover Actions */}
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                                                    <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full shadow-sm" onClick={(e) => { e.stopPropagation(); /* Download */ }}>
                                                        <Download className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full shadow-sm" onClick={(e) => { e.stopPropagation(); /* Share */ }}>
                                                        <Share2 className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <div className="aspect-[3/4] rounded-md bg-muted/30 flex items-center justify-center relative overflow-hidden ring-1 ring-border/50">
                                                    {getFileIcon(doc.fileType)}
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-4">
                                                        <span className="text-[10px] text-white font-bold uppercase tracking-wider">{doc.fileType}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-medium leading-tight truncate" title={doc.name}>
                                                        {doc.name}
                                                    </h4>
                                                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                                                        <span>
                                                            {(() => {
                                                                try {
                                                                    return formatDistanceToNow(new Date(doc.lastModifiedAt || doc.uploadedAt)) + ' ago';
                                                                } catch (e) {
                                                                    return 'recently';
                                                                }
                                                            })()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {categoryDocs.length > 10 && (
                                            <div className="w-[100px] flex flex-col items-center justify-center">
                                                <Button variant="ghost" className="flex flex-col gap-2 h-auto py-8" onClick={() => onCategoryClick(category.id)}>
                                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                        <ChevronRight className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <span className="text-xs font-medium text-muted-foreground">See All</span>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <ScrollBar orientation="horizontal" className="h-2" />
                                </ScrollArea>
                            ) : (
                                <div className="h-[120px] flex flex-col items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-muted rounded-lg bg-muted/10">
                                    <FolderIcon className="h-8 w-8 mb-2 opacity-20" />
                                    <span>Empty Shelf</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
