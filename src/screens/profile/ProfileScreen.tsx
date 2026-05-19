import { Check, ChevronRight, Copy, LogOut, Trash2, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useMindoraScore } from "@/hooks/useMindoraScore";
import { signOut } from "@/services/authService";
import { useUiStore } from "@/store/uiStore";
import { useT } from "@/store/languageStore";

function Row({ to, label, danger }: { to: string; label: string; danger?: boolean }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-2 overflow-hidden rounded-xl bg-white px-3 py-3 ring-1 ring-[var(--color-border)] sm:px-4"
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
  const t = useT();
  const userId = useUiStore((s) => s.user?.id);
  const displayName = useUiStore((s) => s.profile?.full_name ?? "Friend");
  const { score } = useMindoraScore(userId);
  const [confirmClear, setConfirmClear] = useState(false);
  const [copied, setCopied] = useState(false);

  function clearAllData() {
    setConfirmClear(false);
  }

  function handleCopyInvite() {
    // Placeholder URL — embed your real invite link here
    const inviteUrl = window.location.origin + "/#/signup";
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28 pt-4 profile-layout lg:pt-6">
      <div className="mx-auto w-full px-3 sm:px-4 lg:max-w-3xl lg:px-8">

        {/* Avatar card */}
        <div className="flex items-center gap-3 overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-[var(--color-border)] sm:p-4 profile-avatar-card">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] sm:h-16 sm:w-16 profile-avatar">
            <User className="h-7 w-7 text-[var(--color-text-muted)]" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-[#3B2A1A] sm:text-lg profile-name">
              {displayName}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">{t("profile.member")}</p>
          </div>
          <ProgressRing value={score / 100} size={52} stroke={5} progressColor="var(--color-accent-green)" />
        </div>

        {/* General */}
        <section className="mt-6 space-y-2">
          <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
            {t("profile.general")}
          </p>
          <Row to="/settings/personal" label={t("profile.personalInfo")} />
        </section>

        {/* Preferences */}
        <section className="mt-6 space-y-2">
          <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
            {t("profile.preferences")}
          </p>
          <Row to="/settings/language" label={t("profile.language")} />
        </section>

        {/* Social — inline copy-link only, no invite page */}
        <section className="mt-6 space-y-2">
          <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
            Social
          </p>
          <button
            type="button"
            onClick={handleCopyInvite}
            className="flex w-full items-center justify-between gap-2 overflow-hidden rounded-xl bg-white px-3 py-3 ring-1 ring-[var(--color-border)] sm:px-4"
          >
            <span className="min-w-0 truncate text-sm font-medium text-[#3B2A1A]">
              {copied ? t("profile.linkCopied") : t("profile.copyLink")}
            </span>
            {copied
              ? <Check className="h-4 w-4 shrink-0 text-[var(--color-accent-green)]" />
              : <Copy className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />}
          </button>
        </section>

        {/* Security & Privacy */}
        <section className="mt-6 space-y-2">
          <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
            {t("profile.securityPrivacy")}
          </p>
          <Row to="/settings/security" label={t("profile.security")} />
          <Row to="/help" label={t("profile.helpCenter")} />
        </section>

        {/* Data */}
        <section className="mt-6 space-y-2">
          <p className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
            {t("profile.data")}
          </p>
          {confirmClear ? (
            <div className="rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
              <p className="text-sm font-semibold text-red-800">
                This will request deletion of all your data. Are you sure?
              </p>
              <div className="mt-3 flex gap-2">
                <Button type="button" variant="secondary" fullWidth className="rounded-full" onClick={() => setConfirmClear(false)}>
                  Cancel
                </Button>
                <Button type="button" fullWidth className="rounded-full bg-red-600 hover:bg-red-700" onClick={clearAllData}>
                  {t("profile.clearData")}
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
              <span className="text-sm font-medium text-red-600">{t("profile.clearData")}</span>
            </button>
          )}
        </section>

        {/* Close account */}
        <section className="mt-6">
          <Link
            to="/not-allowed"
            className="flex items-center justify-center rounded-xl bg-[var(--color-accent-orange-light)] py-3 text-sm font-bold text-red-700 ring-1 ring-[var(--color-accent-orange)]/30"
          >
            {t("profile.closeAccount")}
          </Link>
        </section>

        {/* Log out */}
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
            {t("action.logOut")}
          </span>
        </Button>

      </div>
    </div>
  );
}
