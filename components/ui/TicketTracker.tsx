"use client";
import React, { useEffect, useState } from "react";
import { Clock, CheckCircle2, AlertCircle, X, RefreshCw } from "lucide-react";
import { useTickets } from "../../hooks/useTickets";
import { useSearchParams } from "next/navigation";

interface Ticket {
  id: string;
  code: string;
  title: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: Date;
  updatedAt: Date;
  priority: "low" | "medium" | "high" | "urgent";
  question?: string;
  answer?: string;
}

interface TicketTrackerProps {
  onTicketClick?: (ticket: Ticket) => void;
  className?: string;
  initialTicketCode?: string;
}

export default function TicketTracker({
  onTicketClick,
  className = "",
}: TicketTrackerProps) {
  const { loading, trackTicket, currentTicket } = useTickets();
  const searchParams = useSearchParams();
  const [ticketCode, setTicketCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle initial load from URL params and localStorage
  useEffect(() => {
    const loadInitialTickets = async () => {
      const savedTicketCode = localStorage.getItem("ticketCode");
      const paramCode = searchParams.get("code");

      if (paramCode) {
        localStorage.setItem("ticketCode", paramCode);
        setTicketCode(paramCode);
        try {
          await trackTicket(paramCode);
          setShowModal(true);
        } catch (err) {
          setError("Failed to load ticket from URL");
        }
      } else if (savedTicketCode) {
        setTicketCode(savedTicketCode);
        try {
          await trackTicket(savedTicketCode);
          setShowModal(true);
        } catch (err) {
          setError("Failed to load saved ticket");
        }
      }
    };

    loadInitialTickets();
  }, [searchParams, trackTicket]);

  // Update ticket code when currentTicket changes
  useEffect(() => {
    if (currentTicket) {
      setTicketCode(currentTicket.code);
      localStorage.setItem("ticketCode", currentTicket.code);
    }
  }, [currentTicket]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "closed":
        return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "in-progress":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200";
      case "closed":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleTrack = async () => {
    if (!ticketCode.trim()) return;

    try {
      setError(null);
      const ticket = await trackTicket(ticketCode.trim());
      if (ticket) {
        setShowModal(true);
        onTicketClick?.(ticket as any);
      }
    } catch (err) {
      setError("Failed to track ticket. Please check the code and try again.");
      console.error("Failed to track ticket:", err);
    }
  };

  const handleRefresh = async () => {
    const savedTicketCode = localStorage.getItem("ticketCode");
    if (savedTicketCode) {
      try {
        setError(null);
        await trackTicket(savedTicketCode);
        setShowModal(true);
      } catch (err) {
        setError("Failed to refresh ticket");
      }
    }
  };

  if (loading && !currentTicket) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Track Your Tickets
          </h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
            placeholder="Enter ticket code"
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleTrack}
            disabled={!ticketCode.trim() || loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Track
          </button>
        </div>

        {currentTicket && (
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Current Ticket
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Code: <span className="font-mono">#{currentTicket.code}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Created:{" "}
                {new Date(currentTicket.createdAt).toLocaleDateString()}
              </p>
              {currentTicket.question && (
                <p className="text-sm text-muted-foreground">
                  Question: {currentTicket.question}
                </p>
              )}
              {currentTicket.answer && (
                <p className="text-sm text-muted-foreground">
                  Answer: {currentTicket.answer}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {showModal && currentTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-lg bg-card shadow-xl">
            <div className="flex items-start justify-between p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {getStatusIcon(currentTicket.status)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Ticket Details
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ticket code:{" "}
                    <span className="font-mono text-foreground">
                      #{currentTicket.code}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-t p-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-foreground">
                    Status:
                  </span>
                  <span
                    className={`ml-2 text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(
                      currentTicket.status
                    )}`}
                  >
                    {currentTicket.status.replace("-", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">
                    Created:
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {new Date(currentTicket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">
                    Question:
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {currentTicket.question || "No question provided"}
                  </p>
                </div>
                {currentTicket.answer && (
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      Answer:
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {currentTicket.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
