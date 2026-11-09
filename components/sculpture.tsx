"use client";

import { useEffect, useRef, useState } from "react";
import { Expand, Pause, Play, RotateCcw } from "lucide-react";

export function Sculpture() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const expandRef = useRef(false);
  const resetRef = useRef<() => void>(() => {});

  useEffect(() => {
    pauseRef.current = paused;
  }, [paused]);
  useEffect(() => {
    expandRef.current = expanded;
  }, [expanded]);
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
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
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
        const orbit = new THREE.Mesh(
          new THREE.TorusGeometry(2.25, 0.012, 8, 120),
          new THREE.MeshBasicMaterial({ color: 0xb7b6a8, transparent: true, opacity: 0.45 }),
        );
        orbit.rotation.set(1.1, 0.2, -0.35);
        group.add(orbit);
        const pointer = { x: 0, y: 0 };
        const drag = { active: false, x: 0, rotation: 0 };
        let needsRender = true;
        const move = (event: PointerEvent) => {
          const bounds = container.getBoundingClientRect();
          pointer.x = (event.clientX - bounds.left) / bounds.width - 0.5;
          pointer.y = (event.clientY - bounds.top) / bounds.height - 0.5;
          if (drag.active) {
            drag.rotation += (event.clientX - drag.x) * 0.009;
            drag.x = event.clientX;
          }
        };
        const down = (event: PointerEvent) => {
          if (event.button !== 0) return;
          drag.active = true;
          drag.x = event.clientX;
          container.setPointerCapture(event.pointerId);
          container.classList.add("is-dragging");
        };
        const up = () => {
          drag.active = false;
          container.classList.remove("is-dragging");
        };
        const leave = () => {
          pointer.x = 0;
          pointer.y = 0;
        };
        container.addEventListener("pointermove", move);
        container.addEventListener("pointerleave", leave);
        container.addEventListener("pointerdown", down);
        container.addEventListener("pointerup", up);
        container.addEventListener("pointercancel", up);
        container.addEventListener("lostpointercapture", up);
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
        const motionChange = () => {
          if (motion.matches) {
            pauseRef.current = true;
            setPaused(true);
          }
        };
        motion.addEventListener("change", motionChange);
        motionChange();
        let visible = true;
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        });
        observer.observe(container);
        let frame = 0;
        let time = 0;
        let previous = performance.now();
        let spread = 0;
        let lastExpanded = false;
        resetRef.current = () => {
          time = 0;
          drag.rotation = 0;
          spread = 0;
          expandRef.current = false;
          setExpanded(false);
          group.rotation.set(0, 0, 0);
          group.position.y = 0;
          leave();
          needsRender = true;
        };
        const render = (now: number) => {
          frame = requestAnimationFrame(render);
          const delta = Math.min((now - previous) / 1000, 0.05);
          previous = now;
          if (!visible || document.hidden) return;
          if (lastExpanded !== expandRef.current) {
            lastExpanded = expandRef.current;
            needsRender = true;
          }
          if (pauseRef.current && !needsRender) return;
          const blend = 1 - Math.exp(-delta * 5);
          spread = pauseRef.current
            ? Number(expandRef.current)
            : THREE.MathUtils.lerp(spread, Number(expandRef.current), blend);
          if (!pauseRef.current) {
            time += delta;
            const scroll = Math.min(window.scrollY / window.innerHeight, 1);
            group.rotation.y += (pointer.x * 0.5 + drag.rotation + scroll * 0.7 - group.rotation.y) * blend;
            group.rotation.x += (pointer.y * 0.3 - group.rotation.x) * blend;
            group.position.y = Math.sin(time * 0.85) * 0.15;
          }
          first.rotation.set(0.62 + Math.sin(time * 0.45) * 0.3, 0.35 + time * 0.24, -0.55);
          second.rotation.set(-0.65 + time * 0.16, 1.1, 0.6 - Math.sin(time * 0.4) * 0.25);
          first.position.set(-0.38 - spread * 0.35, 0.32 + spread * 0.3, 0);
          second.position.set(0.6 + spread * 0.3, -0.3 - spread * 0.3, 0.1);
          sphere.position.set(Math.cos(time * 0.55 + 3.8) * (1.95 + spread * 0.3), Math.sin(time * 0.55 + 3.8) * 1.45, Math.sin(time * 0.55) * 0.8);
          mini.position.set(Math.cos(-time * 0.65 + 0.6) * 2.05, Math.sin(-time * 0.65 + 0.6) * 1.65, Math.cos(time * 0.65) * 0.5);
          mini.rotation.set(time * 0.6, time * 0.8, 0);
          renderer.render(scene, camera);
          needsRender = false;
        };
        render(performance.now());
        setReady(true);
        cleanup = () => {
          cancelAnimationFrame(frame);
          resize.disconnect();
          observer.disconnect();
          motion.removeEventListener("change", motionChange);
          container.removeEventListener("pointermove", move);
          container.removeEventListener("pointerleave", leave);
          container.removeEventListener("pointerdown", down);
          container.removeEventListener("pointerup", up);
          container.removeEventListener("pointercancel", up);
          container.removeEventListener("lostpointercapture", up);
          orbit.material.dispose();
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
      <div className="scene-grid" aria-hidden="true" />
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
        <span>{ready ? "DRAG TO EXPLORE" : "CONNECTED FORMS"}</span>
        {ready && (
          <>
            <button
              type="button"
              className="scene-expand"
              onClick={() => setExpanded(!expanded)}
              aria-pressed={expanded}
              aria-label={expanded ? "Assemble sculpture" : "Explode sculpture"}
            >
              <Expand size={14} aria-hidden />
              {expanded ? "Assemble" : "Explode"}
            </button>
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
