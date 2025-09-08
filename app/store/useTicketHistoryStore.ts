import { create } from 'zustand';
import { GetTicketHistory200ResponseDataTicketsInner } from '@/utils/api/generated';

interface TicketHistoryState {
  tickets: GetTicketHistory200ResponseDataTicketsInner[];
  loading: boolean;
  error: string | null;
  setTickets: (tickets: GetTicketHistory200ResponseDataTicketsInner[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearTickets: () => void;
}

export const useTicketHistoryStore = create<TicketHistoryState>((set) => ({
  tickets: [],
  loading: false,
  error: null,
  setTickets: (tickets) => set({ tickets }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearTickets: () => set({ tickets: [], error: null }),
}));
