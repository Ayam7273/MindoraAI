import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Play } from "lucide-react";

const CHIPS = ["Health", "Meditation", "Stress"];

const LIST = [
  { id: "1", title: "Indian Meditation", author: "Alan Watts", rating: "4.7", lessons: 10 },
  { id: "2", title: "Mindfulness 101", author: "Dr. Hannibal Lecter", rating: "4.8", lessons: 10 },
];

export function CoursesScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="bg-[var(--color-accent-orange)] px-3 pb-4 pt-[max(0.5rem,env(safe-area-inset-top))] text-white">
        <div className="mb-3 flex items-center gap-2">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20" aria-label="Back">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold">Our Courses</h1>
          <span className="w-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CHIPS.map((c) => (
            <span key={c} className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
              {c}
            </span>
          ))}
        </div>
      </header>

      <div className="-mt-4 px-3">
        <Link to="/resources/course/featured" className="relative mb-4 block overflow-hidden rounded-2xl shadow-lg">
          <div className="h-44 bg-gradient-to-br from-emerald-200 to-teal-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white">
              <Play className="h-7 w-7 fill-current" />
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <p className="text-lg font-bold">Gratefulness in Nature</p>
            <p className="text-xs text-white/80">Featured course</p>
          </div>
        </Link>

        <h2 className="mb-2 text-sm font-bold text-[#3B2A1A]">All Courses</h2>
        <ul className="space-y-2">
          {LIST.map((c) => (
            <li key={c.id}>
              <Link to={`/resources/course/${c.id}`} className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3">
                <div className="h-12 w-12 shrink-0 rounded-full bg-[var(--color-bg-secondary)]" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#3B2A1A]">{c.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {c.author} · ⭐ {c.rating} · {c.lessons} lessons
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
