import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function showHomepageAfterRefresh() {
  const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (entry?.type !== "reload") return;
  let path = window.location.pathname;
  try {
    path = new URL(entry.name).pathname;
  } catch {
    return;
  }
  if (path !== "/") return;
  const current = window.history.state;
  if (!current || typeof current !== "object" || !("usr" in current)) return;
  window.history.replaceState({ ...current, usr: null }, "");
}

showHomepageAfterRefresh();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
