import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function CommunityWelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#FAF8F4] px-6 pb-28 text-center">
      <div className="text-7xl">💚</div>
      <h1 className="mt-6 text-2xl font-bold text-[var(--color-primary)]">Welcome to Our Community!</h1>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">
        A place of warmth and acceptance, where everyone&apos;s voice is valued.
      </p>
      <Button type="button" className="mt-10 w-full max-w-xs rounded-full" onClick={() => navigate("/community")}>
        Start Posting →
      </Button>
      <div className="mt-6 flex flex-col gap-2 text-xs text-[var(--color-text-muted)]">
        <Link to="/help" className="underline">
          Privacy Policy
        </Link>
        <Link to="/help" className="underline">
          Terms &amp; Conditions
        </Link>
      </div>
    </div>
  );
}
