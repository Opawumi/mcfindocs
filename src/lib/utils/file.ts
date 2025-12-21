/**
 * Format file size in bytes to human-readable string
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Get file extension from filename
 * @param filename - File name
 * @returns File extension (lowercase, without dot)
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

/**
 * Get file type category from extension
 * @param filename - File name
 * @returns File type category
 */
export function getFileType(filename: string): string {
  const ext = getFileExtension(filename);

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  const documentExtensions = ["pdf", "doc", "docx", "txt", "rtf", "odt"];
  const spreadsheetExtensions = ["xls", "xlsx", "csv", "ods"];
  const presentationExtensions = ["ppt", "pptx", "odp"];
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm"];
  const audioExtensions = ["mp3", "wav", "ogg", "flac", "m4a"];
  const archiveExtensions = ["zip", "rar", "7z", "tar", "gz"];
  const codeExtensions = [
    "js",
    "ts",
    "jsx",
    "tsx",
    "py",
    "java",
    "cpp",
    "c",
    "cs",
    "php",
    "rb",
    "go",
    "rs",
  ];

  if (imageExtensions.includes(ext)) return "image";
  if (documentExtensions.includes(ext)) return "document";
  if (spreadsheetExtensions.includes(ext)) return "spreadsheet";
  if (presentationExtensions.includes(ext)) return "presentation";
  if (videoExtensions.includes(ext)) return "video";
  if (audioExtensions.includes(ext)) return "audio";
  if (archiveExtensions.includes(ext)) return "archive";
  if (codeExtensions.includes(ext)) return "code";

  return "file";
}

/**
 * Get file icon name based on file type
 * @param filename - File name
 * @returns Icon name (for use with lucide-react)
 */
export function getFileIcon(filename: string): string {
  const type = getFileType(filename);

  const iconMap: Record<string, string> = {
    image: "FileImage",
    document: "FileText",
    spreadsheet: "FileSpreadsheet",
    presentation: "Presentation",
    video: "FileVideo",
    audio: "FileAudio",
    archive: "FileArchive",
    code: "FileCode",
    file: "File",
  };

  return iconMap[type] || "File";
}

/**
 * Validate file type against allowed extensions
 * @param filename - File name
 * @param allowedExtensions - Array of allowed extensions (without dots)
 * @returns Whether file type is allowed
 */
export function isFileTypeAllowed(
  filename: string,
  allowedExtensions: string[]
): boolean {
  const ext = getFileExtension(filename);
  return allowedExtensions.map((e) => e.toLowerCase()).includes(ext);
}

/**
 * Sanitize filename by removing special characters
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove special characters but keep dots, hyphens, and underscores
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}
