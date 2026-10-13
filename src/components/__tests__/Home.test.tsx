import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";

import Home from "@/routes/Home";

vi.mock("@/components/ui/prism-demo", () => ({ default: () => null }));
vi.mock("@/hooks/usePrefersReducedMotion", () => ({ usePrefersReducedMotion: () => false }));
vi.mock("@/lib/analytics", () => ({ analytics: { track: vi.fn() } }));
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  motion: { article: ({ children }: { children: ReactNode }) => <article>{children}</article> },
}));

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => {
  act(() => root.render(null));
  vi.useRealTimers();
});

it("pauses while focused and keeps the pause/play controls predictable", () => {
  vi.useFakeTimers();
  act(() => root.render(<HelmetProvider><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Home /></MemoryRouter></HelmetProvider>));
  const excerpt = () => container.querySelector(".hero-story article > p")?.textContent;
  const first = excerpt();
  const pause = container.querySelector<HTMLButtonElement>("[aria-label='Pause story excerpts']")!;
  act(() => pause.focus());
  act(() => vi.advanceTimersByTime(7000));
  expect(excerpt()).toBe(first);

  act(() => pause.click());
  expect(pause.getAttribute("aria-label")).toBe("Play story excerpts");
  act(() => pause.blur());
  act(() => vi.advanceTimersByTime(7000));
  expect(excerpt()).toBe(first);

  act(() => pause.click());
  expect(pause.getAttribute("aria-label")).toBe("Pause story excerpts");
  act(() => vi.advanceTimersByTime(7000));
  expect(excerpt()).not.toBe(first);
});
