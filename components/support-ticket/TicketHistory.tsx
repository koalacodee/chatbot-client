import { GetTicketHistory200ResponseDataTicketsInner } from "@/utils/api/generated";
import TicketHistoryItem from "./TicketHistoryItem";
import { CommonLocales } from "@/public/locales/common/map";

export default function TicketHistory({
  tickets,
  attachments,
  locales = { no_tickets: "No tickets found." },
}: {
  tickets: GetTicketHistory200ResponseDataTicketsInner[];
  attachments: Record<string, Array<string>>;
  locales?: Partial<CommonLocales["tickets"]>;
}) {
  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground animate-fade-in">
          <p>{locales?.no_tickets}</p>
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
