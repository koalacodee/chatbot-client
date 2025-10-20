import { CommonLocales } from "@/public/locales/common/map";
import { create } from "zustand";

interface LocalesStore {
  locales: Partial<CommonLocales>;
  setLocales: (locales: CommonLocales) => void;
}

export const useLocalesStore = create<LocalesStore>((set) => ({
  locales: {},
  setLocales: (locales) => set({ locales }),
}));
