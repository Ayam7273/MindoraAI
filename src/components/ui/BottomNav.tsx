import { Bot, Home, MessageCircle, User, Wind } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { shouldHideBottomNav } from "@/lib/navPaths";
import { cn } from "@/lib/utils";

const itemClass =
  "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-medium leading-tight transition-colors";
const itemActive = "text-[var(--color-accent-green)]";
const itemInactive = "text-[var(--color-text-muted)]";

export function BottomNav() {
  const location = useLocation();

  if (shouldHideBottomNav(location.pathname)) {
    return null;
  }

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
      <div className="flex items-end justify-between px-1">
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

        <NavLink
          to="/chatbot"
          className={({ isActive }) => cn(itemClass, isActive ? itemActive : itemInactive)}
        >
          <Bot className="h-6 w-6 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="max-w-full truncate">AI Chat</span>
        </NavLink>

        <NavLink
          to="/mindful"
          className={({ isActive }) => cn(itemClass, isActive ? itemActive : itemInactive)}
        >
          <Wind className="h-6 w-6 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="max-w-full truncate">Mindfulness</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => cn(itemClass, isActive ? itemActive : itemInactive)}
        >
          <User className="h-6 w-6 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="max-w-full truncate">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
