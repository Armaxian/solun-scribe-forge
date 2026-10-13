import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it } from "vitest";

import { StoryWorkspace } from "../StoryWorkspace";

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);

// React needs this flag when exercising updates without a test-library wrapper.
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => act(() => root.render(null)));

it("switches chapters, opens the matching lore, and explores each studio view", () => {
  act(() => root.render(<StoryWorkspace />));
  const chapter = [...container.querySelectorAll<HTMLButtonElement>("button")].find((button) => button.textContent?.includes("The moth market"))!;
  act(() => chapter.click());
  expect(chapter.getAttribute("aria-pressed")).toBe("true");
  expect(container.querySelector(".manuscript-page h3")?.textContent).toBe("The moth market");

  const note = container.querySelector<HTMLButtonElement>(".lore-link")!;
  act(() => note.click());
  expect(note.getAttribute("aria-expanded")).toBe("true");
  expect(container.querySelector("#linked-story-note")?.textContent).toContain("Its lanterns hold memories");
  act(() => note.click());
  expect(container.querySelector("#linked-story-note")).toBeNull();

  for (const name of ["Lore Vault", "Ideas", "Manuscript"]) {
    const tab = [...container.querySelectorAll<HTMLButtonElement>("[role='tab']")].find((button) => button.textContent === name)!;
    act(() => tab.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 })));
    expect(tab.getAttribute("aria-selected")).toBe("true");
    expect(container.querySelector("[role='tabpanel'][data-state='active']")).not.toBeNull();
  }
});
