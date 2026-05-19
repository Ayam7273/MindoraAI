import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "@/app/App";
import { AuthProvider } from "@/providers/AuthProvider";
import { applyLangToDocument } from "@/store/languageStore";
import "./index.css";

// Restore persisted language before first render
const stored = localStorage.getItem("mindora-language");
if (stored) {
  try {
    const parsed = JSON.parse(stored) as { state?: { lang?: string } };
    if (parsed.state?.lang) {
      applyLangToDocument(parsed.state.lang as import("@/lib/i18n").LangCode);
    }
  } catch { /* ignore */ }
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
