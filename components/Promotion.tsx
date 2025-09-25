"use client";
import { useState, useEffect } from "react";
import api, { AttachmentService, PromotionService } from "@/utils/api";
import PromotionAttachmentPreview from "./ui/PromotionAttachmentPreview";

export default function Promotion() {
  const [promotion, setPromotion] = useState<any>(null);
  const [attachmentsMetadata, setAttachmentsMetadata] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPromotion = async () => {
      try {
        const promotionData = await PromotionService.getPromotion();
        const { title, startDate, endDate } = promotionData.promotion;

        // Check if promotion is currently active
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        const isActive = now >= start && now <= end;

        if (isActive) {
          setPromotion(promotionData);

          // Load attachments metadata
          const metadata = await Promise.all(
            promotionData.attachments[promotionData.promotion.id].map(
              async (attachment: string) => {
                const attachmentMetadata =
                  await AttachmentService.getAttachmentMetadata(attachment);
                return {
                  attachmentKey: attachment,
                  metadata: attachmentMetadata,
                };
              }
            )
          );
          setAttachmentsMetadata(metadata);
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Error loading promotion:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPromotion();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (isLoading || !isVisible || !promotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-black/20 rounded-lg transition-colors"
            aria-label="Close promotion"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex items-center justify-center min-h-[60vh] pb-0">
          {attachmentsMetadata.length > 0 ? (
            <div className="w-full">
              {attachmentsMetadata.map(({ attachmentKey, metadata }, index) => (
                <PromotionAttachmentPreview
                  key={index}
                  attachmentKey={attachmentKey}
                  meta={metadata}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-muted-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground">
                No media available for this promotion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
