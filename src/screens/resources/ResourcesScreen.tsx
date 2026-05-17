import { Link } from "react-router-dom";
import { ChevronRight, Music2 } from "lucide-react";
import { ARTICLES } from "@/lib/articles";

export function ResourcesScreen() {
  const featured = ARTICLES[9]; // Hope in the Storm as featured
  const articles = ARTICLES;

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="bg-[#3B2A1A] px-4 pb-6 pt-[max(0.5rem,env(safe-area-inset-top))] text-white lg:px-8">
        <h1 className="text-xl font-bold">Resources</h1>
        <p className="mt-1 text-sm text-white/70">
          <span className="font-semibold text-white">10</span> Articles &middot;{" "}
          <span className="font-semibold text-white">Recommended Playlist</span>
        </p>
      </header>

      <div className="space-y-8 px-4 pt-6 lg:px-8">
        {/* Featured article */}
        <Link
          to={`/resources/article/${featured.id}`}
          className="block overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-[var(--color-border)] lg:flex lg:h-52"
        >
          <div className="relative h-40 overflow-hidden lg:h-full lg:w-72 lg:shrink-0">
            <img
              src={featured.image}
              alt={featured.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).parentElement!.classList.add("bg-gradient-to-br", "from-amber-100", "to-orange-200");
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="p-4 lg:flex lg:flex-col lg:justify-center">
            <p className="text-[10px] font-bold uppercase text-[var(--color-accent-green)]">Featured</p>
            <p className="mt-1 text-base font-bold text-[#3B2A1A] lg:text-lg">{featured.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-secondary)]">{featured.subtitle}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent-orange)]">
              Read more <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </Link>

        {/* All 10 articles */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#3B2A1A]">Mindful Articles</h2>
            <Link to="/resources/articles" className="text-xs font-semibold text-[var(--color-accent-green)]">
              See all
            </Link>
          </div>
          {/* Mobile: horizontal scroll; Desktop: 2-column grid */}
          <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0">
            {articles.map((a) => (
              <Link
                key={a.id}
                to={`/resources/article/${a.id}`}
                className="min-w-[9rem] shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[var(--color-border)] lg:min-w-0 lg:flex lg:items-center lg:gap-3 lg:p-2"
              >
                <div className="h-24 w-full overflow-hidden lg:h-14 lg:w-14 lg:shrink-0 lg:rounded-lg">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).parentElement!.classList.add("bg-gradient-to-br", "from-green-50", "to-emerald-100");
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="p-2 lg:p-0 lg:min-w-0">
                  <p className="text-[10px] font-bold text-[var(--color-accent-green)]">{a.category}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-[#3B2A1A]">{a.title}</p>
                  <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{a.readTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recommended Playlist */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Music2 className="h-4 w-4 text-[#1DB954]" strokeWidth={1.75} />
            <h2 className="text-sm font-bold text-[#3B2A1A]">Recommended Playlist</h2>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-md">
            <iframe
              title="Mindora Recommended Playlist"
              style={{ borderRadius: "16px" }}
              src="https://open.spotify.com/embed/playlist/77AOjGgwOTmcDiH15lARCh?utm_source=generator&theme=0"
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
