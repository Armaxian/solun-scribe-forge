import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PostHogProvider } from "posthog-js/react";

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-[var(--solun-cream)] text-[var(--ink-900)] min-h-screen">
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={{
          api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
          persistence: 'memory',
          disable_session_recording: true,
          disable_persistence: true,
          loaded: (posthog) => {
            if (import.meta.env.DEV) {
              console.log('PostHog loaded in development mode')
            }
          }
        }}
      >
        <App />
      </PostHogProvider>
    </div>
  </StrictMode>
);