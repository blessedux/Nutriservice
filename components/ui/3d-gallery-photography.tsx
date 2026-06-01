"use client";

import type React from "react";
import {
  Suspense,
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import {
  FINAL_TIMELINE_YEAR_INDEX,
  MAX_TIMELINE_PASS_COUNT,
  NOSOTROS_TIMELINE_YEARS,
} from "@/lib/nosotros-timeline-years";

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
  fadeIn: { start: number; end: number };
  fadeOut: { start: number; end: number };
}

interface BlurSettings {
  blurIn: { start: number; end: number };
  blurOut: { start: number; end: number };
  maxBlur: number;
}

export interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  visibleCount?: number;
  fadeSettings?: FadeSettings;
  blurSettings?: BlurSettings;
  /** When false: frozen hallway frame, no scroll input. */
  interactive?: boolean;
  /** Fired once on first user scroll while interactive. */
  onUserScroll?: () => void;
  /** Fired when timeline year changes (every 2 image passes through focal point). */
  onTimelineYear?: (year: number, yearIndex: number) => void;
  /** Fired once when the final timeline year (2026) is reached. */
  onTimelineComplete?: () => void;
  /** Block forward scroll (wheel down); backward scroll still works. */
  forwardScrollLocked?: boolean;
  /** Block backward scroll (wheel up) at timeline start. */
  backwardScrollLocked?: boolean;
  /** Normalized depth (0–1) at which an image counts as "passed". */
  passThreshold?: number;
  /** Increment to reset timeline progress while staying interactive. */
  sessionKey?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface PlaneData {
  index: number;
  z: number;
  imageIndex: number;
  x: number;
  y: number;
}

const DEFAULT_DEPTH_RANGE = 120;
const DEFAULT_TIMELINE_X_OFFSET = 6.5;
const TIMELINE_Y = 0;
const BASE_PLANE_HEIGHT = 6;

/** Wider band — two frames (left + right) visible while passing through. */
export const HALLWAY_FADE_SETTINGS: FadeSettings = {
  fadeIn: { start: 0.16, end: 0.26 },
  fadeOut: { start: 0.58, end: 0.72 },
};

export const HALLWAY_BLUR_SETTINGS: BlurSettings = {
  blurIn: { start: 0.12, end: 0.24 },
  blurOut: { start: 0.58, end: 0.72 },
  maxBlur: 3.5,
};

function getTimelineLayout(containerWidth: number): {
  timelineXOffset: number;
  cameraFov: number;
  fadeSettings: FadeSettings;
  blurSettings: BlurSettings;
  initialDepthOffsetRatio: number;
} {
  if (containerWidth < 480) {
    return {
      timelineXOffset: 2.75,
      cameraFov: 56,
      fadeSettings: {
        fadeIn: { start: 0.02, end: 0.14 },
        fadeOut: { start: 0.45, end: 0.53 },
      },
      blurSettings: {
        blurIn: { start: 0.02, end: 0.12 },
        blurOut: { start: 0.45, end: 0.53 },
        maxBlur: 4,
      },
      initialDepthOffsetRatio: 0.02,
    };
  }
  if (containerWidth < 640) {
    return {
      timelineXOffset: 3.5,
      cameraFov: 54,
      fadeSettings: {
        fadeIn: { start: 0.04, end: 0.18 },
        fadeOut: { start: 0.44, end: 0.52 },
      },
      blurSettings: {
        blurIn: { start: 0.03, end: 0.16 },
        blurOut: { start: 0.44, end: 0.52 },
        maxBlur: 3.75,
      },
      initialDepthOffsetRatio: 0.04,
    };
  }
  if (containerWidth < 1024) {
    return {
      timelineXOffset: 5,
      cameraFov: 50,
      fadeSettings: {
        fadeIn: { start: 0.1, end: 0.22 },
        fadeOut: { start: 0.5, end: 0.6 },
      },
      blurSettings: {
        blurIn: { start: 0.08, end: 0.2 },
        blurOut: { start: 0.5, end: 0.6 },
        maxBlur: 3.5,
      },
      initialDepthOffsetRatio: 0.08,
    };
  }
  return {
    timelineXOffset: DEFAULT_TIMELINE_X_OFFSET,
    cameraFov: 48,
    fadeSettings: HALLWAY_FADE_SETTINGS,
    blurSettings: HALLWAY_BLUR_SETTINGS,
    initialDepthOffsetRatio: 0.14,
  };
}

function useContainerTimelineLayout(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [layout, setLayout] = useState(() =>
    getTimelineLayout(
      typeof window !== "undefined" ? window.innerWidth : 1024,
    ),
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setLayout(getTimelineLayout(el.clientWidth));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  return layout;
}

const DEFAULT_PASS_THRESHOLD = 0.54;
/** Hysteresis band so passCount does not oscillate at year boundaries. */
const PASS_FORWARD_THRESHOLD = DEFAULT_PASS_THRESHOLD;
const PASS_BACKWARD_THRESHOLD = DEFAULT_PASS_THRESHOLD - 0.08;
/** passCount below this = before first timeline year (1993). */
const TIMELINE_START_PASS_COUNT = 2;

function getHeroPlaneZ(
  index: number,
  visibleCount: number,
  depthRange: number,
): number {
  const spacing = (depthRange * 0.72) / Math.max(visibleCount, 1);
  const focalZ = depthRange * 0.34;
  return (focalZ + index * spacing) % depthRange;
}

/** Scale grows as the plane approaches the camera (worldZ → 0). */
function computePlaneScale(
  planeZ: number,
  depthRange: number,
  aspect: number,
  isInteractive: boolean,
): [number, number, number] {
  const worldZ = planeZ - depthRange / 2;
  const closeness = THREE.MathUtils.smoothstep(worldZ, -58, -2);
  const minH = isInteractive ? 0.45 : 1.1;
  const maxH = isInteractive ? BASE_PLANE_HEIGHT : 4.2;
  const height = THREE.MathUtils.lerp(minH, maxH, closeness);

  if (aspect > 1) {
    return [height * aspect, height, 1];
  }
  return [height, height / aspect, 1];
}

function getTimelineX(imageIndex: number, xOffset: number): number {
  return (imageIndex % 2 === 0 ? -1 : 1) * xOffset;
}

function getInitialPlaneZ(
  index: number,
  visibleCount: number,
  depthRange: number,
  depthOffsetRatio = 0.14,
): number {
  const spacing = (depthRange * 0.72) / Math.max(visibleCount, 1);
  const offset = depthRange * depthOffsetRatio;
  return offset + spacing * index;
}

const createClothMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;
        float curveIntensity = scrollForce * 0.3;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;
        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;
          flagWave += sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
        }
        pos.z -= (curve + clothEffect + flagWave);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(map, vUv);
        if (blurAmount > 0.0) {
          vec2 texSize = vec2(textureSize(map, 0));
          if (texSize.x > 0.0 && texSize.y > 0.0) {
            vec2 texelSize = 1.0 / texSize;
            vec4 blurred = vec4(0.0);
            float total = 0.0;
            for (float x = -2.0; x <= 2.0; x += 1.0) {
              for (float y = -2.0; y <= 2.0; y += 1.0) {
                vec2 offset = vec2(x, y) * texelSize * blurAmount;
                float weight = 1.0 / (1.0 + length(vec2(x, y)));
                blurred += texture2D(map, vUv + offset) * weight;
                total += weight;
              }
            }
            color = blurred / total;
          }
        }
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });

function computeOpacity(normalizedPosition: number, fade: FadeSettings): number {
  if (normalizedPosition < fade.fadeIn.start) return 0;
  if (normalizedPosition <= fade.fadeIn.end) {
    return (
      (normalizedPosition - fade.fadeIn.start) /
      (fade.fadeIn.end - fade.fadeIn.start)
    );
  }
  if (normalizedPosition < fade.fadeOut.start) return 1;
  if (normalizedPosition <= fade.fadeOut.end) {
    return (
      1 -
      (normalizedPosition - fade.fadeOut.start) /
        (fade.fadeOut.end - fade.fadeOut.start)
    );
  }
  return 0;
}

function computeBlur(
  normalizedPosition: number,
  blur: BlurSettings,
): number {
  if (normalizedPosition <= blur.blurIn.start) return blur.maxBlur;
  if (normalizedPosition <= blur.blurIn.end) {
    const t =
      (normalizedPosition - blur.blurIn.start) /
      (blur.blurIn.end - blur.blurIn.start);
    return blur.maxBlur * (1 - t);
  }
  if (normalizedPosition < blur.blurOut.start) return 0;
  if (normalizedPosition <= blur.blurOut.end) {
    const t =
      (normalizedPosition - blur.blurOut.start) /
      (blur.blurOut.end - blur.blurOut.start);
    return blur.maxBlur * t;
  }
  return blur.maxBlur;
}

function CameraFovSync({ fov }: { fov: number }) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, fov]);

  return null;
}

function ImagePlane({
  planeIndex,
  textures,
  material,
  planesRef,
  depthRange,
  initialScale,
  allowHover,
  interactiveRef,
}: {
  planeIndex: number;
  textures: THREE.Texture[];
  material: THREE.ShaderMaterial;
  planesRef: React.RefObject<PlaneData[]>;
  depthRange: number;
  initialScale: [number, number, number];
  allowHover: boolean;
  interactiveRef: React.RefObject<boolean>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const lastImageIndex = useRef(-1);
  const aspectRef = useRef(1);

  useEffect(() => {
    if (material?.uniforms) {
      material.uniforms.isHovered.value =
        allowHover && isHovered ? 1.0 : 0.0;
    }
  }, [allowHover, isHovered, material]);

  useFrame(() => {
    const plane = planesRef.current?.[planeIndex];
    const mesh = meshRef.current;
    if (!plane || !mesh) return;

    mesh.position.set(plane.x, plane.y, plane.z - depthRange / 2);

    if (plane.imageIndex !== lastImageIndex.current) {
      const texture = textures[plane.imageIndex];
      if (texture && material?.uniforms) {
        material.uniforms.map.value = texture;
        const image = texture.image as HTMLImageElement | undefined;
        if (image?.width && image.height) {
          aspectRef.current = image.width / image.height;
        }
      }
      lastImageIndex.current = plane.imageIndex;
    }

    const isInteractive = interactiveRef.current ?? false;
    const [sx, sy, sz] = computePlaneScale(
      plane.z,
      depthRange,
      aspectRef.current,
      isInteractive,
    );
    mesh.scale.set(sx, sy, sz);
  });

  return (
    <mesh
      ref={meshRef}
      scale={initialScale}
      material={material}
      onPointerEnter={allowHover ? () => setIsHovered(true) : undefined}
      onPointerLeave={allowHover ? () => setIsHovered(false) : undefined}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}

function GalleryScene({
  images,
  speed = 1,
  visibleCount = 8,
  interactive = true,
  forwardScrollLocked = false,
  backwardScrollLocked = false,
  containerRef,
  onUserScroll,
  onTimelineYear,
  onTimelineComplete,
  passThreshold = DEFAULT_PASS_THRESHOLD,
  fadeSettings = HALLWAY_FADE_SETTINGS,
  blurSettings = HALLWAY_BLUR_SETTINGS,
  timelineXOffset = DEFAULT_TIMELINE_X_OFFSET,
  initialDepthOffsetRatio = 0.14,
  sessionKey = 0,
}: Omit<InfiniteGalleryProps, "className" | "style"> & {
  containerRef: React.RefObject<HTMLDivElement | null>;
  timelineXOffset?: number;
  initialDepthOffsetRatio?: number;
}) {
  const scrollVelocityRef = useRef(0);
  const interactiveRef = useRef(interactive);
  const forwardLockedRef = useRef(forwardScrollLocked);
  const backwardLockedRef = useRef(backwardScrollLocked);
  const hasReportedScrollRef = useRef(false);
  const onUserScrollRef = useRef(onUserScroll);
  const onTimelineYearRef = useRef(onTimelineYear);
  const onTimelineCompleteRef = useRef(onTimelineComplete);
  const passCountRef = useRef(0);
  const lastYearIndexRef = useRef(-1);
  const hasCompletedTimelineRef = useRef(false);
  const planePassedRef = useRef<boolean[]>([]);
  const timelineXOffsetRef = useRef(timelineXOffset);
  const initialDepthOffsetRatioRef = useRef(initialDepthOffsetRatio);

  useEffect(() => {
    timelineXOffsetRef.current = timelineXOffset;
  }, [timelineXOffset]);

  useEffect(() => {
    initialDepthOffsetRatioRef.current = initialDepthOffsetRatio;
  }, [initialDepthOffsetRatio]);

  const emitYearForPassCount = useCallback((passCount: number) => {
    if (passCount < TIMELINE_START_PASS_COUNT) {
      if (lastYearIndexRef.current !== -1) {
        lastYearIndexRef.current = -1;
        hasCompletedTimelineRef.current = false;
        forwardLockedRef.current = false;
        onTimelineYearRef.current?.(0, -1);
      }
      return;
    }
    const yearIndex = Math.floor(passCount / 2) - 1;
    if (
      yearIndex < 0 ||
      yearIndex >= NOSOTROS_TIMELINE_YEARS.length ||
      yearIndex === lastYearIndexRef.current
    ) {
      return;
    }
    lastYearIndexRef.current = yearIndex;
    onTimelineYearRef.current?.(
      NOSOTROS_TIMELINE_YEARS[yearIndex],
      yearIndex,
    );
    if (yearIndex === FINAL_TIMELINE_YEAR_INDEX) {
      if (!hasCompletedTimelineRef.current) {
        hasCompletedTimelineRef.current = true;
        forwardLockedRef.current = true;
        onTimelineCompleteRef.current?.();
      }
    } else {
      hasCompletedTimelineRef.current = false;
      forwardLockedRef.current = false;
    }
  }, []);

  const isAtTimelineHardStart = useCallback(
    () => passCountRef.current === 0,
    [],
  );

  const normalizedImages = useMemo(
    () =>
      images.map((img) =>
        typeof img === "string" ? { src: img, alt: "" } : img,
      ),
    [images],
  );

  const totalImages = normalizedImages.length;
  const depthRange = DEFAULT_DEPTH_RANGE;

  const buildPlanes = useCallback(
    (frozen: boolean): PlaneData[] =>
      Array.from({ length: visibleCount }, (_, i) => ({
        index: i,
        z: frozen
          ? getHeroPlaneZ(i, visibleCount, depthRange)
          : getInitialPlaneZ(
              i,
              visibleCount,
              depthRange,
              initialDepthOffsetRatioRef.current,
            ),
        imageIndex: totalImages > 0 ? i % totalImages : 0,
        x: getTimelineX(
          totalImages > 0 ? i % totalImages : 0,
          timelineXOffsetRef.current,
        ),
        y: TIMELINE_Y,
      })),
    [depthRange, totalImages, visibleCount],
  );

  const planesRef = useRef<PlaneData[]>(buildPlanes(true));

  const resetTimelineSession = useCallback(() => {
    scrollVelocityRef.current = 0;
    hasReportedScrollRef.current = false;
    passCountRef.current = 0;
    lastYearIndexRef.current = -1;
    hasCompletedTimelineRef.current = false;
    forwardLockedRef.current = false;
    planePassedRef.current = Array.from({ length: visibleCount }, () => false);
    planesRef.current = buildPlanes(!interactiveRef.current);
  }, [buildPlanes, visibleCount]);

  useEffect(() => {
    onUserScrollRef.current = onUserScroll;
  }, [onUserScroll]);

  useEffect(() => {
    onTimelineYearRef.current = onTimelineYear;
  }, [onTimelineYear]);

  useEffect(() => {
    onTimelineCompleteRef.current = onTimelineComplete;
  }, [onTimelineComplete]);

  useEffect(() => {
    backwardLockedRef.current = backwardScrollLocked;
  }, [backwardScrollLocked]);

  useEffect(() => {
    interactiveRef.current = interactive;
    if (!interactive) {
      resetTimelineSession();
      planesRef.current = buildPlanes(true);
    } else {
      planesRef.current = buildPlanes(false);
      planePassedRef.current = Array.from({ length: visibleCount }, () => false);
    }
  }, [interactive, buildPlanes, visibleCount, resetTimelineSession]);

  useEffect(() => {
    if (!interactive || sessionKey === 0) return;
    resetTimelineSession();
  }, [sessionKey, interactive, resetTimelineSession]);

  const textures = useTexture(normalizedImages.map((img) => img.src));

  useEffect(() => {
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
    });
  }, [textures]);

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount],
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (!interactiveRef.current) return;
      event.preventDefault();

      const atHardStart = isAtTimelineHardStart();

      if (forwardLockedRef.current && event.deltaY > 0) {
        scrollVelocityRef.current = Math.min(scrollVelocityRef.current, 0);
        return;
      }

      if (
        (backwardLockedRef.current || atHardStart) &&
        event.deltaY < 0
      ) {
        scrollVelocityRef.current = Math.max(scrollVelocityRef.current, 0);
        return;
      }

      scrollVelocityRef.current += event.deltaY * 0.01 * speed;

      if (!hasReportedScrollRef.current && Math.abs(event.deltaY) > 2) {
        hasReportedScrollRef.current = true;
        onUserScrollRef.current?.();
      }
    },
    [speed, isAtTimelineHardStart],
  );

  useEffect(() => {
    if (!interactive) return;
    const root = containerRef.current;
    if (!root) return;

    root.addEventListener("wheel", handleWheel, { passive: false });
    return () => root.removeEventListener("wheel", handleWheel);
  }, [interactive, containerRef, handleWheel]);

  useFrame((state, delta) => {
    const isInteractive = interactiveRef.current;
    const time = state.clock.getElapsedTime();

    scrollVelocityRef.current *= isInteractive ? 0.92 : 0;

    if (forwardLockedRef.current && scrollVelocityRef.current > 0) {
      scrollVelocityRef.current = 0;
    }

    if (
      (backwardLockedRef.current || isAtTimelineHardStart()) &&
      scrollVelocityRef.current < 0
    ) {
      scrollVelocityRef.current = 0;
    }

    const scrollVelocity = scrollVelocityRef.current;
    let passCountDelta = 0;

    materials.forEach((mat) => {
      if (mat?.uniforms) {
        mat.uniforms.time.value = time;
        mat.uniforms.scrollForce.value = scrollVelocity;
      }
    });

    planesRef.current.forEach((plane) => {
      if (isInteractive) {
        const prevZ = plane.z;
        let newZ = plane.z + scrollVelocity * delta * 12;
        let wrapsForward = 0;

        if (newZ >= depthRange) {
          wrapsForward = Math.floor(newZ / depthRange);
          newZ -= depthRange * wrapsForward;
          if (totalImages > 0) {
            plane.imageIndex = (plane.imageIndex + wrapsForward) % totalImages;
          }
          planePassedRef.current[plane.index] = false;
        } else if (newZ < 0) {
          if (isAtTimelineHardStart()) {
            newZ = 0;
          } else {
            const wraps = Math.ceil(-newZ / depthRange);
            newZ += depthRange * wraps;
            if (totalImages > 0) {
              plane.imageIndex =
                ((plane.imageIndex - wraps) % totalImages + totalImages) %
                totalImages;
            }
            planePassedRef.current[plane.index] = false;
          }
        }

        plane.z = ((newZ % depthRange) + depthRange) % depthRange;

        const prevT = prevZ / depthRange;
        const t = plane.z / depthRange;
        const wasPast = planePassedRef.current[plane.index] ?? false;
        const crossedForward =
          !forwardLockedRef.current &&
          !wasPast &&
          prevT < PASS_FORWARD_THRESHOLD &&
          t >= PASS_FORWARD_THRESHOLD;
        const crossedBackward =
          wasPast &&
          prevT > PASS_FORWARD_THRESHOLD &&
          t <= PASS_BACKWARD_THRESHOLD;

        if (crossedForward) {
          planePassedRef.current[plane.index] = true;
          if (passCountDelta < 1) {
            passCountDelta = 1;
          }
        }

        if (crossedBackward) {
          planePassedRef.current[plane.index] = false;
          if (passCountDelta > -1) {
            passCountDelta = -1;
          }
        }
      }

      plane.x = getTimelineX(plane.imageIndex, timelineXOffsetRef.current);
      plane.y = TIMELINE_Y;

      const t = plane.z / depthRange;
      const opacity = isInteractive ? computeOpacity(t, fadeSettings) : 1;
      const blur = isInteractive ? computeBlur(t, blurSettings) : 0;

      const mat = materials[plane.index];
      if (mat?.uniforms) {
        mat.uniforms.opacity.value = opacity;
        mat.uniforms.blurAmount.value = blur;
      }
    });

    if (passCountDelta > 0 && passCountRef.current < MAX_TIMELINE_PASS_COUNT) {
      passCountRef.current += 1;
      emitYearForPassCount(passCountRef.current);
    } else if (passCountDelta < 0 && passCountRef.current > 0) {
      passCountRef.current -= 1;
      emitYearForPassCount(passCountRef.current);
    }
  });

  if (normalizedImages.length === 0) return null;

  return (
    <>
      {Array.from({ length: visibleCount }, (_, i) => {
        const plane = planesRef.current[i];
        const material = materials[i];
        const texture = textures[plane?.imageIndex ?? i % totalImages];
        if (!plane || !material || !texture) return null;

        const image = texture.image as HTMLImageElement | undefined;
        const aspect =
          image?.width && image.height ? image.width / image.height : 1;
        const initialScale: [number, number, number] =
          aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1];

        if (material.uniforms.map.value !== texture) {
          material.uniforms.map.value = texture;
        }

        return (
          <ImagePlane
            key={plane.index}
            planeIndex={i}
            textures={textures}
            material={material}
            planesRef={planesRef}
            depthRange={depthRange}
            initialScale={initialScale}
            allowHover={interactive}
            interactiveRef={interactiveRef}
          />
        );
      })}
    </>
  );
}

function FallbackGallery({ images }: { images: ImageItem[] }) {
  const normalized = useMemo(
    () =>
      images.map((img) =>
        typeof img === "string" ? { src: img, alt: "" } : img,
      ),
    [images],
  );

  return (
    <div className="grid h-full grid-cols-2 gap-1 p-1 sm:grid-cols-3">
      {normalized.slice(0, 9).map((img) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className="h-full min-h-24 w-full rounded-lg object-cover"
        />
      ))}
    </div>
  );
}

export default function InfiniteGallery({
  images,
  speed = 1.2,
  visibleCount = 8,
  interactive = true,
  forwardScrollLocked = false,
  backwardScrollLocked = false,
  onUserScroll,
  onTimelineYear,
  onTimelineComplete,
  passThreshold = DEFAULT_PASS_THRESHOLD,
  sessionKey = 0,
  className = "h-96 w-full",
  style,
  fadeSettings,
  blurSettings,
}: InfiniteGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const {
    timelineXOffset,
    cameraFov,
    fadeSettings: layoutFadeSettings,
    blurSettings: layoutBlurSettings,
    initialDepthOffsetRatio,
  } = useContainerTimelineLayout(containerRef);
  const resolvedFadeSettings = fadeSettings ?? layoutFadeSettings;
  const resolvedBlurSettings = blurSettings ?? layoutBlurSettings;

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div className={className} style={style}>
        <FallbackGallery images={images} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
      aria-label="Galería 3D de nuestra historia"
    >
      <Canvas
        camera={{ position: [0, 0, 0], fov: cameraFov }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <CameraFovSync fov={cameraFov} />
          <GalleryScene
            images={images}
            speed={speed}
            visibleCount={visibleCount}
            interactive={interactive}
            forwardScrollLocked={forwardScrollLocked}
            backwardScrollLocked={backwardScrollLocked}
            onUserScroll={onUserScroll}
            onTimelineYear={onTimelineYear}
            onTimelineComplete={onTimelineComplete}
            passThreshold={passThreshold}
            containerRef={containerRef}
            timelineXOffset={timelineXOffset}
            initialDepthOffsetRatio={initialDepthOffsetRatio}
            sessionKey={sessionKey}
            fadeSettings={resolvedFadeSettings}
            blurSettings={resolvedBlurSettings}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
