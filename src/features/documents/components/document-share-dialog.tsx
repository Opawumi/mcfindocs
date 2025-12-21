'use client';

import { useState } from 'react';
import { Share2, X, Search } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { Document } from '@/lib/types';

interface ShareRecipient {
  id: string;
  name: string;
  email: string;
  permissions: string[];
}

interface DocumentShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onShare?: (data: any) => void;
}

export function DocumentShareDialog({
  open,
  onOpenChange,
  document,
  onShare,
}: DocumentShareDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipients, setRecipients] = useState<ShareRecipient[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState({
    view: true,
    download: false,
    edit: false,
    share: false,
  });

  // Mock users for autocomplete
  const mockUsers = [
    { id: 'user-1', name: 'John Doe', email: 'john@mcfin.com' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane@mcfin.com' },
    { id: 'user-3', name: 'Mike Johnson', email: 'mike@mcfin.com' },
    { id: 'user-4', name: 'Sarah Williams', email: 'sarah@mcfin.com' },
  ];

  const filteredUsers = mockUsers.filter(
    user =>
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !recipients.find(r => r.id === user.id)
  );

  const addRecipient = (user: typeof mockUsers[0]) => {
    setRecipients(prev => [
      ...prev,
      {
        ...user,
        permissions: Object.keys(selectedPermissions).filter(
          key => selectedPermissions[key as keyof typeof selectedPermissions]
        ),
      },
    ]);
    setSearchQuery('');
  };

  const removeRecipient = (userId: string) => {
    setRecipients(prev => prev.filter(r => r.id !== userId));
  };

  const handleShare = () => {
    if (recipients.length === 0) return;

    onShare?.({
      documentId: document?.id,
      recipients: recipients.map(r => ({
        userId: r.id,
        permissions: r.permissions,
      })),
    });

    handleClose();
  };

  const handleClose = () => {
    setRecipients([]);
    setSearchQuery('');
    setSelectedPermissions({
      view: true,
      download: false,
      edit: false,
      share: false,
    });
    onOpenChange(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share "{document?.name}" with other users
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Search */}
          <div>
            <Label>Add People</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            {searchQuery && filteredUsers.length > 0 && (
              <div className="mt-2 border border-border rounded-lg max-h-48 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => addRecipient(user)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Permissions */}
          <div>
            <Label>Default Permissions</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="view"
                  checked={selectedPermissions.view}
                  onCheckedChange={(checked) =>
                    setSelectedPermissions(prev => ({ ...prev, view: checked as boolean }))
                  }
                />
                <label
                  htmlFor="view"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  View - Can view the document
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="download"
                  checked={selectedPermissions.download}
                  onCheckedChange={(checked) =>
                    setSelectedPermissions(prev => ({ ...prev, download: checked as boolean }))
                  }
                />
                <label htmlFor="download" className="text-sm font-medium">
                  Download - Can download the document
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit"
                  checked={selectedPermissions.edit}
                  onCheckedChange={(checked) =>
                    setSelectedPermissions(prev => ({ ...prev, edit: checked as boolean }))
                  }
                />
                <label htmlFor="edit" className="text-sm font-medium">
                  Edit - Can edit the document
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="share"
                  checked={selectedPermissions.share}
                  onCheckedChange={(checked) =>
                    setSelectedPermissions(prev => ({ ...prev, share: checked as boolean }))
                  }
                />
                <label htmlFor="share" className="text-sm font-medium">
                  Share - Can share with others
                </label>
              </div>
            </div>
          </div>

          {/* Recipients List */}
          {recipients.length > 0 && (
            <>
              <Separator />
              <div>
                <Label>Sharing With ({recipients.length})</Label>
                <div className="mt-2 space-y-2">
                  {recipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-white text-xs">
                            {getInitials(recipient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{recipient.name}</p>
                          <div className="flex gap-1 mt-1">
                            {recipient.permissions.map((perm) => (
                              <Badge key={perm} variant="secondary" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRecipient(recipient.id)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={recipients.length === 0}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
