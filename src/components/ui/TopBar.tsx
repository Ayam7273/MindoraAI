import type { ReactNode } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface TopBarProps {
  title: string;
  showBack?: boolean;
  /** Renders a search icon button on the right (before rightAction). */
  showSearch?: boolean;
  /** Custom right-side content (e.g. menu, filter). Rendered after search when both set. */
  rightAction?: ReactNode;
  onSearchClick?: () => void;
  className?: string;
}

export function TopBar({
  title,
  showBack = true,
  showSearch = false,
  rightAction,
  onSearchClick,
  className,
}: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "flex items-center gap-2 px-3 py-3 text-[var(--color-bg)]",
        "bg-[#3B2A1A]",
        className,
      )}
      style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
    >
      {showBack ? (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#FAF8F4] transition-colors hover:bg-white/10"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2} />
        </button>
      ) : (
        <span className="w-10 shrink-0" />
      )}

      <h1 className="min-w-0 flex-1 truncate text-center text-lg font-semibold text-[#FAF8F4]">
        {title}
      </h1>

      <div className="flex min-w-[2.5rem] shrink-0 items-center justify-end gap-1">
        {showSearch ? (
          <button
            type="button"
            onClick={onSearchClick}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#FAF8F4] transition-colors hover:bg-white/10"
            aria-label="Search"
          >
            <Search className="h-5 w-5" strokeWidth={2} />
          </button>
        ) : null}
        {rightAction}
      </div>
    </header>
  );
}
