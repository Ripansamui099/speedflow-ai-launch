import { useEffect, useRef } from "react";
import * as THREE from "three";

export function BrainCore3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 14;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Main Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Color tokens
    const forsythia = new THREE.Color("#ffc801");
    const saffron = new THREE.Color("#ff9932");
    const powder = new THREE.Color("#f1f6f4");
    const mint = new THREE.Color("#d9e8e2");

    // 1. NESTED CORES (Double wireframe sphere core for engine look)
    const core1Geo = new THREE.SphereGeometry(1.2, 16, 16);
    const core1Mat = new THREE.MeshBasicMaterial({
      color: forsythia,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const core1 = new THREE.Mesh(core1Geo, core1Mat);
    mainGroup.add(core1);

    const core2Geo = new THREE.SphereGeometry(0.8, 12, 12);
    const core2Mat = new THREE.MeshBasicMaterial({
      color: saffron,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const core2 = new THREE.Mesh(core2Geo, core2Mat);
    mainGroup.add(core2);

    // 2. FIBONACCI NODE NETWORK (Outer node shell)
    const nodeCount = 50;
    const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const nodes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 2.8 + Math.sin(i * 1.5) * 0.3; // slight spherical wave

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Randomize node colors for visual richness (Forsythia, Saffron, Powder)
      const color = i % 3 === 0 ? forsythia : i % 3 === 1 ? saffron : powder;
      const nodeMat = new THREE.MeshBasicMaterial({ color });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(x, y, z);

      mainGroup.add(node);
      nodes.push(node);
      nodePositions.push(node.position);
    }

    // Proximity connections
    const lineMat = new THREE.LineBasicMaterial({
      color: saffron,
      transparent: true,
      opacity: 0.15,
    });

    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const posA = nodePositions[i];
      // Connect to the 2 closest nodes
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

    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    mainGroup.add(lines);

    // 3. SPINNING GYRO RINGS (saturn-like data trails)
    const ring1Group = new THREE.Group();
    const ring2Group = new THREE.Group();
    mainGroup.add(ring1Group);
    mainGroup.add(ring2Group);

    // Tilt the rings
    ring1Group.rotation.x = Math.PI / 4;
    ring1Group.rotation.y = Math.PI / 6;

    ring2Group.rotation.x = -Math.PI / 5;
    ring2Group.rotation.z = Math.PI / 4;

    const createRingParticles = (radius: number, count: number, color: THREE.Color) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        pos[i * 3] = Math.cos(angle) * radius;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = Math.sin(angle) * radius;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color,
        size: 0.08,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Points(geo, mat);
    };

    const ring1 = createRingParticles(3.8, 80, forsythia);
    const ring2 = createRingParticles(4.2, 90, saffron);
    ring1Group.add(ring1);
    ring2Group.add(ring2);

    // 4. FREE FLOATING SWARM PARTICLES
    const swarmCount = 100;
    const swarmGeo = new THREE.BufferGeometry();
    const swarmPos = new Float32Array(swarmCount * 3);
    const swarmSpeeds = new Float32Array(swarmCount);
    const swarmRadii = new Float32Array(swarmCount);
    const swarmOffsets = new Float32Array(swarmCount);

    for (let i = 0; i < swarmCount; i++) {
      swarmSpeeds[i] = 0.3 + Math.random() * 0.7;
      swarmRadii[i] = 2.5 + Math.random() * 2.0;
      swarmOffsets[i] = Math.random() * Math.PI * 2;

      swarmPos[i * 3] = 0;
      swarmPos[i * 3 + 1] = 0;
      swarmPos[i * 3 + 2] = 0;
    }
    swarmGeo.setAttribute("position", new THREE.BufferAttribute(swarmPos, 3));

    // Multi-colored particles (forsythia, saffron, powder, mint)
    const swarmColors = new Float32Array(swarmCount * 3);
    for (let i = 0; i < swarmCount; i++) {
      const c = i % 4 === 0 ? forsythia : i % 4 === 1 ? saffron : i % 4 === 2 ? powder : mint;
      swarmColors[i * 3] = c.r;
      swarmColors[i * 3 + 1] = c.g;
      swarmColors[i * 3 + 2] = c.b;
    }
    swarmGeo.setAttribute("color", new THREE.BufferAttribute(swarmColors, 3));

    const swarmMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const swarm = new THREE.Points(swarmGeo, swarmMat);
    mainGroup.add(swarm);

    // Mouse interactive tilt
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      targetRotationY = (x / (width / 2)) * 0.35;
      targetRotationX = (y / (height / 2)) * 0.35;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Render loop
    let time = 0;
    let reqId: number;

    const animate = () => {
      time += 0.01;

      // Mouse follow rotation
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

      // Constant core spin
      mainGroup.rotation.y += 0.001;

      // Rotate Saturn rings on their own speeds
      ring1Group.rotation.y += 0.008;
      ring2Group.rotation.y -= 0.006;

      // Spin inner cores in opposite directions
      core1.rotation.y += 0.004;
      core1.rotation.x += 0.002;
      core2.rotation.y -= 0.006;
      core2.rotation.z += 0.003;

      // Pulse sizes
      const pulse1 = 1.0 + Math.sin(time * 2.5) * 0.06;
      const pulse2 = 1.0 + Math.cos(time * 3.5) * 0.08;
      core1.scale.set(pulse1, pulse1, pulse1);
      core2.scale.set(pulse2, pulse2, pulse2);

      // Animate swarm particles
      const posAttr = swarmGeo.getAttribute("position") as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < swarmCount; i++) {
        const speed = swarmSpeeds[i] * 0.6;
        const radius = swarmRadii[i];
        const offset = swarmOffsets[i];

        // Orbit paths
        const theta = time * speed + offset;
        const phi = (i / swarmCount) * Math.PI;

        posArr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        posArr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArr[i * 3 + 2] = radius * Math.cos(phi);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      core1Geo.dispose();
      core1Mat.dispose();
      core2Geo.dispose();
      core2Mat.dispose();
      nodeGeo.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      swarmGeo.dispose();
      swarmMat.dispose();
      ring1.geometry.dispose();
      (ring1.material as THREE.Material).dispose();
      ring2.geometry.dispose();
      (ring2.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
