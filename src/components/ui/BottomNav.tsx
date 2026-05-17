import { BarChart2, Home, MessageCircle, Plus, User } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { shouldHideBottomNav } from "@/lib/navPaths";
import { cn } from "@/lib/utils";

const itemClass =
  "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-medium leading-tight transition-colors";
const itemActive = "text-[var(--color-accent-green)]";
const itemInactive = "text-[var(--color-text-muted)]";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  if (shouldHideBottomNav(location.pathname)) {
    return null;
  }

  const fabAction = () => {
    if (location.pathname.startsWith("/journal")) {
      navigate("/journal/new");
      return;
    }
    if (location.pathname.startsWith("/chatbot")) {
      navigate("/chatbot/new");
      return;
    }
    if (location.pathname.startsWith("/community")) {
      navigate("/community/new-post");
      return;
    }
    navigate("/mood/set");
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 z-50 w-full lg:hidden",
        "border-t border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]",
      )}
      style={{
        minHeight: "calc(64px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        paddingTop: "10px",
      }}
      aria-label="Main navigation"
    >
      <div className="relative flex items-end justify-between px-1">
        <NavLink
          to="/home"
          end
          className={({ isActive }) => cn(itemClass, isActive ? itemActive : itemInactive)}
        >
          <Home className="h-6 w-6 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="max-w-full truncate">Home</span>
        </NavLink>

        <NavLink
          to="/community"
          className={({ isActive }) => cn(itemClass, isActive ? itemActive : itemInactive)}
        >
          <MessageCircle className="h-6 w-6 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="max-w-full truncate">Community</span>
        </NavLink>

        <div className="w-14 shrink-0" aria-hidden />

        <NavLink
          to="/mindora-score"
          className={({ isActive }) => cn(itemClass, isActive ? itemActive : itemInactive)}
        >
          <BarChart2 className="h-6 w-6 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="max-w-full truncate">Stats</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => cn(itemClass, isActive ? itemActive : itemInactive)}
        >
          <User className="h-6 w-6 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="max-w-full truncate">Profile</span>
        </NavLink>

        <button
          type="button"
          onClick={fabAction}
          className={cn(
            "absolute left-1/2 top-0 z-10 flex h-[3.25rem] w-[3.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white",
            "bg-[var(--color-accent-orange)] ring-4 ring-[var(--color-surface)] transition-transform active:scale-95",
          )}
          style={{ boxShadow: "0 8px 22px rgba(224, 122, 58, 0.5)" }}
          aria-label="Quick action"
        >
          <Plus className="h-8 w-8" strokeWidth={2.25} />
        </button>
      </div>
    </nav>
  );
}
