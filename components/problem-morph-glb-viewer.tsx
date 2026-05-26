"use client";

import * as React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function extractMergedVertices(root: THREE.Object3D): Float32Array {
  const chunks: Float32Array[] = [];
  root.updateMatrixWorld(true);
  const v = new THREE.Vector3();

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    const geom = mesh.geometry;
    const pos = geom.getAttribute("position");
    if (!pos) return;
    const idx = geom.index;
    const m = mesh.matrixWorld;

    if (!idx) {
      const n = pos.count;
      const out = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m);
        const o = i * 3;
        out[o] = v.x;
        out[o + 1] = v.y;
        out[o + 2] = v.z;
      }
      chunks.push(out);
    } else {
      const out = new Float32Array(idx.count * 3);
      for (let i = 0; i < idx.count; i++) {
        const vi = idx.getX(i);
        v.fromBufferAttribute(pos, vi).applyMatrix4(m);
        const o = i * 3;
        out[o] = v.x;
        out[o + 1] = v.y;
        out[o + 2] = v.z;
      }
      chunks.push(out);
    }
  });

  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const merged = new Float32Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  return merged;
}

function normalizeVertices(vertices: Float32Array, targetSize = 1): Float32Array {
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;
  const maxDim = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 1e-6);
  const s = targetSize / maxDim;
  const out = new Float32Array(vertices.length);
  for (let i = 0; i < vertices.length; i += 3) {
    out[i] = (vertices[i] - cx) * s;
    out[i + 1] = (vertices[i + 1] - cy) * s;
    out[i + 2] = (vertices[i + 2] - cz) * s;
  }
  return out;
}

function padToLength(src: Float32Array, floatLength: number): Float32Array {
  const out = new Float32Array(floatLength);
  out.set(src);
  return out;
}

type ProblemMorphGlbViewerProps = {
  /** 0 = first model (sheep), 1 = second (chicken). */
  morphTarget: number;
  compact?: boolean;
  reducedMotion?: boolean;
  sheepSrc?: string;
  chickenSrc?: string;
  className?: string;
};

export default function ProblemMorphGlbViewer({
  morphTarget,
  compact = false,
  reducedMotion = false,
  sheepSrc = PUBLIC_ASSETS.problemSection.sheepModel,
  chickenSrc = PUBLIC_ASSETS.problemSection.chickenModel,
  className,
}: ProblemMorphGlbViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const morphTargetRef = React.useRef(morphTarget);
  React.useLayoutEffect(() => {
    morphTargetRef.current = morphTarget;
  }, [morphTarget]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const clock = new THREE.Clock();
    let cancelled = false;

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
    controls.autoRotateSpeed = 0.48;
    controls.minDistance = 1.2;
    controls.maxDistance = 8;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI / 2 + 0.35;
    controls.target.set(0, 0.12, 0);

    const morphGroup = new THREE.Group();
    scene.add(morphGroup);

    let morphMesh: THREE.Mesh | null = null;
    let morphGeometry: THREE.BufferGeometry | null = null;
    let vertsA: Float32Array | null = null;
    let vertsB: Float32Array | null = null;

    const morphProgressRef = { current: 0 };
    const loader = new GLTFLoader();

    Promise.all([loader.loadAsync(sheepSrc), loader.loadAsync(chickenSrc)])
      .then(([gA, gB]) => {
        if (cancelled) return;

        const vA = normalizeVertices(extractMergedVertices(gA.scene.clone()));
        const vB = normalizeVertices(extractMergedVertices(gB.scene.clone()));

        const maxLen = Math.max(vA.length, vB.length);
        vertsA = padToLength(vA, maxLen);
        vertsB = padToLength(vB, maxLen);

        const positions = new Float32Array(maxLen);
        const startP = morphTargetRef.current;
        for (let i = 0; i < positions.length; i++) {
          positions[i] = lerp(vertsA[i] ?? 0, vertsB[i] ?? 0, startP);
        }

        morphGeometry = new THREE.BufferGeometry();
        morphGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3),
        );
        morphGeometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.42,
          metalness: 0.08,
        });

        morphMesh = new THREE.Mesh(morphGeometry, material);
        const modelScale = 0.82;
        morphMesh.scale.setScalar(modelScale);
        morphGroup.add(morphMesh);

        let minX = Infinity;
        let minY = Infinity;
        let minZ = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;
        for (let i = 0; i < vertsA.length; i += 3) {
          const x = vertsA[i] ?? 0;
          const y = vertsA[i + 1] ?? 0;
          const z = vertsA[i + 2] ?? 0;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          minZ = Math.min(minZ, z);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          maxZ = Math.max(maxZ, z);
        }
        const maxDim =
          Math.max(maxX - minX, maxY - minY, maxZ - minZ, 1e-6) * modelScale;

        morphProgressRef.current = morphTargetRef.current;

        const aspect =
          Math.max(container.clientWidth, 1) /
          Math.max(container.clientHeight, 1);
        const dist =
          maxDim *
          (aspect > 0.85 ? 1.55 : 1.85) *
          1.22;

        camera.position.set(dist * 0.5, dist * 0.32, dist * 0.72);
        controls.target.set(0, maxDim * 0.12, 0);
        controls.update();
      })
      .catch(() => {
        /* canvas stays empty */
      });

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();

      const target = morphTargetRef.current;
      if (reducedMotion) {
        morphProgressRef.current = target;
      } else {
        const k = 12;
        morphProgressRef.current = lerp(
          morphProgressRef.current,
          target,
          1 - Math.exp(-k * dt),
        );
      }

      const p = morphProgressRef.current;
      if (vertsA && vertsB && morphGeometry && morphMesh) {
        const attr = morphGeometry.attributes.position;
        const arr = attr.array as Float32Array;
        const a = vertsA;
        const b = vertsB;
        for (let i = 0; i < arr.length; i++) {
          arr[i] = lerp(a[i] ?? 0, b[i] ?? 0, p);
        }
        attr.needsUpdate = true;
        morphGeometry.computeVertexNormals();
        morphMesh.rotation.y = Math.PI * 2 * -p;
      }

      controls.update(dt);
      renderer.render(scene, camera);
    };
    tick();

    const ro = new ResizeObserver(() => {
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
      if (morphMesh && morphGeometry) {
        morphGroup.remove(morphMesh);
        morphGeometry.dispose();
        const mat = morphMesh.material;
        if (!Array.isArray(mat)) mat.dispose();
        else mat.forEach((m) => m.dispose());
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [compact, reducedMotion, sheepSrc, chickenSrc]);

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
      <div
        ref={containerRef}
        className={canvasBox}
        role="img"
        aria-label="Modelo 3D interactivo: oveja y pollo"
      />
    </div>
  );
}
