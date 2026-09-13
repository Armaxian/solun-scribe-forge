import { useEffect, useRef, useState } from "react";

import InkflowCanvas from "@/components/Inkflow/InkflowCanvas";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface TypewriterTextInkProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
  cursorBlink?: boolean;
  loop?: boolean;
  pauseTime?: number;
}

export function TypewriterTextInk({
  text,
  speed = 100,
  delay = 500,
  className = "",
  onComplete,
  showCursor = true,
  cursorBlink = true,
  loop = false,
  pauseTime = 4000,
}: TypewriterTextInkProps) {
  const [ready, setReady] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hasCompletedFirstWord, setHasCompletedFirstWord] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const textRef = useRef<HTMLSpanElement | null>(null);

  const words = Array.isArray(text) ? text : [text];
  const currentText = words[currentWordIndex];

  useEffect(() => {
    const handleVisibility = () => setIsHidden(document.hidden);
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Typewriter logic
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (!isDeleting && currentIndex < currentText.length) {
      const randomSpeed = speed + (Math.random() - 0.5) * 20;
      const timer = setTimeout(() => {
        setDisplayedText(currentText.slice(0, currentIndex + 1));
        setCurrentIndex((prev) => prev + 1);
      }, Math.max(50, randomSpeed));
      return () => clearTimeout(timer);
    }

    if (!isDeleting && currentIndex >= currentText.length) {
      if (!hasCompletedFirstWord && onComplete) {
        setHasCompletedFirstWord(true);
        onComplete();
      }

      if (loop) {
        const pauseTimer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
        return () => clearTimeout(pauseTimer);
      }
      return;
    }

    if (isDeleting && currentIndex > 0) {
      const deleteSpeed = speed * 0.5;
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setDisplayedText(currentText.slice(0, currentIndex - 1));
      }, deleteSpeed);
      return () => clearTimeout(timer);
    }

    if (isDeleting && currentIndex <= 0) {
      setIsDeleting(false);
      setCurrentIndex(0);
      setDisplayedText("");

      if (words.length > 1) {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [
    currentIndex,
    isTyping,
    isDeleting,
    currentText,
    speed,
    onComplete,
    hasCompletedFirstWord,
    loop,
    pauseTime,
    words.length,
  ]);

  // If reduced motion, just show regular black typewriter
  if (prefersReduced) {
    return (
      <span ref={textRef} className={cn("typewriter", className)}>
        {displayedText}
        {showCursor && (isTyping || isDeleting) && (
          <span className={cn("typewriter-caret", cursorBlink && "animate-pulse")}>▌</span>
        )}
      </span>
    );
  }

  // Create escaped text for SVG
  const escapedText = (displayedText + (showCursor && (isTyping || isDeleting) ? "▌" : ""))
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  return (
    <span className={cn("relative inline-block min-h-[1.5em]", className)}>
      {/* Invisible spacer to maintain layout */}
      <span className="typewriter opacity-0 pointer-events-none select-none" aria-hidden="true">
        {displayedText || "\u00A0"}
        {showCursor && (isTyping || isDeleting) && (
          <span className="typewriter-caret">▌</span>
        )}
      </span>

      {/* Visible ink effect text */}
      <span className="absolute inset-0 flex items-center pointer-events-none overflow-visible">
        {/* Ink canvas with text mask */}
        <span
          className="w-full h-full absolute inset-0"
          style={{
            WebkitMaskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><text x="0" y="75" font-family="Courier Prime, Courier, monospace" font-size="80" font-weight="inherit" fill="white">${escapedText}</text></svg>')`,
            maskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><text x="0" y="75" font-family="Courier Prime, Courier, monospace" font-size="80" font-weight="inherit" fill="white">${escapedText}</text></svg>')`,
            WebkitMaskSize: "auto 100%",
            maskSize: "auto 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "left center",
            maskPosition: "left center",
          }}
        >
          <InkflowCanvas
            className="w-full h-full"
            paused={isHidden}
            onReady={() => setReady(true)}
          />
        </span>
      </span>

      {/* Fallback text before canvas ready */}
      {!ready && (
        <span className="absolute inset-0 flex items-center pointer-events-none">
          <span className="typewriter">
            {displayedText}
            {showCursor && (isTyping || isDeleting) && (
              <span className={cn("typewriter-caret", cursorBlink && "animate-pulse")}>▌</span>
            )}
          </span>
        </span>
      )}
    </span>
  );
}

