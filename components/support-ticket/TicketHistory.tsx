import { GetTicketHistory200ResponseDataTicketsInner } from "@/utils/api/generated";
import TicketHistoryItem from "./TicketHistoryItem";

export default function TicketHistory({
  tickets,
  attachments,
}: {
  tickets: GetTicketHistory200ResponseDataTicketsInner[];
  attachments: Record<string, Array<string>>;
}) {
  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground animate-fade-in">
          <p>No tickets found.</p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <TicketHistoryItem
            key={ticket.id}
            ticket={ticket}
            attachments={attachments[ticket.id] || []}
          />
        ))
      )}
    </div>
  );
}
