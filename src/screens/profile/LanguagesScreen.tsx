import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useState } from "react";

const LANGS = ["Italian", "Arabic", "American", "British", "Irish", "European"];

export function LanguagesScreen() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Japan (JP)");
  const [bilingual, setBilingual] = useState(false);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Languages</h1>
        <span className="w-10" />
      </header>

      <button type="button" onClick={() => setActive("Japan (JP)")} className="mb-4 w-full rounded-2xl bg-[var(--color-accent-green-light)] p-4 text-left ring-2 ring-[var(--color-accent-green)]">
        <p className="text-sm font-bold text-[#3B2A1A]">Japan (JP)</p>
        <p className="text-xs text-[var(--color-text-muted)]">Currently selected</p>
      </button>

      <Toggle label="Bilingual Feature NEW" checked={bilingual} onChange={(e) => setBilingual(e.target.checked)} />

      <ul className="mt-6 space-y-2">
        {LANGS.map((l) => (
          <li key={l}>
            <button
              type="button"
              onClick={() => setActive(l)}
              className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-left text-sm font-medium ring-1 ring-[var(--color-border)]"
            >
              {l}
              <span className={`h-4 w-4 rounded-full border-2 ${active === l ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green)]" : "border-[var(--color-border)]"}`} />
            </button>
          </li>
        ))}
      </ul>

      <Button type="button" fullWidth className="mt-8 rounded-full" onClick={() => navigate(-1)}>
        Save Settings
      </Button>
    </div>
  );
}
