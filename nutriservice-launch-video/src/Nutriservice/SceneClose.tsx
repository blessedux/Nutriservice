import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, fonts} from './palette';

export const navLogoSrc = staticFile('brand/logo-white.png');

// 60 frames = 2s at 30fps
export const SceneClose: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const logoSpring = spring({
    frame,
    fps,
    config: {damping: 12, stiffness: 140, mass: 0.6},
    durationInFrames: 20,
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.88, 1]);

  const urlSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: {damping: 10, stiffness: 180, mass: 0.5},
    durationInFrames: 16,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 28,
      }}
    >
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <Img
          src={navLogoSrc}
          style={{
            width: 320,
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>
      <div
        style={{
          opacity: interpolate(urlSpring, [0, 1], [0, 1]),
          transform: `scale(${interpolate(urlSpring, [0, 1], [0.9, 1])})`,
          color: palette.textPrimary,
          fontFamily: fonts.heading,
          fontSize: 34,
          letterSpacing: 1,
        }}
      >
        nutriservice.cl
      </div>
    </AbsoluteFill>
  );
};
