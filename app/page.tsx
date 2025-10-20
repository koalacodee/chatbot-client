import PageClient from "./PageClient";
import { CommonLocales } from "@/public/locales/common/map";
import { getLocale } from "@/lib/utils";
import { SupportedLanguage } from "@/types/translation";

export default async function Home() {
  const lang = await getLocale();
  const locales: { default: CommonLocales } = await import(
    `@/public/locales/common/${lang}.json`
  );

  return (
    <PageClient locales={locales.default} lang={lang as SupportedLanguage} />
  );
}
