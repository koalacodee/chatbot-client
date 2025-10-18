"use client";
import { FAQService } from "@/utils/api/index";
import { useEffect, useState } from "react";
import ChevronDownIcon from "../ui/icons/ChevronDownIcon";
import { useAttachmentsStore } from "@/app/store/useAttachmentsStore";
import {
  AttachmentMetadata,
  useAttachmentMetadataStore,
} from "@/app/store/useAttachmentMetadataStore";
import { AttachmentService } from "@/utils/api";
import AttachmentPreview from "../ui/AttachmentPreview";
import PromotionAttachmentPreview from "../ui/PromotionAttachmentPreview";

export default function FaqItem({
  text,
  answer,
  isRated: rate,
  id,
  isViewed: viewed,
}: {
  id: string;
  text: string;
  answer?: string;
  isRated: boolean;
  isViewed: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRated, setIsRated] = useState(rate);
  const [isViewed, setIsViewed] = useState(viewed);
  const { getAttachmentsForFaq, attachments } = useAttachmentsStore();
  const { setMetadataForAttachment, getMetadataForAttachment, metadata } =
    useAttachmentMetadataStore();
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const [currentPreview, setCurrentPreview] = useState<{
    attachmentKey: string;
    metadata: AttachmentMetadata;
  }>();

  useEffect(() => {
    if (isOpen && !isViewed) {
      FAQService.viewFaq(id).then(() => setIsViewed(true));
    } else if (isOpen) {
      const populateMetadata = async () => {
        const attachments = getAttachmentsForFaq(id);
        const promises = attachments.map((attachment) =>
          AttachmentService.getAttachmentMetadata(attachment).then((metadata) =>
            setMetadataForAttachment(attachment, metadata)
          )
        );
        await Promise.all(promises);
      };
      populateMetadata();
    }
  }, [isOpen]);

  useEffect(() => {
    const attachment = getAttachmentsForFaq(id)[0];
    const metadata = getMetadataForAttachment(attachment);
    if (attachment && metadata) {
      setCurrentPreview({
        attachmentKey: attachment,
        metadata,
      });
    }
  }, [attachments, metadata]);

  const handleRate = async (rate: "satisfied" | "dissatisfied") => {
    switch (rate) {
      case "satisfied":
        await FAQService.recordSatisfaction(id);
        break;
      case "dissatisfied":
        await FAQService.recordDissatisfaction(id);
        break;
    }
    setIsRated(true);
  };

  return (
    <div className="border-b border-border last:border-b-0 transition-all duration-200">
      <button
        className="w-full flex justify-between items-center text-left py-2 px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md hover:bg-accent/50 transition-colors"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-foreground">{text}</span>
        <ChevronDownIcon
          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="prose prose-slate max-w-none text-muted-foreground p-4 pt-0">
            <p className="mt-0 leading-relaxed">{answer}</p>
          </div>
          <div className="px-4 pb-4">
            {!isRated ? (
              <div className="flex items-center gap-4 mt-4 p-3 bg-secondary/50 rounded-lg border border-border">
                <p className="text-sm font-medium text-secondary-foreground">
                  Was this answer helpful?
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleRate("satisfied")}
                    className="flex items-center justify-center w-10 h-10 text-xl bg-success/10 text-success rounded-full hover:bg-success/20 transition-colors"
                    aria-label="Satisfied"
                    title="Satisfied"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleRate("dissatisfied")}
                    className="flex items-center justify-center w-10 h-10 text-xl bg-destructive/10 text-destructive rounded-full hover:bg-destructive/20 transition-colors"
                    aria-label="Dissatisfied"
                    title="Dissatisfied"
                  >
                    👎
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-accent/50 text-accent-foreground rounded-lg text-sm font-medium text-center animate-fade-in">
                Thank you for your feedback!
              </div>
            )}
          </div>
          {currentPreview && (
            <PromotionAttachmentPreview
              attachmentKey={currentPreview.attachmentKey}
              meta={currentPreview.metadata}
              autoPlay={false}
              loop={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
