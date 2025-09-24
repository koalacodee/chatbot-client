import React from "react";
import { AttachmentMetadata } from "@/app/store/useAttachmentMetadataStore";
import api from "@/utils/api";

const FileIcon: React.FC<{ className?: string }> = ({
  className = "w-12 h-12",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);

interface AttachmentPreviewProps {
  attachmentKey: string;
  meta: AttachmentMetadata;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachmentKey,
  meta,
}) => {
  const { contentType, originalName } = meta;
  const url = `${api.defaults.baseURL}/attachment/${attachmentKey}`;
  const renderPreview = () => {
    if (!attachmentKey) {
      return (
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex-shrink-0">
            <FileIcon className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="flex-grow min-w-0">
            <p
              className="font-medium text-foreground truncate text-sm"
              title={originalName}
            >
              {originalName}
            </p>
            <p className="text-xs text-destructive mt-1">
              Preview not available.
            </p>
          </div>
        </div>
      );
    }

    if (contentType.startsWith("image/")) {
      return (
        <div className="bg-muted/30 rounded-lg p-2 border border-border/50">
          <img
            src={url}
            alt={originalName}
            className="max-w-full h-auto rounded-md object-contain max-h-80 mx-auto block"
          />
        </div>
      );
    }
    if (contentType.startsWith("video/")) {
      return (
        <div className="bg-muted/30 rounded-lg p-2 border border-border/50">
          <video
            src={url}
            className="max-w-full h-auto rounded-md max-h-80 mx-auto block"
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        </div>
      );
    }
    if (contentType.startsWith("audio/")) {
      return (
        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
          <audio controls src={url} className="w-full" />
        </div>
      );
    }
    // Generic preview for other file types
    return (
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex-shrink-0">
          <FileIcon className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="flex-grow min-w-0">
          <p
            className="font-medium text-foreground truncate text-sm"
            title={originalName}
          >
            {originalName}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{contentType}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 mx-4 mb-2">
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
            <FileIcon className="w-4 h-4 text-muted-foreground" />
            Attachment
          </h4>
          {renderPreview()}
        </div>
        {url && (
          <div className="pt-3 border-t border-border">
            <a
              href={url}
              download={originalName}
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Download "{originalName}"
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentPreview;
