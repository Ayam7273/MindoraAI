import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { signIn, signInWithGoogle } from "@/services/authService";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.25 1.6-1.9 4.7-5.5 4.7-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.7 3.9 14.6 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.7-3.6 8.7-8.7 0-.6-.1-1-.2-1.4H12z"
      />
      <path
        fill="#34A853"
        d="M3.3 7.1C2.5 8.6 2 10.3 2 12c0 1.7.5 3.4 1.3 4.9l3.3-2.6c-.4-1.1-.6-2.3-.6-3.6 0-1.3.2-2.5.6-3.6L3.3 7.1z"
      />
      <path
        fill="#4A90E2"
        d="M12 22c2.6 0 4.7-.9 6.3-2.4l-2.9-2.3c-.8.6-1.9 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2l-3.3 2.6C5.4 20.3 8.5 22 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M21.8 12.1c0-.8-.1-1.6-.2-2.4H12v4.6h5.5c-.2 1.3-.9 2.5-1.9 3.3l2.9 2.3c1.7-1.6 2.7-3.9 2.7-6.8z"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f58529" />
          <stop offset="50%" stopColor="#dd2a7b" />
          <stop offset="100%" stopColor="#8134af" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" stroke="url(#ig)" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig)" />
    </svg>
  );
}

export function SignInScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    setError(null);
    const { error: err } = await signIn(email.trim(), password);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate("/home", { replace: true });
  };

  const inputWrap =
    "flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-sm)] focus-within:border-[var(--color-border-strong)]";

  return (
    <div
      className="flex min-h-dvh flex-col bg-[#FAF8F4]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div
        className="relative flex shrink-0 flex-col items-center bg-[var(--color-accent-green)] px-6 pb-12 pt-[max(1.25rem,env(safe-area-inset-top))]"
        style={{
          borderBottomLeftRadius: "50% 18%",
          borderBottomRightRadius: "50% 18%",
        }}
      >
        <MindoraLogo size={52} variant="white" className="text-white drop-shadow-sm" />
      </div>

      <div className="-mt-2 flex flex-1 flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <h1
          className="mt-4 text-center text-[1.35rem] font-semibold text-[var(--color-primary)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Sign In To Mindora AI
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col gap-4">
          {error ? (
            <p className="rounded-[var(--radius-lg)] bg-red-50 px-3 py-2 text-center text-[var(--text-sm)] text-red-700">
              {error}
            </p>
          ) : null}
          <label className="block">
            <span className="sr-only">Email address</span>
            <div className={cn(inputWrap)}>
              <Mail className="h-5 w-5 shrink-0 text-[var(--color-text-muted)]" strokeWidth={1.75} />
              <input
                type="email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-[var(--text-base)] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
              />
            </div>
          </label>

          <label className="block">
            <span className="sr-only">Password</span>
            <div className={cn(inputWrap)}>
              <Lock className="h-5 w-5 shrink-0 text-[var(--color-text-muted)]" strokeWidth={1.75} />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-[var(--text-base)] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 rounded-full p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>

          <Button
            type="submit"
            fullWidth
            disabled={busy}
            className="mt-2 h-12 rounded-full text-[var(--text-base)] font-semibold"
          >
            {busy ? "Signing in…" : "Sign In →"}
          </Button>
        </form>

        <div className="mt-8 flex justify-center gap-4">
          {[
            { label: "Facebook", el: <FacebookIcon className="h-5 w-5 text-[#1877F2]" /> },
            {
              label: "Google",
              el: <GoogleIcon className="h-5 w-5" />,
              onClick: async () => {
                setError(null);
                const { error: err } = await signInWithGoogle();
                if (err) setError(err.message);
              },
            },
            { label: "Instagram", el: <InstagramIcon className="h-6 w-6" /> },
          ].map(({ label, el, onClick }) => (
            <button
              key={label}
              type="button"
              aria-label={`Continue with ${label}`}
              onClick={onClick}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-border)] transition-transform active:scale-95"
            >
              {el}
            </button>
          ))}
        </div>

        <p className="mt-auto pt-10 text-center text-[var(--text-sm)] text-[var(--color-text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[var(--color-accent-orange)] underline-offset-2 hover:underline"
          >
            Sign Up
          </Link>
          .
        </p>
        <Link
          to="/forgot-password"
          className="mt-3 block text-center text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] underline-offset-2 hover:underline"
        >
          Forgot Password
        </Link>
      </div>
    </div>
  );
}
