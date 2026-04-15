import { useState } from "react";
import { ChevronLeft, Paperclip, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SEED = [
  { id: "1", who: "bot" as const, text: "Hi! I'm the Freud.ai triage bot. A specialist will join shortly.", t: "09:41" },
  { id: "2", who: "agent" as const, text: "Hello — thanks for reaching out. What's going on today?", t: "09:42" },
];

export function LiveChatChatScreen() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [rows, setRows] = useState(SEED);

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF8F4]">
      <header className="flex items-center gap-2 bg-[var(--color-accent-orange)] px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-white">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20" aria-label="Back">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">Live Support</p>
          <p className="text-[10px] text-white/80">Typically replies in minutes</p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {rows.map((m) => (
          <div key={m.id} className={m.who === "agent" ? "flex flex-col items-start" : "flex flex-col items-end"}>
            <div
              className={
                m.who === "agent"
                  ? "max-w-[90%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-[#3B2A1A] ring-1 ring-[var(--color-border)]"
                  : "max-w-[90%] rounded-2xl rounded-br-sm bg-[#3B2A1A] px-3 py-2 text-sm text-[#FAF8F4]"
              }
            >
              {m.text}
            </div>
            <span className="mt-1 text-[10px] text-[var(--color-text-muted)]">{m.t}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-border)] bg-white px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="mb-2 text-center text-[11px] font-semibold text-[var(--color-text-muted)]">Chat with our specialist 🤖</p>
        <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-bg-secondary)] px-2 py-2">
          <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white" aria-label="Attach">
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type a message…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-green)] text-white"
            onClick={() => {
              if (!msg.trim()) return;
              setRows((r) => [...r, { id: crypto.randomUUID(), who: "bot", text: msg.trim(), t: "now" }]);
              setMsg("");
            }}
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
