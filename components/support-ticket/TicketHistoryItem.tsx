"use client";
import { GetTicketHistory200ResponseDataTicketsInner } from "@/utils/api/generated";
import TicketHistoryItemRating from "./TicketHistoryItemRating";
import { useEffect, useState } from "react";
import { AttachmentService, api } from "@/utils/api";
import { env } from "next-runtime-env";

interface Attachment {
  fileType: string;
  originalName: string;
  sizeInBytes: number;
  expiryDate: string;
  contentType: string;
  token: string;
}

export default function TicketHistoryItem({
  ticket,
  attachments: attachmentTokens,
}: {
  ticket: GetTicketHistory200ResponseDataTicketsInner;
  attachments: Array<string>;
}) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-primary/10 text-primary",
      pending: "bg-warning/10 text-warning",
      resolved: "bg-success/10 text-success",
      closed: "bg-muted text-muted-foreground",
    };
    return colors[status.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    attachment: Attachment | null;
    url: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    attachment: null,
    url: "",
    isLoading: false,
  });

  useEffect(() => {
    const fetchAttachments = async () => {
      const attachments = await Promise.all(
        attachmentTokens.map(async (token) => {
          const metadata = await AttachmentService.getAttachmentMetadata(token);
          return { ...metadata, token };
        })
      );
      setAttachments(attachments);
    };
    fetchAttachments();
  }, [attachmentTokens]);

  const handleAttachmentPreview = async (attachment: Attachment) => {
    setPreviewModal({
      isOpen: true,
      attachment,
      url: "",
      isLoading: true,
    });

    try {
      let attachmentUrl: string;
      if (env("NEXT_PUBLIC_MEDIA_ACCESS_TYPE") === "signed-url") {
        const response = await AttachmentService.getAttachmentSignedUrl(
          attachment.token
        );
        attachmentUrl = response.signedUrl;
      } else {
        attachmentUrl = `${api.defaults.baseURL}/attachment/${attachment.token}`;
      }
      setPreviewModal((prev) => ({
        ...prev,
        url: attachmentUrl,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch attachment URL:", error);
      setPreviewModal((prev) => ({
        ...prev,
        url: `${api.defaults.baseURL}/attachment/${attachment.token}`,
        isLoading: false,
      }));
    }
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      attachment: null,
      url: "",
      isLoading: false,
    });
  };

  return (
    <li key={ticket.id}>
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 animate-fade-in">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-medium text-card-foreground">
              {ticket.subject}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {ticket.description}
            </p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${getStatusColor(
              ticket.status
            )}`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Ticket #{ticket.code}</span>
          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>
        {ticket.answer && (
          <div className="p-3 bg-primary/10 border-l-4 border-primary text-card-foreground mt-2">
            <p className="font-semibold text-xs text-primary mb-1">
              Support Reply
            </p>
            {ticket.answer}
          </div>
        )}
        {attachments.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <span className="text-sm font-medium text-muted-foreground">
                Attachments ({attachments.length})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  onClick={() => handleAttachmentPreview(attachment)}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    {attachment.contentType.startsWith("image/") ? (
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    ) : attachment.contentType.startsWith("application/pdf") ? (
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-red-600 dark:text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    ) : attachment.contentType.includes("text/") ? (
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-gray-600 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {attachment.originalName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{attachment.fileType.toUpperCase()}</span>
                      <span>•</span>
                      <span>
                        {attachment.sizeInBytes < 1024
                          ? `${attachment.sizeInBytes} B`
                          : attachment.sizeInBytes < 1024 * 1024
                          ? `${(attachment.sizeInBytes / 1024).toFixed(1)} KB`
                          : `${(attachment.sizeInBytes / (1024 * 1024)).toFixed(
                              1
                            )} MB`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {ticket.answer && (
          <div className="mt-3">
            <TicketHistoryItemRating
              ticketId={ticket.id}
              isRated={ticket.isRated}
            />
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] mx-4">
            {/* Close button */}
            <button
              onClick={closePreviewModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal content */}
            <div className="bg-card rounded-xl overflow-hidden shadow-2xl">
              {previewModal.isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-muted-foreground">
                      Loading preview...
                    </span>
                  </div>
                </div>
              ) : previewModal.attachment ? (
                <div>
                  {/* Header with file info */}
                  <div className="p-4 border-b border-border">
                    <h3 className="font-medium text-card-foreground truncate">
                      {previewModal.attachment.originalName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {previewModal.attachment.contentType} •{" "}
                      {previewModal.attachment.sizeInBytes < 1024
                        ? `${previewModal.attachment.sizeInBytes} B`
                        : previewModal.attachment.sizeInBytes < 1024 * 1024
                        ? `${(
                            previewModal.attachment.sizeInBytes / 1024
                          ).toFixed(1)} KB`
                        : `${(
                            previewModal.attachment.sizeInBytes /
                            (1024 * 1024)
                          ).toFixed(1)} MB`}
                    </p>
                  </div>

                  {/* Preview content */}
                  <div className="p-4">
                    {previewModal.attachment.contentType.startsWith(
                      "image/"
                    ) ? (
                      <img
                        src={previewModal.url}
                        alt={previewModal.attachment.originalName}
                        className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                      />
                    ) : previewModal.attachment.contentType.startsWith(
                        "video/"
                      ) ? (
                      <video
                        src={previewModal.url}
                        className="w-full h-auto max-h-[60vh] rounded-lg"
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : previewModal.attachment.contentType.startsWith(
                        "audio/"
                      ) ? (
                      <div className="flex items-center justify-center p-8">
                        <audio
                          controls
                          src={previewModal.url}
                          className="w-full max-w-md"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-8 h-8 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-muted-foreground mb-2">
                            Preview not available for this file type
                          </p>
                          <a
                            href={previewModal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            Download File
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
