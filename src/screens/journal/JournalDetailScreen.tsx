import { useEffect, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { CrisisBanner } from "@/components/ui/CrisisBanner";
import { detectCrisisLanguage } from "@/lib/crisisDetection";
import { useUiStore } from "@/store/uiStore";

const BODY =
  "Today I had a hard time concentrating. I was very worried about making mistakes, very angry! Some phrases feel heavier than others.";

export function JournalDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const crisisProtocolActive = useUiStore((s) => s.crisisMode);
  const activateCrisisProtocol = useUiStore((s) => s.setCrisisMode);

  const textCrisis = useMemo(() => detectCrisisLanguage(BODY), []);
  const showCrisis = id === "critical" || textCrisis || crisisProtocolActive;

  useEffect(() => {
    if (textCrisis && !crisisProtocolActive) activateCrisisProtocol(true);
  }, [textCrisis, crisisProtocolActive, activateCrisisProtocol]);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="min-w-0 flex-1 truncate px-2 text-center text-base font-semibold text-[var(--color-primary)]">
          Feeling Bad Again! 😡
        </h1>
        <span className="w-10" />
      </header>

      <div className="px-4 pt-4">
        {showCrisis ? <CrisisBanner /> : null}

        <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-relaxed text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
          {BODY.split(" ").map((word, i) => {
            const highlight = ["worried", "angry", "heavier"].some((k) => word.toLowerCase().includes(k));
            return (
              <span key={i} className={highlight ? "border-b-2 border-[var(--color-accent-orange)]" : undefined}>
                {word}{" "}
              </span>
            );
          })}
        </article>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button type="button" variant="danger" className="rounded-full text-sm">
            Delete
          </Button>
          <Button type="button" variant="secondary" className="rounded-full text-sm">
            Edit
          </Button>
          <Button type="button" variant="secondary" className="rounded-full text-sm">
            Share
          </Button>
          <Button type="button" variant="ghost" className="rounded-full text-sm ring-1 ring-[var(--color-border)]">
            AI Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
