/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Paginated result interface
 */
export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Search result interface
 */
export interface SearchResult {
  id: string;
  type: "document" | "memo";
  title: string;
  snippet?: string;
  highlightedText?: string;
  metadata: Record<string, any>;
  relevanceScore?: number;
  url: string;
}

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  userId: string;
  type:
    | "document_shared"
    | "new_memo"
    | "memo_reply"
    | "mention"
    | "document_review"
    | "system";
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  metadata?: Record<string, any>;
}

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: "document" | "memo" | "user" | "category" | "folder" | "system";
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

/**
 * Audit log filter options
 */
export interface AuditLogFilters {
  userId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Error response
 */
export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

/**
 * Upload progress
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  status: "pending" | "uploading" | "processing" | "completed" | "error";
  error?: string;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

/**
 * Sort option
 */
export interface SortOption {
  field: string;
  label: string;
  order: "asc" | "desc";
}

/**
 * Filter option
 */
export interface FilterOption {
  field: string;
  label: string;
  value: any;
  type: "select" | "multiselect" | "date" | "daterange" | "text";
  options?: { label: string; value: any }[];
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  id: string;
  label: string;
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => React.ReactNode;
}

/**
 * Action menu item
 */
export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  separator?: boolean;
}
