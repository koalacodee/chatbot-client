import React from "react";
import { AttachmentMetadata } from "@/app/store/useAttachmentMetadataStore";
import api, { AttachmentService } from "@/utils/api";
import { env } from "next-runtime-env";

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

const AttachmentPreview: React.FC<AttachmentPreviewProps> = async ({
  attachmentKey,
  meta,
}) => {
  const { contentType, originalName } = meta;
  let url: string;
  if (env("NEXT_PUBLIC_MEDIA_ACCESS_TYPE") === "signed-url") {
    url = (await AttachmentService.getAttachmentSignedUrl(attachmentKey))
      .signedUrl;
  } else {
    url = `${api.defaults.baseURL}/attachment/${attachmentKey}`;
  }
  const renderPreview = () => {
    if (!attachmentKey) {
      return (
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
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
        <div className="w-full overflow-hidden rounded-xl">
          <img
            src={url}
            alt={originalName}
            className="w-full h-auto object-contain block"
            style={{
              display: "block",
              maxHeight: "400px",
            }}
          />
        </div>
      );
    }
    if (contentType.startsWith("video/")) {
      return (
        <div className="w-full overflow-hidden rounded-xl">
          <video
            src={url}
            className="w-full h-auto block"
            style={{
              display: "block",
              maxHeight: "400px",
            }}
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
        <audio
          controls
          src={url}
          className="w-full rounded-xl"
          style={{
            borderRadius: "12px",
          }}
        />
      );
    }
    // Generic preview for other file types
    return (
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
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

  return <div className="px-4">{renderPreview()}</div>;
};

export default AttachmentPreview;
