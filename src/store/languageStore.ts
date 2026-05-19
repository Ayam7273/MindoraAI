import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LangCode } from "@/lib/i18n";
import { LANGUAGES, translate } from "@/lib/i18n";

interface LanguageState {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang) => {
        set({ lang });
        applyLangToDocument(lang);
      },
    }),
    { name: "mindora-language" },
  ),
);

/** Apply lang/dir attributes to the HTML element so the whole app reflects the choice */
export function applyLangToDocument(lang: LangCode) {
  const meta = LANGUAGES.find((l) => l.code === lang);
  if (!meta) return;
  document.documentElement.lang = lang;
  document.documentElement.dir = meta.dir;
}

/** Convenience hook — returns a t() function scoped to the current language */
export function useT() {
  const lang = useLanguageStore((s) => s.lang);
  return (key: Parameters<typeof translate>[1]) => translate(lang, key);
}
