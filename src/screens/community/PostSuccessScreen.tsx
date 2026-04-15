import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PostSuccessScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#FAF8F4] px-6 pb-28 text-center">
      <div className="text-7xl" aria-hidden>
        🎊
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[#3B2A1A]">Post Successful!</h1>
      <p className="mt-2 max-w-xs text-sm text-[var(--color-text-secondary)]">You have successfully posted a post.</p>
      <Button type="button" className="mt-10 w-full max-w-xs rounded-full" onClick={() => navigate("/community")}>
        See My Post →
      </Button>
      <button type="button" className="mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#3B2A1A] text-white" onClick={() => navigate("/community")} aria-label="Close">
        <X className="h-6 w-6" />
      </button>
    </div>
  );
}
