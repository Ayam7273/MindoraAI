import { useState } from "react";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LANGUAGES } from "@/lib/i18n";
import { useLanguageStore, useT } from "@/store/languageStore";
import type { LangCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguagesScreen() {
  const navigate = useNavigate();
  const currentLang = useLanguageStore((s) => s.lang);
  const setLang = useLanguageStore((s) => s.setLang);
  const t = useT();
  const [selected, setSelected] = useState<LangCode>(currentLang);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLang(selected);
    setSaved(true);
    setTimeout(() => navigate(-1), 600);
  };

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      {/* Header */}
      <header className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]"
          aria-label={t("action.back")}
        >
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">
          {t("lang.title")}
        </h1>
        <span className="w-10 shrink-0" />
      </header>

      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
        Select your preferred language. The app interface will update immediately.
      </p>

      <ul className="space-y-2">
        {LANGUAGES.map((lang) => {
          const isSelected = selected === lang.code;
          const isCurrent = currentLang === lang.code;
          return (
            <li key={lang.code}>
              <button
                type="button"
                onClick={() => setSelected(lang.code)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all",
                  isSelected
                    ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)] shadow-sm"
                    : "border-[var(--color-border)] bg-white hover:bg-[var(--color-bg-secondary)]",
                )}
              >
                {/* Flag */}
                <span className="text-2xl" aria-hidden>{lang.flag}</span>

                {/* Name */}
                <div className="flex-1">
                  <p className="font-bold text-[#3B2A1A]">{lang.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{lang.englishLabel}</p>
                </div>

                {/* Current tag */}
                {isCurrent && !isSelected && (
                  <span className="rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">
                    {t("lang.currentlySelected")}
                  </span>
                )}

                {/* Selected check */}
                {isSelected && (
                  <CheckCircle2
                    className="h-5 w-5 shrink-0 text-[var(--color-accent-green)]"
                    strokeWidth={2}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* RTL note for Arabic */}
      {selected === "ar" && (
        <div className="mt-4 rounded-xl bg-[var(--color-accent-orange-light)] px-4 py-3 text-sm text-[var(--color-accent-orange)]">
          <p className="font-semibold">Arabic (RTL)</p>
          <p className="mt-0.5 text-xs">
            The app layout will switch to right-to-left when you save.
          </p>
        </div>
      )}

      <button
        type="button"
        disabled={saved}
        onClick={handleSave}
        className={cn(
          "mt-8 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white transition-all",
          saved
            ? "bg-[var(--color-success)]"
            : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]",
        )}
      >
        {saved ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Saved!
          </>
        ) : (
          t("lang.saveLanguage")
        )}
      </button>
    </div>
  );
}
