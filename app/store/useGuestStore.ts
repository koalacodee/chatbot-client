import { RegisterGuest201ResponseDataGuest } from "@/utils/api/generated";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Import the type from the generated models

interface GuestStore {
  // Guest data
  guest: RegisterGuest201ResponseDataGuest | null;

  // Loading states
  isLoading: boolean;
  isRegistering: boolean;

  // Actions
  setGuest: (guest: RegisterGuest201ResponseDataGuest) => void;
  clearGuest: () => void;
  setLoading: (loading: boolean) => void;
  setRegistering: (registering: boolean) => void;

  // Computed properties
  isAuthenticated: boolean;
  guestId: string | null;
  guestEmail: string | null;
  guestName: string | null;
}

export const useGuestStore = create<GuestStore>()(
  persist(
    (set, get) => ({
      // Initial state
      guest: null,
      isLoading: false,
      isRegistering: false,

      // Actions
      setGuest: (guest) => set({ guest, isAuthenticated: true }),
      clearGuest: () => set({ guest: null, isAuthenticated: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      setRegistering: (registering) => set({ isRegistering: registering }),

      // Computed properties with getters
      get isAuthenticated() {
        return get().guest !== null;
      },
      get guestId() {
        return get().guest?.id || null;
      },
      get guestEmail() {
        return get().guest?.email || null;
      },
      get guestName() {
        return get().guest?.name || null;
      },
    }),
    {
      name: "guest-store",
      partialize: (state) => ({
        guest: state.guest,
      }),
    }
  )
);
