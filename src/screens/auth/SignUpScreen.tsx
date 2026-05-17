import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { signUp } from "@/services/authService";

export function SignUpScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || password.length < 6) {
      setError("Use a valid email and a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await signUp(email.trim(), password);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate("/signin", { replace: true });
  };

  const inputWrap =
    "flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-sm)] focus-within:border-[var(--color-border-strong)]";

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF8F4] lg:flex-row" style={{ fontFamily: "var(--font-sans)" }}>

      {/* Desktop left panel */}
      <div className="hidden lg:flex lg:w-[420px] lg:shrink-0 lg:flex-col lg:items-center lg:justify-center lg:bg-[#3B2A1A] lg:px-12 lg:py-16">
        <MindoraLogo size={72} variant="white" className="text-white" />
        <h2
          className="mt-8 text-center text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Begin Your Journey
        </h2>
        <p className="mt-3 text-center text-sm leading-relaxed text-white/70">
          Join thousands of people who use Mindora AI to understand their emotions, build resilience, and thrive.
        </p>
        <div className="mt-12 space-y-3 text-center">
          {["Personalized mood tracking", "AI therapy chatbot", "Mindful journal & resources", "Supportive community"].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-white/80">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-green)] text-white">
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {f}
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold text-[var(--color-accent-orange)] hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      {/* Right / mobile panel */}
      <div className="flex flex-1 flex-col">
        {/* Mobile: top section */}
        <div className="flex flex-col items-center pt-[max(2rem,env(safe-area-inset-top))] lg:hidden">
          <MindoraLogo size={52} variant="brown" className="text-[var(--color-primary)]" />
          <h1
            className="mt-6 text-center text-[1.35rem] font-semibold text-[var(--color-primary)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Create your account
          </h1>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:items-center lg:justify-center lg:px-16 lg:py-16">
          <div className="w-full lg:max-w-md">
            {/* Desktop heading */}
            <h1
              className="hidden lg:block text-2xl font-bold text-[var(--color-primary)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Create your free account
            </h1>
            <p className="hidden lg:block mt-1 text-sm text-[var(--color-text-secondary)]">
              It only takes 30 seconds to get started.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              {error ? (
                <p className="rounded-[var(--radius-lg)] bg-red-50 px-3 py-2 text-center text-[var(--text-sm)] text-red-700">
                  {error}
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
                    autoComplete="new-password"
                    placeholder="Password (min 6 characters)"
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
              <Button type="submit" fullWidth disabled={busy} className="mt-2 h-12 rounded-full font-semibold">
                {busy ? "Creating account…" : "Create Account"}
              </Button>
            </form>

            <p className="mt-8 text-center text-[var(--text-sm)] text-[var(--color-text-secondary)] lg:hidden">
              Already have an account?{" "}
              <Link to="/signin" className="font-semibold text-[var(--color-accent-orange)] underline-offset-2 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
