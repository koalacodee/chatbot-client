import { create } from "zustand";
import { CreateSupportTicket201ResponseData } from "@/utils/api/generated/models/create-support-ticket201-response-data";

interface SubmittedTicketStore {
  submittedTicket: CreateSupportTicket201ResponseData | null;
  setSubmittedTicket: (
    ticket: CreateSupportTicket201ResponseData | null
  ) => void;
}

export const useSubmittedTicketStore = create<SubmittedTicketStore>((set) => ({
  submittedTicket: null,

  setSubmittedTicket: (ticket) =>
    set(() => ({
      submittedTicket: ticket,
    })),
}));
