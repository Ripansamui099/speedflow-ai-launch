import { useEffect, useRef } from "react";
import * as THREE from "three";

export function BrainCore3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 15;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all objects (for ease of rotation)
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // Color spec tokens
    const forsythiaColor = new THREE.Color("#ffc801");
    const saffronColor = new THREE.Color("#ff9932");

    // 1. Create central core node (glowing mesh sphere)
    const coreGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: forsythiaColor,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    brainGroup.add(coreMesh);

    // 2. Create neural nodes & connecting lines
    const nodeCount = 45;
    const nodeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: forsythiaColor });
    const nodes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];

    // Distribute nodes spherically using fibonacci lattice
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 3.2 + Math.sin(i * 1.7) * 0.4; // organic slight variance

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      nodeMesh.position.set(x, y, z);
      brainGroup.add(nodeMesh);
      nodes.push(nodeMesh);
      nodePositions.push(nodeMesh.position);
    }

    // Connect nodes with line segments based on proximity
    const lineMaterial = new THREE.LineBasicMaterial({
      color: saffronColor,
      transparent: true,
      opacity: 0.2,
    });

    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const posA = nodePositions[i];
      // Find 2 closest nodes to connect to
      const connections = nodePositions
        .map((posB, idx) => ({ idx, dist: posA.distanceTo(posB) }))
        .filter((item) => item.idx !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 2);

      connections.forEach((conn) => {
        linePoints.push(posA);
        linePoints.push(nodePositions[conn.idx]);
      });
    }

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    brainGroup.add(lines);

    // 3. Orbiting Data Packet Particles
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const randomSpeeds = new Float32Array(particleCount);
    const randomRadii = new Float32Array(particleCount);
    const randomOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      randomSpeeds[i] = 0.2 + Math.random() * 0.8;
      randomRadii[i] = 3.0 + Math.random() * 1.5;
      randomOffsets[i] = Math.random() * Math.PI * 2;

      // Start position
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle texture / material (glowing circular points)
    const pMaterial = new THREE.PointsMaterial({
      color: forsythiaColor,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, pMaterial);
    brainGroup.add(particles);

    // Mouse movement variables
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - width / 2;
      const y = event.clientY - rect.top - height / 2;
      targetRotationY = (x / (width / 2)) * 0.4;
      targetRotationX = (y / (height / 2)) * 0.4;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation variables
    let time = 0;
    let reqId: number;

    const animate = () => {
      time += 0.01;

      // Smooth mouse rotation response
      brainGroup.rotation.y += (targetRotationY - brainGroup.rotation.y) * 0.05;
      brainGroup.rotation.x += (targetRotationX - brainGroup.rotation.x) * 0.05;

      // Constant base rotation
      brainGroup.rotation.y += 0.002;

      // Orbital physics calculation for data particles
      const posAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const speed = randomSpeeds[i] * 0.8;
        const radius = randomRadii[i];
        const offset = randomOffsets[i];

        // Spherical orbital paths
        const theta = time * speed + offset;
        const phi = (i / particleCount) * Math.PI;

        posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i * 3 + 2] = radius * Math.cos(phi);
      }
      posAttr.needsUpdate = true;

      // Subtle pulse scale for core nodes
      const pulse = 1.0 + Math.sin(time * 3) * 0.08;
      coreMesh.scale.set(pulse, pulse, pulse);

      // Render
      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coreGeometry.dispose();
      coreMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      particleGeometry.dispose();
      pMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Decorative radar/ping rings in CSS background for depth */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="absolute w-[280px] h-[280px] rounded-full border border-[var(--forsythia)] animate-[ping_8s_infinite]" />
        <div className="absolute w-[180px] h-[180px] rounded-full border border-[var(--saffron)] animate-[ping_12s_infinite]" />
        <div className="absolute w-[80px] h-[80px] rounded-full border border-[var(--forsythia)] animate-[ping_16s_infinite]" />
      </div>

      <div ref={containerRef} className="w-full h-full min-h-[380px]" />
    </div>
  );
}
