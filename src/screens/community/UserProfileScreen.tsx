import { useState } from "react";
import { ChevronLeft, Heart, MessageCircle, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";

export function UserProfileScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"all" | "post" | "video" | "audio">("all");
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <div className="relative h-40 bg-gradient-to-br from-orange-200 to-amber-400">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-2 top-[max(0.5rem,env(safe-area-inset-top))] flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white" aria-label="Back">
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      <div className="-mt-12 px-4">
        <div className="flex items-end gap-4">
          <div className="h-24 w-24 shrink-0 rounded-full border-4 border-[#FAF8F4] bg-[var(--color-bg-secondary)]" />
          <div className="mb-1 min-w-0 flex-1">
            <h1 className="text-xl font-bold text-[#3B2A1A]">Shinomiya Kaguya</h1>
            <p className="text-xs text-[var(--color-text-muted)]">ID: {id} · Tokyo</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="button" className="flex-1 rounded-full">
            Follow
          </Button>
          <Button type="button" variant="secondary" className="flex-1 rounded-full" onClick={() => navigate("/community/dm/alfonso")}>
            Message
          </Button>
        </div>
        <div className="mt-4 flex justify-around text-center text-sm">
          <div>
            <p className="font-bold text-[#3B2A1A]">128</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">Posts</p>
          </div>
          <div>
            <p className="font-bold text-[#3B2A1A]">1.2k</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">Followers</p>
          </div>
          <div>
            <p className="font-bold text-[#3B2A1A]">340</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">Following</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">Building gentle habits, one day at a time. {tab.toUpperCase()} view .</p>

        <div className="mt-4 flex gap-2 overflow-x-auto border-b border-[var(--color-border)] pb-2">
          {(["all", "post", "video", "audio"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ${tab === t ? "bg-[#3B2A1A] text-white" : "bg-white ring-1 ring-[var(--color-border)]"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <article className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <div className="h-36 bg-gradient-to-br from-green-100 to-emerald-200" />
          <div className="p-3">
            <p className="text-sm font-semibold text-[#3B2A1A]">Leaf in the wind 🍃</p>
            <div className="mt-2 flex gap-4 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" /> 42
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" /> 3
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="h-4 w-4" /> 1
              </span>
            </div>
            <button type="button" className="mt-3 text-xs font-semibold text-red-600 underline" onClick={() => setDeleteOpen(true)}>
              Delete post 
            </button>
          </div>
        </article>
      </div>

      <Sheet open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Post?">
        <p className="text-sm text-[var(--color-text-secondary)]">Are you sure you want to delete your post?</p>
        <div className="mt-4 space-y-2">
          <Button type="button" fullWidth className="rounded-full bg-[var(--color-accent-orange)] hover:opacity-95" onClick={() => setDeleteOpen(false)}>
            No, Don&apos;t Delete ☺
          </Button>
          <Button type="button" fullWidth variant="secondary" className="rounded-full text-red-600 ring-1 ring-red-200" onClick={() => setDeleteOpen(false)}>
            Yes, Delete ☹
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
