import {
  getTotalDocumentsCount,
  getSharedDocumentsCount,
  getRecentActivity
} from "@/services/document.service";
import { getMyFoldersCount } from "@/services/folder.service";
import { getUnreadCount } from "@/services/memo.service";
import { formatRelativeTime } from "@/lib/utils";
import { FileText, Folder, Mail, Share2, File as FileIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }

  const userEmail = session.user.email;

  // Fetch data in parallel
  const [
    totalDocuments,
    myFoldersCount,
    unreadMemosCount,
    sharedDocumentsCount,
    recentDocuments
  ] = await Promise.all([
    getTotalDocumentsCount(),
    getMyFoldersCount(userEmail),
    getUnreadCount(userEmail),
    getSharedDocumentsCount(userEmail),
    getRecentActivity(5)
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Overview</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Track activity across your document management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalDocuments.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* My Folders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">My Folders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{myFoldersCount.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Unread Memos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Unread Memos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{unreadMemosCount.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
              <Mail className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Shared with Me */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Shared with Me</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{sharedDocumentsCount.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <Share2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {recentDocuments.length > 0 ? (
            recentDocuments.map((doc) => (
              <Link
                key={doc.id}
                href={doc.fileUrl || '#'}
                className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <FileIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Modified {formatRelativeTime(doc.lastModifiedAt)} by {doc.lastModifiedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200 border border-transparent dark:border-gray-600">
                      {doc.fileType}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
