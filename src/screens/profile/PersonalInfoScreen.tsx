import { Camera, ChevronLeft, Loader2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { useUiStore } from "@/store/uiStore";

export function PersonalInfoScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const setProfile = useUiStore((s) => s.setProfile);
  const { data: profile } = useProfile(userId);
  const updateProfile = useUpdateProfile();
  const { upload, uploading } = useAvatarUpload();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile) return;
    setName(profile.full_name ?? "");
    setDob(profile.date_of_birth ?? "");
    setGender(profile.gender ?? "Prefer not to say");
    setAvatarUrl(profile.avatar_url ?? null);
  }, [profile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    // Show preview immediately
    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
    const publicUrl = await upload(userId, file);
    if (publicUrl) {
      setAvatarUrl(publicUrl);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    const updated = await updateProfile.mutateAsync({
      id: userId,
      patch: {
        full_name: name.trim() || profile?.full_name,
        date_of_birth: dob || null,
        gender: gender || null,
        avatar_url: avatarUrl,
      },
    });
    // Keep Zustand store in sync so the avatar shows everywhere immediately
    setProfile(updated);
    setSaving(false);
    navigate(-1);
  };

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))] lg:mx-auto lg:max-w-lg lg:pt-8">
      {/* Header */}
      <header className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Personal Information</h1>
        <span className="w-10 shrink-0" />
      </header>

      {/* Avatar upload */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative h-24 w-24 overflow-hidden rounded-full bg-[var(--color-bg-secondary)] ring-4 ring-[var(--color-border)] transition-all hover:ring-[var(--color-accent-green)]"
          aria-label="Change profile picture"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-10 w-10 text-[var(--color-text-muted)]" strokeWidth={1.5} />
            </div>
          )}
          {/* Camera overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/25">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-white opacity-0 transition-opacity group-hover:opacity-100" />
            ) : (
              <Camera className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.75} />
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-xs font-semibold text-[var(--color-accent-green)] underline-offset-2 hover:underline"
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "Change photo"}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Full Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-border-strong)]"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Date of Birth
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-border-strong)]"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Gender
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-border-strong)]"
          >
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
        </label>
      </div>

      <Button
        type="button"
        fullWidth
        className="mt-8 rounded-full"
        disabled={saving || uploading}
        onClick={() => void handleSave()}
      >
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
