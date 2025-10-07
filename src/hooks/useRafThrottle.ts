import { useRef, useEffect } from "react";
export function useRafThrottle(cb: (dt: number)=>void, fps=30){
  const last = useRef(0); const id = useRef(0);
  useEffect(() => {
    const frame = (t: number) => {
      const dt = t - last.current;
      const min = 1000 / fps;
      if (dt >= min) { last.current = t; cb(dt); }
      id.current = requestAnimationFrame(frame);
    };
    id.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id.current);
  }, [cb, fps]);
}
