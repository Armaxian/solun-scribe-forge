import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || prefersReducedMotion) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create glassy orbs with premium materials
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    
    const materials = [
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0B3D2E'),
        transmission: 0.85,
        roughness: 0.2,
        thickness: 0.6,
        transparent: true,
        opacity: 0.8,
      }),
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#556B2F'),
        transmission: 0.8,
        roughness: 0.25,
        thickness: 0.5,
        transparent: true,
        opacity: 0.7,
      }),
    ];

    const orbs = [
      { mesh: new THREE.Mesh(geometry, materials[0]), speed: 0.0003, radiusX: 3, radiusY: 2 },
      { mesh: new THREE.Mesh(geometry, materials[1]), speed: 0.0004, radiusX: 2.5, radiusY: 1.8 },
    ];

    orbs.forEach(({ mesh }, i) => {
      mesh.position.set(i * 2 - 1, i * 0.5, 0);
      mesh.scale.set(0.8 + i * 0.3, 0.8 + i * 0.3, 0.8 + i * 0.3);
      scene.add(mesh);
    });

    // Subtle lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    // Animation with 30fps cap
    let lastFrameTime = 0;
    const fps = 30;
    const frameDelay = 1000 / fps;
    let animationId: number;
    let time = 0;

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);

      const delta = currentTime - lastFrameTime;
      if (delta < frameDelay) return;
      
      lastFrameTime = currentTime - (delta % frameDelay);
      time += 0.001;

      // Gentle orbital motion
      orbs.forEach(({ mesh, speed, radiusX, radiusY }) => {
        mesh.position.x = Math.cos(time * speed * 1000) * radiusX;
        mesh.position.y = Math.sin(time * speed * 1000) * radiusY;
        mesh.rotation.y += 0.001;
        mesh.rotation.x += 0.0005;
      });

      renderer.render(scene, camera);
    };

    // Pause when tab hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        lastFrameTime = performance.now();
        animationId = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Responsive
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      renderer.dispose();
      geometry.dispose();
      materials.forEach(m => m.dispose());
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className="absolute inset-0 bg-gradient-subtle opacity-20" />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{ mixBlendMode: "soft-light" }}
    />
  );
}
