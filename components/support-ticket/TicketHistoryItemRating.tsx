"use client";
import { SupportTicketService } from "@/utils/api/index";
import { useState } from "react";
import { useLocalesStore } from "@/app/store/useLocalesStore";

export default function TicketHistoryItemRating({
  ticketId,
  isRated: rated,
}: {
  ticketId: string;
  isRated: boolean;
}) {
  const [isRated, setIsRated] = useState(rated);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locales = useLocalesStore((state) => state.locales);

  const handleRate = async (rate: "satisfied" | "dissatisfied") => {
    if (isRated) return;
    setIsSubmitting(true);
    try {
      switch (rate) {
        case "satisfied":
          await SupportTicketService.recordTicketSatisfaction(ticketId);
          setIsRated(true);
          break;
        case "dissatisfied":
          await SupportTicketService.recordTicketDissatisfaction(ticketId);
          setIsRated(true);
          break;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isRated ? (
        <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-md border border-border">
          <p className="text-xs font-medium text-muted-foreground">
            {locales.faqs?.was_this_reply_helpful}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleRate("satisfied")}
              className={`p-1 rounded transition-all duration-200 text-muted-foreground hover:text-warning hover:scale-110`}
              aria-label={locales.faqs?.satisfied || "Satisfied"}
              title={locales.faqs?.satisfied || "Satisfied"}
            >
              👍
            </button>
            <button
              type="button"
              onClick={() => handleRate("dissatisfied")}
              className={`p-1 rounded transition-all duration-200 text-muted-foreground hover:text-warning hover:scale-110`}
              aria-label={locales.faqs?.dissatisfied || "Dissatisfied"}
              title={locales.faqs?.dissatisfied || "Dissatisfied"}
            >
              👎
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2 bg-primary/10 text-primary rounded-md text-xs font-medium text-center animate-fade-in">
          {locales.faqs?.thanks_for_your_feedback}
        </div>
      )}
    </>
  );
}
