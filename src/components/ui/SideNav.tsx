import {
  BarChart2,
  BookOpen,
  Brain,
  Heart,
  Home,
  Leaf,
  MessageCircle,
  Moon,
  Smile,
  User,
  Wind,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { shouldHideBottomNav } from "@/lib/navPaths";

const NAV_ITEMS = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/chatbot", icon: MessageCircle, label: "AI Chat" },
  { to: "/mood", icon: Smile, label: "Mood" },
  { to: "/journal", icon: BookOpen, label: "Journal" },
  { to: "/stress", icon: Brain, label: "Stress" },
  { to: "/sleep", icon: Moon, label: "Sleep" },
  { to: "/mindful", icon: Wind, label: "Mindfulness" },
  { to: "/resources/coping", icon: Heart, label: "Coping Toolkit" },
  { to: "/mindora-score", icon: BarChart2, label: "Progress" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function SideNav() {
  const location = useLocation();

  if (shouldHideBottomNav(location.pathname)) return null;

  return (
    <aside
      className={cn(
        "fixed bottom-0 left-0 top-0 z-40 hidden w-60 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex",
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-[var(--color-border)] px-5">
        <Leaf className="h-5 w-5 text-[var(--color-accent-green)]" strokeWidth={1.75} />
        <span className="text-base font-bold text-[var(--color-primary)]">Mindora</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5 px-3">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/home"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--color-accent-green-light)] text-[var(--color-accent-green)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-primary)]",
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-[var(--color-border)] px-5 py-4">
        <p className="text-[10px] text-[var(--color-text-muted)]">
          Mindora is not a substitute for professional mental health care.
        </p>
      </div>
    </aside>
  );
}
