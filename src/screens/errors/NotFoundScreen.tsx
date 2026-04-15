import { RouteErrorLayout } from "@/screens/errors/RouteErrorLayout";

export function NotFoundScreen() {
  return (
    <RouteErrorLayout
      title="Not Found"
      subtitle="Whoops! Dr. F can't find this page :("
      badge="⚠ Status Code: 404"
      illustration={<span aria-hidden>🔍</span>}
    />
  );
}
