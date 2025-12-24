import { SearchResult } from "../lib/types";
import { mockDocuments, mockMemos } from "../lib/mock-data";
import { sleep } from "../lib/utils";

/**
 * Search Service
 * Handles all search-related operations
 * Currently uses mock data - will be replaced with real API calls
 */

/**
 * Search documents
 */
export async function searchDocuments(
  query: string,
  filters?: {
    categoryId?: string;
    fileType?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Promise<SearchResult[]> {
  await sleep(400);

  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchQuery = query.toLowerCase();
  let results = mockDocuments.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery) ||
      doc.metadata.title.toLowerCase().includes(searchQuery) ||
      doc.metadata.description?.toLowerCase().includes(searchQuery) ||
      doc.metadata.tags?.some((tag) => tag.toLowerCase().includes(searchQuery))
  );

  // Apply filters
  if (filters) {
    if (filters.categoryId) {
      results = results.filter((doc) => doc.categoryId === filters.categoryId);
    }

    if (filters.fileType) {
      results = results.filter((doc) => doc.fileType === filters.fileType);
    }
  }

  return results.map((doc) => ({
    id: doc.id,
    type: "document" as const,
    title: doc.name,
    snippet: doc.metadata.description || "",
    highlightedText: getHighlightedText(doc.name, searchQuery),
    metadata: {
      fileType: doc.fileType,
      uploadedBy: doc.uploadedBy,
      uploadedAt: doc.uploadedAt,
      categoryId: doc.categoryId,
    },
    relevanceScore: calculateRelevance(doc.name, searchQuery),
    url: `/documents/${doc.id}`,
  }));
}

/**
 * Search memos
 */
export async function searchMemos(
  query: string,
  filters?: {
    senderId?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Promise<SearchResult[]> {
  await sleep(400);

  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchQuery = query.toLowerCase();
  let results = mockMemos.filter(
    (memo) =>
      memo.subject.toLowerCase().includes(searchQuery) ||
      memo.body.toLowerCase().includes(searchQuery)
  );

  // Apply filters
  if (filters) {
    if (filters.senderId) {
      results = results.filter((memo) => memo.senderId === filters.senderId);
    }

    if (filters.priority) {
      results = results.filter((memo) => memo.priority === filters.priority);
    }
  }

  return results.map((memo) => ({
    id: memo.id,
    type: "memo" as const,
    title: memo.subject,
    snippet: stripHtml(memo.body).substring(0, 150) + "...",
    highlightedText: getHighlightedText(memo.subject, searchQuery),
    metadata: {
      senderId: memo.senderId,
      sentAt: memo.sentAt,
      priority: memo.priority,
      recipientCount: memo.recipients.length,
    },
    relevanceScore: calculateRelevance(memo.subject, searchQuery),
    url: `/memos/${memo.id}`,
  }));
}

/**
 * Global search (documents and memos)
 */
export async function globalSearch(query: string): Promise<SearchResult[]> {
  await sleep(500);

  if (!query || query.trim().length === 0) {
    return [];
  }

  const [documentResults, memoResults] = await Promise.all([
    searchDocuments(query),
    searchMemos(query),
  ]);

  // Combine and sort by relevance
  const allResults = [...documentResults, ...memoResults].sort(
    (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)
  );

  return allResults;
}

/**
 * Helper: Calculate relevance score
 */
function calculateRelevance(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Exact match gets highest score
  if (lowerText === lowerQuery) return 100;

  // Starts with query gets high score
  if (lowerText.startsWith(lowerQuery)) return 80;

  // Contains query gets medium score
  if (lowerText.includes(lowerQuery)) return 60;

  // Word match gets lower score
  const textWords = lowerText.split(/\s+/);
  const queryWords = lowerQuery.split(/\s+/);
  const matchingWords = queryWords.filter((qw) =>
    textWords.some((tw) => tw.includes(qw))
  );

  return (matchingWords.length / queryWords.length) * 40;
}

/**
 * Helper: Get highlighted text
 */
function getHighlightedText(text: string, query: string): string {
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

/**
 * Helper: Strip HTML tags
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}
