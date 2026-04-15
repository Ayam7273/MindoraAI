import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useState } from "react";

export function NotificationSettingsScreen() {
  const navigate = useNavigate();
  const [push, setPush] = useState(true);
  const [support, setSupport] = useState(true);
  const [alert, setAlert] = useState(true);
  const [sound, setSound] = useState(true);
  const [vib, setVib] = useState(true);
  const [offers, setOffers] = useState(false);
  const [updates, setUpdates] = useState(true);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Notification Settings</h1>
        <span className="w-10" />
      </header>

      <p className="mb-2 text-xs font-bold uppercase text-[var(--color-text-muted)]">Chatbot</p>
      <div className="mb-4 space-y-2 rounded-xl bg-white p-3 ring-1 ring-[var(--color-border)]">
        <Toggle label="Push Notifications" checked={push} onChange={(e) => setPush(e.target.checked)} />
        <Toggle label="Support Notification" checked={support} onChange={(e) => setSupport(e.target.checked)} />
      </div>

      <p className="mb-2 text-xs font-bold uppercase text-[var(--color-text-muted)]">Alert</p>
      <div className="mb-4 rounded-xl bg-white p-3 ring-1 ring-[var(--color-border)]">
        <Toggle label="Alert Notification" checked={alert} onChange={(e) => setAlert(e.target.checked)} />
      </div>

      <p className="mb-2 text-xs font-bold uppercase text-[var(--color-text-muted)]">Sound &amp; haptics</p>
      <div className="mb-4 space-y-2 rounded-xl bg-white p-3 ring-1 ring-[var(--color-border)]">
        <Toggle label="Sound (biometric check always in production)" checked={sound} onChange={(e) => setSound(e.target.checked)} />
        <Toggle label="Vibration" checked={vib} onChange={(e) => setVib(e.target.checked)} />
      </div>

      <p className="mb-2 text-xs font-bold uppercase text-[var(--color-text-muted)]">Misc</p>
      <div className="mb-4 space-y-2 rounded-xl bg-white p-3 ring-1 ring-[var(--color-border)]">
        <Toggle label="Offers" checked={offers} onChange={(e) => setOffers(e.target.checked)} />
        <Toggle label="App Updates" checked={updates} onChange={(e) => setUpdates(e.target.checked)} />
      </div>

      <Link to="/resources" className="block text-center text-sm font-semibold text-[var(--color-accent-green)]">
        Browse Mindful Resources →
      </Link>

      <Button type="button" fullWidth className="mt-8 rounded-full" onClick={() => navigate(-1)}>
        Save Settings ✓
      </Button>
    </div>
  );
}
