"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";

interface QuickTicketInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  className?: string;
}

export default function QuickTicketInput({ 
  onSubmit, 
  placeholder = "Describe your issue...",
  className = "" 
}: QuickTicketInputProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(message.trim());
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          disabled={isSubmitting}
          aria-label="Quick ticket description"
        />
        <button
          type="submit"
          disabled={!message.trim() || isSubmitting}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
}
