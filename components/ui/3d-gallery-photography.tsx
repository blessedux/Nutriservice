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
  TIMELINE_INTRO_IMAGE_COUNT,
  getMaxTimelineScrollDistance,
  getTimelineXForImageIndex,
} from "@/lib/nosotros-timeline-images";
import {
  MAX_TIMELINE_PASS_COUNT,
  NOSOTROS_TIMELINE_YEARS,
  yearIndexForPassCount,
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
  /** Continuous hallway scroll offset while interactive (for title fade, etc.). */
  onTimelineScroll?: (scrollOffset: number) => void;
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
  imageIndex: number;
  z: number;
  x: number;
  y: number;
}

const DEFAULT_DEPTH_RANGE = 120;
const DEFAULT_TIMELINE_X_OFFSET = 6.5;
const TIMELINE_Y = 0;
const BASE_PLANE_HEIGHT = 8;
/** Stop momentum and lock frames below this velocity. */
const SCROLL_IDLE_VELOCITY = 0.045;
/** Camera crossing — full size is reached here (after extra scroll within each frame). */
const CAMERA_CROSS_RELATIVE = 1.18;
/** Depth (plane.z) where the frame first appears — lower = farther / smaller. */
const HALLWAY_ENTRY_Z_RATIO = 0.045;
/** Ease-in for depth travel — higher = slower / smaller at the start of each frame. */
const HALLWAY_APPROACH_EASE = 1.75;

/** Wider band — two frames (left + right) visible while passing through. */
export const HALLWAY_FADE_SETTINGS: FadeSettings = {
  fadeIn: { start: 0.16, end: 0.26 },
  fadeOut: { start: 0.58, end: 0.72 },
};

export const HALLWAY_BLUR_SETTINGS: BlurSettings = {
  blurIn: { start: 0.1, end: 0.2 },
  blurOut: { start: 0.62, end: 0.78 },
  maxBlur: 1.75,
};

function getTimelineLayout(containerWidth: number): {
  timelineXOffset: number;
  cameraFov: number;
  fadeSettings: FadeSettings;
  blurSettings: BlurSettings;
  initialDepthOffsetRatio: number;
  hallwayVisibility: HallwayVisibilityConfig;
} {
  const hallwayVisibility = getHallwayVisibilityConfig(containerWidth);

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
        maxBlur: 2,
      },
      initialDepthOffsetRatio: 0.02,
      hallwayVisibility,
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
        maxBlur: 2,
      },
      initialDepthOffsetRatio: 0.04,
      hallwayVisibility,
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
        maxBlur: 1.85,
      },
      initialDepthOffsetRatio: 0.08,
      hallwayVisibility,
    };
  }
  return {
    timelineXOffset: DEFAULT_TIMELINE_X_OFFSET,
    cameraFov: 48,
    fadeSettings: HALLWAY_FADE_SETTINGS,
    blurSettings: HALLWAY_BLUR_SETTINGS,
    initialDepthOffsetRatio: 0.14,
    hallwayVisibility,
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

/** Equal depth gap between consecutive frames in the timeline hallway. */
function getTimelinePlaneSpacing(
  depthRange: number,
  visibleCount: number,
): number {
  return depthRange / Math.max(visibleCount, 1);
}

/** How many frames stay in the hallway ahead of the focal image. */
const HALLWAY_AHEAD_COUNT = 3.25;
/** How far a passed frame may linger before hiding. */
const HALLWAY_BEHIND_COUNT = 0.35;
const HALLWAY_FADE_IN_SPAN = 0.28;

type HallwayVisibilityConfig = {
  aheadCount: number;
  cameraCrossRelative: number;
  behindCount: number;
  fadeInSpan: number;
  /** Pre-camera fade — opacity reaches 0 before the camera cross line. */
  fadeOutStart?: number;
  fadeOutEnd?: number;
};

const DEFAULT_HALLWAY_VISIBILITY: HallwayVisibilityConfig = {
  aheadCount: HALLWAY_AHEAD_COUNT,
  cameraCrossRelative: CAMERA_CROSS_RELATIVE,
  behindCount: HALLWAY_BEHIND_COUNT,
  fadeInSpan: HALLWAY_FADE_IN_SPAN,
};

function getHallwayVisibilityConfig(containerWidth: number): HallwayVisibilityConfig {
  if (containerWidth < 480) {
    return {
      ...DEFAULT_HALLWAY_VISIBILITY,
      behindCount: 0.04,
      fadeOutStart: 0.74,
      fadeOutEnd: 0.98,
    };
  }
  if (containerWidth < 640) {
    return {
      ...DEFAULT_HALLWAY_VISIBILITY,
      behindCount: 0.06,
      fadeOutStart: 0.78,
      fadeOutEnd: 1.02,
    };
  }
  if (containerWidth < 1024) {
    return {
      ...DEFAULT_HALLWAY_VISIBILITY,
      behindCount: 0.12,
      fadeOutStart: 0.86,
      fadeOutEnd: 1.08,
    };
  }
  return DEFAULT_HALLWAY_VISIBILITY;
}

function getPlaneZForImageIndex(
  imageIndex: number,
  scrollOffset: number,
  spacing: number,
  depthRange: number,
): number {
  const relative = scrollOffset / spacing - imageIndex;
  const cameraZ = depthRange * 0.5;
  const entryZ = depthRange * HALLWAY_ENTRY_Z_RATIO;
  const enterAt = -HALLWAY_AHEAD_COUNT;

  if (relative <= CAMERA_CROSS_RELATIVE) {
    const tLinear = THREE.MathUtils.clamp(
      (relative - enterAt) / (CAMERA_CROSS_RELATIVE - enterAt),
      0,
      1,
    );
    const t = Math.pow(tLinear, HALLWAY_APPROACH_EASE);
    return THREE.MathUtils.lerp(entryZ, cameraZ, t);
  }

  const pastT = relative - CAMERA_CROSS_RELATIVE;
  return cameraZ + pastT * spacing * 0.9;
}

function computeHallwayOpacity(
  relative: number,
  config: HallwayVisibilityConfig = DEFAULT_HALLWAY_VISIBILITY,
): number {
  const enterAt = -config.aheadCount;
  const fadeInEnd = enterAt + config.fadeInSpan;

  if (relative < enterAt) return 0;
  if (relative < fadeInEnd) {
    return (relative - enterAt) / (fadeInEnd - enterAt);
  }

  if (config.fadeOutStart !== undefined && config.fadeOutEnd !== undefined) {
    if (relative >= config.fadeOutEnd) return 0;
    if (relative >= config.fadeOutStart) {
      return (
        1 -
        (relative - config.fadeOutStart) /
          (config.fadeOutEnd - config.fadeOutStart)
      );
    }
    return 1;
  }

  if (relative <= config.cameraCrossRelative) return 1;

  const fadeOutEnd = config.cameraCrossRelative + config.behindCount;
  if (relative >= fadeOutEnd) return 0;
  return (
    1 -
    (relative - config.cameraCrossRelative) /
      (fadeOutEnd - config.cameraCrossRelative)
  );
}

function computeHallwayBlur(
  relative: number,
  maxBlur: number,
  config: HallwayVisibilityConfig = DEFAULT_HALLWAY_VISIBILITY,
): number {
  const enterAt = -config.aheadCount;
  const sharpAt = 0.42;

  if (relative < enterAt) return maxBlur;
  if (relative < sharpAt) {
    const t = (relative - enterAt) / (sharpAt - enterAt);
    return maxBlur * (1 - t);
  }

  if (config.fadeOutStart !== undefined && config.fadeOutEnd !== undefined) {
    if (relative >= config.fadeOutEnd) return maxBlur;
    if (relative >= config.fadeOutStart) {
      const t =
        (relative - config.fadeOutStart) /
        (config.fadeOutEnd - config.fadeOutStart);
      return maxBlur * t;
    }
    return 0;
  }

  if (relative <= config.cameraCrossRelative) return 0;

  const fadeOutEnd = config.cameraCrossRelative + config.behindCount;
  if (relative >= fadeOutEnd) return maxBlur;
  const t =
    (relative - config.cameraCrossRelative) /
    (fadeOutEnd - config.cameraCrossRelative);
  return maxBlur * t;
}

function getHallwayRelative(
  imageIndex: number,
  scrollOffset: number,
  spacing: number,
): number {
  return scrollOffset / spacing - imageIndex;
}

function isImageInHallway(
  relative: number,
  config: HallwayVisibilityConfig = DEFAULT_HALLWAY_VISIBILITY,
): boolean {
  const exitAt =
    config.fadeOutEnd ??
    config.cameraCrossRelative + config.behindCount;

  return relative >= -config.aheadCount && relative <= exitAt;
}

function getFocalIndexFromScroll(
  scrollOffset: number,
  spacing: number,
  maxIndex: number,
): number {
  if (spacing <= 0) return 0;
  return Math.min(Math.max(0, Math.floor(scrollOffset / spacing)), maxIndex);
}

function getPlaneCloseness(planeZ: number, depthRange: number): number {
  const worldZ = planeZ - depthRange / 2;
  return THREE.MathUtils.smoothstep(worldZ, -56, 2);
}

/** Scale grows as the plane approaches the camera (worldZ → 0). */
function computePlaneScale(
  planeZ: number,
  depthRange: number,
  aspect: number,
): [number, number, number] {
  const closeness = getPlaneCloseness(planeZ, depthRange);
  const minH = 0.68;
  const maxH = BASE_PLANE_HEIGHT;
  const height = THREE.MathUtils.lerp(minH, maxH, closeness);

  if (aspect > 1) {
    return [height * aspect, height, 1];
  }
  return [height, height / aspect, 1];
}

function getTimelineX(imageIndex: number, xOffset: number): number {
  return getTimelineXForImageIndex(imageIndex, xOffset);
}

const createClothMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
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
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(map, vUv);
        gl_FragColor = vec4(color.rgb, opacity);
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
  imageIndex,
  texture,
  material,
  planesRef,
  depthRange,
  allowHover,
}: {
  imageIndex: number;
  texture: THREE.Texture;
  material: THREE.ShaderMaterial;
  planesRef: React.RefObject<PlaneData[]>;
  depthRange: number;
  allowHover: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const aspectRef = useRef(1);

  useEffect(() => {
    if (material?.uniforms) {
      material.uniforms.map.value = texture;
      material.uniforms.isHovered.value = allowHover && isHovered ? 1.0 : 0.0;
      const image = texture.image as HTMLImageElement | undefined;
      if (image?.width && image.height) {
        aspectRef.current = image.width / image.height;
      }
    }
  }, [allowHover, isHovered, material, texture]);

  useFrame(() => {
    const plane = planesRef.current?.[imageIndex];
    const mesh = meshRef.current;
    if (!plane || !mesh) return;

    mesh.position.set(plane.x, plane.y, plane.z - depthRange / 2);

    const [sx, sy, sz] = computePlaneScale(
      plane.z,
      depthRange,
      aspectRef.current,
    );
    mesh.scale.set(sx, sy, sz);
  });

  const image = texture.image as HTMLImageElement | undefined;
  const aspect =
    image?.width && image.height ? image.width / image.height : 1;
  const initialScale: [number, number, number] =
    aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1];

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
  onTimelineScroll,
  onTimelineYear,
  onTimelineComplete,
  passThreshold = DEFAULT_PASS_THRESHOLD,
  fadeSettings = HALLWAY_FADE_SETTINGS,
  blurSettings = HALLWAY_BLUR_SETTINGS,
  hallwayVisibility = DEFAULT_HALLWAY_VISIBILITY,
  timelineXOffset = DEFAULT_TIMELINE_X_OFFSET,
  initialDepthOffsetRatio = 0.14,
  sessionKey = 0,
}: Omit<InfiniteGalleryProps, "className" | "style"> & {
  containerRef: React.RefObject<HTMLDivElement | null>;
  timelineXOffset?: number;
  initialDepthOffsetRatio?: number;
  hallwayVisibility?: HallwayVisibilityConfig;
}) {
  const scrollVelocityRef = useRef(0);
  const interactiveRef = useRef(interactive);
  const forwardLockedRef = useRef(forwardScrollLocked);
  const backwardLockedRef = useRef(backwardScrollLocked);
  const hasReportedScrollRef = useRef(false);
  const onUserScrollRef = useRef(onUserScroll);
  const onTimelineScrollRef = useRef(onTimelineScroll);
  const onTimelineYearRef = useRef(onTimelineYear);
  const onTimelineCompleteRef = useRef(onTimelineComplete);
  /** Focal image index in NOSOTROS_TIMELINE_IMAGES (0 = first frame). */
  const passCountRef = useRef(0);
  /** Continuous scroll offset along the hallway (one spacing unit = one image). */
  const timelineScrollRef = useRef(0);
  const hasCompletedTimelineRef = useRef(false);
  const lastReportedYearIndexRef = useRef<number | undefined>(undefined);
  const timelineXOffsetRef = useRef(timelineXOffset);
  const hallwayVisibilityRef = useRef(hallwayVisibility);

  useEffect(() => {
    timelineXOffsetRef.current = timelineXOffset;
  }, [timelineXOffset]);

  useEffect(() => {
    hallwayVisibilityRef.current = hallwayVisibility;
  }, [hallwayVisibility]);

  const maxTimelineScroll = getMaxTimelineScrollDistance(
    visibleCount,
    DEFAULT_DEPTH_RANGE,
  );

  const isTimelineAtEnd = useCallback(() => {
    if (hasCompletedTimelineRef.current) return true;
    return timelineScrollRef.current >= maxTimelineScroll - 0.5;
  }, [maxTimelineScroll]);

  const tryCompleteTimeline = useCallback((scrollOffset: number) => {
    if (hasCompletedTimelineRef.current) return;
    if (scrollOffset < maxTimelineScroll - 0.5) return;

    hasCompletedTimelineRef.current = true;
    forwardLockedRef.current = true;
    onTimelineCompleteRef.current?.();
  }, [maxTimelineScroll]);

  const isAtTimelineHardStart = useCallback(
    () => timelineScrollRef.current <= 0.001,
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
  const planeSpacing = getTimelinePlaneSpacing(depthRange, visibleCount);

  const layoutTimelinePlanes = useCallback(
    (scrollOffset: number) => {
      if (totalImages === 0) return 0;

      const focalIndex = getFocalIndexFromScroll(
        scrollOffset,
        planeSpacing,
        MAX_TIMELINE_PASS_COUNT,
      );

      planesRef.current.forEach((plane) => {
        plane.z = getPlaneZForImageIndex(
          plane.imageIndex,
          scrollOffset,
          planeSpacing,
          depthRange,
        );
        plane.x = getTimelineX(
          plane.imageIndex,
          timelineXOffsetRef.current,
        );
      });

      return focalIndex;
    },
    [depthRange, planeSpacing, totalImages],
  );

  const applyPassCount = useCallback(
    (rawPassCount: number) => {
      const passCount = Math.max(
        0,
        Math.min(rawPassCount, MAX_TIMELINE_PASS_COUNT),
      );
      passCountRef.current = passCount;

      if (passCount < TIMELINE_INTRO_IMAGE_COUNT) {
        hasCompletedTimelineRef.current = false;
        forwardLockedRef.current = false;
        if (lastReportedYearIndexRef.current !== -1) {
          lastReportedYearIndexRef.current = -1;
          onTimelineYearRef.current?.(0, -1);
        }
        return;
      }

      const yearIndex = yearIndexForPassCount(passCount);
      if (yearIndex === null) {
        return;
      }

      if (lastReportedYearIndexRef.current !== yearIndex) {
        lastReportedYearIndexRef.current = yearIndex;
        onTimelineYearRef.current?.(
          NOSOTROS_TIMELINE_YEARS[yearIndex],
          yearIndex,
        );
      }

      if (passCount < MAX_TIMELINE_PASS_COUNT) {
        hasCompletedTimelineRef.current = false;
        forwardLockedRef.current = false;
      }
    },
    [],
  );

  const buildPlanes = useCallback(
    (): PlaneData[] =>
      Array.from({ length: totalImages }, (_, imageIndex) => ({
        imageIndex,
        z: getPlaneZForImageIndex(imageIndex, 0, planeSpacing, depthRange),
        x: getTimelineX(imageIndex, timelineXOffsetRef.current),
        y: TIMELINE_Y,
      })),
    [depthRange, planeSpacing, totalImages],
  );

  const planesRef = useRef<PlaneData[]>(buildPlanes());

  const resetTimelineSession = useCallback(() => {
    scrollVelocityRef.current = 0;
    timelineScrollRef.current = 0;
    hasReportedScrollRef.current = false;
    passCountRef.current = 0;
    hasCompletedTimelineRef.current = false;
    lastReportedYearIndexRef.current = undefined;
    forwardLockedRef.current = false;
    planesRef.current = buildPlanes();
    layoutTimelinePlanes(0);
    applyPassCount(0);
    onTimelineScrollRef.current?.(0);
  }, [applyPassCount, buildPlanes, layoutTimelinePlanes]);

  useEffect(() => {
    onUserScrollRef.current = onUserScroll;
  }, [onUserScroll]);

  useEffect(() => {
    onTimelineScrollRef.current = onTimelineScroll;
  }, [onTimelineScroll]);

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
  }, [interactive]);

  useEffect(() => {
    if (!interactive) {
      resetTimelineSession();
    }
  }, [interactive, resetTimelineSession]);

  useEffect(() => {
    if (!interactive || sessionKey === 0) return;
    resetTimelineSession();
  }, [sessionKey, interactive, resetTimelineSession]);

  const textures = useTexture(normalizedImages.map((img) => img.src));

  useEffect(() => {
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });
  }, [textures]);

  const materials = useMemo(
    () => Array.from({ length: totalImages }, () => createClothMaterial()),
    [totalImages],
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (!interactiveRef.current) return;
      event.preventDefault();

      const atHardStart = isAtTimelineHardStart();
      const atEnd = isTimelineAtEnd();

      if ((forwardLockedRef.current || atEnd) && event.deltaY > 0) {
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
    [speed, isAtTimelineHardStart, isTimelineAtEnd],
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

    if (isInteractive && Math.abs(scrollVelocityRef.current) < SCROLL_IDLE_VELOCITY) {
      scrollVelocityRef.current = 0;
    } else if (isInteractive) {
      scrollVelocityRef.current *= 0.9;
    } else {
      scrollVelocityRef.current = 0;
    }

    const atEnd = isTimelineAtEnd();

    if ((forwardLockedRef.current || atEnd) && scrollVelocityRef.current > 0) {
      scrollVelocityRef.current = 0;
    }

    if (
      (backwardLockedRef.current || isAtTimelineHardStart()) &&
      scrollVelocityRef.current < 0
    ) {
      scrollVelocityRef.current = 0;
    }

    const scrollVelocity = scrollVelocityRef.current;
    const scrollIdle = scrollVelocity === 0;

    materials.forEach((mat) => {
      if (mat?.uniforms) {
        mat.uniforms.time.value = time;
        mat.uniforms.scrollForce.value = scrollIdle ? 0 : -scrollVelocity;
      }
    });

    if (isInteractive && totalImages > 0) {
      const prevScroll = timelineScrollRef.current;
      let nextScroll = scrollIdle
        ? prevScroll
        : prevScroll + scrollVelocity * delta * 12;

      if (atEnd || forwardLockedRef.current) {
        nextScroll = Math.min(nextScroll, maxTimelineScroll);
      }
      if (isAtTimelineHardStart() || backwardLockedRef.current) {
        nextScroll = Math.max(nextScroll, 0);
      }

      nextScroll = THREE.MathUtils.clamp(nextScroll, 0, maxTimelineScroll);
      timelineScrollRef.current = nextScroll;

      onTimelineScrollRef.current?.(timelineScrollRef.current);

      layoutTimelinePlanes(timelineScrollRef.current);

      const scrollFocal = getFocalIndexFromScroll(
        timelineScrollRef.current,
        planeSpacing,
        MAX_TIMELINE_PASS_COUNT,
      );

      if (scrollFocal !== passCountRef.current) {
        applyPassCount(scrollFocal);
      }

      tryCompleteTimeline(timelineScrollRef.current);
    } else if (!isInteractive) {
      layoutTimelinePlanes(0);
      onTimelineScrollRef.current?.(0);
    }

    let dominantImageIndex = getFocalIndexFromScroll(
      timelineScrollRef.current,
      planeSpacing,
      MAX_TIMELINE_PASS_COUNT,
    );
    let bestCloseness = -1;
    const visibility = hallwayVisibilityRef.current;
    planesRef.current.forEach((plane) => {
      const relative = getHallwayRelative(
        plane.imageIndex,
        timelineScrollRef.current,
        planeSpacing,
      );
      if (!isImageInHallway(relative, visibility)) return;
      const closeness = getPlaneCloseness(plane.z, depthRange);
      if (closeness > bestCloseness) {
        bestCloseness = closeness;
        dominantImageIndex = plane.imageIndex;
      }
    });

    const scrollProgress = timelineScrollRef.current / planeSpacing;

    planesRef.current.forEach((plane) => {
      plane.y = TIMELINE_Y;

      const relative = scrollProgress - plane.imageIndex;
      const inHallway = isImageInHallway(relative, visibility);
      const isDominantFrame = plane.imageIndex === dominantImageIndex;
      const inPreCameraFade =
        visibility.fadeOutStart !== undefined &&
        relative >= visibility.fadeOutStart;

      if (!inHallway) {
        const mat = materials[plane.imageIndex];
        if (mat?.uniforms) {
          mat.uniforms.opacity.value = 0;
        }
        return;
      }

      const baseOpacity = computeHallwayOpacity(relative, visibility);
      let opacity = baseOpacity;

      if (isDominantFrame && !inPreCameraFade) {
        opacity = Math.max(opacity, 1);
      }

      const mat = materials[plane.imageIndex];
      if (mat?.uniforms) {
        mat.uniforms.opacity.value = opacity;
      }
    });
  });

  if (normalizedImages.length === 0) return null;

  return (
    <>
      {normalizedImages.map((_, imageIndex) => {
        const material = materials[imageIndex];
        const texture = textures[imageIndex];
        if (!material || !texture) return null;

        return (
          <ImagePlane
            key={`timeline-image-${imageIndex}`}
            imageIndex={imageIndex}
            texture={texture}
            material={material}
            planesRef={planesRef}
            depthRange={depthRange}
            allowHover={interactive}
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
  onTimelineScroll,
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
    hallwayVisibility,
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
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
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
            onTimelineScroll={onTimelineScroll}
            onTimelineYear={onTimelineYear}
            onTimelineComplete={onTimelineComplete}
            passThreshold={passThreshold}
            containerRef={containerRef}
            timelineXOffset={timelineXOffset}
            initialDepthOffsetRatio={initialDepthOffsetRatio}
            sessionKey={sessionKey}
            fadeSettings={resolvedFadeSettings}
            blurSettings={resolvedBlurSettings}
            hallwayVisibility={hallwayVisibility}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
