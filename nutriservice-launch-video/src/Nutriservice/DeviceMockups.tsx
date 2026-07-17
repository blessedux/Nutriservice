import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, fonts} from './palette';
import {MacBookMockup, macBookScrollVideo} from './MacBookMockup';
import {IPhoneMockup, iphoneScrollVideo} from './IPhoneMockup';

const CAPTION_FADE_START = 150;
const CAPTION_FADE_END = 170;
const DEVICES_EXIT_START = 268;
const DEVICES_EXIT_END = 298;

// Runs 300 frames (global 180–480): entrance, hold, exit before close.
export const DeviceMockups: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const macSpring = spring({
    frame,
    fps,
    config: {damping: 11, stiffness: 140, mass: 0.7},
    durationInFrames: 26,
  });
  const macX = interpolate(macSpring, [0, 1], [-260, 0]);
  const macRotateY = interpolate(macSpring, [0, 1], [-32, -6]);
  const macScale = interpolate(macSpring, [0, 1], [0.72, 1]);
  const macBlur = interpolate(frame, [0, 14], [16, 0], {extrapolateRight: 'clamp'});
  const macEntranceOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const driftT = Math.max(0, frame - 26) / fps;
  const macDriftRotate = Math.sin(driftT * 0.9) * 1.6;
  const macDriftY = Math.sin(driftT * 0.7) * 6;

  const macTransform = `
    perspective(1400px)
    translateX(${macX}px)
    translateY(${macDriftY}px)
    rotateY(${macRotateY + macDriftRotate}deg)
    scale(${macScale})
  `;

  const phoneStartFrame = 14;
  const phoneLocalFrame = Math.max(0, frame - phoneStartFrame);
  const phoneSpring = spring({
    frame: phoneLocalFrame,
    fps,
    config: {damping: 10, stiffness: 160, mass: 0.5},
    durationInFrames: 24,
  });
  const phoneX = interpolate(phoneSpring, [0, 1], [280, 130]);
  const phoneY = interpolate(phoneSpring, [0, 1], [120, 60]);
  const phoneRotateY = interpolate(phoneSpring, [0, 1], [28, 10]);
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.6, 0.85]);
  const phoneBlur = interpolate(phoneLocalFrame, [0, 14], [16, 0], {
    extrapolateRight: 'clamp',
  });
  const phoneEntranceOpacity = interpolate(phoneLocalFrame, [0, 6], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const phoneDriftRotate = Math.sin(driftT * 1.1 + 1) * 2.2;
  const phoneDriftY = Math.sin(driftT * 0.8 + 1) * 8;

  const phoneTransform = `
    perspective(1400px)
    translateX(${phoneX}px)
    translateY(${phoneY + phoneDriftY}px)
    rotateY(${phoneRotateY + phoneDriftRotate}deg)
    scale(${phoneScale})
  `;

  const textSpring = spring({
    frame: Math.max(0, frame - 46),
    fps,
    config: {damping: 10, stiffness: 180, mass: 0.5},
    durationInFrames: 18,
  });
  const captionOpacity =
    interpolate(textSpring, [0, 1], [0, 1]) *
    interpolate(frame, [CAPTION_FADE_START, CAPTION_FADE_END], [1, 0], {
      extrapolateLeft: 'clamp',
    });
  const textScale = interpolate(textSpring, [0, 1], [0.9, 1]);

  const devicesExit = interpolate(frame, [DEVICES_EXIT_START, DEVICES_EXIT_END], [1, 0], {
    extrapolateLeft: 'clamp',
  });
  const devicesOpacity = macEntranceOpacity * devicesExit;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          filter: `blur(${macBlur}px)`,
          opacity: devicesOpacity,
        }}
      >
        <MacBookMockup transform={macTransform} opacity={1} screenVideoSrc={macBookScrollVideo} />
      </div>

      <div
        style={{
          position: 'absolute',
          filter: `blur(${phoneBlur}px)`,
          opacity: phoneEntranceOpacity * devicesExit,
        }}
      >
        <IPhoneMockup transform={phoneTransform} opacity={1} screenVideoSrc={iphoneScrollVideo} />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 110,
          opacity: captionOpacity * devicesExit,
          transform: `scale(${textScale})`,
          color: palette.textPrimary,
          fontFamily: fonts.heading,
          fontSize: 42,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        Nuevo sitio. <span style={{color: palette.accentCyanBright}}>Misma visión.</span>
      </div>
    </AbsoluteFill>
  );
};
