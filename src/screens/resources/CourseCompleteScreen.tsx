import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const FACES = ["😢", "😐", "🙂", "😄", "🤩"];

export function CourseCompleteScreen() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(2);

  return (
    <div className="flex min-h-dvh flex-col items-center bg-[#FAF8F4] px-6 pb-28 pt-12 text-center">
      <div className="text-8xl" aria-hidden>
        🌳
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[#3B2A1A]">Course Done!</h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">How do you feel about this course?</p>
      <div className="mt-8 flex justify-center gap-3 text-4xl">
        {FACES.map((f, i) => (
          <button key={f} type="button" onClick={() => setIdx(i)} className={`rounded-xl p-1 ${idx === i ? "ring-2 ring-[#3B2A1A]" : ""}`}>
            {f}
          </button>
        ))}
      </div>
      <Button type="button" className="mt-12 w-full max-w-xs rounded-full" onClick={() => navigate("/resources/courses")}>
        Rate Session +
      </Button>
    </div>
  );
}
