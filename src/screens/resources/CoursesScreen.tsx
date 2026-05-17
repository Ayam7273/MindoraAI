import { useNavigate } from "react-router-dom";
import { ChevronLeft, Music2 } from "lucide-react";

export function CoursesScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="bg-[#3B2A1A] px-4 pb-6 pt-[max(0.5rem,env(safe-area-inset-top))] text-white">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10" aria-label="Back">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-1 items-center gap-2">
            <Music2 className="h-5 w-5 text-[#1DB954]" strokeWidth={1.75} />
            <h1 className="text-lg font-bold">Recommended Playlist</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-white/70">Mindora's curated mental wellness music</p>
      </header>

      <div className="space-y-6 px-4 pt-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl shadow-lg">
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

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <h2 className="text-sm font-bold text-[var(--color-primary)]">Why Music Matters for Mental Health</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Music directly influences the brain's limbic system — the emotional core responsible for mood, motivation, and stress response. Listening to carefully selected music can reduce cortisol levels, slow heart rate, and activate the parasympathetic nervous system, creating a physiological state conducive to calm, focus, and emotional processing.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            This playlist has been curated with mental wellness in mind — featuring ambient, acoustic, and mindful tracks that support meditation, journalling, breathing exercises, and restful wind-down routines. Listen whenever you need to reset.
          </p>
        </div>
      </div>
    </div>
  );
}
