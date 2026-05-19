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
  Users,
  Wind,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/store/languageStore";
import { shouldHideBottomNav } from "@/lib/navPaths";

import type { TranslationKey } from "@/lib/i18n";

type NavItem = { to: string; icon: LucideIcon; key: TranslationKey; matchPrefix?: string };
const NAV_ITEMS: NavItem[] = [
  { to: "/home", icon: Home, key: "nav.home" },
  { to: "/chatbot", icon: MessageCircle, key: "nav.aiChat" },
  { to: "/mood", icon: Smile, key: "nav.mood" },
  { to: "/journal", icon: BookOpen, key: "nav.journal" },
  { to: "/stress", icon: Brain, key: "nav.stress" },
  { to: "/sleep", icon: Moon, key: "nav.sleep" },
  { to: "/mindful", icon: Wind, key: "nav.mindfulness" },
  { to: "/community", icon: Users, key: "nav.community", matchPrefix: "/community" },
  { to: "/resources/coping", icon: Heart, key: "nav.copingToolkit" },
  { to: "/mindora-score", icon: BarChart2, key: "nav.progress" },
  { to: "/profile", icon: User, key: "nav.profile" },
];

export function SideNav() {
  const location = useLocation();
  const t = useT();

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
          {NAV_ITEMS.map(({ to, icon: Icon, key, matchPrefix }) => {
            const prefixActive = matchPrefix
              ? location.pathname.startsWith(matchPrefix)
              : false;
            return (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/home"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive || prefixActive
                        ? "bg-[var(--color-accent-green-light)] text-[var(--color-accent-green)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-primary)]",
                    )
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                  <span>{t(key)}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[var(--color-border)] px-5 py-4">
        <p className="text-[10px] text-[var(--color-text-muted)]">
          {t("misc.disclaimer")}
        </p>
      </div>
    </aside>
  );
}
