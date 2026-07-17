import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
  size?: number;
  /** 0–1 assembly progress; when omitted, uses a spring from the local frame. */
  progress?: number;
};

export const faviconSrc = staticFile('brand/favicon.png');

export const FaviconMark: React.FC<Props> = ({size = 240, progress}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const assembly =
    progress ??
    spring({
      frame,
      fps,
      config: {damping: 14, stiffness: 120, mass: 0.6},
      durationInFrames: 45,
    });

  const scale = interpolate(assembly, [0, 1], [0.25, 1]);
  const opacity = interpolate(assembly, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'});
  const blur = interpolate(frame, [0, 18], [14, 0], {extrapolateRight: 'clamp'});

  return (
    <Img
      src={faviconSrc}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        transform: `scale(${scale})`,
        opacity,
        filter: `blur(${blur}px) drop-shadow(0 0 40px rgba(30, 107, 255, 0.35))`,
      }} />
  );
};
