import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import posthog from 'posthog-js';

import App from "./App.tsx";
import "./index.css";
import { suppressThreeWarnings } from "./lib/three-utils";
import "./lib/debounce-polyfill"; // Import debounce polyfill

// Import fonts
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import '@fontsource/newsreader/400.css';
import '@fontsource/newsreader/700.css';
import '@fontsource/azeret-mono/400.css';

// Suppress Three.js multiple instance warnings
suppressThreeWarnings();

// Initialize PostHog with error handling
if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY && import.meta.env.VITE_PUBLIC_POSTHOG_HOST) {
  try {
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
      persistence: 'memory',
      disable_session_recording: true,
      disable_persistence: true,
      capture_pageview: false, // Disable automatic pageview capture
      capture_pageleave: false, // Disable automatic pageleave capture
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          console.log('PostHog loaded in development mode')
        }
      },
      on_xhr_error: (failedRequest) => {
        if (import.meta.env.DEV) {
          console.warn('PostHog request failed (likely blocked by ad blocker):', failedRequest)
        }
      }
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('PostHog initialization failed:', error)
    }
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);