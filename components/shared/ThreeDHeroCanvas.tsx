'use client';

import * as React from 'react';
import * as THREE from 'three';

export function ThreeDHeroCanvas() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = React.useState(false);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 14;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // 1. Center Metallic Glass Torus Knot
      const torusGeo = new THREE.TorusKnotGeometry(2.2, 0.45, 120, 18);
      const torusMat = new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        metalness: 0.9,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
        emissive: 0x0369a1,
        emissiveIntensity: 0.2,
      });
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      scene.add(torusMesh);

      // 2. Outer Geodesic Wireframe Shield
      const icoGeo = new THREE.IcosahedronGeometry(4.2, 2);
      const icoMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const icoMesh = new THREE.Mesh(icoGeo, icoMat);
      scene.add(icoMesh);

      // 3. Orbital Neon Ring 1
      const ring1Geo = new THREE.TorusGeometry(3.5, 0.05, 16, 100);
      const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1Mesh.rotation.x = Math.PI / 3;
      scene.add(ring1Mesh);

      // 4. Orbital Neon Ring 2
      const ring2Geo = new THREE.TorusGeometry(4.8, 0.04, 16, 100);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
      const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2Mesh.rotation.y = Math.PI / 4;
      scene.add(ring2Mesh);

      // 5. Floating Glowing Glass Crystals
      const crystalGroup = new THREE.Group();
      const crystalGeo = new THREE.OctahedronGeometry(0.4, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        metalness: 0.5,
        roughness: 0.2,
        emissive: 0x059669,
        emissiveIntensity: 0.4,
      });

      for (let i = 0; i < 8; i++) {
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        const angle = (i / 8) * Math.PI * 2;
        crystal.position.set(Math.cos(angle) * 5.2, Math.sin(angle) * 2.5, (Math.random() - 0.5) * 3);
        crystalGroup.add(crystal);
      }
      scene.add(crystalGroup);

      // 6. Particle Field
      const particleCount = 140;
      const particlesGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 35;
        particlePositions[i + 1] = (Math.random() - 0.5) * 35;
        particlePositions[i + 2] = (Math.random() - 0.5) * 35;
      }

      particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x7dd3fc,
        size: 0.16,
        transparent: true,
        opacity: 0.85,
      });
      const particleSystem = new THREE.Points(particlesGeo, particleMat);
      scene.add(particleSystem);

      // 7. Multi-Color Dynamic Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      const cyanPointLight = new THREE.PointLight(0x38bdf8, 4, 40);
      cyanPointLight.position.set(12, 12, 10);
      scene.add(cyanPointLight);

      const purplePointLight = new THREE.PointLight(0xa855f7, 3, 40);
      purplePointLight.position.set(-12, -10, 8);
      scene.add(purplePointLight);

      const emeraldPointLight = new THREE.PointLight(0x34d399, 2.5, 30);
      emeraldPointLight.position.set(0, 15, -10);
      scene.add(emeraldPointLight);

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
        const w = containerRef.current.clientWidth || 340;
        const h = containerRef.current.clientHeight || 340;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotations
        torusMesh.rotation.x = elapsedTime * 0.4;
        torusMesh.rotation.y = elapsedTime * 0.5;

        icoMesh.rotation.x = -elapsedTime * 0.15;
        icoMesh.rotation.y = -elapsedTime * 0.2;

        ring1Mesh.rotation.z = elapsedTime * 0.3;
        ring2Mesh.rotation.z = -elapsedTime * 0.25;

        crystalGroup.rotation.y = elapsedTime * 0.3;
        particleSystem.rotation.y = elapsedTime * 0.05;

        // Smooth mouse inertia tilt
        scene.rotation.y += (mouseX * 0.3 - scene.rotation.y) * 0.05;
        scene.rotation.x += (-mouseY * 0.3 - scene.rotation.x) * 0.05;

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
        torusGeo.dispose();
        torusMat.dispose();
        icoGeo.dispose();
        icoMat.dispose();
        ring1Geo.dispose();
        ring1Mat.dispose();
        ring2Geo.dispose();
        ring2Mat.dispose();
        crystalGeo.dispose();
        crystalMat.dispose();
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
      <div className="w-full h-full flex items-center justify-center p-6 text-center text-xs font-semibold text-sky-400 bg-sky-950/40 rounded-2xl border border-sky-800/50 shadow-inner">
        Enterprise 3D Security Engine Active
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[320px] max-h-[440px] relative pointer-events-none"
    />
  );
}

