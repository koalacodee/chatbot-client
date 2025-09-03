import { GetTicketHistory200ResponseDataTicketsInner } from "@/utils/api/generated";
import TicketHistoryItemRating from "./TicketHistoryItemRating";

export default function TicketHistoryItem({
  ticket,
}: {
  ticket: GetTicketHistory200ResponseDataTicketsInner;
}) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-primary/10 text-primary",
      pending: "bg-warning/10 text-warning",
      resolved: "bg-success/10 text-success",
      closed: "bg-muted text-muted-foreground",
    };
    return colors[status.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  return (
    <li key={ticket.id}>
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 animate-fade-in">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-medium text-card-foreground">
              {ticket.subject}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {ticket.description}
            </p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${getStatusColor(
              ticket.status
            )}`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Ticket #{ticket.code}</span>
          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>
        {ticket.answer && (
          <div className="p-3 bg-primary/10 border-l-4 border-primary text-card-foreground mt-2">
            <p className="font-semibold text-xs text-primary mb-1">
              Support Reply
            </p>
            {ticket.answer}
          </div>
        )}
        {ticket.answer && (
          <div className="mt-3">
            <TicketHistoryItemRating
              ticketId={ticket.id}
              isRated={ticket.isRated}
            />
          </div>
        )}
      </div>
    </li>
  );
}
