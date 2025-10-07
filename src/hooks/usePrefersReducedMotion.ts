import { useEffect, useState } from "react";
export function usePrefersReducedMotion(){
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(m.matches);
    const on = (e: MediaQueryListEvent)=>setPrefers(e.matches);
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);
  return prefers;
}
