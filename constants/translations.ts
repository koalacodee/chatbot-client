import { SupportedLanguage } from "@/types/translation";

export const TRANSLATIONS_MAP = {
  en: "English",
  ar: "Arabic",
  de: "German",
  es: "Spanish",
  fr: "French",
  ja: "Japanese",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
  tr: "Turkish",
} as const satisfies Record<SupportedLanguage, string>;

export const RTL_LANGUAGES: Set<string> = new Set([
  "ar", // Arabic
  "he", // Hebrew
  "fa", // Persian (Farsi)
  "ur", // Urdu
  "ps", // Pashto
  "sd", // Sindhi
  "ckb", // Central Kurdish (Sorani)
  "prs", // Dari (Afghan Persian)
  "yi", // Yiddish
]);
