"use client";
import { SupportTicketService } from "@/utils/api/index";
import TicketHistory from "./TicketHistory";
import TicketForm from "./TicketForm";
import { useSubmittedTicketStore } from "@/app/store/useSubmittedTicketStore";
import { GetTicketHistory200ResponseDataTicketsInner } from "@/utils/api/generated";
import { useEffect, useState } from "react";

export default function TicketWrapper() {
  const { submittedTicket } = useSubmittedTicketStore();
  const [tickets, setTickets] = useState<
    GetTicketHistory200ResponseDataTicketsInner[]
  >([]);

  useEffect(() => {
    if (submittedTicket) return;
    const fetchTickets = async () => {
      const tickets = await SupportTicketService.getTicketHistory();
      setTickets(tickets.data.data.tickets);
    };
    fetchTickets();
  }, [submittedTicket]);

  return (
    <>
      {!submittedTicket ? (
        <div className="mt-12 p-8 bg-card rounded-lg shadow-lg border border-border animate-fade-in">
          <h3 className="text-2xl font-bold text-center text-card-foreground mb-2">
            Didn't find your answer?
          </h3>
          <p className="text-center text-muted-foreground mb-8">
            Submit a ticket and our support team will get back to you.
          </p>

          <div className="space-y-4 max-w-3xl mx-auto">
            <TicketHistory tickets={tickets} />
            <hr className="!my-6 border-border" />
            <TicketForm />
          </div>
        </div>
      ) : (
        <div className="mt-12 p-8 bg-success/10 rounded-lg shadow-lg border border-success/20 text-center animate-fade-in">
          <h3 className="text-2xl font-bold text-success mb-2">
            Ticket Submitted Successfully!
          </h3>
          <p className="text-success-foreground mb-4">
            Your ticket has been received. Our team will get back to you
            shortly.
          </p>
          <p className="text-muted-foreground">Your reference number is:</p>
          <p className="text-2xl font-mono bg-success/20 text-success inline-block px-4 py-2 rounded-md mt-2 animate-bounce">
            {submittedTicket.code}
          </p>
        </div>
      )}
    </>
  );
}
