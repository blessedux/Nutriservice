"use client";

import * as React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** World-space positions for every triangle vertex in the scene graph (matches OBJ-style morph in antonbobrov/threejs-model-morph). */
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

type GlbMorphHoverViewerProps = {
  /** Models to morph between (order matches hover indices). */
  srcs: [string, string];
  className?: string;
  morphDurationMs?: number;
};

export default function GlbMorphHoverViewer({
  srcs,
  className,
  morphDurationMs = 1000,
}: GlbMorphHoverViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const morphTargetRef = React.useRef(0);
  const morphAnimRef = React.useRef<{
    from: number;
    to: number;
    start: number;
  } | null>(null);
  const morphProgressRef = React.useRef(0);

  const morphTo = React.useCallback((index: 0 | 1) => {
    morphTargetRef.current = index;
    const from = morphProgressRef.current;
    const to = index;
    if (Math.abs(from - to) < 1e-6) return;
    morphAnimRef.current = { from, to, start: performance.now() };
  }, []);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const clock = new THREE.Clock();
    let cancelled = false;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      60,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.01,
      100,
    );
    camera.position.set(0, 0.15, 2.4);

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
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(4, 8, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xb8e8ff, 0.4);
    fill.position.set(-5, 2, -4);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    let morphMesh: THREE.Mesh | null = null;
    let morphGeometry: THREE.BufferGeometry | null = null;
    let sheepVerts: Float32Array | null = null;
    let chickenVerts: Float32Array | null = null;

    const mouseRef = { x: 0, y: 0, tx: 0, ty: 0 };

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.tx = nx;
      mouseRef.ty = ny;
    };
    window.addEventListener("mousemove", onMove);

    const loader = new GLTFLoader();

    Promise.all(srcs.map((url) => loader.loadAsync(url)))
      .then(([gA, gB]) => {
        if (cancelled) return;

        const vA = normalizeVertices(extractMergedVertices(gA.scene.clone()));
        const vB = normalizeVertices(extractMergedVertices(gB.scene.clone()));

        const maxLen = Math.max(vA.length, vB.length);
        sheepVerts = padToLength(vA, maxLen);
        chickenVerts = padToLength(vB, maxLen);

        const positions = new Float32Array(maxLen);
        positions.set(sheepVerts);

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
        morphMesh.scale.setScalar(0.92);
        group.add(morphMesh);

        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudieron cargar los modelos.");
      });

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();

      mouseRef.x = lerp(mouseRef.x, mouseRef.tx, 1 - Math.pow(0.92, dt * 60));
      mouseRef.y = lerp(mouseRef.y, mouseRef.ty, 1 - Math.pow(0.92, dt * 60));

      const anim = morphAnimRef.current;
      if (anim && sheepVerts && chickenVerts && morphGeometry && morphMesh) {
        const t = Math.min(
          1,
          (performance.now() - anim.start) / morphDurationMs,
        );
        const e = easeOutCubic(t);
        morphProgressRef.current = lerp(anim.from, anim.to, e);
        if (t >= 1) morphAnimRef.current = null;
      }

      const p = morphProgressRef.current;
      if (sheepVerts && chickenVerts && morphGeometry && morphMesh) {
        const attr = morphGeometry.attributes.position;
        const arr = attr.array as Float32Array;
        const prev = sheepVerts;
        const next = chickenVerts;
        for (let i = 0; i < arr.length; i++) {
          arr[i] = lerp(prev[i] ?? 0, next[i] ?? 0, p);
        }
        attr.needsUpdate = true;
        morphGeometry.computeVertexNormals();
        morphMesh.rotation.y = Math.PI * 2 * -p;
      }

      group.rotation.y = mouseRef.x * Math.PI * 0.125;
      group.rotation.x = mouseRef.y * Math.PI * 0.125;
      group.position.y = mouseRef.x * 0.08;
      group.position.x = mouseRef.y * 0.08;

      camera.rotation.y = mouseRef.x * Math.PI * -0.05;
      camera.rotation.x = mouseRef.y * Math.PI * -0.05;

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
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();

      if (morphMesh && morphGeometry) {
        group.remove(morphMesh);
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
  }, [srcs, morphDurationMs]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative mx-auto h-[min(58vh,520px)] min-h-[260px] w-full max-w-[640px] rounded-2xl border border-neutral-200 bg-neutral-100"
      />

      {error ? (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      ) : null}

      {!ready && !error ? (
        <p className="mt-4 text-center text-sm text-neutral-500">
          Cargando modelos…
        </p>
      ) : null}

      <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-3">
        <button
          type="button"
          className="rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50"
          onMouseEnter={() => morphTo(0)}
        >
          Oveja
        </button>
        <button
          type="button"
          className="rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50"
          onMouseEnter={() => morphTo(1)}
        >
          Pollo (low poly)
        </button>
      </div>

      <p className="mx-auto mt-6 max-w-xl text-center text-xs text-neutral-500 leading-relaxed">
        Pasá el cursor sobre cada etiqueta para interpolar vértices entre los
        dos GLB (misma idea que{" "}
        <a
          href="https://github.com/antonbobrov/threejs-model-morph/"
          className="underline underline-offset-2 hover:text-neutral-700"
          target="_blank"
          rel="noreferrer"
        >
          threejs-model-morph
        </a>
        ); topologías distintas producen un morph expresivo, no una
        correspondencia uno-a-uno.
      </p>
    </div>
  );
}
