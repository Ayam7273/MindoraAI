import { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";

const LESSONS = Array.from({ length: 10 }, (_, i) => ({
  title: `Lesson ${i + 1}`,
  dur: "~10 Min",
  r: "4.5",
}));

export function CourseDetailScreen() {
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
        <h1 className="flex-1 text-center text-sm font-bold">Course</h1>
        <span className="w-10" />
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold ring-1 ring-[var(--color-border)]">
            Course
          </span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold ring-1 ring-[var(--color-border)]">
            Free
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-bold text-[#3B2A1A]">Mindfulness 101</h2>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Course #{id} · ⭐ 4.8 · 10 lessons · ~2h
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[var(--color-bg-secondary)]" />
          <div className="flex-1">
            <p className="font-semibold text-[#3B2A1A]">Mindora Team</p>
          </div>
          <Button type="button" variant="secondary" className="rounded-full text-xs">
            Follow +
          </Button>
        </div>

        <div className="mt-4 h-40 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400" />
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          A gentle introduction to posture, attention, and returning kindly to the breath when the
          mind wanders. All lessons are fully available to every Mindora user.
        </p>

        <h3 className="mt-6 text-sm font-bold text-[#3B2A1A]">Curriculum · {LESSONS.length} Lessons</h3>
        <ul className="mt-2 space-y-2">
          {LESSONS.map((l, idx) => (
            <li
              key={`${l.title}-${idx}`}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3"
            >
              <Play className="h-4 w-4 text-[var(--color-accent-green)]" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#3B2A1A]">{l.title}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {l.dur} · ⭐ {l.r}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <Link
          to={`/resources/play/${id ?? "1"}`}
          className="mt-4 block text-center text-sm font-bold text-[var(--color-accent-green)]"
        >
          Open course player →
        </Link>
      </div>
    </div>
  );
}
