import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";

/**
 * Forward (PUSH): new screen from right, old exits left.
 * Back (POP): new screen from left, old exits right.
 */
export function PageTransition() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const forward = navigationType !== "POP";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={forward ? { x: "100%", opacity: 0.94 } : { x: "-32%", opacity: 0.94 }}
        animate={{ x: 0, opacity: 1 }}
        exit={forward ? { x: "-28%", opacity: 0.88 } : { x: "100%", opacity: 0.88 }}
        transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.26 }}
        className="min-h-0 flex-1"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
