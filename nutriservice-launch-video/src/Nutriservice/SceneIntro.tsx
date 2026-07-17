import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, fonts} from './palette';
import {FaviconMark} from './FaviconMark';

const TEXT_START = 90;
const EXIT_START = 158;
const EXIT_END = 180;

// 180 frames = 6s — favicon assembles, text appears below, both exit before devices.
export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const markProgress = spring({
    frame,
    fps,
    config: {damping: 14, stiffness: 120, mass: 0.6},
    durationInFrames: 45,
  });

  const textSpring = spring({
    frame: Math.max(0, frame - TEXT_START),
    fps,
    config: {damping: 10, stiffness: 180, mass: 0.5},
    durationInFrames: 20,
  });
  const textScale = interpolate(textSpring, [0, 1], [0.85, 1]);
  const textOpacity =
    frame >= TEXT_START
      ? interpolate(frame, [TEXT_START, TEXT_START + 8], [0, 1], {
          extrapolateRight: 'clamp',
        })
      : 0;

  const exitOpacity = interpolate(frame, [EXIT_START, EXIT_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
          opacity: exitOpacity,
        }}
      >
        <FaviconMark size={280} progress={markProgress} />
        <div
          style={{
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            color: palette.textPrimary,
            fontFamily: fonts.heading,
            fontSize: 52,
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          Nueva identidad.
          <br />
          <span style={{color: palette.accentCyanBright}}>Misma excelencia.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
