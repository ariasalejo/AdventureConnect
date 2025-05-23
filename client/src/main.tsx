import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// Seed the database when in development mode
if (import.meta.env.DEV) {
  fetch("/api/seed", { method: "POST" })
    .then((res) => res.json())
    .then((data) => console.log("Database seeded:", data))
    .catch((error) => console.error("Failed to seed database:", error));
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
