"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { SupportedLanguage } from "@/types/translation";
import { useLocalesStore } from "@/app/store/useLocalesStore";
import { TRANSLATIONS_MAP } from "@/constants/translations";
import { useLangStore } from "@/app/store/useLangStore";

export function LanguageSelector() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang: currentLang, setLang: setCurrentLang } = useLangStore();
  const localesRoot = useLocalesStore((state) => state.locales);

  useEffect(() => {
    // Get current language from cookie
    const savedLang = Cookies.get("lang") as SupportedLanguage;
    if (savedLang && Object.keys(TRANSLATIONS_MAP).includes(savedLang)) {
      setCurrentLang(savedLang);
    }
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    Cookies.set("lang", lang, { expires: 365 }); // Set cookie for 1 year
    setIsOpen(false);
    router.refresh(); // Reload the page
  };

  const getFlagPath = (lang: SupportedLanguage) => {
    return `/locales/flags/${lang}.webp`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        aria-label={localesRoot.ui?.select_language || "Select language"}
      >
        <Image
          src={getFlagPath(currentLang)}
          alt={`${TRANSLATIONS_MAP[currentLang]} flag`}
          width={20}
          height={15}
          className="rounded-sm"
        />
        <span className="text-sm font-medium">
          {TRANSLATIONS_MAP[currentLang]}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="py-1">
            {Object.entries(TRANSLATIONS_MAP).map(([lang, name]) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang as SupportedLanguage)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted transition-colors ${
                  currentLang === lang ? "bg-muted" : ""
                }`}
              >
                <Image
                  src={getFlagPath(lang as SupportedLanguage)}
                  alt={`${name} flag`}
                  width={20}
                  height={15}
                  className="rounded-sm"
                />
                <span className="text-sm">{name}</span>
                {currentLang === lang && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
