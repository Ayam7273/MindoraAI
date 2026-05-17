import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, SearchX, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet } from "@/components/ui/Sheet";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/utils";
import { ARTICLES } from "@/lib/articles";

interface SearchResult {
  title: string;
  section: string;
  href: string;
  color: string;
}

// All searchable items in the app
const ALL_ITEMS: SearchResult[] = [
  // Articles
  ...ARTICLES.map((a) => ({
    title: a.title,
    section: `Articles · ${a.category}`,
    href: `/resources/article/${a.id}`,
    color: "bg-[var(--color-accent-green-light)]",
  })),
  // App screens
  { title: "Mood Tracker", section: "Mood", href: "/mood", color: "bg-[var(--color-accent-orange-light)]" },
  { title: "Log Your Mood", section: "Mood", href: "/mood/set", color: "bg-[var(--color-accent-orange-light)]" },
  { title: "Mood History", section: "Mood", href: "/mood/history", color: "bg-[var(--color-accent-orange-light)]" },
  { title: "AI Suggestions for Mood", section: "Mood", href: "/mood/suggestions", color: "bg-[var(--color-accent-orange-light)]" },
  { title: "Journal", section: "Journal", href: "/journal", color: "bg-[var(--color-bg-secondary)]" },
  { title: "New Journal Entry", section: "Journal", href: "/journal/new", color: "bg-[var(--color-bg-secondary)]" },
  { title: "Sleep Quality", section: "Sleep", href: "/sleep", color: "bg-[#ede8f5]" },
  { title: "Sleep Schedule", section: "Sleep", href: "/sleep/schedule", color: "bg-[#ede8f5]" },
  { title: "Sleep Insights", section: "Sleep", href: "/sleep/insights", color: "bg-[#ede8f5]" },
  { title: "Stress Level", section: "Stress", href: "/stress", color: "bg-[var(--color-accent-orange-light)]" },
  { title: "Log Stress Entry", section: "Stress", href: "/stress/log", color: "bg-[var(--color-accent-orange-light)]" },
  { title: "Mindful Hours", section: "Mindfulness", href: "/mindful", color: "bg-[var(--color-accent-green-light)]" },
  { title: "Breathing Exercise", section: "Mindfulness", href: "/mindful/exercise", color: "bg-[var(--color-accent-green-light)]" },
  { title: "AI Chatbot", section: "Chatbot", href: "/chatbot", color: "bg-[#3d3d3d]/10" },
  { title: "New Conversation", section: "Chatbot", href: "/chatbot/new", color: "bg-[#3d3d3d]/10" },
  { title: "Mindora Score", section: "Progress", href: "/mindora-score", color: "bg-[var(--color-accent-green-light)]" },
  { title: "Community", section: "Community", href: "/community", color: "bg-[#ede8f5]" },
  { title: "Resources", section: "Resources", href: "/resources", color: "bg-[var(--color-accent-green-light)]" },
  { title: "Recommended Playlist", section: "Resources", href: "/resources/courses", color: "bg-[#1DB954]/10" },
  { title: "Profile Settings", section: "Profile", href: "/profile", color: "bg-[var(--color-border)]" },
  { title: "Help Center", section: "Help", href: "/help", color: "bg-[var(--color-border)]" },
  { title: "Coping Toolkit", section: "Resources", href: "/resources/coping", color: "bg-[var(--color-accent-green-light)]" },
];

const CATEGORIES = ["All", "Articles", "Mood", "Journal", "Sleep", "Stress", "Mindfulness", "Chatbot", "Progress"];

export function SearchScreen() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("All");
  const [includeAI, setIncludeAI] = useState(true);

  const trimmed = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmed) return [];
    return ALL_ITEMS.filter((item) => {
      const matchesCat =
        activeCat === "All" ||
        item.section.toLowerCase().includes(activeCat.toLowerCase());
      const matchesQ =
        item.title.toLowerCase().includes(trimmed) ||
        item.section.toLowerCase().includes(trimmed);
      return matchesCat && matchesQ;
    });
  }, [trimmed, activeCat]);

  const suggestions = useMemo(() => {
    if (trimmed.length < 2) return [];
    const seen = new Set<string>();
    return ALL_ITEMS.filter((item) => {
      const match = item.title.toLowerCase().startsWith(trimmed) || item.section.toLowerCase().startsWith(trimmed);
      if (match && !seen.has(item.title)) {
        seen.add(item.title);
        return true;
      }
      return false;
    }).slice(0, 5);
  }, [trimmed]);

  const showSuggestions = trimmed.length >= 2 && trimmed.length < 4 && suggestions.length > 0 && results.length === 0;
  const showResults = trimmed.length >= 2 && results.length > 0;
  const showNotFound = trimmed.length >= 2 && results.length === 0 && suggestions.length === 0;

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28 lg:pb-8">
      {/* Header with search bar */}
      <header className="bg-[#3B2A1A] px-3 pb-4 pt-[max(0.5rem,env(safe-area-inset-top))] text-white lg:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"
            aria-label="Back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="shrink-0 text-sm font-semibold">Search</h1>
          <div className="relative flex min-w-0 flex-1 items-center rounded-full bg-white/95 px-3 py-2 text-[#3B2A1A]">
            <Search className="mr-2 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" strokeWidth={1.75} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Mindora…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]"
              autoFocus
            />
            {q && (
              <button type="button" onClick={() => setQ("")} className="shrink-0 p-1 text-[var(--color-text-muted)]" aria-label="Clear">
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </button>
            )}
            <button type="button" onClick={() => setFilterOpen(true)} className="shrink-0 p-1" aria-label="Filter">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCat(c)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                activeCat === c ? "bg-white text-[#3B2A1A]" : "bg-white/20 text-white/80",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="relative px-4 pt-4 lg:px-6">
        {/* Empty state */}
        {!trimmed && (
          <div className="py-10 text-center">
            <Search className="mx-auto h-10 w-10 text-[var(--color-border)]" strokeWidth={1.25} />
            <p className="mt-4 text-sm font-medium text-[var(--color-text-secondary)]">
              Search across articles, features, and more
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Type at least 2 characters to see results
            </p>
          </div>
        )}

        {/* Autocomplete suggestions */}
        {showSuggestions && (
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-md">
            {suggestions.map((s) => (
              <button
                key={s.href}
                type="button"
                onClick={() => setQ(s.title)}
                className="flex w-full items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 text-left text-sm last:border-0 hover:bg-[var(--color-bg-secondary)]"
              >
                <Search className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
                <span className="flex-1 text-[var(--color-text-primary)]">{s.title}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">{s.section}</span>
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {showResults && (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--color-primary)]">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{q.trim()}&rdquo;
              </p>
            </div>
            <ul className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
              {results.map((r) => (
                <li key={r.href}>
                  <button
                    type="button"
                    onClick={() => navigate(r.href)}
                    className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3 text-left shadow-sm transition-colors hover:bg-[var(--color-bg-secondary)]"
                  >
                    <span className={cn("h-10 w-10 shrink-0 rounded-xl", r.color)} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--color-primary)]">{r.title}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">{r.section}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-[var(--color-text-muted)]" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Not found */}
        {showNotFound && (
          <div className="flex flex-col items-center py-12 text-center">
            <SearchX className="h-16 w-16 text-[var(--color-border)]" strokeWidth={1.25} />
            <h2 className="mt-6 text-xl font-bold text-[#3B2A1A]">No results found</h2>
            <p className="mt-2 max-w-xs text-sm text-[var(--color-text-secondary)]">
              No matches for &ldquo;{q.trim()}&rdquo;. Try a different keyword or browse the categories above.
            </p>
          </div>
        )}
      </div>

      {/* Filter sheet */}
      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Search Results">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-[var(--color-text-muted)]">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCat(c)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold",
                    activeCat === c
                      ? "bg-[var(--color-accent-orange)] text-white"
                      : "bg-[var(--color-bg-secondary)] text-[var(--color-primary)]",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <Toggle label="Include AI suggestions" checked={includeAI} onChange={(e) => setIncludeAI(e.target.checked)} />
          <button
            type="button"
            className="w-full rounded-full bg-[var(--color-primary)] py-3 text-sm font-semibold text-white"
            onClick={() => setFilterOpen(false)}
          >
            Apply Filters
          </button>
        </div>
      </Sheet>
    </div>
  );
}
