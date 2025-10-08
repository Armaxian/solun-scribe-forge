import { useEffect, useRef, useState } from "react";
import InkflowCanvas from "./InkflowCanvas";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = { text?: string; className?: string; paused?: boolean };
export default function InkflowTitle({ text="Write worlds.", className="", paused=false }: Props){
  const [ready, setReady] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement|null>(null);
  const maskId = useRef(`ink-text-mask-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const handleVisibility = () => setIsHidden(document.hidden);
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // If reduced motion, just show gradient text
  if (prefersReduced) {
    return (
      <div ref={wrapRef} className={`relative min-h-[200px] flex items-center justify-center ${className}`}>
        <h1 className="text-gradient text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] 2xl:text-[16rem] font-extrabold tracking-tight text-center">
          {text}
        </h1>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`relative min-h-[250px] flex items-center justify-center ${className}`}>
      <h1 className="sr-only">{text}</h1>
      
      {/* Hidden SVG that defines the mask */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <mask id={maskId.current}>
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="55%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="180"
              fontWeight="800"
              fontFamily="Courier New, Courier, monospace"
              letterSpacing="-2px"
              fill="white"
            >
              {text}
            </text>
          </mask>
        </defs>
      </svg>

      {/* Canvas container with CSS mask applied */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          WebkitMaskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 250"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-size="180" font-weight="800" font-family="Courier New, Courier, monospace" letter-spacing="-2px" fill="white">${text}</text></svg>')`,
          maskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 250"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-size="180" font-weight="800" font-family="Courier New, Courier, monospace" letter-spacing="-2px" fill="white">${text}</text></svg>')`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1000px', height: '250px' }}>
          <InkflowCanvas 
            className="w-full h-full" 
            paused={paused || isHidden} 
            onReady={()=>setReady(true)} 
          />
        </div>
      </div>

      {/* Fallback gradient text shown until canvas is ready */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-gradient text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] 2xl:text-[16rem] font-extrabold tracking-tight px-4">
            {text}
          </span>
        </div>
      )}
    </div>
  );
}
