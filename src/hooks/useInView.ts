import { useEffect, useRef, useState } from "react";
export function useInView<T extends Element = HTMLElement>(rootMargin="0px"){
  const ref = useRef<T|null>(null);
  const [inView, set] = useState(false);
  useEffect(() => {
    if(!ref.current) return;
    const io = new IntersectionObserver(([entry]) => set(entry.isIntersecting), { rootMargin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, inView } as const;
}
