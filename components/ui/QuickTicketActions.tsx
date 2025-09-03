"use client";

import React from "react";
import { Plus, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";

interface QuickTicketActionsProps {
  onQuickAction?: (action: string) => void;
  className?: string;
}

export default function QuickTicketActions({ 
  onQuickAction, 
  className = "" 
}: QuickTicketActionsProps) {
  const actions = [
    {
      id: "create",
      label: "New Ticket",
      icon: Plus,
      href: "/create-ticket",
      color: "text-primary",
    },
    {
      id: "recent",
      label: "Recent Tickets",
      icon: Clock,
      href: "/ticket-track",
      color: "text-secondary",
    },
    {
      id: "chat",
      label: "Start Chat",
      icon: MessageSquare,
      href: "#",
      color: "text-accent",
    },
  ];

  return (
    <div className={`flex gap-2 ${className}`}>
      {actions.map((action) => (
        <Link
          key={action.id}
          href={action.href}
          onClick={() => onQuickAction?.(action.id)}
          className="group flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <action.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${action.color}`} />
          <span>{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
