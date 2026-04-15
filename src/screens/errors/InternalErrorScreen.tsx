import { RouteErrorLayout } from "@/screens/errors/RouteErrorLayout";

export function InternalErrorScreen() {
  return (
    <RouteErrorLayout
      title="Internal Error"
      subtitle="Whoops! Our server seems to error :("
      badge="⚙ Status Code: 500"
      illustration={<span aria-hidden>⚠️</span>}
    />
  );
}
