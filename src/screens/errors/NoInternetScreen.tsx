import { RouteErrorLayout } from "@/screens/errors/RouteErrorLayout";

export function NoInternetScreen() {
  return (
    <RouteErrorLayout
      title="No Internet!"
      subtitle="It seems you don't have active internet."
      badge="↺ Refresh or Try Again"
      illustration={<span aria-hidden>📶</span>}
    />
  );
}
