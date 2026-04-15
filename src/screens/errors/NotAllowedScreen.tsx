import { RouteErrorLayout } from "@/screens/errors/RouteErrorLayout";

export function NotAllowedScreen() {
  return (
    <RouteErrorLayout
      title="Not Allowed"
      subtitle="Hey, you don't have permission."
      badge="📞 Contact Admin"
      illustration={<span aria-hidden>🛑</span>}
    />
  );
}
