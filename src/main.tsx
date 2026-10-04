import "./fonts.css";
import "./styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// WebMCP: expose site tools to AI agents via the browser
// https://webmachinelearning.github.io/webmcp/
const modelContext =
  (document as any).modelContext ?? (navigator as any).modelContext;
if (typeof modelContext?.provideContext === "function") {
  modelContext.provideContext({
    tools: [
      {
        name: "navigate",
        description: "Navigate to a page on the Aestra website",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Path to navigate to, e.g. /features, /pricing, /docs, /downloads" }
          },
          required: ["path"]
        },
        execute: ({ path }: { path: string }) => {
          window.location.pathname = path;
        }
      },
      {
        name: "get_site_info",
        description: "Get basic information about Aestra",
        inputSchema: { type: "object", properties: {} },
        execute: () => ({
          name: "Aestra",
          description: "A next-generation DAW with AI-native features",
          url: "https://www.aestra.studio",
          docs: "https://www.aestra.studio/docs",
          pricing: "https://www.aestra.studio/pricing",
          downloads: "https://www.aestra.studio/download"
        })
      }
    ]
  });
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
