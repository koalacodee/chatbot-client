import { GetTicketHistory200ResponseDataTicketsInner } from "@/utils/api/generated";
import TicketHistoryItem from "./TicketHistoryItem";

export default function TicketHistory({
  tickets,
}: {
  tickets: GetTicketHistory200ResponseDataTicketsInner[];
}) {
  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground animate-fade-in">
          <p>No tickets found.</p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <TicketHistoryItem key={ticket.id} ticket={ticket} />
        ))
      )}
    </div>
  );
}
