import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const DEVICES = [
  { name: "Smart Watch", state: "connect" as const },
  { name: "Smart Patch", state: "disconnect" as const },
  { name: "Mini ECG", state: "connect" as const },
  { name: "BP Monitor", state: "connect" as const },
];

export function LinkedDevicesScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Linked Devices</h1>
        <span className="w-10" />
      </header>

      <div className="grid grid-cols-2 gap-3">
        {DEVICES.map((d) => (
          <div key={d.name} className="rounded-2xl bg-white p-4 ring-1 ring-[var(--color-border)]">
            <p className="text-sm font-bold text-[#3B2A1A]">{d.name}</p>
            <Button
              type="button"
              variant="secondary"
              className={cn(
                "mt-3 w-full rounded-full text-xs",
                d.state === "disconnect" && "border-transparent bg-[var(--color-accent-orange)] text-white hover:brightness-95",
              )}
            >
              {d.state === "disconnect" ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" fullWidth className="mt-8 rounded-full" onClick={() => navigate(-1)}>
        Save Settings
      </Button>
    </div>
  );
}
