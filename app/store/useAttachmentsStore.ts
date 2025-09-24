import { create } from "zustand";

interface AttachmentsState {
  attachments: Record<string, Array<string>>;
  setAttachments: (attachments: Record<string, Array<string>>) => void;
  appendAttachments: (attachments: Record<string, Array<string>>) => void;
  setAttachmentsForFaq: (faqId: string, attachmentUrls: Array<string>) => void;
  addAttachmentToFaq: (faqId: string, attachmentUrl: string) => void;
  removeAttachmentFromFaq: (faqId: string, attachmentUrl: string) => void;
  removeAllAttachmentsForFaq: (faqId: string) => void;
  clearAllAttachments: () => void;
  getAttachmentsForFaq: (faqId: string) => Array<string>;
  hasAttachmentsForFaq: (faqId: string) => boolean;
  getAttachmentCountForFaq: (faqId: string) => number;
  getAllFaqIdsWithAttachments: () => Array<string>;
  searchAttachments: (query: string) => Record<string, Array<string>>;
}

export const useAttachmentsStore = create<AttachmentsState>((set, get) => ({
  attachments: {},

  setAttachments: (attachments) => set({ attachments }),

  appendAttachments: (attachments) =>
    set((state) => ({
      attachments: {
        ...state.attachments,
        ...attachments,
      },
    })),

  setAttachmentsForFaq: (faqId, attachmentUrls) =>
    set((state) => ({
      attachments: {
        ...state.attachments,
        [faqId]: attachmentUrls,
      },
    })),

  addAttachmentToFaq: (faqId, attachmentUrl) =>
    set((state) => {
      const currentAttachments = state.attachments[faqId] || [];
      // Avoid duplicates
      if (currentAttachments.includes(attachmentUrl)) {
        return state;
      }
      return {
        attachments: {
          ...state.attachments,
          [faqId]: [...currentAttachments, attachmentUrl],
        },
      };
    }),

  removeAttachmentFromFaq: (faqId, attachmentUrl) =>
    set((state) => {
      const currentAttachments = state.attachments[faqId] || [];
      const updatedAttachments = currentAttachments.filter(
        (url) => url !== attachmentUrl
      );

      // If no attachments left for this FAQ, remove the key entirely
      if (updatedAttachments.length === 0) {
        const { [faqId]: removed, ...rest } = state.attachments;
        return { attachments: rest };
      }

      return {
        attachments: {
          ...state.attachments,
          [faqId]: updatedAttachments,
        },
      };
    }),

  removeAllAttachmentsForFaq: (faqId) =>
    set((state) => {
      const { [faqId]: removed, ...rest } = state.attachments;
      return { attachments: rest };
    }),

  clearAllAttachments: () => set({ attachments: {} }),

  getAttachmentsForFaq: (faqId) => {
    const state = get();
    return state.attachments[faqId] || [];
  },

  hasAttachmentsForFaq: (faqId) => {
    const state = get();
    const attachments = state.attachments[faqId];
    return attachments && attachments.length > 0;
  },

  getAttachmentCountForFaq: (faqId) => {
    const state = get();
    const attachments = state.attachments[faqId];
    return attachments ? attachments.length : 0;
  },

  getAllFaqIdsWithAttachments: () => {
    const state = get();
    return Object.keys(state.attachments).filter(
      (faqId) => state.attachments[faqId] && state.attachments[faqId].length > 0
    );
  },

  searchAttachments: (query) => {
    const state = get();
    const searchTerm = query.toLowerCase();
    const filteredAttachments: Record<string, Array<string>> = {};

    Object.entries(state.attachments).forEach(([faqId, urls]) => {
      const matchingUrls = urls.filter((url) =>
        url.toLowerCase().includes(searchTerm)
      );
      if (matchingUrls.length > 0) {
        filteredAttachments[faqId] = matchingUrls;
      }
    });

    return filteredAttachments;
  },
}));
