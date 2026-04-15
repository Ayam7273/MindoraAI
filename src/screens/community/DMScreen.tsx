import { useState } from "react";
import { ChevronLeft, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const SEED = [
  { id: "1", who: "them" as const, text: "Hey — thanks for reaching out earlier.", t: "10:02" },
  { id: "2", who: "me" as const, text: "Of course. How are you feeling today?", t: "10:04" },
];

export function DMScreen() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [rows, setRows] = useState(SEED);

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF8F4]">
      <header className="flex items-center gap-2 border-b border-[var(--color-border)] bg-white px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full" aria-label="Back">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-[#3B2A1A]">{userId === "alfonso" ? "Alfonso Merton" : "Community member"}</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">Active now (demo)</p>
        </div>
        <button type="button" className="text-xs">
          🔍
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {rows.map((m) => (
          <div key={m.id} className={m.who === "me" ? "flex flex-col items-end" : "flex flex-col items-start"}>
            <div
              className={
                m.who === "me"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-[#3B2A1A] px-3 py-2 text-sm text-[#FAF8F4]"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-[#3B2A1A] ring-1 ring-[var(--color-border)]"
              }
            >
              {m.text}
            </div>
            <span className="mt-1 text-[10px] text-[var(--color-text-muted)]">{m.t}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--color-border)] bg-white px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] text-lg">
          +
        </button>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Message…"
          className="min-w-0 flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-sm"
        />
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-green)] text-white"
          onClick={() => {
            if (!msg.trim()) return;
            setRows((r) => [...r, { id: crypto.randomUUID(), who: "me", text: msg.trim(), t: "now" }]);
            setMsg("");
          }}
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
