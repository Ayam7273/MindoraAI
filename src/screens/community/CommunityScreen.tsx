import { Bell, Heart, MessageCircle, Share2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { StatusBar } from "@/components/ui/StatusBar";

const CHIPS = ["Trending", "Stress", "Suicide", "Mindfulness", "Support"];

export function CommunityScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <div className="bg-[#3B2A1A] text-[#FAF8F4]">
        <StatusBar className="!bg-[#3B2A1A] !text-[#FAF8F4]" />
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="h-10 w-10 rounded-full bg-white/20" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">Shinomiya Kaguya</p>
            <p className="text-xs text-white/60">Pro member</p>
          </div>
          <Link to="/community/notifications" className="rounded-full bg-white/10 p-2" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Link>
          <button type="button" onClick={() => navigate("/search")} className="rounded-full bg-white/10 p-2">
            🔍
          </button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-3 py-3">
        {CHIPS.map((c) => (
          <span key={c} className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ring-[var(--color-border)]">
            {c}
          </span>
        ))}
      </div>
      <div className="space-y-4 px-4">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2">
            <div className="h-9 w-9 rounded-full bg-[var(--color-bg-secondary)]" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--color-primary)]">Shinomiya</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">2h ago · Pro</p>
            </div>
          </div>
          <p className="px-3 py-2 text-sm text-[var(--color-text-primary)]">
            Sharing a small win today — took a walk and journaled. Hope it helps someone else too. #mindfulness
          </p>
          <div className="h-40 bg-gradient-to-br from-[var(--color-accent-green-light)] to-[var(--color-bg-secondary)]" />
          <div className="flex gap-6 border-t border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" /> 128
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" /> 14
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="h-4 w-4" /> 3
            </span>
          </div>
        </Card>
        <Link to="/community/welcome" className="block text-center text-xs text-[var(--color-accent-green)]">
          Re-show welcome
        </Link>
      </div>
    </div>
  );
}
