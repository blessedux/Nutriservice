"use client";

import * as React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type SheepGlbViewerProps = {
  /** Path under `public/` */
  src?: string;
  className?: string;
  /** Smaller canvas + scale for dense layouts (e.g. pinned problema viewport) */
  compact?: boolean;
};

export default function SheepGlbViewer({
  src = "/sheep.glb",
  className,
  compact = false,
}: SheepGlbViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const clock = new THREE.Clock();

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      45,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.1,
      200,
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.background = "transparent";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(4, 8, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xb8e8ff, 0.45);
    fill.position.set(-5, 2, -4);
    scene.add(fill);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.085;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    /** Slow, steady orbit; `update(delta)` keeps speed independent of FPS */
    controls.autoRotateSpeed = 0.48;
    controls.minDistance = 1.2;
    controls.maxDistance = 8;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI / 2 + 0.35;
    controls.target.set(0, 0.4, 0);

    let root: THREE.Group | null = null;
    let cancelled = false;

    const loader = new GLTFLoader();
    loader.load(
      src,
      (gltf) => {
        if (cancelled) return;
        root = gltf.scene;
        /** Appear smaller on screen */
        const modelScale = 0.82;
        root.scale.setScalar(modelScale);

        root.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh && mesh.material) {
            const mats = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];
            mats.forEach((m) => {
              const mat = m as THREE.MeshStandardMaterial;
              if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
            });
          }
        });

        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        root.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z, 1);
        const aspect =
          Math.max(container.clientWidth, 1) /
          Math.max(container.clientHeight, 1);
        const dist =
          maxDim *
          (aspect > 0.85 ? 1.55 : 1.85) *
          /** Pull camera back — reads smaller + full figure */
          1.22;

        camera.position.set(dist * 0.5, dist * 0.32, dist * 0.72);
        controls.target.set(0, maxDim * 0.12, 0);
        controls.update();

        scene.add(root);
      },
      undefined,
      () => {
        /* ignore load errors — canvas stays empty */
      },
    );

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      controls.update(dt);
      renderer.render(scene, camera);
    };
    tick();

    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      if (root) {
        scene.remove(root);
        const mats = new Set<THREE.Material>();
        root.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry?.dispose();
          const m = mesh.material;
          if (Array.isArray(m)) m.forEach((mat) => mats.add(mat));
          else if (m) mats.add(m);
        });
        mats.forEach((m) => m.dispose());
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [src]);

  const canvasBox = compact
    ? "relative mx-auto h-[min(50vh,460px)] min-h-[240px] w-full max-w-[480px] origin-center lg:h-[min(54vh,500px)] lg:min-h-[280px] lg:scale-[1.02]"
    : "relative mx-auto h-[min(62vh,580px)] min-h-[280px] w-full max-w-[560px] origin-center lg:h-[min(70vh,640px)] lg:min-h-[340px] lg:scale-[1.07]";

  return (
    <div
      className={[
        "relative w-full min-w-0 overflow-visible",
        compact ? "py-2 lg:py-3" : "py-4 lg:py-6",
        className ?? "",
      ].join(" ")}
    >
      {/*
        Stable column width (w-full). Previously w-[126%] on an intrinsic-sized flex child collapsed width → 0 → invisible canvas.
        Scale yields similar visual bulk without breaking layout sizing.
      */}
      <div
        ref={containerRef}
        className={canvasBox}
        role="img"
        aria-label="Modelo 3D interactivo"
      />
    </div>
  );
}
