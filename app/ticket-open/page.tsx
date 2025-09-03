"use client";
import React from "react";
import PageLayout from "../../components/layout/PageLayout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TicketOpenPage() {
  return (
    <PageLayout>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Ticket Open</h1>
          <p className="text-muted-foreground">
            This page is currently under development.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}