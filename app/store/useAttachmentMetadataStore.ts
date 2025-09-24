import { create } from "zustand";

export interface AttachmentMetadata {
  fileType: string;
  originalName: string;
  sizeInBytes: number;
  expiryDate: string;
  contentType: string;
}

interface AttachmentMetadataState {
  metadata: Record<string, AttachmentMetadata>;
  setMetadata: (metadata: Record<string, AttachmentMetadata>) => void;
  appendMetadata: (metadata: Record<string, AttachmentMetadata>) => void;
  setMetadataForAttachment: (
    attachmentKey: string,
    metadata: AttachmentMetadata
  ) => void;
  addMetadata: (attachmentKey: string, metadata: AttachmentMetadata) => void;
  removeMetadata: (attachmentKey: string) => void;
  removeMultipleMetadata: (attachmentKeys: string[]) => void;
  clearAllMetadata: () => void;
  getMetadataForAttachment: (
    attachmentKey: string
  ) => AttachmentMetadata | undefined;
  hasMetadataForAttachment: (attachmentKey: string) => boolean;
  getAllAttachmentKeys: () => string[];
  getMetadataByFileType: (
    fileType: string
  ) => Record<string, AttachmentMetadata>;
  getMetadataByContentType: (
    contentType: string
  ) => Record<string, AttachmentMetadata>;
  getExpiredAttachments: () => Record<string, AttachmentMetadata>;
  getAttachmentsBySizeRange: (
    minBytes: number,
    maxBytes: number
  ) => Record<string, AttachmentMetadata>;
  searchMetadata: (query: string) => Record<string, AttachmentMetadata>;
  getTotalSize: () => number;
  getAttachmentCount: () => number;
}

export const useAttachmentMetadataStore = create<AttachmentMetadataState>(
  (set, get) => ({
    metadata: {},

    setMetadata: (metadata) => set({ metadata }),

    appendMetadata: (metadata) =>
      set((state) => ({
        metadata: {
          ...state.metadata,
          ...metadata,
        },
      })),

    setMetadataForAttachment: (attachmentKey, metadata) =>
      set((state) => ({
        metadata: {
          ...state.metadata,
          [attachmentKey]: metadata,
        },
      })),

    addMetadata: (attachmentKey, metadata) =>
      set((state) => ({
        metadata: {
          ...state.metadata,
          [attachmentKey]: metadata,
        },
      })),

    removeMetadata: (attachmentKey) =>
      set((state) => {
        const { [attachmentKey]: removed, ...rest } = state.metadata;
        return { metadata: rest };
      }),

    removeMultipleMetadata: (attachmentKeys) =>
      set((state) => {
        const newMetadata = { ...state.metadata };
        attachmentKeys.forEach((key) => {
          delete newMetadata[key];
        });
        return { metadata: newMetadata };
      }),

    clearAllMetadata: () => set({ metadata: {} }),

    getMetadataForAttachment: (attachmentKey) => {
      const state = get();
      return state.metadata[attachmentKey];
    },

    hasMetadataForAttachment: (attachmentKey) => {
      const state = get();
      return attachmentKey in state.metadata;
    },

    getAllAttachmentKeys: () => {
      const state = get();
      return Object.keys(state.metadata);
    },

    getMetadataByFileType: (fileType) => {
      const state = get();
      const filtered: Record<string, AttachmentMetadata> = {};

      Object.entries(state.metadata).forEach(([key, metadata]) => {
        if (metadata.fileType === fileType) {
          filtered[key] = metadata;
        }
      });

      return filtered;
    },

    getMetadataByContentType: (contentType) => {
      const state = get();
      const filtered: Record<string, AttachmentMetadata> = {};

      Object.entries(state.metadata).forEach(([key, metadata]) => {
        if (metadata.contentType === contentType) {
          filtered[key] = metadata;
        }
      });

      return filtered;
    },

    getExpiredAttachments: () => {
      const state = get();
      const now = new Date();
      const expired: Record<string, AttachmentMetadata> = {};

      Object.entries(state.metadata).forEach(([key, metadata]) => {
        const expiryDate = new Date(metadata.expiryDate);
        if (expiryDate < now) {
          expired[key] = metadata;
        }
      });

      return expired;
    },

    getAttachmentsBySizeRange: (minBytes, maxBytes) => {
      const state = get();
      const filtered: Record<string, AttachmentMetadata> = {};

      Object.entries(state.metadata).forEach(([key, metadata]) => {
        if (
          metadata.sizeInBytes >= minBytes &&
          metadata.sizeInBytes <= maxBytes
        ) {
          filtered[key] = metadata;
        }
      });

      return filtered;
    },

    searchMetadata: (query) => {
      const state = get();
      const searchTerm = query.toLowerCase();
      const filtered: Record<string, AttachmentMetadata> = {};

      Object.entries(state.metadata).forEach(([key, metadata]) => {
        if (
          metadata.originalName.toLowerCase().includes(searchTerm) ||
          metadata.fileType.toLowerCase().includes(searchTerm) ||
          metadata.contentType.toLowerCase().includes(searchTerm)
        ) {
          filtered[key] = metadata;
        }
      });

      return filtered;
    },

    getTotalSize: () => {
      const state = get();
      return Object.values(state.metadata).reduce(
        (total, metadata) => total + metadata.sizeInBytes,
        0
      );
    },

    getAttachmentCount: () => {
      const state = get();
      return Object.keys(state.metadata).length;
    },
  })
);
