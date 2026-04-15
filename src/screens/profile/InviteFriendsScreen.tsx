import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const CONTACTS = ["Alfonso Merton", "Kaguya Shinomiya", "Miyuki Shirogane", "Chika Fujiwara"];

export function InviteFriendsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Invite Friends</h1>
        <span className="w-10" />
      </header>

      <div className="text-center">
        <div className="text-6xl" aria-hidden>
          🎁
        </div>
        <p className="mt-4 text-2xl font-black text-[var(--color-accent-orange)]">$50 OFF!</p>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Invite friends &amp; change the world together.</p>
      </div>

      <input placeholder="Search contacts…" className="mt-8 w-full rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm" />

      <ul className="mt-4 space-y-2">
        {CONTACTS.map((c) => (
          <li key={c} className="flex items-center justify-between rounded-xl bg-white px-3 py-3 ring-1 ring-[var(--color-border)]">
            <span className="text-sm font-medium text-[#3B2A1A]">{c}</span>
            <Button type="button" variant="secondary" className="h-8 rounded-full px-3 text-xs">
              Add
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
