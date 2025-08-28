// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryProvider } from "./infrastructure/providers/query-client-provider";
import { AppRouter } from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  </StrictMode>
);