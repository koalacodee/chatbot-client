import { SupportedLanguage } from "@/types/translation";
import { FAqTranslation, ViewAll200Response } from "@/utils/api/generated";
import { create } from "zustand";

type FAQTranslation = ViewAll200Response["data"]["translations"];

interface FaqTranslationStore {
  faqTranslations: FAQTranslation;
  setFaqTranslations: (faqTranslations: FAQTranslation) => void;
  getFaqTranslationsForLanguage: (
    faqId: string,
    lang: SupportedLanguage
  ) => FAqTranslation[];
  getFaqTranslations: (faqId: string) => FAqTranslation[];
}

export const useFaqTranslationStore = create<FaqTranslationStore>(
  (set, get) => ({
    faqTranslations: {},
    setFaqTranslations: (faqTranslations) => set({ faqTranslations }),
    getFaqTranslationsForLanguage(faqId, lang) {
      const state = get();
      return (
        state.faqTranslations[faqId]?.filter(
          (translation) => translation.lang === lang
        ) ?? []
      );
    },
    getFaqTranslations(faqId) {
      const state = get();
      return state.faqTranslations[faqId] ?? [];
    },
  })
);
