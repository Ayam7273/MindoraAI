import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Global connectivity: push no-internet route when offline; pop back when online.
 */
export function OfflineListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const onOffline = () => navigate("/no-internet");
    const onOnline = () => navigate(-1);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, [navigate]);

  return null;
}
