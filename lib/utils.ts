import { RTL_LANGUAGES } from "@/constants/translations";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getLocale() {
  const { cookies, headers } = await import("next/headers");
  const headerList = await headers();
  const cookieList = await cookies();
  const lang =
    cookieList.get("lang")?.value ??
    headerList.get("accept-language")?.split(",")[0]?.split("-")[0];
  return lang;
}

export function isRTL(lang: string) {
  return RTL_LANGUAGES.has(lang);
}
