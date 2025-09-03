import { create } from "zustand";
import { ViewAll200ResponseDataInner } from "../../utils/api/generated/models/view-all200-response-data-inner";

interface FaqsState {
  faqs: ViewAll200ResponseDataInner[];
  setFaqs: (faqs: ViewAll200ResponseDataInner[]) => void;
  addFaq: (faq: ViewAll200ResponseDataInner) => void;
  removeFaq: (id: string) => void;
  updateFaq: (
    id: string,
    updates: Partial<ViewAll200ResponseDataInner>
  ) => void;
  clearFaqs: () => void;
  getFaqById: (id: string) => ViewAll200ResponseDataInner | undefined;
  getFaqsByDepartmentId: (
    departmentId: string
  ) => ViewAll200ResponseDataInner[];
  searchFaqs: (query: string) => ViewAll200ResponseDataInner[];
}

export const useFaqsStore = create<FaqsState>((set, get) => ({
  faqs: [],

  setFaqs: (faqs) => set({ faqs }),

  addFaq: (faq) =>
    set((state) => ({
      faqs: [...state.faqs, faq],
    })),

  removeFaq: (id) =>
    set((state) => ({
      faqs: state.faqs.filter((faq) => faq.id !== id),
    })),

  updateFaq: (id, updates) =>
    set((state) => ({
      faqs: state.faqs.map((faq) =>
        faq.id === id ? { ...faq, ...updates } : faq
      ),
    })),

  clearFaqs: () => set({ faqs: [] }),

  getFaqById: (id) => {
    const state = get();
    return state.faqs.find((faq) => faq.id === id);
  },

  getFaqsByDepartmentId: (departmentId) => {
    const state = get();
    return state.faqs.filter((faq) => faq.departmentId === departmentId);
  },

  searchFaqs: (query) => {
    const state = get();
    const searchTerm = query.toLowerCase();
    return state.faqs.filter(
      (faq) =>
        faq.text?.toLowerCase().includes(searchTerm) ||
        faq.answer?.toLowerCase().includes(searchTerm)
    );
  },
}));
