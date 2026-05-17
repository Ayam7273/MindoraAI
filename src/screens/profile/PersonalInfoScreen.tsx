import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useUiStore } from "@/store/uiStore";

export function PersonalInfoScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { data: profile } = useProfile(userId);
  const updateProfile = useUpdateProfile();
  const [name, setNameLocal] = useState("");
  const [emergency, setEmergency] = useState("");
  const [dob, setDob] = useState("2000-01-01");
  const [gender, setGender] = useState("Prefer not to say");
  const [loc, setLoc] = useState("");
  const [weight, setWeight] = useState(55);
  const [accountPro, setAccountPro] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setNameLocal(profile.full_name ?? "");
    setEmergency(profile.emergency_contact ?? "");
    setDob(profile.date_of_birth ?? "2000-01-01");
    setGender(profile.gender ?? "Prefer not to say");
    setLoc(profile.location ?? "");
    setWeight(profile.weight != null ? Number(profile.weight) : 55);
    setAccountPro(profile.account_type === "professional");
  }, [profile]);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Personal Information</h1>
        <span className="w-10" />
      </header>

      <div className="mb-4 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] text-4xl">📷</div>
      </div>

      <label className="mb-3 block text-sm font-medium text-[var(--color-text-secondary)]">
        Full Name
        <input value={name} onChange={(e) => setNameLocal(e.target.value)} className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5" />
      </label>
      <label className="mb-3 block text-sm font-medium text-[var(--color-text-secondary)]">
        Date of Birth
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5" />
      </label>
      <label className="mb-3 block text-sm font-medium text-[var(--color-text-secondary)]">
        Gender
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5">
          <option>Female</option>
          <option>Male</option>
          <option>Non-binary</option>
          <option>Prefer not to say</option>
        </select>
      </label>
      <label className="mb-3 block text-sm font-medium text-[var(--color-text-secondary)]">
        Location
        <input value={loc} onChange={(e) => setLoc(e.target.value)} className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5" />
      </label>
      <label className="mb-3 block text-sm font-medium text-[var(--color-text-secondary)]">
        Emergency contact (phone)
        <input
          value={emergency}
          onChange={(e) => setEmergency(e.target.value)}
          placeholder="+1 555 123 4567"
          inputMode="tel"
          className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5"
        />
      </label>

      <p className="mb-1 text-sm font-medium text-[var(--color-text-secondary)]">Weight ({weight}kg)</p>
      <input type="range" min={40} max={100} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="mb-4 w-full accent-[#3B2A1A]" />

      <p className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">Account Type</p>
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setAccountPro(false)}
          className={`flex-1 rounded-full py-2 text-xs font-bold ${!accountPro ? "bg-[#3B2A1A] text-white" : "bg-white ring-1 ring-[var(--color-border)]"}`}
        >
          Patient
        </button>
        <button
          type="button"
          onClick={() => setAccountPro(true)}
          className={`flex-1 rounded-full py-2 text-xs font-bold ${accountPro ? "bg-[#3B2A1A] text-white" : "bg-white ring-1 ring-[var(--color-border)]"}`}
        >
          Professional
        </button>
      </div>

      <Toggle label="Show avatar on posts (demo)" checked onChange={() => {}} />

      <Button
        type="button"
        fullWidth
        className="mt-8 rounded-full"
        onClick={() => {
          if (!userId) return;
          void updateProfile.mutateAsync({
            id: userId,
            patch: {
              full_name: name.trim() || profile?.full_name,
              emergency_contact: emergency.trim() || null,
              date_of_birth: dob || null,
              gender: gender || null,
              location: loc.trim() || null,
              weight,
              account_type: accountPro ? "professional" : "patient",
            },
          });
          navigate(-1);
        }}
      >
        Save Settings
      </Button>
    </div>
  );
}
