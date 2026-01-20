import {
  getTotalDocumentsCount,
  getSharedDocumentsCount,
  getRecentActivity
} from "@/services/document.service";
import { getMyFoldersCount } from "@/services/folder.service";
import { getUnreadCount } from "@/services/memo.service";
import { getCurrentUser } from "@/lib/mock-data/users.mock";
import { formatRelativeTime } from "@/lib/utils";
import { FileText, Folder, Mail, Share2, File as FileIcon } from "lucide-react";

export default async function DashboardPage() {
  const currentUser = getCurrentUser();

  // Fetch data in parallel
  const [
    totalDocuments,
    myFoldersCount,
    unreadMemosCount,
    sharedDocumentsCount,
    recentDocuments
  ] = await Promise.all([
    getTotalDocumentsCount(),
    getMyFoldersCount(currentUser.id),
    getUnreadCount(currentUser.id),
    getSharedDocumentsCount(currentUser.id),
    getRecentActivity(5)
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Overview</h1>
        <p className="text-sm text-gray-600 mt-1">
          Track activity across your document management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Documents */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalDocuments.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* My Folders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">My Folders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{myFoldersCount.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <Folder className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Unread Memos */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Unread Memos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{unreadMemosCount.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Shared with Me */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Shared with Me</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{sharedDocumentsCount.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <Share2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentDocuments.length > 0 ? (
            recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FileIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Modified {formatRelativeTime(doc.lastModifiedAt)} by {doc.lastModifiedBy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {doc.fileType}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-gray-500">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
