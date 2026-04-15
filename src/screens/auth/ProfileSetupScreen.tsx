import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useUiStore } from "@/store/uiStore";

export function ProfileSetupScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const profile = useUiStore((s) => s.profile);
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState(profile?.full_name ?? "");

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF8F4] px-6 pb-10 pt-[max(1rem,env(safe-area-inset-top))]">
      <button type="button" onClick={() => navigate(-1)} className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-secondary)]" aria-label="Back">
        <ChevronLeft className="h-6 w-6 text-[var(--color-primary)]" />
      </button>
      <h1 className="text-2xl font-bold text-[var(--color-primary)]">Finish your profile</h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">A display name helps personalize your experience.</p>
      <div className="mt-8">
        <Input id="profile-display-name" label="Display name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div className="mt-auto pt-10">
        <Button
          type="button"
          fullWidth
          className="rounded-full"
          onClick={async () => {
            if (!userId) {
              navigate("/signin", { replace: true });
              return;
            }
            await updateProfile.mutateAsync({
              id: userId,
              patch: {
                full_name: name.trim() || "Friend",
                profile_setup_complete: true,
              },
            });
            navigate("/home", { replace: true });
          }}
        >
          Continue to app →
        </Button>
      </div>
    </div>
  );
}
