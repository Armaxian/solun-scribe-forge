import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';

// Custom shader material for the animated noise effect
const NoiseShaderMaterial = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { viewport } = useThree();

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Check for mobile/low DPR
  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || window.devicePixelRatio < 2);
  }, []);

  // Create shader material with useMemo to prevent recreation
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uIntensity: { value: isMobile ? 1.2 : 1.8 },
        uColors: {
          value: [
            new THREE.Color('#0B3D2E'), // Deep phthalo green
            new THREE.Color('#3b7253'), // Solun green
            new THREE.Color('#5aa07a'), // Mid green
          ],
        },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uIntensity;
        uniform vec3 uColors[3];
        uniform vec2 uResolution;
        varying vec2 vUv;

        // FBM noise functions
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          for(int i = 0; i < 4; i++) {
            value += amplitude * snoise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          vec2 uv = vUv;

          // Aspect-corrected coordinates
          vec2 p = uv * 2.0 - 1.0;
          p.x *= uResolution.x / uResolution.y;

          // Mouse influence with stronger drift
          vec2 mouseInfluence = (uMouse - 0.5) * 0.6;

          // Multi-octave FBM noise with time and mouse
          float noise1 = fbm(p * 0.6 + uTime * 0.06 + mouseInfluence);
          float noise2 = fbm(p * 1.0 - uTime * 0.04 + mouseInfluence * 0.8);
          float noise3 = fbm(p * 0.4 + uTime * 0.10 - mouseInfluence * 0.6);

          // Combine noise layers with more contrast
          float combinedNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
          combinedNoise = combinedNoise * 0.5 + 0.5; // Normalize to 0..1

          // Minimal vignette for very subtle edge falloff - much wider spread
          float distFromCenter = length(p * 0.3);
          float vignette = 1.0 - smoothstep(0.8, 2.5, distFromCenter);

          // Smooth color blending based on noise with more vibrant mixing
          vec3 color1 = mix(uColors[0], uColors[1], smoothstep(0.0, 0.6, combinedNoise));
          vec3 color2 = mix(uColors[1], uColors[2], smoothstep(0.4, 1.0, combinedNoise));
          vec3 color = mix(color1, color2, smoothstep(0.2, 0.8, combinedNoise));

          // Apply minimal vignette and higher intensity for full coverage
          float finalAlpha = vignette * uIntensity * 0.4;

          // Brighter output for better background visibility
          vec3 finalColor = color * (0.7 + finalAlpha * 0.3);
          finalColor = clamp(finalColor, 0.0, 1.0);

          gl_FragColor = vec4(finalColor, finalAlpha * 2.0);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [isMobile]);

  // Update intensity on mobile
  useEffect(() => {
    shaderMaterial.uniforms.uIntensity.value = isMobile ? 1.2 : 1.8;
  }, [isMobile, shaderMaterial]);

  // Animate with useFrame
  useFrame((state) => {
    if (!meshRef.current) return;

    // Update time uniform (freeze if reduced motion)
    if (!prefersReducedMotion) {
      shaderMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
    }

    // Pause if tab is hidden
    if (document.hidden) return;
  });

  return (
    <mesh ref={meshRef} material={shaderMaterial} position={[0, 0, 0]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
    </mesh>
  );
};

// Mouse tracking component inside Canvas
const MouseTracker = () => {
  const meshRef = useRef<THREE.Mesh>();

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      if (!meshRef.current) {
        // Find the mesh with shader material
        const scene = (window as any).__r3f_scene;
        if (scene) {
          scene.traverse((child: any) => {
            if (child.material?.uniforms?.uMouse) {
              meshRef.current = child;
            }
          });
        }
      }

      if (meshRef.current) {
        const material = meshRef.current.material as THREE.ShaderMaterial;
        if (material.uniforms?.uMouse) {
          material.uniforms.uMouse.value.set(
            e.clientX / window.innerWidth,
            1.0 - e.clientY / window.innerHeight
          );
        }
      }
    };

    let rafId: number;
    const throttledHandler = (e: MouseEvent) => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          handlePointerMove(e);
          rafId = 0;
        });
      }
    };

    window.addEventListener('mousemove', throttledHandler);
    return () => {
      window.removeEventListener('mousemove', throttledHandler);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
};

// Main HeroCanvas component
export default function HeroCanvas() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#3b7253]/8 via-[#5aa07a]/8 to-[#7ab896]/8" />
    );
  }

  return (
    <>
      {/* Canvas with shader */}
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 1.75]}
        className="pointer-events-none hero-canvas-gl"
        style={{ width: '100vw', height: '100vh' }}
        frameloop="always"
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0); // Transparent - parent handles background
          (window as any).__r3f_scene = scene;
        }}
      >
        <NoiseShaderMaterial />
        <MouseTracker />
      </Canvas>

      {/* Fallback for noscript */}
      <noscript>
        <div className="w-full h-full bg-gradient-to-br from-[#3b7253]/8 via-[#5aa07a]/8 to-[#7ab896]/8" />
      </noscript>
    </>
  );
}

// Named export for backward compatibility
export { HeroCanvas };
