import { useSwipeable } from "react-swipeable";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/ui/BottomNav";
import { SideNav } from "@/components/ui/SideNav";
import { PageTransition } from "@/components/ui/PageTransition";
import { shouldHideBottomNav } from "@/lib/navPaths";
import { cn } from "@/lib/utils";

const TAB_ROOTS = new Set(["/home", "/community", "/mindora-score", "/profile"]);

export function MainLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hideNav = shouldHideBottomNav(pathname);

  const swipeHandlers = useSwipeable({
    onSwipedRight: (e) => {
      if (TAB_ROOTS.has(pathname)) return;
      if (e.absX > 48) {
        navigate(-1);
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: false,
    delta: 40,
  });

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar — visible on lg+ */}
      <SideNav />

      {/* Main content */}
      <div
        {...swipeHandlers}
        className={cn(
          "flex min-h-dvh flex-1 flex-col",
          // On desktop the sidebar takes 240px; offset the content
          "lg:ml-60",
          // Bottom padding only when bottom nav is visible (mobile)
          !hideNav && "pb-[calc(76px+env(safe-area-inset-bottom,0px))] lg:pb-0",
          hideNav && "pb-4",
        )}
      >
        <div className="w-full flex-1">
          <PageTransition />
        </div>
      </div>

      {/* Bottom nav — hidden on lg+ */}
      <BottomNav />
    </div>
  );
}
