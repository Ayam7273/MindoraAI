import { RouteErrorLayout } from "@/screens/errors/RouteErrorLayout";

export function MaintenanceScreen() {
  return (
    <RouteErrorLayout
      title="Maintenance"
      subtitle="We're undergoing maintenance."
      badge="⏱ Come back in 9h 12m"
      illustration={<span aria-hidden>🛠️</span>}
    />
  );
}
