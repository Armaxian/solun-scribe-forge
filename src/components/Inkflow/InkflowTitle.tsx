import { useEffect, useRef, useState } from "react";
import InkflowCanvas from "./InkflowCanvas";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = { text?: string; className?: string; paused?: boolean };
export default function InkflowTitle({ text="Write worlds.", className="", paused=false }: Props){
  const [ready, setReady] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement|null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if(!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      const r = wrapRef.current!.getBoundingClientRect();
      setBox({ w: Math.ceil(r.width), h: Math.ceil(r.height) });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibility = () => setIsHidden(document.hidden);
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div ref={wrapRef} className={`relative min-h-[120px] ${className}`}>
      {/* Fallback static gradient text for SSR / mask-less browsers */}
      <h1 className="sr-only">{text}</h1>
      <svg width={box.w || '100%'} height={box.h || 120} className="block" role="img" aria-label={text}>
        <defs>
          <mask id="ink-mask" x="0" y="0" width="1" height="1">
            <rect width="100%" height="100%" fill="black" />
            <text x="50%" y="50%" dy=".32em"
                  textAnchor="middle"
                  fontWeight="800"
                  fontSize={Math.max(48, Math.min(112, box.w * 0.11))}
                  letterSpacing="-0.02em"
                  fontFamily="Inter, system-ui, sans-serif"
                  fill="white">{text}</text>
          </mask>
        </defs>
        <g mask="url(#ink-mask)">
          {/* canvas sits under the mask area */}
          <foreignObject x="0" y="0" width="100%" height="100%">
            <div {...({'xmlns': 'http://www.w3.org/1999/xhtml'} as any)} style={{width:"100%",height:"100%", background:"transparent"}}>
              <InkflowCanvas className="w-full h-full" paused={paused || isHidden} onReady={()=>setReady(true)} />
            </div>
          </foreignObject>
        </g>
        {/* subtle glow effect to enhance the vibrant shader */}
        <rect width="100%" height="100%" fill="url(#text-glow)" opacity="0.4"/>
        <defs>
          <radialGradient id="text-glow" cx="50%" cy="50%" r="70%">
            <stop offset="0%"  stopColor="rgba(138, 43, 226, 0.15)"/>
            <stop offset="50%" stopColor="rgba(0, 206, 209, 0.10)"/>
            <stop offset="100%" stopColor="rgba(255, 105, 180, 0.05)"/>
          </radialGradient>
        </defs>
      </svg>
      {/* Static CSS gradient fallback when JS/WebGL unavailable */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className={`text-gradient text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight transition-opacity duration-500 ${ready && !prefersReduced ? 'opacity-0' : 'opacity-100'}`}>
          {text}
        </span>
      </div>
    </div>
  );
}
