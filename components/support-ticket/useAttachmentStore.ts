import { create } from "zustand";

interface AttachmentStore {
  attachments: File[];
  setAttachments: (attachments: File[]) => void;
  addAttachment: (attachment: File) => void;
  removeAttachment: (attachment: File) => void;
  clearAttachments: () => void;
}

export const useAttachmentStore = create<AttachmentStore>((set) => ({
  attachments: [],
  setAttachments: (attachments) => set({ attachments }),
  addAttachment: (attachment) =>
    set((state) => ({ attachments: [...state.attachments, attachment] })),
  removeAttachment: (attachment) =>
    set((state) => ({
      attachments: state.attachments.filter((a) => a !== attachment),
    })),
  clearAttachments: () => set({ attachments: [] }),
}));
