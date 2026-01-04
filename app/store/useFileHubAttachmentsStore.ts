import { FileHubAttachment } from "@/utils/api/generated";
import { create } from "zustand";

interface FileHubAttachmentsStore {
  attachments: FileHubAttachment[];

  // Basic CRUD operations
  setAttachments: (attachments: FileHubAttachment[]) => void;
  addAttachment: (attachment: FileHubAttachment) => void;
  addAttachments: (attachments: FileHubAttachment[]) => void;
  updateAttachment: (id: string, updates: Partial<FileHubAttachment>) => void;
  upsertAttachment: (attachment: FileHubAttachment) => void;
  removeAttachment: (id: string) => void;
  removeAttachments: (ids: string[]) => void;
  clearAllAttachments: () => void;

  // Query operations
  getAttachmentById: (id: string) => FileHubAttachment | undefined;
  getAttachmentsByTargetId: (targetId: string) => FileHubAttachment[];

  // Utility operations
  hasAttachment: (id: string) => boolean;
  getAttachmentCount: () => number;
  getTotalSize: () => number;
  searchAttachments: (query: string) => FileHubAttachment[];
  filterAttachments: (
    predicate: (attachment: FileHubAttachment) => boolean
  ) => FileHubAttachment[];

  // Bulk operations
  removeAttachmentsByTargetId: (targetId: string) => void;
  updateAttachmentsByTargetId: (
    targetId: string,
    updates: Partial<FileHubAttachment>
  ) => void;
}

export const useFileHubAttachmentsStore = create<FileHubAttachmentsStore>(
  (set, get) => ({
    attachments: [],

    // Set all attachments (replaces existing)
    setAttachments: (attachments) => set({ attachments }),

    // Add a single attachment (avoids duplicates by ID)
    addAttachment: (attachment) =>
      set((state) => {
        const exists = state.attachments.some((a) => a.id === attachment.id);
        if (exists) {
          return state;
        }
        return {
          attachments: [...state.attachments, attachment],
        };
      }),

    // Add multiple attachments (avoids duplicates by ID)
    addAttachments: (attachments) =>
      set((state) => {
        const existingIds = new Set(state.attachments.map((a) => a.id));
        const newAttachments = attachments.filter(
          (a) => !existingIds.has(a.id)
        );
        return {
          attachments: [...state.attachments, ...newAttachments],
        };
      }),

    // Update an attachment by ID
    updateAttachment: (id, updates) =>
      set((state) => ({
        attachments: state.attachments.map((attachment) =>
          attachment.id === id ? { ...attachment, ...updates } : attachment
        ),
      })),

    // Upsert an attachment by ID
    upsertAttachment: (attachment) =>
      set((state) => {
        const exists = state.attachments.some((a) => a.id === attachment.id);
        if (exists) {
          return {
            attachments: state.attachments.map((a) =>
              a.id === attachment.id ? attachment : a
            ),
          };
        }
        return {
          attachments: [...state.attachments, attachment],
        };
      }),

    // Remove a single attachment by ID
    removeAttachment: (id) =>
      set((state) => ({
        attachments: state.attachments.filter(
          (attachment) => attachment.id !== id
        ),
      })),

    // Remove multiple attachments by IDs
    removeAttachments: (ids) =>
      set((state) => {
        const idsSet = new Set(ids);
        return {
          attachments: state.attachments.filter(
            (attachment) => !idsSet.has(attachment.id)
          ),
        };
      }),

    // Clear all attachments
    clearAllAttachments: () => set({ attachments: [] }),

    // Get attachment by ID
    getAttachmentById: (id) => {
      const state = get();
      return state.attachments.find((attachment) => attachment.id === id);
    },

    // Get attachments by targetId
    getAttachmentsByTargetId: (targetId) => {
      const state = get();
      return state.attachments.filter(
        (attachment) => attachment.targetId === targetId
      );
    },

    // Check if attachment exists
    hasAttachment: (id) => {
      const state = get();
      return state.attachments.some((attachment) => attachment.id === id);
    },

    // Get total count of attachments
    getAttachmentCount: () => {
      const state = get();
      return state.attachments.length;
    },

    // Get total size of all attachments
    getTotalSize: () => {
      const state = get();
      return state.attachments.reduce(
        (total, attachment) => total + attachment.size,
        0
      );
    },

    // Search attachments by query (searches in originalName, filename, and type)
    searchAttachments: (query) => {
      const state = get();
      const searchTerm = query.toLowerCase();
      return state.attachments.filter(
        (attachment) =>
          attachment.originalName.toLowerCase().includes(searchTerm) ||
          attachment.filename.toLowerCase().includes(searchTerm)
      );
    },

    // Filter attachments by custom predicate
    filterAttachments: (predicate) => {
      const state = get();
      return state.attachments.filter(predicate);
    },

    // Remove all attachments for a specific targetId
    removeAttachmentsByTargetId: (targetId) =>
      set((state) => ({
        attachments: state.attachments.filter(
          (attachment) => attachment.targetId !== targetId
        ),
      })),

    // Update all attachments for a specific targetId
    updateAttachmentsByTargetId: (targetId, updates) =>
      set((state) => ({
        attachments: state.attachments.map((attachment) =>
          attachment.targetId === targetId
            ? { ...attachment, ...updates }
            : attachment
        ),
      })),
  })
);
