import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

const EXTRA = Array.from({ length: 12 }, (_, i) => (
  <p key={i} className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
    Section {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
    ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </p>
));

export function ArticleDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-dvh max-h-dvh flex-col bg-[#FAF8F4]">
      <header className="flex shrink-0 items-center bg-[#3B2A1A] px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-[#FAF8F4]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-sm font-bold">Article</h1>
        <span className="w-10" />
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold ring-1 ring-[var(--color-border)]">
            Article
          </span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold ring-1 ring-[var(--color-border)]">
            Mindfulness
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-bold text-[#3B2A1A]">What is Life? Why?</h2>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Article #{id} · 4.6 ★ · 12k views
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[var(--color-bg-secondary)]" />
          <div className="flex-1">
            <p className="font-semibold text-[#3B2A1A]">Mindora Team</p>
            <p className="text-xs text-[var(--color-text-muted)]">Author</p>
          </div>
          <Button type="button" variant="secondary" className="rounded-full text-xs">
            Follow +
          </Button>
        </div>

        <section className="mt-6">
          <h3 className="text-sm font-bold text-[#3B2A1A]">Introduction</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            This article explores meaning, purpose, and self-compassion — concepts that often travel
            together on the journey toward mental well-being. Full content is always available to
            all Mindora users.
          </p>
          <div className="mt-4 h-40 w-full rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100" />
        </section>
        {EXTRA}
      </div>
    </div>
  );
}
