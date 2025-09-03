"use client";
import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface TicketConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ticketCode?: string;
  title?: string;
  description?: string;
}

export default function TicketConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  ticketCode,
  title = "Create Support Ticket",
  description = "Would you like to create a support ticket for this conversation?",
}: TicketConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-modal-title"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-[40]"></div>

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md rounded-lg bg-card shadow-xl z-[100]">
        <div className="flex items-start justify-between p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2
                id="ticket-modal-title"
                className="text-lg font-semibold text-foreground"
              >
                {title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
              {ticketCode && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Ticket code:{" "}
                  <span className="font-mono text-foreground">
                    {ticketCode}
                  </span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-3 border-t p-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
