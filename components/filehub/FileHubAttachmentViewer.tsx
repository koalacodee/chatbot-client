"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Image,
  Video,
  Music,
  Download,
  Loader2,
} from "lucide-react";
import { useFileHubAttachmentsStore } from "@/app/store/useFileHubAttachmentsStore";
import { FileHubAttachment } from "@/utils/api/generated";

interface FileHubAttachmentViewerProps {
  targetId: string;
  className?: string;
  maxVisible?: number;
  showCount?: boolean;
}

export default function FileHubAttachmentViewer({
  targetId,
  className = "",
  maxVisible = 3,
  showCount = true,
}: FileHubAttachmentViewerProps) {
  const { getAttachmentsByTargetId } = useFileHubAttachmentsStore();
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    attachment: FileHubAttachment | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    attachment: null,
    isLoading: false,
  });

  const [attachments, setAttachments] = useState<FileHubAttachment[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAttachments(getAttachmentsByTargetId(targetId));
  }, [targetId, getAttachmentsByTargetId]);

  const visibleAttachments = attachments.slice(0, maxVisible);
  const remainingCount = attachments.length - maxVisible;

  // Map file extension to MIME type
  const getContentType = (type: string): string => {
    const typeMap: Record<string, string> = {
      // Images
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      // Videos
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      // Audio
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      // Documents
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
    return typeMap[type.toLowerCase()] || `application/${type}`;
  };

  const getFileIcon = (filename: string) => {
    const type = filename.split(".").pop()?.toLowerCase() || "";
    const contentType = getContentType(type);
    if (contentType.startsWith("image/")) {
      return <Image className="h-4 w-4" />;
    } else if (contentType.startsWith("video/")) {
      return <Video className="h-4 w-4" />;
    } else if (contentType.startsWith("audio/")) {
      return <Music className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handlePreview = (attachment: FileHubAttachment) => {
    setPreviewModal({
      isOpen: true,
      attachment,
      isLoading: !attachment.signedUrl,
    });
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      attachment: null,
      isLoading: false,
    });
  };

  if (attachments.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {visibleAttachments.map((attachment) => (
          <motion.button
            key={attachment.id}
            onClick={() => handlePreview(attachment)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 border border-border rounded-lg text-sm text-foreground transition-colors cursor-pointer"
            title={attachment.originalName}
          >
            {getFileIcon(attachment.filename)}
            <span className="truncate max-w-[120px]">
              {attachment.originalName}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatFileSize(attachment.size)}
            </span>
          </motion.button>
        ))}
        {remainingCount > 0 && showCount && (
          <motion.button
            onClick={() => handlePreview(attachments[maxVisible])}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1 px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-sm text-primary font-medium transition-colors cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>+{remainingCount} more</span>
          </motion.button>
        )}
      </div>

      {/* Preview Modal - Rendered via Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {previewModal.isOpen && previewModal.attachment && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePreviewModal}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl shadow-2xl overflow-hidden"
                >
                  {/* Close button */}
                  <button
                    onClick={closePreviewModal}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Modal content */}
                  {previewModal.isLoading ? (
                    <div className="flex items-center justify-center p-12">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-muted-foreground">
                          Loading preview...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Header with file info */}
                      <div className="p-6 border-b border-border">
                        <h3 className="font-semibold text-foreground truncate text-lg">
                          {previewModal.attachment.originalName}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            {previewModal.attachment.filename
                              .split(".")
                              .pop()
                              ?.toUpperCase()}{" "}
                            file
                          </span>
                          <span>•</span>
                          <span>
                            {formatFileSize(previewModal.attachment.size)}
                          </span>
                          {previewModal.attachment.signedUrl && (
                            <>
                              <span>•</span>
                              <a
                                href={previewModal.attachment.signedUrl}
                                download={previewModal.attachment.originalName}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                              >
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Preview content */}
                      <div className="p-6">
                        {!previewModal.attachment.signedUrl ? (
                          <div className="flex items-center justify-center p-12">
                            <div className="text-center">
                              <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                                {getFileIcon(previewModal.attachment.filename)}
                              </div>
                              <p className="text-muted-foreground mb-4">
                                Preview not available. Signed URL is not
                                available.
                              </p>
                              <p className="text-sm text-muted-foreground">
                                File: {previewModal.attachment.filename}
                              </p>
                            </div>
                          </div>
                        ) : (
                          (() => {
                            const contentType = getContentType(
                              previewModal.attachment.filename
                                .split(".")
                                .pop() || ""
                            );
                            if (contentType.startsWith("image/")) {
                              return (
                                <img
                                  src={previewModal.attachment.signedUrl}
                                  alt={previewModal.attachment.originalName}
                                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg mx-auto"
                                  onError={() => {
                                    setPreviewModal((prev) => ({
                                      ...prev,
                                      isLoading: false,
                                    }));
                                  }}
                                />
                              );
                            } else if (contentType.startsWith("video/")) {
                              return (
                                <video
                                  src={previewModal.attachment.signedUrl}
                                  className="w-full h-auto max-h-[60vh] rounded-lg mx-auto"
                                  controls
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  onError={() => {
                                    setPreviewModal((prev) => ({
                                      ...prev,
                                      isLoading: false,
                                    }));
                                  }}
                                />
                              );
                            } else if (contentType.startsWith("audio/")) {
                              return (
                                <div className="flex items-center justify-center p-8">
                                  <audio
                                    controls
                                    src={previewModal.attachment.signedUrl}
                                    className="w-full max-w-md"
                                    onError={() => {
                                      setPreviewModal((prev) => ({
                                        ...prev,
                                        isLoading: false,
                                      }));
                                    }}
                                  />
                                </div>
                              );
                            } else {
                              return (
                                <div className="flex items-center justify-center p-12">
                                  <div className="text-center">
                                    <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                                      {getFileIcon(
                                        previewModal.attachment.filename
                                      )}
                                    </div>
                                    <p className="text-muted-foreground mb-4">
                                      Preview not available for this file type
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-4">
                                      {previewModal.attachment.filename
                                        .split(".")
                                        .pop()
                                        ?.toUpperCase()}{" "}
                                      file
                                    </p>
                                    <a
                                      href={previewModal.attachment.signedUrl}
                                      download={
                                        previewModal.attachment.originalName
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                                    >
                                      <Download className="w-4 h-4" />
                                      Download File
                                    </a>
                                  </div>
                                </div>
                              );
                            }
                          })()
                        )}
                      </div>

                      {/* Navigation for multiple attachments */}
                      {attachments.length > 1 && (
                        <div className="p-4 border-t border-border bg-muted/30">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = attachments.findIndex(
                                  (a) => a.id === previewModal.attachment?.id
                                );
                                if (currentIndex > 0) {
                                  handlePreview(attachments[currentIndex - 1]);
                                }
                              }}
                              disabled={
                                attachments.findIndex(
                                  (a) => a.id === previewModal.attachment?.id
                                ) === 0
                              }
                              className="px-4 py-2 bg-background hover:bg-muted border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Previous
                            </button>
                            <span className="text-sm text-muted-foreground">
                              {attachments.findIndex(
                                (a) => a.id === previewModal.attachment?.id
                              ) + 1}{" "}
                              of {attachments.length}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = attachments.findIndex(
                                  (a) => a.id === previewModal.attachment?.id
                                );
                                if (currentIndex < attachments.length - 1) {
                                  handlePreview(attachments[currentIndex + 1]);
                                }
                              }}
                              disabled={
                                attachments.findIndex(
                                  (a) => a.id === previewModal.attachment?.id
                                ) ===
                                attachments.length - 1
                              }
                              className="px-4 py-2 bg-background hover:bg-muted border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
