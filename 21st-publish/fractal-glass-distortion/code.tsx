"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const DEFAULT_HDR_URL =
  "https://miroleon.github.io/daily-assets/GRADIENT_01_01_comp.hdr";
const DEFAULT_MODEL_URL =
  "https://miroleon.github.io/daily-assets/two_hands_01.fbx";
const DEFAULT_SURFACE_URL =
  "https://miroleon.github.io/daily-assets/surf_imp_02.jpg";
const DEFAULT_DISPLACEMENT_URL =
  "https://raw.githubusercontent.com/miroleon/displacement_texture_freebie/main/assets/1K/jpeg/normal/ml-dpt-21-1K_normal.jpeg";

export type FractalGlassDistortionProps = {
  className?: string;
  hdrUrl?: string;
  modelUrl?: string;
  surfaceUrl?: string;
  displacementUrl?: string;
  showOverlay?: boolean;
};

export function FractalGlassDistortion({
  className,
  hdrUrl = DEFAULT_HDR_URL,
  modelUrl = DEFAULT_MODEL_URL,
  surfaceUrl = DEFAULT_SURFACE_URL,
  displacementUrl = DEFAULT_DISPLACEMENT_URL,
  showOverlay = true,
}: FractalGlassDistortionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = rootRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(0x11151c);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.08;
    const angleLimit = Math.PI / 7;
    controls.minPolarAngle = Math.PI / 2 - angleLimit;
    controls.maxPolarAngle = Math.PI / 2 + angleLimit;

    let hdrTexture: THREE.Texture | null = null;
    const hdrLoader = new RGBELoader();
    hdrLoader.load(hdrUrl, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      hdrTexture = texture;
    });

    scene.fog = new THREE.FogExp2(0x11151c, 0.4);

    const textureLoader = new THREE.TextureLoader();
    const surfaceImperfection = textureLoader.load(surfaceUrl);
    surfaceImperfection.wrapS = THREE.RepeatWrapping;
    surfaceImperfection.wrapT = THREE.RepeatWrapping;

    const handsMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x606060,
      roughness: 0.2,
      metalness: 1,
      roughnessMap: surfaceImperfection,
      envMapIntensity: 1.5,
    });

    let loadedModel: THREE.Object3D | null = null;
    const fbxLoader = new FBXLoader();
    fbxLoader.load(modelUrl, (object) => {
      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = handsMaterial;
        }
      });
      object.position.set(0, 0, 0);
      object.scale.setScalar(0.05);
      scene.add(object);
      loadedModel = object;
    });

    const renderScene = new RenderPass(scene, camera);
    const afterimagePass = new AfterimagePass();
    afterimagePass.uniforms.damp.value = 0.9;

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.1;
    bloomPass.strength = 1.75;
    bloomPass.radius = 1;

    const displacementTexture = textureLoader.load(displacementUrl, (texture) => {
      texture.minFilter = THREE.NearestFilter;
    });

    const displacementShader = {
      uniforms: {
        tDiffuse: { value: null },
        displacement: { value: displacementTexture },
        scale: { value: 0.025 },
        tileFactor: { value: 2.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D displacement;
        uniform float scale;
        uniform float tileFactor;
        varying vec2 vUv;

        void main() {
          if (vUv.x < 0.75 && vUv.x > 0.25 && vUv.y < 0.75 && vUv.y > 0.25) {
            vec2 tiledUv = mod(vUv * tileFactor, 1.0);
            vec2 disp = texture2D(displacement, tiledUv).rg * scale;
            vec2 distUv = vUv + disp;
            gl_FragColor = texture2D(tDiffuse, distUv);
          } else {
            gl_FragColor = texture2D(tDiffuse, vUv);
          }
        }
      `,
    };

    const displacementPass = new ShaderPass(displacementShader);

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(afterimagePass);
    composer.addPass(bloomPass);
    composer.addPass(displacementPass);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      composer.setSize(width, height);
      bloomPass.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const easeInOutCubic = (x: number) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    let theta = 0;
    let transitionProgress = 0;
    let isUserInteracting = false;
    const transitionTimeSeconds = 2;
    const transitionIncrement = 1 / (60 * transitionTimeSeconds);
    const transitionStartCameraPosition = new THREE.Vector3();
    const transitionStartCameraQuaternion = new THREE.Quaternion();

    const updateCameraTrack = () => {
      theta += 0.005;
      const targetPosition = new THREE.Vector3(
        Math.sin(theta) * 3,
        Math.sin(theta),
        Math.cos(theta) * 3,
      );
      const targetQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, -theta, 0),
      );

      if (isUserInteracting) {
        if (transitionProgress > 0) {
          transitionProgress = 0;
        }
        transitionStartCameraPosition.copy(camera.position);
        transitionStartCameraQuaternion.copy(camera.quaternion);
      } else if (transitionProgress < 1) {
        transitionProgress += transitionIncrement;
        const easedProgress = easeInOutCubic(transitionProgress);
        camera.position.lerpVectors(
          transitionStartCameraPosition,
          targetPosition,
          easedProgress,
        );
        camera.quaternion.slerpQuaternions(
          transitionStartCameraQuaternion,
          targetQuaternion,
          easedProgress,
        );
      } else {
        camera.position.copy(targetPosition);
        camera.quaternion.copy(targetQuaternion);
      }

      camera.lookAt(scene.position);
    };

    const onControlStart = () => {
      isUserInteracting = true;
    };
    const onControlEnd = () => {
      isUserInteracting = false;
      transitionStartCameraPosition.copy(camera.position);
      transitionStartCameraQuaternion.copy(camera.quaternion);
      transitionProgress = 0;
    };
    controls.addEventListener("start", onControlStart);
    controls.addEventListener("end", onControlEnd);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      controls.update();
      updateCameraTrack();
      composer.render();
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      controls.removeEventListener("start", onControlStart);
      controls.removeEventListener("end", onControlEnd);
      controls.dispose();

      if (loadedModel) {
        scene.remove(loadedModel);
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((material) => material.dispose());
            } else {
              mesh.material?.dispose();
            }
          }
        });
      }

      surfaceImperfection.dispose();
      displacementTexture.dispose();
      hdrTexture?.dispose();
      handsMaterial.dispose();
      scene.environment = null;
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [displacementUrl, hdrUrl, modelUrl, surfaceUrl]);

  return (
    <div
      ref={rootRef}
      className={cx("relative h-[640px] w-full overflow-hidden bg-[#11151c]", className)}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      {showOverlay ? (
        <>
          <div className="pointer-events-none absolute left-1/2 top-[10%] -translate-x-1/2 text-center text-white/65">
            <h1 className="m-0 text-[10px] font-medium uppercase tracking-[0.3rem]">
              Miro Leon Bucher
              <br />
              @miroxleon
            </h1>
          </div>
          <div className="pointer-events-none absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center text-sm text-white/60">
            <a
              className="pointer-events-auto transition hover:text-white"
              href="https://youtu.be/tbdQg_Y6Wtc"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch the tutorial
            </a>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default FractalGlassDistortion;
