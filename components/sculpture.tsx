"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

export function Sculpture() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);
  const resetRef = useRef<() => void>(() => {});

  useEffect(() => {
    pauseRef.current = paused;
  }, [paused]);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let disposed = false;
    let cleanup = () => {};
    import("three")
      .then((THREE) => {
        if (disposed) return;
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
        camera.position.set(0, 0, 9);
        scene.add(new THREE.HemisphereLight(0xffffff, 0x7e756a, 3));
        const key = new THREE.DirectionalLight(0xffffff, 4);
        key.position.set(-3, 5, 6);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xe7d8bc, 2);
        rim.position.set(5, -2, 2);
        scene.add(rim);
        const group = new THREE.Group();
        scene.add(group);
        const orange = new THREE.MeshStandardMaterial({
          color: 0xed582c,
          roughness: 0.32,
          metalness: 0.16,
        });
        const ivory = new THREE.MeshStandardMaterial({
          color: 0xf3ecdb,
          roughness: 0.36,
          metalness: 0.12,
        });
        const dark = new THREE.MeshStandardMaterial({
          color: 0x262d2c,
          roughness: 0.26,
          metalness: 0.3,
        });
        const geometry = new THREE.TorusGeometry(1.28, 0.36, 32, 88);
        const first = new THREE.Mesh(geometry, orange);
        first.rotation.set(0.62, 0.35, -0.55);
        first.position.set(-0.38, 0.32, 0);
        group.add(first);
        const second = new THREE.Mesh(geometry, ivory);
        second.rotation.set(-0.65, 1.1, 0.6);
        second.position.set(0.6, -0.3, 0.1);
        group.add(second);
        const sphereGeometry = new THREE.IcosahedronGeometry(0.43, 3);
        const sphere = new THREE.Mesh(sphereGeometry, dark);
        sphere.position.set(-1.85, -1.25, 0.7);
        group.add(sphere);
        const mini = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), orange);
        mini.position.set(1.9, 1.25, -0.2);
        group.add(mini);
        const pointer = { x: 0, y: 0 };
        const move = (event: PointerEvent) => {
          const bounds = container.getBoundingClientRect();
          pointer.x = (event.clientX - bounds.left) / bounds.width - 0.5;
          pointer.y = (event.clientY - bounds.top) / bounds.height - 0.5;
        };
        const leave = () => {
          pointer.x = 0;
          pointer.y = 0;
        };
        container.addEventListener("pointermove", move);
        container.addEventListener("pointerleave", leave);
        let needsRender = true;
        const resize = new ResizeObserver(() => {
          const width = container.clientWidth;
          const height = Math.max(container.clientHeight, 1);
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          needsRender = true;
        });
        resize.observe(container);
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let reduced = motion.matches;
        const motionChange = () => {
          reduced = motion.matches;
          if (reduced) setPaused(true);
        };
        motion.addEventListener("change", motionChange);
        if (reduced) setPaused(true);
        let visible = true;
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        });
        observer.observe(container);
        let frame = 0;
        let time = 0;
        resetRef.current = () => {
          time = 0;
          group.rotation.set(0, 0, 0);
          group.position.y = 0;
          leave();
          needsRender = true;
        };
        const render = () => {
          frame = requestAnimationFrame(render);
          if (!visible || document.hidden) return;
          if ((pauseRef.current || reduced) && !needsRender) return;
          if (!pauseRef.current && !reduced) {
            time += 0.008;
            group.rotation.y += (pointer.x * 0.32 - group.rotation.y) * 0.035;
            group.rotation.x += (pointer.y * 0.18 - group.rotation.x) * 0.035;
            group.position.y = Math.sin(time) * 0.13;
            mini.rotation.y += 0.008;
          }
          renderer.render(scene, camera);
          needsRender = false;
        };
        render();
        setReady(true);
        cleanup = () => {
          cancelAnimationFrame(frame);
          resize.disconnect();
          observer.disconnect();
          motion.removeEventListener("change", motionChange);
          container.removeEventListener("pointermove", move);
          container.removeEventListener("pointerleave", leave);
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh) object.geometry.dispose();
          });
          orange.dispose();
          ivory.dispose();
          dark.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {});
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="sculpture-shell">
      <div ref={host} className="sculpture" aria-hidden="true" />
      <div
        className={`sculpture-fallback ${ready ? "is-ready" : ""}`}
        aria-hidden
      >
        <span />
        <span />
      </div>
      <span className="scene-note scene-note-top">
        EXPERIMENT NO. 001
        <br />
        <b>CONNECTED BY CURIOSITY</b>
      </span>
      <div className="scene-controls">
        <span>{ready ? "INTERACTIVE 3D" : "CONNECTED FORMS"}</span>
        {ready && (
          <>
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? "Play 3D animation" : "Pause 3D animation"}
            >
              {paused ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <button
              type="button"
              onClick={() => resetRef.current()}
              aria-label="Reset 3D view"
            >
              <RotateCcw size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
