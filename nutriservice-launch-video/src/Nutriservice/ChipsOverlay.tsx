import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, fonts} from './palette';

const chips = [
  {label: '+30 años', delay: 0},
  {label: 'SGS · REP', delay: 22},
  {label: 'Producción propia', delay: 44},
];

// Overlay above device mockups (starts at global frame 360).
export const ChipsOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const chipsExit = interpolate(frame, [96, 118], [1, 0], {extrapolateLeft: 'clamp'});

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
        }}
      >
        {chips.map((chip) => {
          const local = Math.max(0, frame - chip.delay);
          const chipSpring = spring({
            frame: local,
            fps,
            config: {damping: 9, stiffness: 200, mass: 0.5},
            durationInFrames: 16,
          });
          const scale = interpolate(chipSpring, [0, 1], [0.6, 1]);
          const opacity =
            interpolate(local, [0, 5], [0, 1], {extrapolateRight: 'clamp'}) *
            chipsExit;

          return (
            <div
              key={chip.label}
              style={{
                opacity,
                transform: `scale(${scale})`,
                border: `1px solid ${palette.chipBorder}`,
                borderRadius: 999,
                padding: '12px 34px',
                background: 'rgba(3, 10, 28, 0.72)',
                backdropFilter: 'blur(8px)',
                color: palette.textPrimary,
                fontFamily: fonts.mono,
                fontSize: 28,
                letterSpacing: 0.5,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
              }}
            >
              {chip.label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
