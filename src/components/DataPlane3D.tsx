import { useEffect, useRef } from "react";

export function DataPlane3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Grid configuration
    const COLS = 16;
    const ROWS = 16;
    const SPACING = 40;
    const FOV = 320; // Perspective projection field-of-view

    // Create 3D points
    const points: { x: number; y: number; z: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // Center the grid around (0,0) in 3D space
        const x = (c - COLS / 2) * SPACING;
        const y = (r - ROWS / 2) * SPACING;
        points.push({ x, y, z: 0 });
      }
    }

    // Handle mouse move to tilt grid
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - width / 2;
      const my = e.clientY - rect.top - height / 2;
      // Normalized target values (-1 to 1)
      mouseRef.current.targetX = mx / (width / 2);
      mouseRef.current.targetY = my / (height / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.015;

      // Smoothly interpolate mouse tilt values
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Base rotation angles + mouse tilt
      const angleX = 1.1 + mouseRef.current.y * 0.15;
      const angleY = 0.2 + mouseRef.current.x * 0.15;
      const angleZ = time * 0.05;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      // Compute rotated points and dynamic heights (wave effect)
      const projected = points.map((p, idx) => {
        // Grid indices
        const r = Math.floor(idx / COLS);
        const c = idx % COLS;

        // Wave formula representing data throughput
        const wave =
          Math.sin(c * 0.35 + time) * Math.cos(r * 0.35 + time) * 22 +
          Math.sin((c + r) * 0.15 - time * 0.5) * 12;

        // Rotate in 3D
        // 1. Z rotation
        const rx1 = p.x * cosZ - p.y * sinZ;
        const ry1 = p.x * sinZ + p.y * cosZ;
        const rz1 = wave;

        // 2. Y rotation
        const rx2 = rx1 * cosY + rz1 * sinY;
        const ry2 = ry1;
        const rz2 = -rx1 * sinY + rz1 * cosY;

        // 3. X rotation
        const rx3 = rx2;
        const ry3 = ry2 * cosX - rz2 * sinX;
        const rz3 = ry2 * sinX + rz2 * cosX;

        // Translate in Z to pull grid away from camera
        const tz = rz3 + 300;

        // Perspective Projection
        const scale = FOV / tz;
        const px = rx3 * scale + width / 2;
        const py = ry3 * scale + height * 0.58;

        return { x: px, y: py, scale, depth: tz };
      });

      // Draw grid lines
      ctx.lineWidth = 0.8;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c;
          const p1 = projected[idx];

          // Draw horizontal connections
          if (c < COLS - 1) {
            const p2 = projected[idx + 1];
            const avgDepth = (p1.depth + p2.depth) / 2;
            const opacity = Math.max(0, 1 - (avgDepth - 180) / 280) * 0.25;

            ctx.strokeStyle = `rgba(255, 200, 1, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }

          // Draw vertical connections
          if (r < ROWS - 1) {
            const p2 = projected[idx + COLS];
            const avgDepth = (p1.depth + p2.depth) / 2;
            const opacity = Math.max(0, 1 - (avgDepth - 180) / 280) * 0.25;

            ctx.strokeStyle = `rgba(255, 200, 1, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw grid nodes (dots)
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        // Calculate point size and opacity based on perspective depth
        const opacity = Math.max(0, 1 - (p.depth - 180) / 280);
        const radius = Math.max(0.5, p.scale * 1.6);

        if (opacity > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          // Highlight active/pulsing node elements with Forsythia yellow
          ctx.fillStyle = `rgba(255, 200, 1, ${opacity * 0.85})`;
          ctx.fill();

          // Add a subtle outer glow for nodes closer to the screen
          if (p.depth < 250) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 1, ${opacity * 0.15})`;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-[0.18] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
