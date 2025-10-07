import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import frag from "./shaders/inkflow.frag.glsl?raw";
import vert from "./shaders/quad.vert.glsl?raw";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useRafThrottle } from "@/hooks/useRafThrottle";

type Props = { className?: string; paused?: boolean; onReady?: ()=>void };

export default function InkflowCanvas({ className, paused=false, onReady }: Props){
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const prefersReduced = usePrefersReducedMotion();
  const state = useRef<{ renderer:THREE.WebGLRenderer; scene:THREE.Scene; camera:THREE.Camera; uniforms:any }|null>(null);
  const t0 = useRef(performance.now());

  useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      u_time: { value: 0 },
      u_res:  { value: new THREE.Vector2(1,1) },
    };
    const mat = new THREE.ShaderMaterial({ 
      vertexShader: vert, 
      fragmentShader: frag, 
      uniforms, 
      transparent: true,
      glslVersion: THREE.GLSL1
    });
    const geo = new THREE.BufferGeometry();
    const verts = new Float32Array([-1,-1,0,  3,-1,0,  -1,3,0]);
    geo.setAttribute("position", new THREE.BufferAttribute(verts, 3)); // fullscreen triangle
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    state.current = { renderer, scene, camera, uniforms };

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.u_res.value.set(w, h);
    };
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    resize();
    onReady?.();
    return () => { ro.disconnect(); renderer.dispose(); geo.dispose(); mat.dispose(); state.current=null; };
  }, []);

  useRafThrottle(() => {
    const s = state.current; if(!s || paused || prefersReduced) return;
    const t = (performance.now() - t0.current) / 1000;
    s.uniforms.u_time.value = t;
    s.renderer.render(s.scene, s.camera);
  }, 30); // 30 FPS cap

  // render one static frame if reduced motion
  useEffect(() => {
    const s = state.current; if(!s) return;
   if (prefersReduced) { s.uniforms.u_time.value = 12.34; s.renderer.render(s.scene, s.camera); }
  }, [prefersReduced]);

  useEffect(() => {
    const onVis = () => { /* pause handled by prop */ };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
