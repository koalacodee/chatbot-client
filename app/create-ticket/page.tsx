"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "../../components/layout/PageLayout";
import CreateTicketForm from "../../components/ui/CreateTicketForm";
import { departmentService } from "@/utils/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTickets } from "../../hooks/useTickets";

export default function CreateTicketPage() {
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { createTicket, loading: ticketLoading } = useTickets();

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const depts = await departmentService.getDepartments();
        setDepartments(depts.map((dept) => ({ id: dept.id, name: dept.name })));
      } catch (error) {
        console.error("Failed to load departments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDepartments();
  }, []);

  const handleCreateTicket = async (data: {
    title: string;
    description: string;
    department: string;
    priority: string;
  }) => {
    try {
      const code = await createTicket({
        departmentId: data.department,
        question: data.description,
        description: data.description,
      });
      router.push("/ticket-track?code=" + code);
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

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

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Create Support Ticket
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill out the form below to create a new support ticket
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <CreateTicketForm
              departments={departments}
              onSubmit={handleCreateTicket}
              isLoading={ticketLoading}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
