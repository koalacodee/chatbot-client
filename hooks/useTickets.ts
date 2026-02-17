import { useState, useEffect, useCallback } from "react";
import { ticketService } from "../utils/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

// Types for ticket operations
interface CreateTicketData {
  departmentId: string;
  question: string;
  description?: string;
}

interface Ticket {
  id: string;
  code: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  question: string;
  answer?: string;
  description?: string;
}

export const useTickets = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [ticketCode, setTicketCode] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    };
    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Load saved ticket code from localStorage
  useEffect(() => {
    const savedTicketCode = localStorage.getItem("ticketCode");
    if (savedTicketCode) {
      setTicketCode(savedTicketCode);
    }
    setLoading(false);
  }, []);

  // Create a new ticket (handles both authenticated and guest)
  const createTicket = useCallback(
    async (ticketData: CreateTicketData) => {
      try {
        setLoading(true);
        setError(null);

        const code: string = isAuthenticated
          ? await ticketService.createTicket({
              departmentId: ticketData.departmentId,
              question: ticketData.question,
            })
          : await ticketService.createTicketGuest({
              departmentId: ticketData.departmentId,
              question: ticketData.question,
            });

        setTicketCode(code);
        localStorage.setItem("ticketCode", code);

        router.push(`/ticket-track?code=${code}`);

        return code;
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError
            ? err.response?.data?.message || "Failed to create ticket"
            : "An unexpected error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated],
  );

  // Track a ticket by code (handles both authenticated and guest)
  const trackTicket = useCallback(
    async (code: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = isAuthenticated
          ? await ticketService.trackTicket(code)
          : await ticketService.trackTicketGuest(code);

        const ticket: Ticket = {
          id: response.id,
          code: response.code,
          status: response.status,
          createdAt: new Date(response.createdAt),
          updatedAt: new Date(response.updatedAt),
          question: response.question,
          answer: response.answer,
        };

        setCurrentTicket(ticket);
        setTicketCode(code);
        localStorage.setItem("ticketCode", code);

        return ticket;
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError
            ? err.response?.data?.message || "Ticket not found"
            : "An unexpected error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated],
  );

  // Clear current ticket
  const clearCurrentTicket = useCallback(() => {
    setCurrentTicket(null);
    setTicketCode(null);
    setError(null);
    localStorage.removeItem("ticketCode");
  }, []);

  // Clear all tickets
  const clearTickets = useCallback(() => {
    setCurrentTicket(null);
    setTicketCode(null);
    setError(null);
    localStorage.removeItem("ticketCode");
  }, []);

  // Get ticket by code from local ticket

  // Update ticket status locally (for optimistic updates)
  const updateTicketStatus = useCallback(
    (code: string, newStatus: string) => {
      if (currentTicket?.code === code) {
        setCurrentTicket((prev) =>
          prev ? { ...prev, status: newStatus, updatedAt: new Date() } : null,
        );
      }
    },
    [currentTicket],
  );

  // Initialize tickets on mount
  useEffect(() => {
    const initializeTickets = async () => {
      const savedTicketCode = localStorage.getItem("ticketCode");
      if (savedTicketCode) {
        await trackTicket(savedTicketCode);
      }
    };

    if (isAuthenticated !== undefined) {
      initializeTickets();
    }
  }, [isAuthenticated, trackTicket]);

  return {
    loading,
    error,
    isAuthenticated,
    currentTicket,
    ticketCode,
    createTicket,
    trackTicket,
    clearCurrentTicket,
    clearTickets,
    updateTicketStatus,
  };
};
