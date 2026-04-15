import { Link } from "react-router-dom";
import { ChevronRight, Play } from "lucide-react";

const ARTICLES = [
  { id: "1", title: "Mental Health in the workplace", cat: "Mental Health" },
  { id: "2", title: "Stress and recovery cycles", cat: "Stress" },
];

const COURSES = [
  { id: "1", title: "Mindfulness 101", author: "Dr. Hannibal Lecter", rating: "4.8", views: "12k" },
  { id: "2", title: "Gratefulness in Nature", author: "Alan Watts", rating: "4.6", views: "8k" },
];

export function ResourcesScreen() {
  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="rounded-b-3xl bg-[#3B2A1A] px-4 pb-6 pt-[max(0.5rem,env(safe-area-inset-top))] text-[#FAF8F4]">
        <h1 className="text-xl font-bold">Our Resources</h1>
        <p className="mt-1 text-sm text-white/70">
          <span className="font-semibold text-white">1.8k</span> Articles · <span className="font-semibold text-white">512</span> Courses
        </p>
      </header>

      <div className="-mt-4 space-y-6 px-4">
        <Link to="/resources/article/featured" className="block overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-[var(--color-border)]">
          <div className="h-36 bg-gradient-to-br from-amber-100 to-orange-200" />
          <div className="p-4">
            <p className="text-xs font-bold uppercase text-[var(--color-accent-green)]">Featured</p>
            <p className="mt-1 text-base font-bold text-[#3B2A1A]">Mindora AI: Your Pocket Companion for Mental Wellness</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent-orange)]">
              Read more <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </Link>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#3B2A1A]">Our Articles</h2>
            <Link to="/resources/articles" className="text-xs font-semibold text-[var(--color-accent-green)]">
              See all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {ARTICLES.map((a) => (
              <Link
                key={a.id}
                to={`/resources/article/${a.id}`}
                className="min-w-[10rem] max-w-[10rem] shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[var(--color-border)]"
              >
                <div className="h-24 bg-gradient-to-br from-green-50 to-emerald-100" />
                <div className="p-2">
                  <span className="text-[10px] font-bold text-[var(--color-accent-green)]">{a.cat}</span>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold text-[#3B2A1A]">{a.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#3B2A1A]">Our Courses</h2>
            <Link to="/resources/courses" className="text-xs font-semibold text-[var(--color-accent-orange)]">
              See all
            </Link>
          </div>
          <ul className="space-y-2">
            {COURSES.map((c) => (
              <li key={c.id}>
                <Link to={`/resources/course/${c.id}`} className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent-green-light)] text-[var(--color-accent-green)]">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#3B2A1A]">{c.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {c.author} · ⭐ {c.rating} · {c.views} views
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
