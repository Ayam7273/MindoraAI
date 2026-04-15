import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useState } from "react";

export function SecuritySettingsScreen() {
  const navigate = useNavigate();
  const [faceId, setFaceId] = useState(true);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Security Settings</h1>
        <span className="w-10" />
      </header>

      <div className="mb-4 rounded-xl bg-white p-4 ring-1 ring-[var(--color-border)]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-[#3B2A1A]">Password</span>
          <button type="button" className="text-xs font-bold text-[var(--color-accent-green)]">
            Change
          </button>
        </div>
        <p className="mt-2 font-mono text-sm">••••••••</p>
      </div>

      <div className="mb-4 rounded-xl bg-white p-4 ring-1 ring-[var(--color-border)]">
        <p className="text-sm font-semibold text-[#3B2A1A]">2FA — Google Authenticator</p>
        <p className="text-xs text-[var(--color-text-muted)]">Status: Inactive (demo)</p>
      </div>

      <div className="mb-4 rounded-xl bg-white p-4 ring-1 ring-[var(--color-border)]">
        <Toggle label="Face ID" checked={faceId} onChange={(e) => setFaceId(e.target.checked)} />
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">Biometric unlock can speed up access while keeping your journal protected on device.</p>
      </div>

      <Button type="button" fullWidth className="rounded-full" onClick={() => navigate(-1)}>
        Save Settings ✓
      </Button>
    </div>
  );
}
