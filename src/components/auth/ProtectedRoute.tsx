import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useUiStore } from "@/store/uiStore";

export function ProtectedRoute() {
  const session = useUiStore((s) => s.session);
  const sessionReady = useUiStore((s) => s.sessionReady);
  const location = useLocation();

  if (!sessionReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#FAF8F4]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
