import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import { ARTICLES } from "@/lib/articles";

const CATS = ["All", "Wellness", "Meditation", "Sleep", "Anxiety", "Recovery", "Peace", "Resilience", "Hope", "Community", "Mindfulness"];

export function ArticlesScreen() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const filtered = ARTICLES.filter((a) => {
    const matchesCat = activeCat === "All" || a.category === activeCat;
    const matchesQ = q.trim() === "" || a.title.toLowerCase().includes(q.toLowerCase()) || a.category.toLowerCase().includes(q.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="bg-[var(--color-accent-green-light)] px-3 pb-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div className="mb-3 flex items-center gap-2">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/60" aria-label="Back">
            <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Mindful Articles</h1>
          <span className="w-10 shrink-0" />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </header>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto px-3 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCat(c)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              activeCat === c
                ? "bg-[var(--color-accent-green)] text-white"
                : "bg-white text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="px-3 lg:px-6">
        <p className="mb-3 text-xs text-[var(--color-text-muted)]">{filtered.length} article{filtered.length !== 1 ? "s" : ""}</p>
        <ul className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {filtered.map((a) => (
            <li key={a.id}>
              <Link
                to={`/resources/article/${a.id}`}
                className="flex overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[var(--color-border)] transition-transform active:scale-[0.98]"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).parentElement!.classList.add("bg-gradient-to-br", "from-stone-100", "to-stone-300");
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-3">
                  <p className="text-[10px] font-bold uppercase text-[var(--color-accent-green)]">{a.category}</p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-bold text-[#3B2A1A]">{a.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {a.author} &middot; {a.readTime} &middot; {a.views} views
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
            No articles found for "{q}"
          </div>
        )}
      </div>
    </div>
  );
}
