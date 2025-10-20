import { SupportedLanguage } from "@/types/translation";
import { create } from "zustand";

interface LangStore {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
}

export const useLangStore = create<LangStore>((set) => ({
  lang: "en",
  setLang: (lang) => set({ lang }),
}));
