import { Link } from "react-router-dom";
import { Play } from "lucide-react";

export function SleepActiveScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#3B2A1A] px-6 text-center text-white">
      <div className="relative flex h-40 w-40 items-center justify-center">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/20"
            style={{ width: `${i * 33}%`, height: `${i * 33}%` }}
          />
        ))}
        <Play className="relative h-16 w-16 fill-white text-white" />
      </div>
      <h1 className="mt-10 text-2xl font-bold">Start Sleeping</h1>
      <Link to="/sleep/schedule" className="mt-8 text-sm font-semibold text-white/70 underline">
        Or Schedule Sleep
      </Link>
    </div>
  );
}
