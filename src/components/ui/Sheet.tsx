import type { CSSProperties, ReactNode } from "react";
import { useEffect } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { cn } from "@/lib/utils";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /** Max height for sheet panel (e.g. filter panels). */
  maxHeight?: string;
}

export function Sheet({ open, onClose, title, children, className, maxHeight = "85vh" }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const swipeHandlers = useSwipeable({
    onSwipedDown: (e) => {
      if (e.absY > 40) onClose();
    },
    delta: 30,
    trackTouch: true,
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 64 || info.velocity.y > 400) onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close sheet"
            className="fixed inset-0 z-[60] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby={title ? "sheet-title" : undefined}
            className={cn(
              "fixed bottom-0 left-1/2 z-[70] flex w-full max-w-[430px] -translate-x-1/2 flex-col rounded-t-[var(--radius-xl)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]",
              className,
            )}
            style={{ maxHeight, touchAction: "none" } as CSSProperties}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 380 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.55 }}
            onDragEnd={onDragEnd}
          >
            <div {...swipeHandlers} className="flex shrink-0 flex-col items-center pt-2">
              <div
                className="h-1 w-8 shrink-0 rounded-full bg-[var(--color-border-strong)]"
                style={{ width: 32, height: 4 }}
                aria-hidden
              />
              {title ? (
                <h2
                  id="sheet-title"
                  className="w-full shrink-0 px-4 pb-2 pt-3 text-center text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]"
                >
                  {title}
                </h2>
              ) : null}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1">
              {children}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
