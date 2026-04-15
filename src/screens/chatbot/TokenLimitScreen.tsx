import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { hapticSuccess } from "@/lib/haptics";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useUiStore } from "@/store/uiStore";

export function TokenLimitScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const setChatbotTokensLeft = useUiStore((s) => s.setChatbotTokensLeft);
  const updateProfile = useUpdateProfile();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#FAF8F4] px-6 text-center">
      <div className="text-6xl" aria-hidden>
        📭
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[#3B2A1A]">Oops, Out of Token!</h1>
      <p className="mt-2 max-w-xs text-sm text-[var(--color-text-secondary)]">You’ve used your monthly allowance. Upgrade to Pro for more sessions (demo).</p>
      <Button
        type="button"
        className="mt-8 w-full max-w-xs rounded-full"
        onClick={() => {
          if (userId) void updateProfile.mutateAsync({ id: userId, patch: { is_pro: true } });
          setChatbotTokensLeft(500);
          hapticSuccess();
          navigate("/chatbot");
        }}
      >
        Upgrade to Pro
      </Button>
      <button
        type="button"
        className="mt-4 text-xs font-semibold text-[var(--color-accent-green)] underline"
        onClick={() => {
          setChatbotTokensLeft(500);
          navigate("/chatbot");
        }}
      >
        Reset tokens (dev)
      </button>
    </div>
  );
}
