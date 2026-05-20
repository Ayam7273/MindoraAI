import { Navigate } from "react-router-dom";

/** Deprecated — replaced by StressLevelScreen dashboard. */
export function StressLevelStatsScreen() {
  return <Navigate to="/stress" replace />;
}
