'use client';

import * as React from 'react';
import * as THREE from 'three';

export function ThreeDHeroCanvas() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = React.useState(false);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 15;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Outer Icosahedron
      const icoGeo = new THREE.IcosahedronGeometry(4, 2);
      const icoMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const icoMesh = new THREE.Mesh(icoGeo, icoMat);
      scene.add(icoMesh);

      // Inner Torus Knot
      const torusGeo = new THREE.TorusKnotGeometry(2, 0.4, 100, 16);
      const torusMat = new THREE.MeshPhysicalMaterial({
        color: 0x6366f1,
        metalness: 0.8,
        roughness: 0.2,
      });
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      scene.add(torusMesh);

      // Particles
      const particleCount = 100;
      const particlesGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 30;
        particlePositions[i + 1] = (Math.random() - 0.5) * 30;
        particlePositions[i + 2] = (Math.random() - 0.5) * 30;
      }

      particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.15,
        transparent: true,
        opacity: 0.7,
      });
      const particleSystem = new THREE.Points(particlesGeo, particleMat);
      scene.add(particleSystem);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0x38bdf8, 3, 50);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      let mouseX = 0;
      let mouseY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };

      window.addEventListener('mousemove', handleMouseMove);

      const handleResize = () => {
        if (!containerRef.current || !renderer) return;
        const w = containerRef.current.clientWidth || 300;
        const h = containerRef.current.clientHeight || 300;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        icoMesh.rotation.x += 0.002;
        icoMesh.rotation.y += 0.003;

        torusMesh.rotation.x += 0.008;
        torusMesh.rotation.y += 0.01;

        particleSystem.rotation.y += 0.001;

        torusMesh.rotation.y += (mouseX * 0.5 - torusMesh.rotation.y) * 0.05;
        torusMesh.rotation.x += (-mouseY * 0.5 - torusMesh.rotation.x) * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (container && renderer && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        icoGeo.dispose();
        icoMat.dispose();
        torusGeo.dispose();
        torusMat.dispose();
        particlesGeo.dispose();
        particleMat.dispose();
        renderer.dispose();
      };
    } catch (e) {
      console.warn('WebGL 3D canvas initialization skipped:', e);
      setHasWebGLError(true);
    }
  }, []);

  if (hasWebGLError) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 text-center text-xs text-sky-400 bg-sky-950/30 rounded-2xl border border-sky-800/40">
        Enterprise 3D Security Shield & Workflow Engine
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] max-h-[420px] relative pointer-events-none"
    />
  );
}
