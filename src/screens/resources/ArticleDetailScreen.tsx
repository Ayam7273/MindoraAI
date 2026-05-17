import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Clock, Eye, Star } from "lucide-react";
import { ARTICLES } from "@/lib/articles";

export function ArticleDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = ARTICLES.find((a) => a.id === id) ?? ARTICLES[0];

  return (
    <div className="min-h-dvh bg-[#FAF8F4]">
      {/* Header */}
      <header className="sticky top-0 z-30 flex shrink-0 items-center gap-2 bg-[#3B2A1A] px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-white">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 truncate text-center text-sm font-bold pr-10">{article.category}</h1>
      </header>

      {/* Desktop: two-column layout */}
      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-0">
        {/* Main article content */}
        <div className="overflow-y-auto">
          {/* Hero image */}
          <div className="relative h-56 w-full overflow-hidden sm:h-72 lg:h-80">
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F4]/90 via-transparent to-transparent" />
          </div>

          <div className="px-4 pb-12 pt-4 lg:px-8 lg:pb-16">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--color-accent-green-light)] px-3 py-0.5 text-[11px] font-bold text-[var(--color-accent-green)]">
                {article.category}
              </span>
              <span className="rounded-full bg-[var(--color-bg-secondary)] px-3 py-0.5 text-[11px] font-bold text-[var(--color-text-secondary)]">
                {article.tag}
              </span>
            </div>

            {/* Title */}
            <h2
              className="mt-3 text-2xl font-bold leading-tight text-[#3B2A1A] lg:text-3xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {article.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {article.subtitle}
            </p>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]" />
                {article.rating}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {article.views} views
              </span>
            </div>

            {/* Author */}
            <div className="mt-5 flex items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-border)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-green-light)] text-sm font-bold text-[var(--color-accent-green)]">
                M
              </div>
              <div>
                <p className="font-semibold text-[#3B2A1A]">{article.author}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Verified Wellness Writer</p>
              </div>
            </div>

            {/* Introduction */}
            <div className="mt-6">
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] lg:text-base">
                {article.intro}
              </p>
            </div>

            {/* Sections */}
            {article.sections.map((s, i) => (
              <section key={i} className="mt-7">
                <h3 className="text-base font-bold text-[#3B2A1A] lg:text-lg">{s.heading}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)] lg:text-base">
                  {s.body}
                </p>
              </section>
            ))}
          </div>
        </div>

        {/* Desktop sidebar: related articles */}
        <div className="hidden border-l border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-8 lg:block">
          <h3 className="mb-4 text-sm font-bold text-[var(--color-primary)]">More Articles</h3>
          <ul className="space-y-3">
            {ARTICLES.filter((a) => a.id !== article.id).slice(0, 6).map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/resources/article/${a.id}`)}
                  className="flex w-full items-start gap-3 rounded-[var(--radius-lg)] p-2 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={a.image}
                      alt={a.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.style.background = "var(--color-bg-secondary)";
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase text-[var(--color-accent-green)]">{a.category}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-[var(--color-primary)]">{a.title}</p>
                    <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{a.readTime}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
