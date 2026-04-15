import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";

const CATS = ["Stress", "Anxiety", "Health", "Status", "Sleep", "Mood"];

const LIST = [
  { id: "1", title: "Will meditation help you escape the rat race?", author: "Johann Liebert", views: "3.2k" },
  { id: "2", title: "Breathing patterns for anxious mornings", author: "Mindora AI", views: "1.1k" },
];

export function ArticlesScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="bg-[var(--color-accent-green-light)] px-3 pb-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div className="mb-3 flex items-center gap-2">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60" aria-label="Back">
            <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Our Articles</h1>
          <span className="w-10" />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
          <input placeholder="Search articles…" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-3 py-3">
        {CATS.map((c) => (
          <span key={c} className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full bg-white text-[10px] font-bold ring-1 ring-[var(--color-border)]">
            {c.slice(0, 2)}
          </span>
        ))}
      </div>

      <div className="px-3">
        <h2 className="mb-2 text-sm font-bold text-[#3B2A1A]">All Articles</h2>
        <ul className="space-y-3">
          {LIST.map((a) => (
            <li key={a.id}>
              <Link to={`/resources/article/${a.id}`} className="flex overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[var(--color-border)]">
                <div className="h-28 w-28 shrink-0 bg-gradient-to-br from-stone-100 to-stone-300" />
                <div className="flex min-w-0 flex-1 flex-col justify-center p-3">
                  <p className="line-clamp-2 text-sm font-bold text-[#3B2A1A]">{a.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {a.author} · {a.views} views · ♡
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
