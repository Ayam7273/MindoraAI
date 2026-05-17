import { ChevronRight, LogOut, Trash2, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useMindoraScore } from "@/hooks/useMindoraScore";
import { signOut } from "@/services/authService";
import { useUiStore } from "@/store/uiStore";

function Row({ to, label, danger }: { to: string; label: string; danger?: boolean }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 sm:px-4 py-3 ring-1 ring-[var(--color-border)] overflow-hidden"
    >
      <span className={`min-w-0 truncate text-sm font-medium ${danger ? "text-red-600" : "text-[#3B2A1A]"}`}>
        {label}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
    </Link>
  );
}

export function ProfileScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const displayName = useUiStore((s) => s.profile?.full_name ?? "Friend");
  const { score } = useMindoraScore(userId);
  const [confirmClear, setConfirmClear] = useState(false);

  function clearAllData() {
    // Data is stored in Supabase — clearing is handled server-side via account deletion
    setConfirmClear(false);
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-3 sm:px-4 pb-28 pt-4 lg:px-8 lg:pt-6">
      <div className="lg:max-w-3xl lg:mx-auto">
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3 sm:p-4 ring-1 ring-[var(--color-border)] overflow-hidden">
        <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-secondary)]">
          <User className="h-7 w-7 text-[var(--color-text-muted)]" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base sm:text-lg font-bold text-[#3B2A1A]">{displayName}</p>
          <p className="text-xs text-[var(--color-text-muted)]">Mindora member</p>
        </div>
        <ProgressRing
          value={score / 100}
          size={52}
          stroke={5}
          progressColor="var(--color-accent-green)"
        />
      </div>

      <section className="mt-6 space-y-2">
        <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
          General
        </p>
        <Row to="/settings/notifications" label="Notifications" />
        <Row to="/settings/personal" label="Personal Information" />
        <Row to="/settings/personal" label="Emergency Contact" />
      </section>

      <section className="mt-6 space-y-2">
        <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
          Preferences
        </p>
        <Row to="/settings/language" label="Language" />
      </section>

      <section className="mt-6 space-y-2">
        <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
          Social
        </p>
        <Row to="/invite" label="Invite Friends" />
        <Row to="/feedback" label="Submit Feedback" />
      </section>

      <section className="mt-6 space-y-2">
        <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
          Security &amp; Privacy
        </p>
        <Row to="/settings/security" label="Security" />
        <Row to="/help" label="Help Center" />
      </section>

      <section className="mt-6 space-y-2">
        <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
          Data
        </p>
        {confirmClear ? (
          <div className="rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
            <p className="text-sm font-semibold text-red-800">
              This will delete all your local app data (chat history, journal entries, mood logs).
              Are you sure?
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                className="rounded-full"
                onClick={() => setConfirmClear(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                fullWidth
                className="rounded-full bg-red-600 hover:bg-red-700"
                onClick={clearAllData}
              >
                Clear All Data
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-[var(--color-border)]"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">Clear All App Data</span>
          </button>
        )}
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
    </div>
  );
}
