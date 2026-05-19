import { ChevronLeft, KeyRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "@/store/languageStore";

export function SecuritySettingsScreen() {
  const navigate = useNavigate();
  const t = useT();
  const [changingPw, setChangingPw] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!newPw || newPw !== confirmPw) return;
    setSaved(true);
    setNewPw("");
    setConfirmPw("");
    setChangingPw(false);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]"
          aria-label={t("action.back")}
        >
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">
          {t("security.title")}
        </h1>
        <span className="w-10 shrink-0" />
      </header>

      {/* Success banner */}
      {saved && (
        <div className="mb-4 rounded-xl bg-[var(--color-accent-green-light)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-green)]">
          Password updated successfully.
        </div>
      )}

      {/* Password section */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-secondary)]">
            <KeyRound className="h-5 w-5 text-[var(--color-text-secondary)]" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#3B2A1A]">{t("security.password")}</p>
            {!changingPw && (
              <p className="font-mono text-sm tracking-widest text-[var(--color-text-muted)]">••••••••</p>
            )}
          </div>
          {!changingPw && (
            <button
              type="button"
              onClick={() => setChangingPw(true)}
              className="text-xs font-bold text-[var(--color-accent-green)]"
            >
              {t("security.changePassword")}
            </button>
          )}
        </div>

        {changingPw && (
          <form onSubmit={handleSave} className="mt-4 space-y-3">
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)]">
              New password
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min 6 characters"
                minLength={6}
                className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-border-strong)]"
              />
            </label>
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)]">
              Confirm new password
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat password"
                className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-border-strong)]"
              />
            </label>
            {confirmPw && newPw !== confirmPw && (
              <p className="text-xs text-red-500">Passwords do not match.</p>
            )}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => { setChangingPw(false); setNewPw(""); setConfirmPw(""); }}
                className="flex-1 rounded-full border border-[var(--color-border)] py-2.5 text-sm font-semibold text-[var(--color-text-secondary)]"
              >
                {t("action.cancel")}
              </button>
              <button
                type="submit"
                disabled={!newPw || newPw !== confirmPw || newPw.length < 6}
                className="flex-1 rounded-full bg-[var(--color-primary)] py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {t("action.save")}
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="mt-6 px-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
        Use a strong, unique password. Never share your password with anyone. Mindora staff will never ask for it.
      </p>
    </div>
  );
}
