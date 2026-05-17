import { AlertTriangle } from "lucide-react";
import { RouteErrorLayout } from "@/screens/errors/RouteErrorLayout";

export function InternalErrorScreen() {
  return (
    <RouteErrorLayout
      title="Internal Error"
      subtitle="Whoops! Something went wrong on our end."
      badge="Status Code: 500"
      illustration={<AlertTriangle className="h-16 w-16 text-[var(--color-warning)]" strokeWidth={1.25} aria-hidden />}
    />
  );
}
