import PageLayout from "../../components/layout/PageLayout";
import TicketTracker from "../../components/ui/TicketTracker";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TicketTrackPage() {
  return (
    <PageLayout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Track Your Tickets
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all your support tickets
            </p>
          </div>

          <TicketTracker />
        </div>
      </div>
    </PageLayout>
  );
}
