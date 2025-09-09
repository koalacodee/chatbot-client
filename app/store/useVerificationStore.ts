import { create } from "zustand";

interface VerificationStore {
  ticketId: string | null;
  guestEmail: string | null;
  verifiedTicketData: {
    ticketId: string;
    code: string;
    subject: string;
    status: string;
    guestName: string;
    guestPhone: string;
    guestEmail: string;
  } | null;
  isVerifying: boolean;
  verificationCode: string;
  verificationError: string | null;
  isVerified: boolean;
  setTicketData: (ticketId: string, guestEmail: string) => void;
  setVerifiedTicketData: (
    ticketData: VerificationStore["verifiedTicketData"]
  ) => void;
  setIsVerifying: (verifying: boolean) => void;
  setVerificationCode: (code: string) => void;
  setVerificationError: (error: string | null) => void;
  setIsVerified: (verified: boolean) => void;
  resetVerification: () => void;
}

export const useVerificationStore = create<VerificationStore>((set) => ({
  ticketId: null,
  guestEmail: null,
  verifiedTicketData: null,
  isVerifying: false,
  verificationCode: "",
  verificationError: null,
  isVerified: false,

  setTicketData: (ticketId, guestEmail) =>
    set(() => ({
      ticketId,
      guestEmail,
    })),
  setIsVerifying: (verifying) => set(() => ({ isVerifying: verifying })),
  setVerificationCode: (code) => set(() => ({ verificationCode: code })),
  setVerificationError: (error) => set(() => ({ verificationError: error })),
  setIsVerified: (verified) => set(() => ({ isVerified: verified })),

  setVerifiedTicketData: (ticketData) =>
    set(() => ({ verifiedTicketData: ticketData })),
  resetVerification: () =>
    set(() => ({
      ticketId: null,
      guestEmail: null,
      verifiedTicketData: null,
      isVerifying: false,
      verificationCode: "",
      verificationError: null,
      isVerified: false,
    })),
}));
