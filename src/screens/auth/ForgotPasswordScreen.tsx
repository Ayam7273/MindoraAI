import { Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { resetPassword } from "@/services/authService";

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    const { error: err } = await resetPassword(email.trim());
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setMessage("Check your email for a reset link.");
  };

  const inputWrap =
    "flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-sm)]";

  return (
    <div
      className="flex min-h-dvh flex-col bg-[#FAF8F4] px-5 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="flex flex-col items-center">
        <MindoraLogo size={52} variant="brown" className="text-[var(--color-primary)]" />
        <h1 className="mt-6 text-center text-xl font-semibold text-[var(--color-primary)]">Reset password</h1>
        <p className="mt-2 max-w-sm text-center text-[var(--text-sm)] text-[var(--color-text-secondary)]">
          Enter your account email and we&apos;ll send you a link to choose a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error ? (
          <p className="rounded-[var(--radius-lg)] bg-red-50 px-3 py-2 text-center text-[var(--text-sm)] text-red-700">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-[var(--radius-lg)] bg-[var(--color-accent-green-light)] px-3 py-2 text-center text-[var(--text-sm)] text-[var(--color-primary)]">
            {message}
          </p>
        ) : null}
        <label className="block">
          <span className="sr-only">Email</span>
          <div className={cn(inputWrap)}>
            <Mail className="h-5 w-5 shrink-0 text-[var(--color-text-muted)]" strokeWidth={1.75} />
            <input
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent text-[var(--text-base)] outline-none placeholder:text-[var(--color-text-muted)]"
            />
          </div>
        </label>
        <Button type="submit" fullWidth disabled={busy} className="h-12 rounded-full font-semibold">
          {busy ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <Link
        to="/signin"
        className="mt-8 block text-center text-[var(--text-sm)] font-medium text-[var(--color-accent-orange)]"
      >
        Back to sign in
      </Link>
    </div>
  );
}
