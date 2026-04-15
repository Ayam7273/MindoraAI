import { ChevronRight, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Toggle } from "@/components/ui/Toggle";
import { useFreudScore } from "@/hooks/useFreudScore";
import { useUpdateProfile } from "@/hooks/useProfile";
import { signOut } from "@/services/authService";
import { useUiStore } from "@/store/uiStore";

function Row({ to, label, danger }: { to: string; label: string; danger?: boolean }) {
  return (
    <Link to={to} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-[var(--color-border)]">
      <span className={`text-sm font-medium ${danger ? "text-red-600" : "text-[#3B2A1A]"}`}>{label}</span>
      <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
    </Link>
  );
}

export function ProfileScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const displayName = useUiStore((s) => s.profile?.full_name ?? "Friend");
  const darkMode = useUiStore((s) => s.darkMode);
  const setDarkMode = useUiStore((s) => s.setDarkMode);
  const isPro = Boolean(useUiStore((s) => s.profile?.is_pro));
  const updateProfile = useUpdateProfile();
  const { score } = useFreudScore(userId);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-4">
      <div className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-[var(--color-border)]">
        <div className="h-16 w-16 rounded-full bg-[var(--color-bg-secondary)] text-center text-2xl leading-[4rem]">👤</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold text-[#3B2A1A]">{displayName}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{isPro ? "Pro" : "Basic"} plan</p>
        </div>
        <ProgressRing value={score / 100} size={56} stroke={5} progressColor="var(--color-accent-green)" />
      </div>

      <section className="mt-6 space-y-2">
        <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">General</p>
        <Row to="/settings/notifications" label="Notifications" />
        <Row to="/settings/personal" label="Personal Information" />
        <Row to="/settings/personal" label="Emergency Contact" />
      </section>

      <section className="mt-6 space-y-2">
        <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Preferences</p>
        <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-[var(--color-border)]">
          <Toggle
            label="Dark Mode"
            checked={darkMode}
            onChange={(e) => {
              const on = e.target.checked;
              setDarkMode(on);
              if (userId) void updateProfile.mutateAsync({ id: userId, patch: { dark_mode: on } });
            }}
          />
        </div>
        <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-[var(--color-border)]">
          <Toggle
            label="Pro (demo unlock)"
            checked={isPro}
            onChange={(e) => {
              if (userId) void updateProfile.mutateAsync({ id: userId, patch: { is_pro: e.target.checked } });
            }}
          />
        </div>
        <Row to="/settings/language" label="Language" />
      </section>

      <section className="mt-6 space-y-2">
        <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Social</p>
        <Row to="/invite" label="Invite Friends" />
        <Row to="/feedback" label="Submit Feedback" />
      </section>

      <section className="mt-6 space-y-2">
        <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Security &amp; Privacy</p>
        <Row to="/settings/security" label="Security" />
        <Row to="/help" label="Help Center" />
      </section>

      <section className="mt-6">
        <Link
          to="/not-allowed"
          className="flex items-center justify-center rounded-xl bg-[var(--color-accent-orange-light)] py-3 text-sm font-bold text-red-700 ring-1 ring-[var(--color-accent-orange)]/30"
        >
          Close Account
        </Link>
      </section>

      <Button
        type="button"
        variant="secondary"
        fullWidth
        className="mt-6 rounded-full"
        onClick={async () => {
          await signOut();
          useUiStore.getState().resetEphemeralSession();
          navigate("/", { replace: true });
        }}
      >
        <span className="inline-flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Log Out
        </span>
      </Button>
    </div>
  );
}
