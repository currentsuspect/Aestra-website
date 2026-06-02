import "./styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// WebMCP: expose site tools to AI agents via the browser
// https://webmachinelearning.github.io/webmcp/
if ("modelContext" in navigator) {
  (navigator as any).modelContext.provideContext({
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
          url: "https://aestra.studio",
          docs: "https://aestra.studio/docs",
          pricing: "https://aestra.studio/pricing",
          downloads: "https://aestra.studio/downloads"
        })
      }
    ]
  });
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
