import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useProfile } from "@/hooks/useProfile";
import { useUiStore } from "@/store/uiStore";

/**
 * After auth: require assessment, then profile setup, before main app routes.
 */
export function OnboardingGuard() {
  const location = useLocation();
  const sessionReady = useUiStore((s) => s.sessionReady);
  const userId = useUiStore((s) => s.user?.id);
  const { data: profile, isLoading } = useProfile(userId);
  const { pathname } = location;

  if (!sessionReady || !userId) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#FAF8F4]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#FAF8F4]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!profile?.assessment_complete) {
    if (pathname === "/assessment") return <Outlet />;
    return <Navigate to="/assessment" replace />;
  }

  if (!profile?.profile_setup_complete) {
    if (pathname === "/profile-setup") return <Outlet />;
    return <Navigate to="/profile-setup" replace />;
  }

  if (pathname === "/assessment" || pathname === "/profile-setup") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
