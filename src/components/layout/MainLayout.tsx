import { useSwipeable } from "react-swipeable";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/ui/BottomNav";
import { PageTransition } from "@/components/ui/PageTransition";
import { shouldHideBottomNav } from "@/lib/navPaths";
import { cn } from "@/lib/utils";

/** Main tab roots: swipe-back disabled (stack root for each tab). */
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
    <>
      <div
        {...swipeHandlers}
        className={cn(
          "min-h-dvh",
          hideNav ? "pb-4" : "pb-[calc(100px+env(safe-area-inset-bottom,0px))]",
        )}
      >
        <PageTransition />
      </div>
      <BottomNav />
    </>
  );
}
