import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

const root = createRoot(document.getElementById("root")!);

async function bootstrap() {
  // Populate clearly labeled editorial demo guides in development before queries run.
  if (import.meta.env.DEV) {
    try {
      const response = await fetch("/api/seed", { method: "POST" });
      if (!response.ok) throw new Error("Seed endpoint returned " + response.status);
      const result = await response.json();
      console.info("AdventureConnect editorial demo content:", result);
    } catch (error) {
      console.error("Development demo content could not be prepared:", error);
    }
  }

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
      </QueryClientProvider>
    </StrictMode>
  );
}

void bootstrap();
