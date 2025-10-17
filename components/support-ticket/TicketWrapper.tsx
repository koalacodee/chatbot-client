"use client";
import TicketHistory from "./TicketHistory";
import TicketForm from "./TicketForm";
import VerificationForm from "./VerificationForm";
import { useSubmittedTicketStore } from "@/app/store/useSubmittedTicketStore";
import { useTicketHistoryStore } from "@/app/store/useTicketHistoryStore";
import { useVerificationStore } from "@/app/store/useVerificationStore";
import { useAttachmentsStore } from "@/app/store/useAttachmentsStore";

export default function TicketWrapper() {
  const { submittedTicket } = useSubmittedTicketStore();
  const { tickets } = useTicketHistoryStore();
  const { isVerifying } = useVerificationStore();
  const attachments = useAttachmentsStore((state) => state.attachments);
  return (
    <>
      {!submittedTicket && !isVerifying ? (
        <div className="mt-12 p-8 bg-card rounded-lg shadow-lg border border-border animate-fade-in">
          <h3 className="text-2xl font-bold text-center text-card-foreground mb-2">
            Didn't find your answer?
          </h3>
          <p className="text-center text-muted-foreground mb-8">
            Submit a ticket and our support team will get back to you.
          </p>

          <div className="space-y-4 max-w-3xl mx-auto">
            <TicketHistory tickets={tickets} attachments={attachments} />
            <hr className="!my-6 border-border" />
            <TicketForm />
          </div>
        </div>
      ) : isVerifying ? (
        <div className="mt-12 p-8 bg-card rounded-lg shadow-lg border border-border animate-fade-in">
          <VerificationForm />
        </div>
      ) : (
        <div className="mt-12 p-8 bg-success/10 rounded-lg shadow-lg border border-success/20 text-center animate-fade-in">
          <h3 className="text-2xl font-bold text-success mb-2">
            Ticket Verified Successfully!
          </h3>
          <p className="text-success-foreground mb-4">
            Your ticket has been verified and received. Our team will get back
            to you shortly.
          </p>
          <p className="text-muted-foreground">Your reference number is:</p>
          <p className="text-2xl font-mono bg-success/20 text-success inline-block px-4 py-2 rounded-md mt-2 animate-bounce">
            {submittedTicket?.ticketId}
          </p>
        </div>
      )}
    </>
  );
}
